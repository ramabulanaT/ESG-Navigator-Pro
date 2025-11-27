#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# AWS Infrastructure Setup Script for ESG Navigator
# Creates all required AWS resources for ECS deployment
# ═══════════════════════════════════════════════════════════════════════════

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Logging functions
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
VPC_CIDR="${VPC_CIDR:-10.0.0.0/16}"
DB_INSTANCE_CLASS="${DB_INSTANCE_CLASS:-db.t3.micro}"
DB_ALLOCATED_STORAGE="${DB_ALLOCATED_STORAGE:-20}"

# Validate AWS Account ID
if [ -z "$AWS_ACCOUNT_ID" ]; then
  log_info "Fetching AWS Account ID..."
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
  log_success "AWS Account ID: $AWS_ACCOUNT_ID"
fi

banner "🏗️  AWS Infrastructure Setup for ESG Navigator"

echo "Configuration:"
echo "  Project: ${PROJECT_NAME}"
echo "  Region: ${AWS_REGION}"
echo "  Account: ${AWS_ACCOUNT_ID}"
echo "  VPC CIDR: ${VPC_CIDR}"
echo ""

read -p "Continue with infrastructure setup? (y/N) " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
  log_warning "Setup cancelled"
  exit 0
fi

# 1. Create ECR Repositories
banner "📦 Creating ECR Repositories"

for repo in api web; do
  log_info "Creating ECR repository: ${PROJECT_NAME}-${repo}"
  if aws ecr describe-repositories --repository-names ${PROJECT_NAME}-${repo} --region ${AWS_REGION} &>/dev/null; then
    log_warning "Repository ${PROJECT_NAME}-${repo} already exists"
  else
    aws ecr create-repository \
      --repository-name ${PROJECT_NAME}-${repo} \
      --region ${AWS_REGION} \
      --image-scanning-configuration scanOnPush=true \
      --encryption-configuration encryptionType=AES256 &>/dev/null
    log_success "Created ${PROJECT_NAME}-${repo}"
  fi
done

# 2. Create VPC and Networking
banner "🌐 Creating VPC and Networking"

log_info "Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
  --cidr-block ${VPC_CIDR} \
  --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=${PROJECT_NAME}-vpc}]" \
  --region ${AWS_REGION} \
  --query 'Vpc.VpcId' \
  --output text 2>/dev/null || \
  aws ec2 describe-vpcs \
    --filters "Name=tag:Name,Values=${PROJECT_NAME}-vpc" \
    --region ${AWS_REGION} \
    --query 'Vpcs[0].VpcId' \
    --output text)

if [ "$VPC_ID" != "None" ] && [ -n "$VPC_ID" ]; then
  log_success "VPC created/found: $VPC_ID"
else
  log_error "Failed to create VPC"
  exit 1
fi

# Enable DNS support
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-support --region ${AWS_REGION}
aws ec2 modify-vpc-attribute --vpc-id $VPC_ID --enable-dns-hostnames --region ${AWS_REGION}

# Create Internet Gateway
log_info "Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
  --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=${PROJECT_NAME}-igw}]" \
  --region ${AWS_REGION} \
  --query 'InternetGateway.InternetGatewayId' \
  --output text 2>/dev/null || \
  aws ec2 describe-internet-gateways \
    --filters "Name=tag:Name,Values=${PROJECT_NAME}-igw" \
    --region ${AWS_REGION} \
    --query 'InternetGateways[0].InternetGatewayId' \
    --output text)

if [ "$IGW_ID" != "None" ] && [ -n "$IGW_ID" ]; then
  aws ec2 attach-internet-gateway --vpc-id $VPC_ID --internet-gateway-id $IGW_ID --region ${AWS_REGION} 2>/dev/null || true
  log_success "Internet Gateway: $IGW_ID"
fi

# Create Public Subnets (2 AZs for high availability)
SUBNET_IDS=()
for i in 1 2; do
  AZ="${AWS_REGION}$(echo 'ab' | cut -c$i)"
  SUBNET_CIDR="10.0.${i}.0/24"

  log_info "Creating public subnet in $AZ..."
  SUBNET_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $SUBNET_CIDR \
    --availability-zone $AZ \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-${i}}]" \
    --region ${AWS_REGION} \
    --query 'Subnet.SubnetId' \
    --output text 2>/dev/null || \
    aws ec2 describe-subnets \
      --filters "Name=tag:Name,Values=${PROJECT_NAME}-public-${i}" \
      --region ${AWS_REGION} \
      --query 'Subnets[0].SubnetId' \
      --output text)

  if [ "$SUBNET_ID" != "None" ] && [ -n "$SUBNET_ID" ]; then
    SUBNET_IDS+=($SUBNET_ID)
    log_success "Subnet created: $SUBNET_ID"
  fi
done

# Create Route Table
log_info "Creating route table..."
RTB_ID=$(aws ec2 create-route-table \
  --vpc-id $VPC_ID \
  --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=${PROJECT_NAME}-public-rtb}]" \
  --region ${AWS_REGION} \
  --query 'RouteTable.RouteTableId' \
  --output text 2>/dev/null || \
  aws ec2 describe-route-tables \
    --filters "Name=tag:Name,Values=${PROJECT_NAME}-public-rtb" \
    --region ${AWS_REGION} \
    --query 'RouteTables[0].RouteTableId' \
    --output text)

aws ec2 create-route --route-table-id $RTB_ID --destination-cidr-block 0.0.0.0/0 --gateway-id $IGW_ID --region ${AWS_REGION} 2>/dev/null || true

# Associate subnets with route table
for SUBNET_ID in "${SUBNET_IDS[@]}"; do
  aws ec2 associate-route-table --subnet-id $SUBNET_ID --route-table-id $RTB_ID --region ${AWS_REGION} 2>/dev/null || true
done

# 3. Create Security Groups
banner "🔒 Creating Security Groups"

# ALB Security Group
log_info "Creating ALB security group..."
ALB_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-alb-sg \
  --description "Security group for ESG Navigator ALB" \
  --vpc-id $VPC_ID \
  --region ${AWS_REGION} \
  --query 'GroupId' \
  --output text 2>/dev/null || \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-alb-sg" \
    --region ${AWS_REGION} \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 80 --cidr 0.0.0.0/0 --region ${AWS_REGION} 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id $ALB_SG_ID --protocol tcp --port 443 --cidr 0.0.0.0/0 --region ${AWS_REGION} 2>/dev/null || true
log_success "ALB Security Group: $ALB_SG_ID"

# ECS Tasks Security Group
log_info "Creating ECS tasks security group..."
ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-ecs-sg \
  --description "Security group for ESG Navigator ECS tasks" \
  --vpc-id $VPC_ID \
  --region ${AWS_REGION} \
  --query 'GroupId' \
  --output text 2>/dev/null || \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-ecs-sg" \
    --region ${AWS_REGION} \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

aws ec2 authorize-security-group-ingress --group-id $ECS_SG_ID --protocol tcp --port 3000 --source-group $ALB_SG_ID --region ${AWS_REGION} 2>/dev/null || true
aws ec2 authorize-security-group-ingress --group-id $ECS_SG_ID --protocol tcp --port 8080 --source-group $ALB_SG_ID --region ${AWS_REGION} 2>/dev/null || true
log_success "ECS Security Group: $ECS_SG_ID"

# RDS Security Group
log_info "Creating RDS security group..."
RDS_SG_ID=$(aws ec2 create-security-group \
  --group-name ${PROJECT_NAME}-rds-sg \
  --description "Security group for ESG Navigator RDS" \
  --vpc-id $VPC_ID \
  --region ${AWS_REGION} \
  --query 'GroupId' \
  --output text 2>/dev/null || \
  aws ec2 describe-security-groups \
    --filters "Name=group-name,Values=${PROJECT_NAME}-rds-sg" \
    --region ${AWS_REGION} \
    --query 'SecurityGroups[0].GroupId' \
    --output text)

aws ec2 authorize-security-group-ingress --group-id $RDS_SG_ID --protocol tcp --port 5432 --source-group $ECS_SG_ID --region ${AWS_REGION} 2>/dev/null || true
log_success "RDS Security Group: $RDS_SG_ID"

# 4. Create ECS Cluster
banner "🐳 Creating ECS Cluster"

log_info "Creating ECS cluster..."
aws ecs create-cluster \
  --cluster-name ${PROJECT_NAME}-cluster \
  --region ${AWS_REGION} \
  --capacity-providers FARGATE FARGATE_SPOT \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  &>/dev/null || log_warning "Cluster may already exist"
log_success "ECS Cluster: ${PROJECT_NAME}-cluster"

# 5. Create CloudWatch Log Groups
banner "📊 Creating CloudWatch Log Groups"

for service in api web; do
  log_info "Creating log group for ${service}..."
  aws logs create-log-group \
    --log-group-name /ecs/${PROJECT_NAME}-${service} \
    --region ${AWS_REGION} 2>/dev/null || log_warning "Log group already exists"
  log_success "Log group: /ecs/${PROJECT_NAME}-${service}"
done

# 6. Create RDS Subnet Group
banner "🗄️  Creating RDS Infrastructure"

log_info "Creating DB subnet group..."
aws rds create-db-subnet-group \
  --db-subnet-group-name ${PROJECT_NAME}-db-subnet-group \
  --db-subnet-group-description "Subnet group for ESG Navigator DB" \
  --subnet-ids ${SUBNET_IDS[@]} \
  --region ${AWS_REGION} 2>/dev/null || log_warning "DB subnet group already exists"

# Summary
banner "📋 Infrastructure Setup Summary"

echo -e "${GREEN}Resources Created:${NC}"
echo "  VPC ID: $VPC_ID"
echo "  Internet Gateway: $IGW_ID"
echo "  Subnets: ${SUBNET_IDS[@]}"
echo "  ALB Security Group: $ALB_SG_ID"
echo "  ECS Security Group: $ECS_SG_ID"
echo "  RDS Security Group: $RDS_SG_ID"
echo "  ECS Cluster: ${PROJECT_NAME}-cluster"
echo "  ECR Repositories: ${PROJECT_NAME}-api, ${PROJECT_NAME}-web"
echo ""

log_success "Infrastructure setup completed!"
echo ""
log_info "Next steps:"
echo "  1. Create RDS database instance (see DEPLOYMENT.md)"
echo "  2. Store secrets in AWS Secrets Manager"
echo "  3. Create Application Load Balancer"
echo "  4. Register ECS task definitions"
echo "  5. Create ECS services"
echo "  6. Deploy application: ./infrastructure/deploy-aws.sh"
echo ""

# Save configuration for later use
cat > infrastructure/aws-config.env << EOF
# AWS Configuration for ESG Navigator
# Generated on $(date)

export AWS_REGION="${AWS_REGION}"
export AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID}"
export PROJECT_NAME="${PROJECT_NAME}"
export VPC_ID="${VPC_ID}"
export ALB_SG_ID="${ALB_SG_ID}"
export ECS_SG_ID="${ECS_SG_ID}"
export RDS_SG_ID="${RDS_SG_ID}"
export SUBNET_IDS="${SUBNET_IDS[@]}"
EOF

log_success "Configuration saved to infrastructure/aws-config.env"
echo "  Source it with: source infrastructure/aws-config.env"
echo ""
