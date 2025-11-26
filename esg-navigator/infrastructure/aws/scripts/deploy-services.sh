#!/bin/bash
set -e

# ESG Navigator ECS Service Deployment Script
# This script forces a new deployment of ECS services

echo "=========================================="
echo "ESG Navigator ECS Service Deployment"
echo "=========================================="

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"
CLUSTER_NAME="${ENVIRONMENT}-esg-navigator-cluster"

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

# Service names
API_SERVICE="${ENVIRONMENT}-api-service"
WEB_SERVICE="${ENVIRONMENT}-web-service"

print_status "Environment: ${ENVIRONMENT}"
print_status "AWS Region: ${AWS_REGION}"
print_status "Cluster: ${CLUSTER_NAME}"

# Function to deploy a service
deploy_service() {
    local service_name=$1
    print_status "Deploying service: ${service_name}..."

    aws ecs update-service \
        --cluster "${CLUSTER_NAME}" \
        --service "${service_name}" \
        --force-new-deployment \
        --region "${AWS_REGION}" \
        --output text

    print_status "Deployment initiated for ${service_name}"
}

# Function to wait for service stability
wait_for_service() {
    local service_name=$1
    print_status "Waiting for service ${service_name} to stabilize..."

    aws ecs wait services-stable \
        --cluster "${CLUSTER_NAME}" \
        --services "${service_name}" \
        --region "${AWS_REGION}"

    print_status "Service ${service_name} is stable"
}

# Parse command line arguments
DEPLOY_API=true
DEPLOY_WEB=true
WAIT_FOR_STABLE=true

while [[ $# -gt 0 ]]; do
    case $1 in
        --api-only)
            DEPLOY_WEB=false
            shift
            ;;
        --web-only)
            DEPLOY_API=false
            shift
            ;;
        --no-wait)
            WAIT_FOR_STABLE=false
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo ""
            echo "Options:"
            echo "  --api-only    Deploy only the API service"
            echo "  --web-only    Deploy only the Web service"
            echo "  --no-wait     Don't wait for services to stabilize"
            echo "  --help        Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Execute deployments
if [[ "${DEPLOY_API}" == "true" ]]; then
    deploy_service "${API_SERVICE}"
fi

if [[ "${DEPLOY_WEB}" == "true" ]]; then
    deploy_service "${WEB_SERVICE}"
fi

# Wait for stability if requested
if [[ "${WAIT_FOR_STABLE}" == "true" ]]; then
    echo ""
    print_status "Waiting for services to stabilize..."

    if [[ "${DEPLOY_API}" == "true" ]]; then
        wait_for_service "${API_SERVICE}"
    fi

    if [[ "${DEPLOY_WEB}" == "true" ]]; then
        wait_for_service "${WEB_SERVICE}"
    fi
fi

echo ""
echo "=========================================="
print_status "Deployment completed!"
echo "=========================================="
echo ""

# Show service status
print_status "Current service status:"
aws ecs describe-services \
    --cluster "${CLUSTER_NAME}" \
    --services "${API_SERVICE}" "${WEB_SERVICE}" \
    --region "${AWS_REGION}" \
    --query 'services[*].{Name:serviceName,Status:status,Running:runningCount,Desired:desiredCount}' \
    --output table
