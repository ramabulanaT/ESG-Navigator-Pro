#!/bin/bash
set -e

# ESG Navigator Docker Build and Push Script
# This script builds Docker images and pushes them to ECR

echo "=========================================="
echo "ESG Navigator Docker Build and Push"
echo "=========================================="

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"
IMAGE_TAG="${IMAGE_TAG:-latest}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Get script directory and project root
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/../../../"

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
ECR_REGISTRY="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com"

# Repository names
API_REPO="${ENVIRONMENT}/esg-navigator-api"
WEB_REPO="${ENVIRONMENT}/esg-navigator-web"

print_status "Environment: ${ENVIRONMENT}"
print_status "AWS Region: ${AWS_REGION}"
print_status "ECR Registry: ${ECR_REGISTRY}"
print_status "Image Tag: ${IMAGE_TAG}"

# Login to ECR
print_status "Logging in to ECR..."
aws ecr get-login-password --region "${AWS_REGION}" | \
    docker login --username AWS --password-stdin "${ECR_REGISTRY}"

# Build and push API image
build_and_push_api() {
    print_status "Building API Docker image..."
    cd "${PROJECT_ROOT}"

    docker build \
        -t "${API_REPO}:${IMAGE_TAG}" \
        -f apps/api/Dockerfile \
        --build-arg NODE_ENV=production \
        .

    docker tag "${API_REPO}:${IMAGE_TAG}" "${ECR_REGISTRY}/${API_REPO}:${IMAGE_TAG}"
    docker tag "${API_REPO}:${IMAGE_TAG}" "${ECR_REGISTRY}/${API_REPO}:latest"

    print_status "Pushing API image to ECR..."
    docker push "${ECR_REGISTRY}/${API_REPO}:${IMAGE_TAG}"
    docker push "${ECR_REGISTRY}/${API_REPO}:latest"

    print_status "API image pushed successfully"
}

# Build and push Web image
build_and_push_web() {
    print_status "Building Web Docker image..."
    cd "${PROJECT_ROOT}"

    docker build \
        -t "${WEB_REPO}:${IMAGE_TAG}" \
        -f apps/web/Dockerfile \
        --build-arg NODE_ENV=production \
        --build-arg NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL:-https://www.esgnavigator.ai}" \
        .

    docker tag "${WEB_REPO}:${IMAGE_TAG}" "${ECR_REGISTRY}/${WEB_REPO}:${IMAGE_TAG}"
    docker tag "${WEB_REPO}:${IMAGE_TAG}" "${ECR_REGISTRY}/${WEB_REPO}:latest"

    print_status "Pushing Web image to ECR..."
    docker push "${ECR_REGISTRY}/${WEB_REPO}:${IMAGE_TAG}"
    docker push "${ECR_REGISTRY}/${WEB_REPO}:latest"

    print_status "Web image pushed successfully"
}

# Parse command line arguments
BUILD_API=true
BUILD_WEB=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --api-only)
            BUILD_WEB=false
            shift
            ;;
        --web-only)
            BUILD_API=false
            shift
            ;;
        --tag)
            IMAGE_TAG="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --api-only    Build and push only the API image"
            echo "  --web-only    Build and push only the Web image"
            echo "  --tag TAG     Use specific image tag (default: latest)"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute builds
if [[ "${BUILD_API}" == "true" ]]; then
    build_and_push_api
fi

if [[ "${BUILD_WEB}" == "true" ]]; then
    build_and_push_web
fi

echo ""
echo "=========================================="
print_status "Build and push completed!"
echo "=========================================="
echo ""
echo "Images pushed:"
if [[ "${BUILD_API}" == "true" ]]; then
    echo "  - ${ECR_REGISTRY}/${API_REPO}:${IMAGE_TAG}"
fi
if [[ "${BUILD_WEB}" == "true" ]]; then
    echo "  - ${ECR_REGISTRY}/${WEB_REPO}:${IMAGE_TAG}"
fi
echo ""
echo "To deploy these images, run:"
echo "  ./deploy-services.sh"
