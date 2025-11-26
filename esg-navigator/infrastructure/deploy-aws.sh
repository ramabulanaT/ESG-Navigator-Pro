#!/bin/bash
# ESG Navigator AWS Deployment Script
# This is a quick deployment script for building and deploying to existing AWS infrastructure

set -e

echo "=========================================="
echo "ESG Navigator Quick Deploy"
echo "=========================================="

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
AWS_SCRIPTS_DIR="${SCRIPT_DIR}/aws/scripts"

# Check if full infrastructure deployment is needed
if [[ "$1" == "--full" ]] || [[ "$1" == "-f" ]]; then
    echo "Running full infrastructure deployment..."
    source "${AWS_SCRIPTS_DIR}/deploy-infrastructure.sh"
    exit 0
fi

# Quick deploy: build images and update services
echo "Running quick deploy (build + service update)..."
echo ""

# Step 1: Build and push Docker images
echo "Step 1: Building and pushing Docker images..."
"${AWS_SCRIPTS_DIR}/build-and-push.sh"

# Step 2: Deploy services
echo ""
echo "Step 2: Deploying services..."
"${AWS_SCRIPTS_DIR}/deploy-services.sh"

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
echo ""
echo "For full infrastructure deployment, run:"
echo "  $0 --full"
