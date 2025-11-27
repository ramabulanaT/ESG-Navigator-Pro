# ═══════════════════════════════════════════════════════════════════════════
# AWS ECS Deployment Verification Script (PowerShell)
# Verifies all components of the ESG Navigator AWS deployment
# ═══════════════════════════════════════════════════════════════════════════

param(
  [string]$ProjectName = "esg-navigator",
  [string]$AwsRegion = "us-east-1",
  [string]$AlbDnsName = ""
)

# Set strict mode
Set-StrictMode -Version Latest
$ErrorActionPreference = "Continue"

# Logging functions
function Log-Info { param([string]$msg) Write-Host "ℹ  $msg" -ForegroundColor Cyan }
function Log-Success { param([string]$msg) Write-Host "✅ $msg" -ForegroundColor Green }
function Log-Error { param([string]$msg) Write-Host "❌ $msg" -ForegroundColor Red }
function Log-Warning { param([string]$msg) Write-Host "⚠️  $msg" -ForegroundColor Yellow }
function Log-Skip { param([string]$msg) Write-Host "⏭️  $msg" -ForegroundColor DarkGray }

function Show-Banner {
  param([string]$msg)
  Write-Host ""
  Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Blue
  Write-Host $msg -ForegroundColor Cyan
  Write-Host "═══════════════════════════════════════════════════════════════════════════" -ForegroundColor Blue
}

# Load configuration from environment or config file
if (-not $Env:AWS_REGION) { $Env:AWS_REGION = $AwsRegion }
if (-not $Env:PROJECT_NAME) { $Env:PROJECT_NAME = $ProjectName }

# Try to load from aws-config.env if it exists
$ConfigFile = Join-Path $PSScriptRoot "aws-config.env"
if (Test-Path $ConfigFile) {
  Log-Info "Loading configuration from aws-config.env"
  Get-Content $ConfigFile | ForEach-Object {
    if ($_ -match '^export\s+(\w+)="?([^"]+)"?$') {
      Set-Item -Path "Env:$($matches[1])" -Value $matches[2]
    }
  }
}

$PROJECT_NAME = $Env:PROJECT_NAME
$AWS_REGION = $Env:AWS_REGION
$AWS_ACCOUNT_ID = $Env:AWS_ACCOUNT_ID
$ALB_DNS_NAME = if ($AlbDnsName) { $AlbDnsName } else { $Env:ALB_DNS_NAME }

# Get AWS Account ID if not set
if (-not $AWS_ACCOUNT_ID) {
  try {
    $AWS_ACCOUNT_ID = aws sts get-caller-identity --query Account --output text 2>$null
    $Env:AWS_ACCOUNT_ID = $AWS_ACCOUNT_ID
  } catch {
    $AWS_ACCOUNT_ID = ""
  }
}

Show-Banner "🔍 AWS ECS Deployment Verification"

Write-Host "Configuration:"
Write-Host "  Project: $PROJECT_NAME"
Write-Host "  Region: $AWS_REGION"
Write-Host "  Account: $(if ($AWS_ACCOUNT_ID) { $AWS_ACCOUNT_ID } else { 'Not detected' })"
Write-Host ""

# Counter for issues
$Script:ISSUES = 0
$Script:WARNINGS = 0

# 1. Verify AWS CLI and Credentials
Show-Banner "🔐 AWS Credentials"

if (-not (Get-Command aws -ErrorAction SilentlyContinue)) {
  Log-Error "AWS CLI not installed"
  $Script:ISSUES++
} else {
  Log-Success "AWS CLI installed"

  try {
    $identity = aws sts get-caller-identity --query 'Arn' --output text 2>$null
    if ($LASTEXITCODE -eq 0) {
      Log-Success "AWS credentials valid: $identity"
    } else {
      Log-Error "AWS credentials invalid or not configured"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "AWS credentials invalid or not configured"
    $Script:ISSUES++
  }
}

# 2. Verify ECR Repositories
Show-Banner "📦 ECR Repositories"

foreach ($repo in @("api", "web")) {
  $repoName = "$PROJECT_NAME-$repo"
  try {
    $result = aws ecr describe-repositories --repository-names $repoName --region $AWS_REGION 2>&1
    if ($LASTEXITCODE -eq 0) {
      $imageCount = aws ecr list-images --repository-name $repoName --region $AWS_REGION --query 'length(imageIds)' --output text 2>$null
      Log-Success "Repository exists: $repoName ($imageCount images)"
    } else {
      Log-Error "Repository not found: $repoName"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "Repository not found: $repoName"
    $Script:ISSUES++
  }
}

# 3. Verify ECS Cluster
Show-Banner "🐳 ECS Cluster"

$clusterName = "$PROJECT_NAME-cluster"
try {
  $clusterStatus = aws ecs describe-clusters --clusters $clusterName --region $AWS_REGION --query 'clusters[0].status' --output text 2>$null
  if ($LASTEXITCODE -eq 0 -and $clusterStatus -eq "ACTIVE") {
    $taskCount = aws ecs describe-clusters --clusters $clusterName --region $AWS_REGION --query 'clusters[0].runningTasksCount' --output text 2>$null
    Log-Success "Cluster active: $clusterName (Running tasks: $taskCount)"
  } else {
    Log-Error "Cluster not found or inactive: $clusterName"
    $Script:ISSUES++
  }
} catch {
  Log-Error "Cluster not found or inactive: $clusterName"
  $Script:ISSUES++
}

# 4. Verify ECS Services
Show-Banner "🔄 ECS Services"

foreach ($service in @("api", "web")) {
  $serviceName = "$PROJECT_NAME-$service-service"
  try {
    $serviceInfo = aws ecs describe-services `
      --cluster $clusterName `
      --services $serviceName `
      --region $AWS_REGION 2>$null | ConvertFrom-Json

    if ($LASTEXITCODE -eq 0 -and $serviceInfo.services.Count -gt 0) {
      $status = $serviceInfo.services[0].status
      $desired = $serviceInfo.services[0].desiredCount
      $running = $serviceInfo.services[0].runningCount

      if ($status -eq "ACTIVE") {
        if ($running -eq $desired -and $running -gt 0) {
          Log-Success "Service healthy: $serviceName ($running/$desired tasks)"
        } else {
          Log-Warning "Service active but tasks not matching: $serviceName ($running/$desired tasks)"
          $Script:WARNINGS++
        }
      } else {
        Log-Error "Service not active: $serviceName (Status: $status)"
        $Script:ISSUES++
      }
    } else {
      Log-Error "Service not found: $serviceName"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "Service not found: $serviceName"
    $Script:ISSUES++
  }
}

# 5. Verify Task Definitions
Show-Banner "📋 Task Definitions"

foreach ($service in @("api", "web")) {
  $taskFamily = "$PROJECT_NAME-$service"
  try {
    $revision = aws ecs describe-task-definition `
      --task-definition $taskFamily `
      --region $AWS_REGION `
      --query 'taskDefinition.revision' `
      --output text 2>$null

    if ($LASTEXITCODE -eq 0 -and $revision) {
      Log-Success "Task definition exists: ${taskFamily}:$revision"
    } else {
      Log-Error "Task definition not found: $taskFamily"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "Task definition not found: $taskFamily"
    $Script:ISSUES++
  }
}

# 6. Verify CloudWatch Log Groups
Show-Banner "📊 CloudWatch Logs"

foreach ($service in @("api", "web")) {
  $logGroup = "/ecs/$PROJECT_NAME-$service"
  try {
    $logGroupExists = aws logs describe-log-groups `
      --log-group-name-prefix $logGroup `
      --region $AWS_REGION `
      --query 'logGroups[0].logGroupName' `
      --output text 2>$null

    if ($LASTEXITCODE -eq 0 -and $logGroupExists -eq $logGroup) {
      # Check for recent log streams
      $recentStream = aws logs describe-log-streams `
        --log-group-name $logGroup `
        --region $AWS_REGION `
        --order-by LastEventTime `
        --descending `
        --max-items 1 `
        --query 'logStreams[0].lastEventTimestamp' `
        --output text 2>$null

      if ($recentStream -and $recentStream -ne "None" -and $recentStream -ne "0") {
        $timestamp = [DateTimeOffset]::FromUnixTimeMilliseconds([long]$recentStream).LocalDateTime.ToString("yyyy-MM-dd HH:mm:ss")
        Log-Success "Log group active: $logGroup (Last event: $timestamp)"
      } else {
        Log-Warning "Log group exists but no recent logs: $logGroup"
        $Script:WARNINGS++
      }
    } else {
      Log-Error "Log group not found: $logGroup"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "Log group not found: $logGroup"
    $Script:ISSUES++
  }
}

# 7. Verify Load Balancer
Show-Banner "⚖️  Application Load Balancer"

if ($ALB_DNS_NAME) {
  try {
    $response = Invoke-WebRequest -Uri "http://$ALB_DNS_NAME" -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
    if ($response.StatusCode -in @(200, 301, 302)) {
      Log-Success "ALB responding: $ALB_DNS_NAME (HTTP $($response.StatusCode))"
    } else {
      Log-Error "ALB not responding properly: $ALB_DNS_NAME (HTTP $($response.StatusCode))"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "ALB not responding: $ALB_DNS_NAME"
    $Script:ISSUES++
  }
} else {
  # Try to get ALB DNS name
  try {
    $albDns = aws elbv2 describe-load-balancers `
      --names "$PROJECT_NAME-alb" `
      --region $AWS_REGION `
      --query 'LoadBalancers[0].DNSName' `
      --output text 2>$null

    if ($LASTEXITCODE -eq 0 -and $albDns -and $albDns -ne "None") {
      $Env:ALB_DNS_NAME = $albDns
      Log-Info "Found ALB DNS: $albDns"

      try {
        $response = Invoke-WebRequest -Uri "http://$albDns" -UseBasicParsing -TimeoutSec 10 -ErrorAction SilentlyContinue
        if ($response.StatusCode -in @(200, 301, 302)) {
          Log-Success "ALB responding: $albDns (HTTP $($response.StatusCode))"
        } else {
          Log-Warning "ALB not responding properly: $albDns (HTTP $($response.StatusCode))"
          $Script:WARNINGS++
        }
      } catch {
        Log-Warning "ALB not responding: $albDns"
        $Script:WARNINGS++
      }
    } else {
      Log-Skip "ALB verification skipped (set `$Env:ALB_DNS_NAME to verify)"
    }
  } catch {
    Log-Skip "ALB verification skipped (set `$Env:ALB_DNS_NAME to verify)"
  }
}

# 8. Verify Target Groups Health
Show-Banner "🎯 Target Groups"

try {
  $targetGroups = aws elbv2 describe-target-groups `
    --region $AWS_REGION `
    --query "TargetGroups[?contains(TargetGroupName, '$PROJECT_NAME')].TargetGroupArn" `
    --output text 2>$null

  if ($LASTEXITCODE -eq 0 -and $targetGroups) {
    foreach ($tgArn in $targetGroups -split '\s+') {
      if ($tgArn) {
        $tgName = aws elbv2 describe-target-groups --target-group-arns $tgArn --region $AWS_REGION --query 'TargetGroups[0].TargetGroupName' --output text 2>$null
        $health = aws elbv2 describe-target-health --target-group-arn $tgArn --region $AWS_REGION --query 'TargetHealthDescriptions[0].TargetHealth.State' --output text 2>$null

        if ($health -eq "healthy") {
          Log-Success "Target group healthy: $tgName"
        } elseif ($health -in @("initial", "unused")) {
          Log-Warning "Target group not ready: $tgName (State: $health)"
          $Script:WARNINGS++
        } elseif ($health) {
          Log-Error "Target group unhealthy: $tgName (State: $health)"
          $Script:ISSUES++
        } else {
          Log-Warning "Target group has no targets: $tgName"
          $Script:WARNINGS++
        }
      }
    }
  } else {
    Log-Skip "No target groups found (ALB may not be configured)"
  }
} catch {
  Log-Skip "No target groups found (ALB may not be configured)"
}

# 9. Verify VPC and Networking
Show-Banner "🌐 VPC and Networking"

$VPC_ID = $Env:VPC_ID
if ($VPC_ID) {
  try {
    $vpcExists = aws ec2 describe-vpcs --vpc-ids $VPC_ID --region $AWS_REGION 2>$null
    if ($LASTEXITCODE -eq 0) {
      Log-Success "VPC exists: $VPC_ID"

      # Check internet connectivity
      $igw = aws ec2 describe-internet-gateways `
        --filters "Name=attachment.vpc-id,Values=$VPC_ID" `
        --region $AWS_REGION `
        --query 'InternetGateways[0].InternetGatewayId' `
        --output text 2>$null

      if ($LASTEXITCODE -eq 0 -and $igw -and $igw -ne "None") {
        Log-Success "Internet Gateway attached: $igw"
      } else {
        Log-Warning "No Internet Gateway found for VPC"
        $Script:WARNINGS++
      }
    } else {
      Log-Error "VPC not found: $VPC_ID"
      $Script:ISSUES++
    }
  } catch {
    Log-Error "VPC not found: $VPC_ID"
    $Script:ISSUES++
  }
} else {
  Log-Skip "VPC verification skipped (VPC_ID not set)"
}

# 10. Test Endpoints
Show-Banner "🌍 Endpoint Health Checks"

function Test-Endpoint {
  param([string]$url, [string]$name)

  if ($url) {
    try {
      $response = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
      if ($response.StatusCode -eq 200) {
        Log-Success "$name endpoint healthy: $url (HTTP $($response.StatusCode))"
      } else {
        Log-Warning "$name endpoint returned HTTP $($response.StatusCode): $url"
        $Script:WARNINGS++
      }
    } catch {
      Log-Error "$name endpoint unreachable: $url"
      $Script:ISSUES++
    }
  } else {
    Log-Skip "$name endpoint not configured"
  }
}

Test-Endpoint -url $Env:API_URL -name "API"
Test-Endpoint -url $Env:WEB_URL -name "Web"

# Summary
Show-Banner "📊 Verification Summary"

Write-Host ""
Write-Host "Results:" -ForegroundColor Cyan
if ($Script:ISSUES -eq 0 -and $Script:WARNINGS -eq 0) {
  Write-Host "  Status: ✅ All checks passed" -ForegroundColor Green
} elseif ($Script:ISSUES -eq 0) {
  Write-Host "  Status: ⚠️  Passed with $Script:WARNINGS warning(s)" -ForegroundColor Yellow
} else {
  Write-Host "  Status: ❌ Failed with $Script:ISSUES issue(s) and $Script:WARNINGS warning(s)" -ForegroundColor Red
}

Write-Host ""
Write-Host "  Issues: $Script:ISSUES"
Write-Host "  Warnings: $Script:WARNINGS"
Write-Host ""

if ($Script:ISSUES -gt 0) {
  Log-Warning "Some components failed verification. Check the errors above."
  Write-Host ""
  Log-Info "Troubleshooting tips:"
  Write-Host "  • Check AWS CloudWatch logs: aws logs tail /ecs/$PROJECT_NAME-api --follow"
  Write-Host "  • Verify ECS task status: aws ecs list-tasks --cluster $clusterName"
  Write-Host "  • Check service events: aws ecs describe-services --cluster $clusterName --services $PROJECT_NAME-api-service"
  Write-Host "  • Review security groups and network configuration"
  Write-Host ""
  exit 1
}

if ($Script:WARNINGS -gt 0) {
  Log-Info "Deployment completed with warnings. Monitor the system for stability."
  exit 0
}

Log-Success "✨ All verification checks passed! Deployment is healthy."
Write-Host ""

# Export ALB DNS if found for convenience
if ($Env:ALB_DNS_NAME) {
  Write-Host "ALB DNS Name: $($Env:ALB_DNS_NAME)" -ForegroundColor Green
  Write-Host "You can access the application at: http://$($Env:ALB_DNS_NAME)" -ForegroundColor Cyan
  Write-Host ""
}
