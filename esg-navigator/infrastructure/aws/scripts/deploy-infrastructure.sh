#!/bin/bash
set -e

# ESG Navigator AWS Infrastructure Deployment Script
# This script deploys all CloudFormation stacks in the correct order

echo "=========================================="
echo "ESG Navigator AWS Infrastructure Deployment"
echo "=========================================="

# Configuration
AWS_REGION="${AWS_REGION:-us-east-1}"
ENVIRONMENT="${ENVIRONMENT:-production}"
STACK_PREFIX="${ENVIRONMENT}-esg-navigator"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to wait for stack completion
wait_for_stack() {
    local stack_name=$1
    print_status "Waiting for stack ${stack_name} to complete..."

    aws cloudformation wait stack-create-complete \
        --stack-name "${stack_name}" \
        --region "${AWS_REGION}" 2>/dev/null || \
    aws cloudformation wait stack-update-complete \
        --stack-name "${stack_name}" \
        --region "${AWS_REGION}" 2>/dev/null || true

    # Check final status
    local status=$(aws cloudformation describe-stacks \
        --stack-name "${stack_name}" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].StackStatus' \
        --output text 2>/dev/null)

    if [[ "$status" == *"COMPLETE"* ]] && [[ "$status" != *"ROLLBACK"* ]]; then
        print_status "Stack ${stack_name} completed successfully: ${status}"
        return 0
    else
        print_error "Stack ${stack_name} failed: ${status}"
        return 1
    fi
}

# Function to deploy or update a stack
deploy_stack() {
    local stack_name=$1
    local template_file=$2
    local parameters=$3

    print_status "Deploying stack: ${stack_name}"

    # Check if stack exists
    if aws cloudformation describe-stacks --stack-name "${stack_name}" --region "${AWS_REGION}" >/dev/null 2>&1; then
        print_status "Updating existing stack ${stack_name}..."
        aws cloudformation update-stack \
            --stack-name "${stack_name}" \
            --template-body "file://${template_file}" \
            --parameters ${parameters} \
            --capabilities CAPABILITY_NAMED_IAM \
            --region "${AWS_REGION}" 2>/dev/null || {
            local exit_code=$?
            if [[ $exit_code -eq 254 ]] || aws cloudformation describe-stacks --stack-name "${stack_name}" --region "${AWS_REGION}" --query 'Stacks[0].StackStatus' --output text | grep -q "UPDATE_COMPLETE"; then
                print_warning "No updates needed for ${stack_name}"
                return 0
            fi
            return $exit_code
        }
    else
        print_status "Creating new stack ${stack_name}..."
        aws cloudformation create-stack \
            --stack-name "${stack_name}" \
            --template-body "file://${template_file}" \
            --parameters ${parameters} \
            --capabilities CAPABILITY_NAMED_IAM \
            --region "${AWS_REGION}"
    fi

    wait_for_stack "${stack_name}"
}

# Validate required parameters
validate_params() {
    if [[ -z "${DB_PASSWORD}" ]]; then
        print_error "DB_PASSWORD environment variable is required"
        exit 1
    fi
    if [[ -z "${CERTIFICATE_ARN}" ]]; then
        print_error "CERTIFICATE_ARN environment variable is required"
        exit 1
    fi
}

# Get script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CF_DIR="${SCRIPT_DIR}/../cloudformation"

# Main deployment
main() {
    print_status "Starting deployment for environment: ${ENVIRONMENT}"
    print_status "AWS Region: ${AWS_REGION}"

    # Validate parameters (skip for VPC and security groups)

    # 1. Deploy VPC and Networking
    print_status "Step 1/6: Deploying VPC and Networking..."
    deploy_stack "${STACK_PREFIX}-vpc" \
        "${CF_DIR}/01-vpc-network.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT}"

    # 2. Deploy Security Groups
    print_status "Step 2/6: Deploying Security Groups..."
    deploy_stack "${STACK_PREFIX}-security-groups" \
        "${CF_DIR}/02-security-groups.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT}"

    # Validate database parameters
    validate_params

    # 3. Deploy Database (RDS and ElastiCache)
    print_status "Step 3/6: Deploying Database Infrastructure..."
    deploy_stack "${STACK_PREFIX}-database" \
        "${CF_DIR}/03-database.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
         ParameterKey=DBPassword,ParameterValue=${DB_PASSWORD} \
         ParameterKey=MultiAZ,ParameterValue=${MULTI_AZ:-false}"

    # 4. Deploy ECR Repositories
    print_status "Step 4/6: Deploying ECR Repositories..."
    deploy_stack "${STACK_PREFIX}-ecr" \
        "${CF_DIR}/04-ecr.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT}"

    # 5. Deploy Application Load Balancer
    print_status "Step 5/6: Deploying Application Load Balancer..."
    deploy_stack "${STACK_PREFIX}-alb" \
        "${CF_DIR}/05-alb.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
         ParameterKey=CertificateArn,ParameterValue=${CERTIFICATE_ARN}"

    # Store secrets in SSM Parameter Store before ECS deployment
    print_status "Storing secrets in SSM Parameter Store..."

    if [[ -n "${JWT_SECRET}" ]]; then
        aws ssm put-parameter \
            --name "/${ENVIRONMENT}/esg-navigator/jwt-secret" \
            --value "${JWT_SECRET}" \
            --type SecureString \
            --overwrite \
            --region "${AWS_REGION}"
    fi

    if [[ -n "${ANTHROPIC_API_KEY}" ]]; then
        aws ssm put-parameter \
            --name "/${ENVIRONMENT}/esg-navigator/anthropic-api-key" \
            --value "${ANTHROPIC_API_KEY}" \
            --type SecureString \
            --overwrite \
            --region "${AWS_REGION}"
    fi

    # 6. Deploy ECS Cluster and Services
    print_status "Step 6/6: Deploying ECS Cluster and Services..."
    deploy_stack "${STACK_PREFIX}-ecs" \
        "${CF_DIR}/06-ecs-cluster.yaml" \
        "ParameterKey=EnvironmentName,ParameterValue=${ENVIRONMENT} \
         ParameterKey=FrontendURL,ParameterValue=${FRONTEND_URL:-https://www.esgnavigator.ai}"

    echo ""
    echo "=========================================="
    print_status "Deployment completed successfully!"
    echo "=========================================="

    # Print outputs
    print_status "Getting stack outputs..."

    ALB_DNS=$(aws cloudformation describe-stacks \
        --stack-name "${STACK_PREFIX}-alb" \
        --region "${AWS_REGION}" \
        --query 'Stacks[0].Outputs[?OutputKey==`LoadBalancerDNSName`].OutputValue' \
        --output text)

    echo ""
    echo "Application Load Balancer DNS: ${ALB_DNS}"
    echo ""
    echo "Next steps:"
    echo "1. Update DNS records to point to: ${ALB_DNS}"
    echo "2. Build and push Docker images using: ./build-and-push.sh"
    echo "3. Verify services are running: aws ecs list-services --cluster ${STACK_PREFIX}-cluster"
}

# Run main function
main "$@"
