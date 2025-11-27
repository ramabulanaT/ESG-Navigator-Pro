#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# AWS ECS Deployment Script for ESG Navigator
# ═══════════════════════════════════════════════════════════════════════════

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Functions
log_info() { echo -e "${CYAN}ℹ ${NC}$1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️ ${NC} $1"; }

banner() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
}

# Configuration
PROJECT_NAME="${PROJECT_NAME:-esg-navigator}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ENVIRONMENT="${ENVIRONMENT:-production}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Validate required environment variables
if [ -z "$AWS_ACCOUNT_ID" ]; then
  log_error "AWS_ACCOUNT_ID environment variable is required"
  echo "Export it with: export AWS_ACCOUNT_ID=123456789012"
  exit 1
fi

ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"
CLUSTER_NAME="${PROJECT_NAME}-cluster"

banner "🚀 ESG Navigator - AWS ECS Deployment"

log_info "Configuration:"
echo "  Project: ${PROJECT_NAME}"
echo "  Region: ${AWS_REGION}"
echo "  Account: ${AWS_ACCOUNT_ID}"
echo "  Environment: ${ENVIRONMENT}"
echo "  Image Tag: ${IMAGE_TAG}"
echo ""

# Check AWS CLI
if ! command -v aws &> /dev/null; then
  log_error "AWS CLI is not installed. Please install it first."
  exit 1
fi

# Verify AWS credentials
log_info "Verifying AWS credentials..."
if ! aws sts get-caller-identity &> /dev/null; then
  log_error "AWS credentials not configured or invalid"
  exit 1
fi
log_success "AWS credentials verified"

# Build Docker images
banner "📦 Building Docker Images"

cd "$(dirname "$0")/.."

log_info "Building API image..."
if docker build -t ${PROJECT_NAME}-api:${IMAGE_TAG} -f apps/api/Dockerfile .; then
  log_success "API image built successfully"
else
  log_error "Failed to build API image"
  exit 1
fi

log_info "Building Web image..."
if docker build -t ${PROJECT_NAME}-web:${IMAGE_TAG} -f apps/web/Dockerfile .; then
  log_success "Web image built successfully"
else
  log_error "Failed to build Web image"
  exit 1
fi

# Login to ECR
banner "🔐 Authenticating with ECR"

log_info "Logging in to Amazon ECR..."
if aws ecr get-login-password --region ${AWS_REGION} | \
   docker login --username AWS --password-stdin ${ECR_REGISTRY}; then
  log_success "ECR authentication successful"
else
  log_error "Failed to authenticate with ECR"
  exit 1
fi

# Tag and push images
banner "📤 Pushing Images to ECR"

# Tag API image
log_info "Tagging API image..."
docker tag ${PROJECT_NAME}-api:${IMAGE_TAG} ${ECR_REGISTRY}/${PROJECT_NAME}-api:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-api:${IMAGE_TAG} ${ECR_REGISTRY}/${PROJECT_NAME}-api:latest

# Tag Web image
log_info "Tagging Web image..."
docker tag ${PROJECT_NAME}-web:${IMAGE_TAG} ${ECR_REGISTRY}/${PROJECT_NAME}-web:${IMAGE_TAG}
docker tag ${PROJECT_NAME}-web:${IMAGE_TAG} ${ECR_REGISTRY}/${PROJECT_NAME}-web:latest

# Push API image
log_info "Pushing API image..."
if docker push ${ECR_REGISTRY}/${PROJECT_NAME}-api:${IMAGE_TAG} && \
   docker push ${ECR_REGISTRY}/${PROJECT_NAME}-api:latest; then
  log_success "API image pushed to ECR"
else
  log_error "Failed to push API image"
  exit 1
fi

# Push Web image
log_info "Pushing Web image..."
if docker push ${ECR_REGISTRY}/${PROJECT_NAME}-web:${IMAGE_TAG} && \
   docker push ${ECR_REGISTRY}/${PROJECT_NAME}-web:latest; then
  log_success "Web image pushed to ECR"
else
  log_error "Failed to push Web image"
  exit 1
fi

# Update ECS services
banner "🔄 Updating ECS Services"

log_info "Updating API service..."
if aws ecs update-service \
  --cluster ${CLUSTER_NAME} \
  --service ${PROJECT_NAME}-api-service \
  --force-new-deployment \
  --region ${AWS_REGION} > /dev/null; then
  log_success "API service update initiated"
else
  log_warning "Failed to update API service (service may not exist yet)"
fi

log_info "Updating Web service..."
if aws ecs update-service \
  --cluster ${CLUSTER_NAME} \
  --service ${PROJECT_NAME}-web-service \
  --force-new-deployment \
  --region ${AWS_REGION} > /dev/null; then
  log_success "Web service update initiated"
else
  log_warning "Failed to update Web service (service may not exist yet)"
fi

# Wait for service stability (optional)
if [ "${WAIT_FOR_STABLE:-false}" = "true" ]; then
  banner "⏳ Waiting for Services to Stabilize"

  log_info "Waiting for API service to stabilize..."
  aws ecs wait services-stable \
    --cluster ${CLUSTER_NAME} \
    --services ${PROJECT_NAME}-api-service \
    --region ${AWS_REGION} && log_success "API service is stable"

  log_info "Waiting for Web service to stabilize..."
  aws ecs wait services-stable \
    --cluster ${CLUSTER_NAME} \
    --services ${PROJECT_NAME}-web-service \
    --region ${AWS_REGION} && log_success "Web service is stable"
fi

# Deployment summary
banner "📊 Deployment Summary"

echo -e "${GREEN}Images pushed:${NC}"
echo "  • ${ECR_REGISTRY}/${PROJECT_NAME}-api:${IMAGE_TAG}"
echo "  • ${ECR_REGISTRY}/${PROJECT_NAME}-web:${IMAGE_TAG}"
echo ""
echo -e "${GREEN}Services updated:${NC}"
echo "  • ${PROJECT_NAME}-api-service"
echo "  • ${PROJECT_NAME}-web-service"
echo ""

log_success "Deployment completed successfully!"
echo ""
log_info "Next steps:"
echo "  1. Run verification: ./infrastructure/verify-aws.sh"
echo "  2. Check service status: aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${PROJECT_NAME}-api-service ${PROJECT_NAME}-web-service"
echo "  3. View logs: aws logs tail /ecs/${PROJECT_NAME} --follow"
echo ""
