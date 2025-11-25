#!/bin/bash

###############################################################################
# Deploy AWS Infrastructure using CloudFormation
#
# This script deploys the infrastructure stack including:
# - S3 buckets
# - Lambda functions
# - CloudFront distribution
# - IAM roles and policies
#
# Usage:
#   ./deploy-infrastructure.sh [stage] [certificate-arn]
###############################################################################

set -e

STAGE="${1:-production}"
CERTIFICATE_ARN="$2"
PROJECT_NAME="esg-navigator"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_PROFILE="${AWS_PROFILE:-default}"
STACK_NAME="$PROJECT_NAME-$STAGE"

echo "🏗️  Deploying ESG Navigator Infrastructure"
echo "==========================================="
echo "Stack: $STACK_NAME"
echo "Stage: $STAGE"
echo "Region: $AWS_REGION"
echo ""

# Check for certificate ARN
if [ -z "$CERTIFICATE_ARN" ]; then
    echo "❌ Error: ACM Certificate ARN required"
    echo ""
    echo "Usage: $0 [stage] [certificate-arn]"
    echo ""
    echo "To create a certificate:"
    echo "  1. Go to AWS Certificate Manager (ACM) in us-east-1"
    echo "  2. Request a public certificate"
    echo "  3. Add all domains:"
    echo "     - tis-holdings.com"
    echo "     - *.tis-holdings.com"
    echo "     - esgnavigator.ai"
    echo "     - *.esgnavigator.ai"
    echo "     - tis-intellimat.net"
    echo "     - *.tis-intellimat.net"
    echo "  4. Validate via DNS"
    echo "  5. Use the ARN here"
    echo ""
    exit 1
fi

echo "📋 CloudFormation Parameters:"
echo "  Certificate ARN: $CERTIFICATE_ARN"
echo ""

# Deploy CloudFormation stack
echo "🚀 Deploying CloudFormation stack..."

aws cloudformation deploy \
    --template-file cloudformation-template.yaml \
    --stack-name "$STACK_NAME" \
    --parameter-overrides \
        ProjectName="$PROJECT_NAME" \
        Stage="$STAGE" \
        TISHoldingsDomain="tis-holdings.com" \
        ESGNavigatorDomain="esgnavigator.ai" \
        TISIntellimatDomain="tis-intellimat.net" \
        ACMCertificateArn="$CERTIFICATE_ARN" \
    --capabilities CAPABILITY_IAM \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

echo ""
echo "✅ Infrastructure deployed successfully!"
echo ""

# Get outputs
echo "📊 Stack Outputs:"
aws cloudformation describe-stacks \
    --stack-name "$STACK_NAME" \
    --query "Stacks[0].Outputs" \
    --output table \
    --region "$AWS_REGION" \
    --profile "$AWS_PROFILE"

echo ""
echo "🎯 Next Steps:"
echo ""
echo "1. Configure DNS records:"
echo "   - tis-holdings.com → CloudFront distribution"
echo "   - esgnavigator.ai → CloudFront distribution"
echo "   - tis-intellimat.net → CloudFront distribution"
echo ""
echo "2. Deploy application:"
echo "   cd ../../apps/web"
echo "   ./scripts/deploy-aws.sh $STAGE"
echo ""
