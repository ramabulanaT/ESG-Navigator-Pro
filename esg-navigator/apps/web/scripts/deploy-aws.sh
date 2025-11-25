#!/bin/bash

###############################################################################
# ESG Navigator - AWS Multi-Domain Deployment Script
#
# Deploys Next.js app to AWS using:
# - Lambda (SSR functions via OpenNext)
# - S3 (Static assets)
# - CloudFront (CDN with multi-domain routing)
#
# Usage:
#   ./scripts/deploy-aws.sh [stage]
#   ./scripts/deploy-aws.sh production
###############################################################################

set -e # Exit on error

# Configuration
STAGE="${1:-production}"
PROJECT_NAME="esg-navigator"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-default}"

echo "🚀 Deploying ESG Navigator to AWS"
echo "=================================="
echo "Stage: $STAGE"
echo "Region: $AWS_REGION"
echo "Profile: $AWS_PROFILE"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI not found. Please install: https://aws.amazon.com/cli/"
    exit 1
fi

# Check OpenNext
echo "📦 Building with OpenNext..."
cd "$(dirname "$0")/.."
npm run build:aws

if [ ! -d ".open-next" ]; then
    echo "❌ OpenNext build failed. .open-next directory not found."
    exit 1
fi

echo "✅ OpenNext build complete"
echo ""

# Get CloudFormation outputs
STACK_NAME="$PROJECT_NAME-$STAGE"
echo "📡 Fetching infrastructure details from CloudFormation..."

# Get S3 bucket names
STATIC_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='StaticAssetsBucket'].OutputValue" \
    --output text \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE")

DEPLOYMENT_BUCKET=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?ExportName=='${PROJECT_NAME}-${STAGE}-DeploymentBucket'].OutputValue" \
    --output text \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" 2>/dev/null || echo "")

if [ -z "$DEPLOYMENT_BUCKET" ]; then
    DEPLOYMENT_BUCKET="${PROJECT_NAME}-deployments-${STAGE}"
fi

echo "Static Bucket: $STATIC_BUCKET"
echo "Deployment Bucket: $DEPLOYMENT_BUCKET"
echo ""

# ============================================
# Deploy Lambda Functions
# ============================================

echo "📤 Deploying Lambda functions..."

# Package server function
cd .open-next/server-function
zip -q -r ../../server-function.zip .
cd ../..

# Package image optimization function
cd .open-next/image-optimization-function
zip -q -r ../../image-function.zip .
cd ../..

# Upload to S3
echo "  Uploading server function..."
aws s3 cp server-function.zip \
    "s3://$DEPLOYMENT_BUCKET/builds/$STAGE/server-function.zip" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

echo "  Uploading image optimization function..."
aws s3 cp image-function.zip \
    "s3://$DEPLOYMENT_BUCKET/builds/$STAGE/image-function.zip" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Update Lambda functions
echo "  Updating Lambda functions..."
aws lambda update-function-code \
    --function-name "$PROJECT_NAME-server-$STAGE" \
    --s3-bucket "$DEPLOYMENT_BUCKET" \
    --s3-key "builds/$STAGE/server-function.zip" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    > /dev/null

aws lambda update-function-code \
    --function-name "$PROJECT_NAME-image-opt-$STAGE" \
    --s3-bucket "$DEPLOYMENT_BUCKET" \
    --s3-key "builds/$STAGE/image-function.zip" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE" \
    > /dev/null

# Clean up zip files
rm server-function.zip image-function.zip

echo "✅ Lambda functions deployed"
echo ""

# ============================================
# Deploy Static Assets to S3
# ============================================

echo "📤 Deploying static assets to S3..."

# Upload static assets
aws s3 sync .open-next/assets \
    "s3://$STATIC_BUCKET/_next/static/" \
    --delete \
    --cache-control "public,max-age=31536000,immutable" \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

# Upload public assets
if [ -d "public" ]; then
    aws s3 sync public \
        "s3://$STATIC_BUCKET/" \
        --delete \
        --cache-control "public,max-age=86400" \
        --region "$AWS_REGION" \
        --profile "$AWS_PROFILE"
fi

echo "✅ Static assets deployed"
echo ""

# ============================================
# Invalidate CloudFront Cache
# ============================================

echo "🔄 Invalidating CloudFront cache..."

CLOUDFRONT_ID=$(aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs[?OutputKey=='CloudFrontDistributionId'].OutputValue" \
    --output text \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE")

if [ -n "$CLOUDFRONT_ID" ]; then
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_ID" \
        --paths "/*" \
        --query "Invalidation.Id" \
        --output text \
        --profile "$AWS_PROFILE")

    echo "✅ CloudFront invalidation created: $INVALIDATION_ID"
    echo "   (This may take 5-10 minutes to complete)"
else
    echo "⚠️  Could not find CloudFront distribution ID"
fi

echo ""

# ============================================
# Deployment Complete
# ============================================

echo "✅ Deployment Complete!"
echo ""
echo "Your ESG Navigator is now deployed to:"
echo ""
echo "  🌐 TIS Holdings:     https://tis-holdings.com"
echo "  🎓 ESG Navigator:    https://esgnavigator.ai"
echo "  🏢 TIS-Intellimat:   https://tis-intellimat.net"
echo ""
echo "CloudFront Distribution: $CLOUDFRONT_ID"
echo ""
echo "Note: It may take a few minutes for changes to propagate globally."
