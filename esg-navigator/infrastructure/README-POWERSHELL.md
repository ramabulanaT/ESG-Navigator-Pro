# AWS Deployment - PowerShell Guide

Quick reference for deploying ESG Navigator to AWS using PowerShell on Windows.

## Prerequisites

- AWS CLI installed and configured
- Docker Desktop running
- PowerShell 5.1 or higher
- AWS account with appropriate permissions

## Quick Start

### 1. Set Environment Variables

```powershell
# Set your AWS configuration
$Env:AWS_REGION = "us-east-1"
$Env:PROJECT_NAME = "esg-navigator"
$Env:AWS_ACCOUNT_ID = $(aws sts get-caller-identity --query Account --output text)

# Verify
Write-Host "AWS Account: $Env:AWS_ACCOUNT_ID"
Write-Host "Region: $Env:AWS_REGION"
```

### 2. Get Infrastructure Information

```powershell
# Get ALB DNS, cluster info, and other deployment details
.\infrastructure\get-aws-info.ps1
```

This will display:
- ✅ ALB DNS name (for accessing your application)
- ✅ ECS cluster status
- ✅ Service health (API and Web)
- ✅ RDS database endpoint
- ✅ ECR repository status
- ✅ VPC information

**Output saved to:** `infrastructure/aws-env.ps1`

### 3. Load Saved Environment Variables

```powershell
# Load previously saved environment variables
. .\infrastructure\aws-env.ps1

# Now you can use:
Write-Host "ALB DNS: $Env:ALB_DNS_NAME"
```

### 4. Verify Deployment

```powershell
# Run comprehensive verification
.\infrastructure\verify-aws.ps1

# Or with custom parameters
.\infrastructure\verify-aws.ps1 -ProjectName "esg-navigator" -AwsRegion "us-east-1"
```

The verification script checks:
- ✅ AWS credentials
- ✅ ECR repositories and images
- ✅ ECS cluster and services
- ✅ Task definitions
- ✅ CloudWatch logs
- ✅ Load balancer health
- ✅ Target groups
- ✅ VPC and networking
- ✅ Endpoint availability

## Common Commands

### Get ALB DNS Name

```powershell
# Method 1: Using get-aws-info.ps1
.\infrastructure\get-aws-info.ps1

# Method 2: Direct AWS CLI command
$ALB_DNS = aws elbv2 describe-load-balancers `
  --names "$Env:PROJECT_NAME-alb" `
  --region $Env:AWS_REGION `
  --query 'LoadBalancers[0].DNSName' `
  --output text

Write-Host "ALB DNS: $ALB_DNS" -ForegroundColor Green
```

### Check ECS Service Status

```powershell
# Check both API and Web services
aws ecs describe-services `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --services "$Env:PROJECT_NAME-api-service" "$Env:PROJECT_NAME-web-service" `
  --region $Env:AWS_REGION `
  --query 'services[*].[serviceName,status,runningCount,desiredCount]' `
  --output table
```

### View CloudWatch Logs

```powershell
# View API logs
aws logs tail /ecs/$Env:PROJECT_NAME-api --follow --region $Env:AWS_REGION

# View Web logs
aws logs tail /ecs/$Env:PROJECT_NAME-web --follow --region $Env:AWS_REGION

# View last 50 lines
aws logs tail /ecs/$Env:PROJECT_NAME-api --since 1h
```

### Test Endpoints

```powershell
# Test frontend
$response = Invoke-WebRequest -Uri "http://$Env:ALB_DNS_NAME" -UseBasicParsing
Write-Host "Frontend: HTTP $($response.StatusCode)" -ForegroundColor Green

# Test API health
$response = Invoke-WebRequest -Uri "http://$Env:ALB_DNS_NAME/api/health" -UseBasicParsing
Write-Host "API Health: HTTP $($response.StatusCode)" -ForegroundColor Green
Write-Host $response.Content
```

### Get Running Tasks

```powershell
# List all tasks
aws ecs list-tasks `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --region $Env:AWS_REGION `
  --query 'taskArns' `
  --output table

# Get task details
$taskArns = aws ecs list-tasks `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --region $Env:AWS_REGION `
  --query 'taskArns' `
  --output text

if ($taskArns) {
  aws ecs describe-tasks `
    --cluster "$Env:PROJECT_NAME-cluster" `
    --tasks $taskArns `
    --region $Env:AWS_REGION `
    --query 'tasks[*].[taskArn,lastStatus,healthStatus,containers[0].name]' `
    --output table
}
```

### Scale Services

```powershell
# Scale API service to 4 tasks
aws ecs update-service `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --service "$Env:PROJECT_NAME-api-service" `
  --desired-count 4 `
  --region $Env:AWS_REGION

# Scale Web service to 3 tasks
aws ecs update-service `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --service "$Env:PROJECT_NAME-web-service" `
  --desired-count 3 `
  --region $Env:AWS_REGION
```

### Check ECR Images

```powershell
# List API images
aws ecr list-images `
  --repository-name "$Env:PROJECT_NAME-api" `
  --region $Env:AWS_REGION `
  --query 'imageIds[*].[imageTag,imageDigest]' `
  --output table

# List Web images
aws ecr list-images `
  --repository-name "$Env:PROJECT_NAME-web" `
  --region $Env:AWS_REGION `
  --query 'imageIds[*].[imageTag,imageDigest]' `
  --output table
```

### Get RDS Database Endpoint

```powershell
# Get database endpoint
$DB_ENDPOINT = aws rds describe-db-instances `
  --db-instance-identifier "$Env:PROJECT_NAME-db" `
  --query 'DBInstances[0].Endpoint.Address' `
  --output text `
  --region $Env:AWS_REGION

Write-Host "Database Endpoint: $DB_ENDPOINT" -ForegroundColor Green
$Env:DB_ENDPOINT = $DB_ENDPOINT
```

## Deployment Workflow (Bash Scripts)

For initial infrastructure setup and deployment, you'll need to use the bash scripts:

### Using Git Bash or WSL

```bash
# 1. Setup infrastructure (one-time)
bash infrastructure/setup-aws-infrastructure.sh

# 2. Deploy application
export AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
export AWS_REGION=us-east-1
bash infrastructure/deploy-aws.sh
```

### After Deployment

Once deployed, use PowerShell scripts for verification and monitoring:

```powershell
# Get deployment info
.\infrastructure\get-aws-info.ps1

# Verify everything is working
.\infrastructure\verify-aws.ps1
```

## Troubleshooting

### ALB Not Found

```powershell
# Check if ALB exists
aws elbv2 describe-load-balancers --region $Env:AWS_REGION

# Check ALB by name
aws elbv2 describe-load-balancers `
  --names "$Env:PROJECT_NAME-alb" `
  --region $Env:AWS_REGION
```

### Service Not Starting

```powershell
# Get service events
aws ecs describe-services `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --services "$Env:PROJECT_NAME-api-service" `
  --region $Env:AWS_REGION `
  --query 'services[0].events[0:5]' `
  --output table

# Check task failures
aws ecs list-tasks `
  --cluster "$Env:PROJECT_NAME-cluster" `
  --desired-status STOPPED `
  --region $Env:AWS_REGION
```

### View Task Logs

```powershell
# Get specific task logs
$taskId = "your-task-id-here"
aws logs get-log-events `
  --log-group-name "/ecs/$Env:PROJECT_NAME-api" `
  --log-stream-name "ecs/$Env:PROJECT_NAME-api/$taskId" `
  --region $Env:AWS_REGION
```

## Environment Variables Reference

```powershell
# Required
$Env:AWS_REGION          # AWS region (e.g., us-east-1)
$Env:AWS_ACCOUNT_ID      # Your AWS account ID
$Env:PROJECT_NAME        # Project name (esg-navigator)

# Optional (auto-detected by get-aws-info.ps1)
$Env:ALB_DNS_NAME        # ALB DNS name
$Env:VPC_ID              # VPC ID
$Env:DB_ENDPOINT         # RDS database endpoint
$Env:ALB_ARN             # ALB ARN
```

## Script Reference

| Script | Purpose |
|--------|---------|
| `get-aws-info.ps1` | Get all deployment information (ALB DNS, services, etc.) |
| `verify-aws.ps1` | Comprehensive deployment verification |
| `setup-aws-infrastructure.sh` | One-time infrastructure setup (use bash) |
| `deploy-aws.sh` | Build and deploy application (use bash) |
| `verify-aws.sh` | Bash version of verification (for Linux/Mac) |

## Tips

1. **Always load environment variables first:**
   ```powershell
   . .\infrastructure\aws-env.ps1
   ```

2. **Use `get-aws-info.ps1` to refresh environment:**
   ```powershell
   .\infrastructure\get-aws-info.ps1
   . .\infrastructure\aws-env.ps1
   ```

3. **Save your session:**
   ```powershell
   # Add to your PowerShell profile
   . "C:\path\to\esg-navigator\infrastructure\aws-env.ps1"
   ```

4. **Quick health check:**
   ```powershell
   .\infrastructure\verify-aws.ps1 | Select-String "Status:"
   ```

## Support

For deployment issues:
- Check CloudWatch logs: `aws logs tail /ecs/$Env:PROJECT_NAME-api --follow`
- Run verification: `.\infrastructure\verify-aws.ps1`
- Review AWS console: ECS → Clusters → $Env:PROJECT_NAME-cluster
