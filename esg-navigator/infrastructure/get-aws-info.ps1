# ═══════════════════════════════════════════════════════════════════════════
# Get AWS Infrastructure Information
# Quick script to retrieve ALB DNS and other deployment info
# ═══════════════════════════════════════════════════════════════════════════

param(
  [string]$ProjectName = "esg-navigator",
  [string]$AwsRegion = "us-east-1"
)

Set-StrictMode -Version Latest

# Set defaults
if (-not $Env:AWS_REGION) { $Env:AWS_REGION = $AwsRegion }
if (-not $Env:PROJECT_NAME) { $Env:PROJECT_NAME = $ProjectName }

$PROJECT_NAME = $Env:PROJECT_NAME
$AWS_REGION = $Env:AWS_REGION

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host "AWS Infrastructure Information - $PROJECT_NAME" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Get AWS Account ID
Write-Host "AWS Account Information:" -ForegroundColor Yellow
try {
  $accountId = aws sts get-caller-identity --query Account --output text 2>$null
  $arn = aws sts get-caller-identity --query Arn --output text 2>$null
  Write-Host "  Account ID: $accountId" -ForegroundColor Green
  Write-Host "  Identity: $arn" -ForegroundColor Gray
  $Env:AWS_ACCOUNT_ID = $accountId
} catch {
  Write-Host "  ❌ Unable to get AWS account info. Check credentials." -ForegroundColor Red
}

Write-Host ""

# Get ALB DNS
Write-Host "Application Load Balancer:" -ForegroundColor Yellow
try {
  $albInfo = aws elbv2 describe-load-balancers `
    --names "$PROJECT_NAME-alb" `
    --region $AWS_REGION 2>$null | ConvertFrom-Json

  if ($LASTEXITCODE -eq 0 -and $albInfo.LoadBalancers) {
    $alb = $albInfo.LoadBalancers[0]
    Write-Host "  DNS Name: $($alb.DNSName)" -ForegroundColor Green
    Write-Host "  ARN: $($alb.LoadBalancerArn)" -ForegroundColor Gray
    Write-Host "  State: $($alb.State.Code)" -ForegroundColor $(if ($alb.State.Code -eq "active") { "Green" } else { "Yellow" })
    Write-Host "  Scheme: $($alb.Scheme)" -ForegroundColor Gray

    # Export for use in other scripts
    $Env:ALB_DNS_NAME = $alb.DNSName
    $Env:ALB_ARN = $alb.LoadBalancerArn

    Write-Host ""
    Write-Host "  Frontend URL: http://$($alb.DNSName)" -ForegroundColor Cyan
    Write-Host "  API URL: http://$($alb.DNSName)/api/health" -ForegroundColor Cyan
  } else {
    Write-Host "  ⚠️  ALB not found. It may not be created yet." -ForegroundColor Yellow
  }
} catch {
  Write-Host "  ❌ Error retrieving ALB information" -ForegroundColor Red
}

Write-Host ""

# Get ECS Cluster Info
Write-Host "ECS Cluster:" -ForegroundColor Yellow
try {
  $clusterInfo = aws ecs describe-clusters `
    --clusters "$PROJECT_NAME-cluster" `
    --region $AWS_REGION 2>$null | ConvertFrom-Json

  if ($LASTEXITCODE -eq 0 -and $clusterInfo.clusters) {
    $cluster = $clusterInfo.clusters[0]
    Write-Host "  Name: $($cluster.clusterName)" -ForegroundColor Green
    Write-Host "  Status: $($cluster.status)" -ForegroundColor $(if ($cluster.status -eq "ACTIVE") { "Green" } else { "Yellow" })
    Write-Host "  Running Tasks: $($cluster.runningTasksCount)" -ForegroundColor Gray
    Write-Host "  Pending Tasks: $($cluster.pendingTasksCount)" -ForegroundColor Gray
    Write-Host "  Services: $($cluster.activeServicesCount)" -ForegroundColor Gray
  } else {
    Write-Host "  ⚠️  Cluster not found" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  ❌ Error retrieving cluster information" -ForegroundColor Red
}

Write-Host ""

# Get ECS Services
Write-Host "ECS Services:" -ForegroundColor Yellow
foreach ($svc in @("api", "web")) {
  $serviceName = "$PROJECT_NAME-$svc-service"
  try {
    $serviceInfo = aws ecs describe-services `
      --cluster "$PROJECT_NAME-cluster" `
      --services $serviceName `
      --region $AWS_REGION 2>$null | ConvertFrom-Json

    if ($LASTEXITCODE -eq 0 -and $serviceInfo.services) {
      $service = $serviceInfo.services[0]
      Write-Host "  $($svc.ToUpper()):" -ForegroundColor Cyan
      Write-Host "    Status: $($service.status)" -ForegroundColor $(if ($service.status -eq "ACTIVE") { "Green" } else { "Yellow" })
      Write-Host "    Desired: $($service.desiredCount) | Running: $($service.runningCount)" -ForegroundColor Gray
      Write-Host "    Task Definition: $($service.taskDefinition.Split('/')[1])" -ForegroundColor Gray
    } else {
      Write-Host "  $($svc.ToUpper()): ⚠️  Not found" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  $($svc.ToUpper()): ❌ Error" -ForegroundColor Red
  }
}

Write-Host ""

# Get RDS Database
Write-Host "RDS Database:" -ForegroundColor Yellow
try {
  $dbInfo = aws rds describe-db-instances `
    --db-instance-identifier "$PROJECT_NAME-db" `
    --region $AWS_REGION 2>$null | ConvertFrom-Json

  if ($LASTEXITCODE -eq 0 -and $dbInfo.DBInstances) {
    $db = $dbInfo.DBInstances[0]
    Write-Host "  Instance ID: $($db.DBInstanceIdentifier)" -ForegroundColor Green
    Write-Host "  Status: $($db.DBInstanceStatus)" -ForegroundColor $(if ($db.DBInstanceStatus -eq "available") { "Green" } else { "Yellow" })
    Write-Host "  Endpoint: $($db.Endpoint.Address):$($db.Endpoint.Port)" -ForegroundColor Gray
    Write-Host "  Engine: PostgreSQL $($db.EngineVersion)" -ForegroundColor Gray
    Write-Host "  Instance Class: $($db.DBInstanceClass)" -ForegroundColor Gray

    $Env:DB_ENDPOINT = $db.Endpoint.Address
  } else {
    Write-Host "  ⚠️  Database not found" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  ⚠️  Database not found or error retrieving info" -ForegroundColor Yellow
}

Write-Host ""

# Get ECR Repositories
Write-Host "ECR Repositories:" -ForegroundColor Yellow
foreach ($repo in @("api", "web")) {
  $repoName = "$PROJECT_NAME-$repo"
  try {
    $repoInfo = aws ecr describe-repositories `
      --repository-names $repoName `
      --region $AWS_REGION 2>$null | ConvertFrom-Json

    if ($LASTEXITCODE -eq 0 -and $repoInfo.repositories) {
      $imageCount = aws ecr list-images `
        --repository-name $repoName `
        --region $AWS_REGION `
        --query 'length(imageIds)' `
        --output text 2>$null

      Write-Host "  $($repo.ToUpper()): ✅ $imageCount images" -ForegroundColor Green
    } else {
      Write-Host "  $($repo.ToUpper()): ⚠️  Not found" -ForegroundColor Yellow
    }
  } catch {
    Write-Host "  $($repo.ToUpper()): ⚠️  Not found" -ForegroundColor Yellow
  }
}

Write-Host ""

# Get VPC Info
Write-Host "VPC:" -ForegroundColor Yellow
try {
  $vpcs = aws ec2 describe-vpcs `
    --filters "Name=tag:Name,Values=$PROJECT_NAME-vpc" `
    --region $AWS_REGION 2>$null | ConvertFrom-Json

  if ($LASTEXITCODE -eq 0 -and $vpcs.Vpcs) {
    $vpc = $vpcs.Vpcs[0]
    Write-Host "  VPC ID: $($vpc.VpcId)" -ForegroundColor Green
    Write-Host "  CIDR: $($vpc.CidrBlock)" -ForegroundColor Gray
    $Env:VPC_ID = $vpc.VpcId
  } else {
    Write-Host "  ⚠️  VPC not found" -ForegroundColor Yellow
  }
} catch {
  Write-Host "  ⚠️  VPC not found" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Blue
Write-Host ""

# Save environment variables to a file for easy re-use
if ($Env:ALB_DNS_NAME -or $Env:VPC_ID -or $Env:DB_ENDPOINT) {
  Write-Host "💾 Saving environment variables..." -ForegroundColor Cyan

  $envVars = @"
# AWS Environment Variables for $PROJECT_NAME
# Generated on $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

`$Env:AWS_REGION = "$AWS_REGION"
`$Env:AWS_ACCOUNT_ID = "$($Env:AWS_ACCOUNT_ID)"
`$Env:PROJECT_NAME = "$PROJECT_NAME"
"@

  if ($Env:ALB_DNS_NAME) {
    $envVars += "`n`$Env:ALB_DNS_NAME = `"$($Env:ALB_DNS_NAME)`""
  }
  if ($Env:VPC_ID) {
    $envVars += "`n`$Env:VPC_ID = `"$($Env:VPC_ID)`""
  }
  if ($Env:DB_ENDPOINT) {
    $envVars += "`n`$Env:DB_ENDPOINT = `"$($Env:DB_ENDPOINT)`""
  }

  $envFile = Join-Path $PSScriptRoot "aws-env.ps1"
  $envVars | Out-File -FilePath $envFile -Encoding UTF8

  Write-Host "   Saved to: $envFile" -ForegroundColor Green
  Write-Host "   Load with: . .\infrastructure\aws-env.ps1" -ForegroundColor Gray
  Write-Host ""
}

Write-Host "Quick Commands:" -ForegroundColor Yellow
Write-Host "  • Verify deployment: .\infrastructure\verify-aws.ps1" -ForegroundColor Cyan
Write-Host "  • View API logs: aws logs tail /ecs/$PROJECT_NAME-api --follow" -ForegroundColor Cyan
Write-Host "  • View Web logs: aws logs tail /ecs/$PROJECT_NAME-web --follow" -ForegroundColor Cyan
if ($Env:ALB_DNS_NAME) {
  Write-Host "  • Test frontend: curl http://$($Env:ALB_DNS_NAME)" -ForegroundColor Cyan
  Write-Host "  • Test API: curl http://$($Env:ALB_DNS_NAME)/api/health" -ForegroundColor Cyan
}
Write-Host ""
