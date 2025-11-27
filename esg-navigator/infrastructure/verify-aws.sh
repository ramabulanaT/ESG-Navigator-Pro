#!/bin/bash
set -euo pipefail

# ═══════════════════════════════════════════════════════════════════════════
# AWS ECS Deployment Verification Script
# Verifies all components of the ESG Navigator AWS deployment
# ═══════════════════════════════════════════════════════════════════════════

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
GRAY='\033[0;90m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${CYAN}ℹ ${NC}$1"; }
log_success() { echo -e "${GREEN}✅${NC} $1"; }
log_error() { echo -e "${RED}❌${NC} $1"; }
log_warning() { echo -e "${YELLOW}⚠️ ${NC} $1"; }
log_skip() { echo -e "${GRAY}⏭️ ${NC} $1"; }

banner() {
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${BLUE}═══════════════════════════════════════════════════════════════════════════${NC}"
}

# Configuration
PROJECT_NAME="${PROJECT_NAME:-esg-navigator}"
AWS_REGION="${AWS_REGION:-us-east-1}"
AWS_ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"
ALB_DNS_NAME="${ALB_DNS_NAME:-}"

# Load config if exists
if [ -f "infrastructure/aws-config.env" ]; then
  source infrastructure/aws-config.env
  log_info "Loaded configuration from aws-config.env"
fi

# Get AWS Account ID if not set
if [ -z "$AWS_ACCOUNT_ID" ]; then
  AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text 2>/dev/null || echo "")
fi

banner "🔍 AWS ECS Deployment Verification"

echo "Configuration:"
echo "  Project: ${PROJECT_NAME}"
echo "  Region: ${AWS_REGION}"
echo "  Account: ${AWS_ACCOUNT_ID:-Not detected}"
echo ""

# Counter for issues
ISSUES=0
WARNINGS=0

# 1. Verify AWS CLI and Credentials
banner "🔐 AWS Credentials"

if ! command -v aws &> /dev/null; then
  log_error "AWS CLI not installed"
  ((ISSUES++))
else
  log_success "AWS CLI installed"

  if aws sts get-caller-identity &> /dev/null; then
    IDENTITY=$(aws sts get-caller-identity --query 'Arn' --output text)
    log_success "AWS credentials valid: $IDENTITY"
  else
    log_error "AWS credentials invalid or not configured"
    ((ISSUES++))
  fi
fi

# 2. Verify ECR Repositories
banner "📦 ECR Repositories"

for repo in api web; do
  REPO_NAME="${PROJECT_NAME}-${repo}"
  if aws ecr describe-repositories --repository-names $REPO_NAME --region ${AWS_REGION} &>/dev/null; then
    # Get image count
    IMAGE_COUNT=$(aws ecr list-images --repository-name $REPO_NAME --region ${AWS_REGION} --query 'length(imageIds)' --output text)
    log_success "Repository exists: $REPO_NAME ($IMAGE_COUNT images)"
  else
    log_error "Repository not found: $REPO_NAME"
    ((ISSUES++))
  fi
done

# 3. Verify ECS Cluster
banner "🐳 ECS Cluster"

CLUSTER_NAME="${PROJECT_NAME}-cluster"
if aws ecs describe-clusters --clusters $CLUSTER_NAME --region ${AWS_REGION} --query 'clusters[0].status' --output text 2>/dev/null | grep -q "ACTIVE"; then
  TASK_COUNT=$(aws ecs describe-clusters --clusters $CLUSTER_NAME --region ${AWS_REGION} --query 'clusters[0].runningTasksCount' --output text)
  log_success "Cluster active: $CLUSTER_NAME (Running tasks: $TASK_COUNT)"
else
  log_error "Cluster not found or inactive: $CLUSTER_NAME"
  ((ISSUES++))
fi

# 4. Verify ECS Services
banner "🔄 ECS Services"

for service in api web; do
  SERVICE_NAME="${PROJECT_NAME}-${service}-service"
  SERVICE_INFO=$(aws ecs describe-services \
    --cluster $CLUSTER_NAME \
    --services $SERVICE_NAME \
    --region ${AWS_REGION} 2>/dev/null)

  if [ -n "$SERVICE_INFO" ]; then
    STATUS=$(echo "$SERVICE_INFO" | jq -r '.services[0].status // "UNKNOWN"')
    DESIRED=$(echo "$SERVICE_INFO" | jq -r '.services[0].desiredCount // 0')
    RUNNING=$(echo "$SERVICE_INFO" | jq -r '.services[0].runningCount // 0')

    if [ "$STATUS" = "ACTIVE" ]; then
      if [ "$RUNNING" -eq "$DESIRED" ] && [ "$RUNNING" -gt 0 ]; then
        log_success "Service healthy: $SERVICE_NAME ($RUNNING/$DESIRED tasks)"
      else
        log_warning "Service active but tasks not matching: $SERVICE_NAME ($RUNNING/$DESIRED tasks)"
        ((WARNINGS++))
      fi
    else
      log_error "Service not active: $SERVICE_NAME (Status: $STATUS)"
      ((ISSUES++))
    fi
  else
    log_error "Service not found: $SERVICE_NAME"
    ((ISSUES++))
  fi
done

# 5. Verify Task Definitions
banner "📋 Task Definitions"

for service in api web; do
  TASK_FAMILY="${PROJECT_NAME}-${service}"
  LATEST_REVISION=$(aws ecs describe-task-definition \
    --task-definition $TASK_FAMILY \
    --region ${AWS_REGION} \
    --query 'taskDefinition.revision' \
    --output text 2>/dev/null || echo "0")

  if [ "$LATEST_REVISION" != "0" ]; then
    log_success "Task definition exists: $TASK_FAMILY:$LATEST_REVISION"
  else
    log_error "Task definition not found: $TASK_FAMILY"
    ((ISSUES++))
  fi
done

# 6. Verify CloudWatch Log Groups
banner "📊 CloudWatch Logs"

for service in api web; do
  LOG_GROUP="/ecs/${PROJECT_NAME}-${service}"
  if aws logs describe-log-groups \
    --log-group-name-prefix $LOG_GROUP \
    --region ${AWS_REGION} \
    --query 'logGroups[0].logGroupName' \
    --output text 2>/dev/null | grep -q "$LOG_GROUP"; then

    # Check for recent log streams
    RECENT_STREAMS=$(aws logs describe-log-streams \
      --log-group-name $LOG_GROUP \
      --region ${AWS_REGION} \
      --order-by LastEventTime \
      --descending \
      --max-items 1 \
      --query 'logStreams[0].lastEventTimestamp' \
      --output text 2>/dev/null || echo "0")

    if [ "$RECENT_STREAMS" != "0" ] && [ "$RECENT_STREAMS" != "None" ]; then
      TIMESTAMP=$(date -d @$((RECENT_STREAMS / 1000)) 2>/dev/null || echo "unknown")
      log_success "Log group active: $LOG_GROUP (Last event: $TIMESTAMP)"
    else
      log_warning "Log group exists but no recent logs: $LOG_GROUP"
      ((WARNINGS++))
    fi
  else
    log_error "Log group not found: $LOG_GROUP"
    ((ISSUES++))
  fi
done

# 7. Verify Load Balancer (if DNS name provided)
banner "⚖️  Application Load Balancer"

if [ -n "$ALB_DNS_NAME" ]; then
  # Check ALB health
  if curl -s -o /dev/null -w "%{http_code}" "http://${ALB_DNS_NAME}" | grep -q "200\|301\|302"; then
    log_success "ALB responding: $ALB_DNS_NAME"
  else
    log_error "ALB not responding: $ALB_DNS_NAME"
    ((ISSUES++))
  fi
else
  log_skip "ALB verification skipped (set ALB_DNS_NAME to verify)"
fi

# 8. Verify Target Groups Health
banner "🎯 Target Groups"

TARGET_GROUPS=$(aws elbv2 describe-target-groups \
  --region ${AWS_REGION} \
  --query "TargetGroups[?contains(TargetGroupName, '${PROJECT_NAME}')].TargetGroupArn" \
  --output text 2>/dev/null || echo "")

if [ -n "$TARGET_GROUPS" ]; then
  for TG_ARN in $TARGET_GROUPS; do
    TG_NAME=$(aws elbv2 describe-target-groups --target-group-arns $TG_ARN --region ${AWS_REGION} --query 'TargetGroups[0].TargetGroupName' --output text)
    HEALTH=$(aws elbv2 describe-target-health --target-group-arn $TG_ARN --region ${AWS_REGION} --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text 2>/dev/null || echo "unknown")

    if [ "$HEALTH" = "healthy" ]; then
      log_success "Target group healthy: $TG_NAME"
    elif [ "$HEALTH" = "initial" ] || [ "$HEALTH" = "unused" ]; then
      log_warning "Target group not ready: $TG_NAME (State: $HEALTH)"
      ((WARNINGS++))
    else
      log_error "Target group unhealthy: $TG_NAME (State: $HEALTH)"
      ((ISSUES++))
    fi
  done
else
  log_skip "No target groups found (ALB may not be configured)"
fi

# 9. Verify VPC and Networking
banner "🌐 VPC and Networking"

if [ -n "${VPC_ID:-}" ]; then
  if aws ec2 describe-vpcs --vpc-ids $VPC_ID --region ${AWS_REGION} &>/dev/null; then
    log_success "VPC exists: $VPC_ID"

    # Check internet connectivity
    IGW=$(aws ec2 describe-internet-gateways \
      --filters "Name=attachment.vpc-id,Values=$VPC_ID" \
      --region ${AWS_REGION} \
      --query 'InternetGateways[0].InternetGatewayId' \
      --output text 2>/dev/null || echo "None")

    if [ "$IGW" != "None" ] && [ -n "$IGW" ]; then
      log_success "Internet Gateway attached: $IGW"
    else
      log_warning "No Internet Gateway found for VPC"
      ((WARNINGS++))
    fi
  else
    log_error "VPC not found: $VPC_ID"
    ((ISSUES++))
  fi
else
  log_skip "VPC verification skipped (VPC_ID not set)"
fi

# 10. Test API and Web Endpoints
banner "🌍 Endpoint Health Checks"

# Function to test endpoint
test_endpoint() {
  local url=$1
  local name=$2

  if [ -n "$url" ]; then
    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")

    if [ "$HTTP_CODE" = "200" ]; then
      log_success "$name endpoint healthy: $url (HTTP $HTTP_CODE)"
    elif [ "$HTTP_CODE" = "000" ]; then
      log_error "$name endpoint unreachable: $url"
      ((ISSUES++))
    else
      log_warning "$name endpoint returned HTTP $HTTP_CODE: $url"
      ((WARNINGS++))
    fi
  else
    log_skip "$name endpoint not configured"
  fi
}

# Test endpoints if provided
test_endpoint "${API_URL:-}" "API"
test_endpoint "${WEB_URL:-}" "Web"

# Summary
banner "📊 Verification Summary"

echo -e "${CYAN}Results:${NC}"
if [ $ISSUES -eq 0 ] && [ $WARNINGS -eq 0 ]; then
  echo -e "  ${GREEN}Status: ✅ All checks passed${NC}"
elif [ $ISSUES -eq 0 ]; then
  echo -e "  ${YELLOW}Status: ⚠️  Passed with $WARNINGS warning(s)${NC}"
else
  echo -e "  ${RED}Status: ❌ Failed with $ISSUES issue(s) and $WARNINGS warning(s)${NC}"
fi

echo ""
echo "  Issues: $ISSUES"
echo "  Warnings: $WARNINGS"
echo ""

if [ $ISSUES -gt 0 ]; then
  log_warning "Some components failed verification. Check the errors above."
  echo ""
  log_info "Troubleshooting tips:"
  echo "  • Check AWS CloudWatch logs: aws logs tail /ecs/${PROJECT_NAME}-api --follow"
  echo "  • Verify ECS task status: aws ecs list-tasks --cluster ${CLUSTER_NAME}"
  echo "  • Check service events: aws ecs describe-services --cluster ${CLUSTER_NAME} --services ${PROJECT_NAME}-api-service"
  echo "  • Review security groups and network configuration"
  echo ""
  exit 1
fi

if [ $WARNINGS -gt 0 ]; then
  log_info "Deployment completed with warnings. Monitor the system for stability."
  exit 0
fi

log_success "✨ All verification checks passed! Deployment is healthy."
echo ""
