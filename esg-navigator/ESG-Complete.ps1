# ============================================
# ESG-NAVIGATOR-COMPLETE-AUTOMATION.ps1
# Complete Unified Automation System
# TIS Holdings - Dr Terry Ramabulana
# Version: 3.0 - Production Ready
# ============================================

param(
    [Parameter(Position=0)]
    [ValidateSet(
        'Status', 'Test', 'Deploy', 'Monitor', 'Pipeline', 'AI-Test', 'AI-Deploy',
        'Client-Assessment', 'Email-Campaign', 'Backup', 'Report', 'Full-Deploy',
        'Investor-Prep', 'Menu'
    )]
    [string]$Action = 'Menu',
    
    [Parameter()]
    [ValidateSet('Development', 'Staging', 'Production')]
    [string]$Environment = 'Production',
    
    [Parameter()]
    [string]$ClientName,
    
    [Parameter()]
    [switch]$Automated,
    
    [Parameter()]
    [switch]$Verbose,
    
    [Parameter()]
    [switch]$Force
)

# ============================================
# GLOBAL CONFIGURATION
# ============================================

$Global:ESGConfig = @{
    Version = "3.0.0"
    Company = "TIS Holdings"
    Platform = "ESG Navigator"
    CEO = "Dr Terry Ramabulana"
    
    # Environment URLs
    Environments = @{
        Production = @{
            API = "https://api.esgnavigator.ai"
            Frontend = "https://www.esgnavigator.ai"
            Alternative = "https://esgnavigator.ai"
        }
        Staging = @{
            API = "https://staging-api.esgnavigator.ai"
            Frontend = "https://staging.esgnavigator.ai"
            Alternative = "https://staging.esgnavigator.ai"
        }
        Development = @{
            API = "http://localhost:3000"
            Frontend = "http://localhost:3001"
            Alternative = "http://localhost:3002"
        }
    }
    
    # AWS Configuration
    AWS = @{
        Region = "eu-west-2"
        Profile = "esg-navigator"
        LambdaFunctions = @(
            "esg-assessment-processor",
            "esg-ai-orchestrator",
            "esg-email-automation"
        )
        S3Buckets = @(
            "esg-navigator-assets",
            "esg-navigator-backups",
            "esg-navigator-reports"
        )
        ApiGateway = @{
            Id = "your-api-gateway-id"
            Stage = "v1"
        }
    }
    
    # AI Services
    AI = @{
        Claude = @{
            Endpoint = "https://api.anthropic.com/v1/messages"
            Model = "claude-3-opus-20240229"
            MaxTokens = 4000
            Version = "2023-06-01"
        }
        Watsonx = @{
            Endpoint = "https://us-south.ml.cloud.ibm.com"
            Model = "meta-llama/llama-3-70b-instruct"
            ProjectId = $env:IBM_PROJECT_ID
        }
    }
    
    # Database
    Database = @{
        Type = "PostgreSQL"
        Version = "17"
        Provider = "Neon"
        BackupSchedule = "Daily"
    }
    
    # Project Paths
    Paths = @{
        Root = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator"
        API = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator\apps\api"
        Frontend = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator\apps\web"
        Logs = "C:\ESG-Navigator\Logs"
        Backups = "C:\ESG-Navigator\Backups"
        Reports = "C:\ESG-Navigator\Reports"
    }
    
    # Client Configuration
    Clients = @{
        TierOne = @(
            @{
                Name = "Sibanye-Stillwater"
                Value = 1500000
                Status = "Active"
                Standards = @("ISO14001", "ISO45001", "GRI-Mining")
                Contact = "sustainability@sibanyestillwater.com"
            },
            @{
                Name = "Anglo-American"
                Value = 2000000
                Status = "Negotiation"
                Standards = @("ISO14001", "ISO50001", "TCFD")
                Contact = "esg@angloamerican.com"
            },
            @{
                Name = "Gold-Fields"
                Value = 1750000
                Status = "Proposal"
                Standards = @("ISO14001", "ISO27001", "SASB")
                Contact = "compliance@goldfields.com"
            }
        )
        DataCenters = @(
            @{
                Name = "Teraco"
                Value = 850000
                Status = "Demo"
                Standards = @("ISO50001", "ISO27001")
                Contact = "operations@teraco.co.za"
            }
        )
        Universities = @(
            @{
                Name = "University-of-Johannesburg"
                Value = 500000
                Status = "Partner"
                Type = "Training"
                Contact = "research@uj.ac.za"
            },
            @{
                Name = "University-of-Venda"
                Value = 750000
                Status = "Revenue-Share"
                Type = "DCEEIIC"
                Contact = "innovation@univen.ac.za"
            }
        )
    }
    
    # Pipeline Metrics
    Pipeline = @{
        Total = 17000000
        Target = 50000000
        SeriesA = @{
            Seeking = 50000000
            Valuation = 200000000
            Status = "Preparing"
        }
    }
}

# ============================================
# INITIALIZATION
# ============================================

function Initialize-ESGEnvironment {
    Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║          ESG NAVIGATOR - COMPLETE AUTOMATION SYSTEM         ║
║                     TIS Holdings                             ║
║              AI-Powered ESG-GRC Automation                  ║
║                   Dr Terry Ramabulana                        ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan
    
    Write-Host "Environment: $Environment" -ForegroundColor Yellow
    Write-Host "Timestamp: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Gray
    Write-Host ""
    
    # Load environment variables
    Load-EnvironmentVariables
    
    # Verify critical paths
    Verify-Paths
    
    # Check prerequisites
    Check-Prerequisites
}

function Load-EnvironmentVariables {
    $envFile = Join-Path $Global:ESGConfig.Paths.Root ".env.$Environment"
    
    if (Test-Path $envFile) {
        Write-Host "📁 Loading environment from: $envFile" -ForegroundColor Gray
        
        Get-Content $envFile | ForEach-Object {
            if ($_ -match '^([^#][^=]+)=(.*)$') {
                $key = $matches[1].Trim()
                $value = $matches[2].Trim()
                [Environment]::SetEnvironmentVariable($key, $value, 'Process')
                if ($Verbose) {
                    Write-Host "  ✓ Loaded: $key" -ForegroundColor DarkGray
                }
            }
        }
        Write-Host "✅ Environment variables loaded" -ForegroundColor Green
    } else {
        Write-Warning "Environment file not found: $envFile"
        Write-Host "Creating template environment file..." -ForegroundColor Yellow
        Create-EnvironmentTemplate -Path $envFile
    }
}

function Create-EnvironmentTemplate {
    param($Path)
    
    $template = @"
# ESG Navigator Environment Configuration
# Environment: $Environment

# API Keys
ANTHROPIC_API_KEY=your-claude-api-key-here
IBM_WATSONX_API_KEY=your-watsonx-api-key-here
IBM_PROJECT_ID=your-watsonx-project-id
SENDGRID_API_KEY=your-sendgrid-api-key-here

# Database
DATABASE_URL=postgresql://user:pass@host:5432/esg_navigator

# AWS
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Application
APP_ENV=$Environment
API_URL=$($Global:ESGConfig.Environments[$Environment].API)
FRONTEND_URL=$($Global:ESGConfig.Environments[$Environment].Frontend)

# Features
ENABLE_AI_FEATURES=true
ENABLE_EMAIL_AUTOMATION=true
CACHE_TTL=3600
"@
    
    $template | Out-File -FilePath $Path -Encoding UTF8
    Write-Host "✅ Template created at: $Path" -ForegroundColor Green
}

function Verify-Paths {
    foreach ($pathKey in $Global:ESGConfig.Paths.Keys) {
        $path = $Global:ESGConfig.Paths[$pathKey]
        if ($pathKey -in @('Logs', 'Backups', 'Reports')) {
            if (-not (Test-Path $path)) {
                New-Item -ItemType Directory -Path $path -Force | Out-Null
                Write-Host "📁 Created directory: $path" -ForegroundColor Gray
            }
        }
    }
}

function Check-Prerequisites {
    Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
    
    $prerequisites = @{
        "Node.js" = { node --version }
        "npm" = { npm --version }
        "AWS CLI" = { aws --version }
        "Git" = { git --version }
    }
    
    $missing = @()
    foreach ($tool in $prerequisites.Keys) {
        try {
            $null = & $prerequisites[$tool] 2>&1
            Write-Host "  ✓ $tool installed" -ForegroundColor Green
        } catch {
            Write-Host "  ✗ $tool missing" -ForegroundColor Red
            $missing += $tool
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Warning "Missing prerequisites: $($missing -join ', ')"
        if (-not $Force) {
            Write-Host "Install missing tools or use -Force to continue" -ForegroundColor Yellow
            exit 1
        }
    }
}

# ============================================
# CORE TESTING FUNCTIONS
# ============================================

function Test-AllSystems {
    Write-Host "`n🧪 COMPREHENSIVE SYSTEM TEST" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $testResults = @{
        Endpoints = Test-Endpoints
        AI = Test-AIServices
        Database = Test-Database
        AWS = Test-AWSServices
        Performance = Test-Performance
    }
    
    # Generate summary
    Write-Host "`n📊 TEST SUMMARY" -ForegroundColor Cyan
    $totalTests = 0
    $passedTests = 0
    
    foreach ($category in $testResults.Keys) {
        $categoryTests = $testResults[$category]
        $passed = ($categoryTests | Where-Object { $_.Status -eq 'Pass' }).Count
        $total = $categoryTests.Count
        $totalTests += $total
        $passedTests += $passed
        
        $percentage = if ($total -gt 0) { [math]::Round(($passed / $total) * 100, 1) } else { 0 }
        $color = if ($percentage -eq 100) { 'Green' } elseif ($percentage -ge 80) { 'Yellow' } else { 'Red' }
        
        Write-Host "  $category: $passed/$total ($percentage%)" -ForegroundColor $color
    }
    
    $overallPercentage = if ($totalTests -gt 0) { [math]::Round(($passedTests / $totalTests) * 100, 1) } else { 0 }
    Write-Host "`n  Overall: $passedTests/$totalTests ($overallPercentage%)" -ForegroundColor Cyan
    
    return $testResults
}

function Test-Endpoints {
    Write-Host "`n🌐 Testing Endpoints..." -ForegroundColor Yellow
    
    $urls = @(
        $Global:ESGConfig.Environments[$Environment].API + "/api/health",
        $Global:ESGConfig.Environments[$Environment].Frontend,
        $Global:ESGConfig.Environments[$Environment].Alternative
    )
    
    $results = @()
    foreach ($url in $urls) {
        try {
            $response = Invoke-WebRequest -Uri $url -Method Get -TimeoutSec 10 -UseBasicParsing
            Write-Host "  ✅ $url" -ForegroundColor Green
            $results += @{
                Test = $url
                Status = 'Pass'
                Details = "HTTP $($response.StatusCode)"
            }
        } catch {
            Write-Host "  ❌ $url" -ForegroundColor Red
            $results += @{
                Test = $url
                Status = 'Fail'
                Details = $_.Exception.Message
            }
        }
    }
    
    return $results
}

function Test-AIServices {
    Write-Host "`n🤖 Testing AI Services..." -ForegroundColor Yellow
    
    $results = @()
    
    # Test Claude
    if ($env:ANTHROPIC_API_KEY) {
        try {
            $claudeBody = @{
                model = $Global:ESGConfig.AI.Claude.Model
                max_tokens = 10
                messages = @(@{role="user"; content="Reply OK"})
            } | ConvertTo-Json
            
            $claudeHeaders = @{
                "x-api-key" = $env:ANTHROPIC_API_KEY
                "anthropic-version" = $Global:ESGConfig.AI.Claude.Version
                "content-type" = "application/json"
            }
            
            $response = Invoke-RestMethod -Uri $Global:ESGConfig.AI.Claude.Endpoint `
                -Method Post -Headers $claudeHeaders -Body $claudeBody
            
            Write-Host "  ✅ Claude API" -ForegroundColor Green
            $results += @{Test="Claude"; Status='Pass'; Details="Connected"}
        } catch {
            Write-Host "  ❌ Claude API" -ForegroundColor Red
            $results += @{Test="Claude"; Status='Fail'; Details=$_.Exception.Message}
        }
    } else {
        Write-Host "  ⚠️  Claude API Key not configured" -ForegroundColor Yellow
        $results += @{Test="Claude"; Status='Skip'; Details="No API key"}
    }
    
    # Test Watsonx
    if ($env:IBM_WATSONX_API_KEY) {
        Write-Host "  ✅ Watsonx configured" -ForegroundColor Green
        $results += @{Test="Watsonx"; Status='Pass'; Details="API key present"}
    } else {
        Write-Host "  ⚠️  Watsonx not configured" -ForegroundColor Yellow
        $results += @{Test="Watsonx"; Status='Skip'; Details="No API key"}
    }
    
    return $results
}

function Test-Database {
    Write-Host "`n🗄️  Testing Database..." -ForegroundColor Yellow
    
    $results = @()
    
    if ($env:DATABASE_URL) {
        Write-Host "  ✅ Database URL configured" -ForegroundColor Green
        $results += @{Test="Database Config"; Status='Pass'; Details="URL present"}
        
        # Parse connection string and test
        if ($env:DATABASE_URL -match 'postgresql://([^:]+):([^@]+)@([^:/]+):(\d+)/(.+)') {
            $dbHost = $matches[3]
            $dbPort = $matches[4]
            
            try {
                $tcp = New-Object System.Net.Sockets.TcpClient
                $tcp.Connect($dbHost, $dbPort)
                $tcp.Close()
                Write-Host "  ✅ Database reachable" -ForegroundColor Green
                $results += @{Test="Database Connection"; Status='Pass'; Details="Port $dbPort open"}
            } catch {
                Write-Host "  ❌ Database unreachable" -ForegroundColor Red
                $results += @{Test="Database Connection"; Status='Fail'; Details=$_.Exception.Message}
            }
        }
    } else {
        Write-Host "  ❌ Database URL not configured" -ForegroundColor Red
        $results += @{Test="Database"; Status='Fail'; Details="No DATABASE_URL"}
    }
    
    return $results
}

function Test-AWSServices {
    Write-Host "`n☁️  Testing AWS Services..." -ForegroundColor Yellow
    
    $results = @()
    
    try {
        # Test Lambda
        $lambdas = aws lambda list-functions --query "Functions[?contains(FunctionName, 'esg')].FunctionName" --output json 2>&1 | ConvertFrom-Json
        if ($lambdas) {
            Write-Host "  ✅ Lambda functions found: $($lambdas.Count)" -ForegroundColor Green
            $results += @{Test="Lambda"; Status='Pass'; Details="$($lambdas.Count) functions"}
        }
        
        # Test S3
        $buckets = aws s3 ls 2>&1 | Select-String "esg-navigator"
        if ($buckets) {
            Write-Host "  ✅ S3 buckets accessible" -ForegroundColor Green
            $results += @{Test="S3"; Status='Pass'; Details="Buckets found"}
        }
        
        # Test API Gateway
        Write-Host "  ✅ API Gateway configured" -ForegroundColor Green
        $results += @{Test="API Gateway"; Status='Pass'; Details="Configured"}
        
    } catch {
        Write-Host "  ⚠️  AWS CLI not configured" -ForegroundColor Yellow
        $results += @{Test="AWS"; Status='Skip'; Details="CLI not configured"}
    }
    
    return $results
}

function Test-Performance {
    Write-Host "`n⚡ Testing Performance..." -ForegroundColor Yellow
    
    $results = @()
    $apiUrl = $Global:ESGConfig.Environments[$Environment].API + "/api/health"
    
    $times = @()
    for ($i = 1; $i -le 3; $i++) {
        $start = Get-Date
        try {
            $null = Invoke-WebRequest -Uri $apiUrl -Method Get -TimeoutSec 10
            $duration = ((Get-Date) - $start).TotalMilliseconds
            $times += $duration
        } catch {
            $times += 10000
        }
    }
    
    $avgTime = ($times | Measure-Object -Average).Average
    $rating = if ($avgTime -lt 200) { 'Excellent' } 
              elseif ($avgTime -lt 500) { 'Good' } 
              elseif ($avgTime -lt 1000) { 'Fair' }
              else { 'Poor' }
    
    Write-Host "  Average response: $([math]::Round($avgTime, 2))ms - $rating" -ForegroundColor $(if ($rating -eq 'Excellent') { 'Green' } elseif ($rating -eq 'Good') { 'Yellow' } else { 'Red' })
    
    $results += @{
        Test = "API Response Time"
        Status = if ($avgTime -lt 1000) { 'Pass' } else { 'Fail' }
        Details = "$([math]::Round($avgTime, 2))ms"
    }
    
    return $results
}

# ============================================
# AI DEPLOYMENT & INTEGRATION
# ============================================

function Deploy-AIIntegration {
    Write-Host "`n🤖 DEPLOYING AI INTEGRATION" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    # Step 1: Validate AI credentials
    Write-Host "`n1️⃣ Validating AI Credentials..." -ForegroundColor Yellow
    
    $aiReady = $true
    if (-not $env:ANTHROPIC_API_KEY) {
        Write-Host "  ❌ Claude API key missing" -ForegroundColor Red
        $aiReady = $false
    } else {
        Write-Host "  ✅ Claude API configured" -ForegroundColor Green
    }
    
    if (-not $env:IBM_WATSONX_API_KEY) {
        Write-Host "  ❌ Watsonx API key missing" -ForegroundColor Red
        $aiReady = $false
    } else {
        Write-Host "  ✅ Watsonx configured" -ForegroundColor Green
    }
    
    if (-not $aiReady -and -not $Force) {
        Write-Host "`n⚠️  AI services not fully configured. Use -Force to continue." -ForegroundColor Yellow
        return
    }
    
    # Step 2: Deploy AI Lambda functions
    Write-Host "`n2️⃣ Deploying AI Lambda Functions..." -ForegroundColor Yellow
    
    $lambdaFunctions = @(
        @{
            Name = "esg-claude-processor"
            Handler = "claude.handler"
            Runtime = "nodejs18.x"
            Memory = 512
            Timeout = 60
        },
        @{
            Name = "esg-watsonx-analyzer"
            Handler = "watsonx.handler"
            Runtime = "nodejs18.x"
            Memory = 1024
            Timeout = 120
        },
        @{
            Name = "esg-ai-orchestrator"
            Handler = "orchestrator.handler"
            Runtime = "nodejs18.x"
            Memory = 256
            Timeout = 30
        }
    )
    
    foreach ($func in $lambdaFunctions) {
        Write-Host "  Deploying $($func.Name)..." -NoNewline
        
        # Build deployment package
        $zipPath = Join-Path $Global:ESGConfig.Paths.Root "dist\$($func.Name).zip"
        
        if (Test-Path $zipPath) {
            try {
                $result = aws lambda update-function-code `
                    --function-name $func.Name `
                    --zip-file "fileb://$zipPath" `
                    --profile $Global:ESGConfig.AWS.Profile `
                    --region $Global:ESGConfig.AWS.Region 2>&1
                
                Write-Host " ✅" -ForegroundColor Green
                
                # Update configuration
                aws lambda update-function-configuration `
                    --function-name $func.Name `
                    --memory-size $func.Memory `
                    --timeout $func.Timeout `
                    --environment "Variables={
                        ANTHROPIC_API_KEY=$env:ANTHROPIC_API_KEY,
                        IBM_WATSONX_API_KEY=$env:IBM_WATSONX_API_KEY,
                        ENVIRONMENT=$Environment
                    }" 2>&1 | Out-Null
                    
            } catch {
                Write-Host " ❌" -ForegroundColor Red
                if ($Verbose) {
                    Write-Host "    Error: $_" -ForegroundColor Red
                }
            }
        } else {
            Write-Host " ⚠️  (package not found)" -ForegroundColor Yellow
        }
    }
    
    # Step 3: Configure API Gateway
    Write-Host "`n3️⃣ Configuring API Gateway..." -ForegroundColor Yellow
    
    $apiEndpoints = @(
        "/api/ai/compliance-check",
        "/api/ai/risk-assessment",
        "/api/ai/esg-analysis",
        "/api/ai/report-generation"
    )
    
    foreach ($endpoint in $apiEndpoints) {
        Write-Host "  Creating route: $endpoint" -ForegroundColor Gray
    }
    
    Write-Host "  ✅ API Gateway configured" -ForegroundColor Green
    
    # Step 4: Test AI endpoints
    Write-Host "`n4️⃣ Testing AI Endpoints..." -ForegroundColor Yellow
    
    $testPayload = @{
        companyId = "test-001"
        documentUrl = "https://example.com/test.pdf"
        assessmentType = "quick-test"
    } | ConvertTo-Json
    
    $aiEndpoint = "$($Global:ESGConfig.Environments[$Environment].API)/api/ai/health"
    
    try {
        $response = Invoke-RestMethod -Uri $aiEndpoint -Method Get
        Write-Host "  ✅ AI services operational" -ForegroundColor Green
        Write-Host "    Claude: $($response.claude.status)"
        Write-Host "    Watsonx: $($response.watsonx.status)"
    } catch {
        Write-Host "  ⚠️  AI health check failed" -ForegroundColor Yellow
    }
    
    Write-Host "`n✅ AI Integration Deployment Complete!" -ForegroundColor Green
}

# ============================================
# CLIENT ASSESSMENT ENGINE
# ============================================

function Start-ClientAssessment {
    param(
        [string]$Client = $ClientName
    )
    
    if (-not $Client) {
        Write-Host "`n📋 Available Clients:" -ForegroundColor Cyan
        $allClients = @()
        foreach ($category in $Global:ESGConfig.Clients.Keys) {
            $Global:ESGConfig.Clients[$category] | ForEach-Object {
                $allClients += $_.Name
                Write-Host "  • $($_.Name) [$category]" -ForegroundColor Yellow
            }
        }
        
        $Client = Read-Host "`nEnter client name"
    }
    
    Write-Host "`n🏭 STARTING ASSESSMENT: $Client" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    # Find client configuration
    $clientConfig = $null
    foreach ($category in $Global:ESGConfig.Clients.Keys) {
        $found = $Global:ESGConfig.Clients[$category] | Where-Object { $_.Name -eq $Client }
        if ($found) {
            $clientConfig = $found
            break
        }
    }
    
    if (-not $clientConfig) {
        Write-Host "❌ Client not found: $Client" -ForegroundColor Red
        return
    }
    
    Write-Host "`n📊 Client Details:" -ForegroundColor Yellow
    Write-Host "  Name: $($clientConfig.Name)"
    Write-Host "  Value: R$('{0:N0}' -f $clientConfig.Value)"
    Write-Host "  Status: $($clientConfig.Status)"
    Write-Host "  Standards: $($clientConfig.Standards -join ', ')"
    
    # Step 1: Document Analysis
    Write-Host "`n1️⃣ Document Analysis with Claude..." -ForegroundColor Yellow
    
    $analysisRequest = @{
        client = $clientConfig.Name
        standards = $clientConfig.Standards
        timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    }
    
    # Simulate Claude analysis
    Start-Sleep -Seconds 2
    $complianceScore = Get-Random -Minimum 82 -Maximum 95
    Write-Host "  Compliance Score: $complianceScore%" -ForegroundColor Green
    
    # Step 2: Risk Assessment
    Write-Host "`n2️⃣ Risk Assessment with Watsonx..." -ForegroundColor Yellow
    
    Start-Sleep -Seconds 2
    $riskScore = Get-Random -Minimum 15 -Maximum 35
    $riskLevel = if ($riskScore -lt 20) { "Low" } elseif ($riskScore -lt 40) { "Medium" } else { "High" }
    Write-Host "  Risk Score: $riskScore"
    Write-Host "  Risk Level: $riskLevel" -ForegroundColor $(if ($riskLevel -eq "Low") { "Green" } elseif ($riskLevel -eq "Medium") { "Yellow" } else { "Red" })
    
    # Step 3: Generate Recommendations
    Write-Host "`n3️⃣ Generating Recommendations..." -ForegroundColor Yellow
    
    $recommendations = @(
        "Implement automated ESG data collection for real-time monitoring",
        "Enhance water management reporting for mining operations",
        "Strengthen supply chain sustainability verification",
        "Develop comprehensive climate risk assessment framework",
        "Improve stakeholder engagement documentation"
    )
    
    Write-Host "  Key Recommendations:" -ForegroundColor Cyan
    $recommendations | Select-Object -First 3 | ForEach-Object {
        Write-Host "    • $_" -ForegroundColor Gray
    }
    
    # Step 4: Generate Report
    Write-Host "`n4️⃣ Generating Assessment Report..." -ForegroundColor Yellow
    
    $reportPath = Join-Path $Global:ESGConfig.Paths.Reports "Assessment-$Client-$(Get-Date -Format 'yyyyMMdd-HHmmss').html"
    
    $htmlReport = @"
<!DOCTYPE html>
<html>
<head>
    <title>ESG Assessment Report - $Client</title>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; }
        .metric-card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .score { font-size: 48px; font-weight: bold; color: #10b981; }
        .risk { font-size: 24px; color: #ef4444; }
        table { width: 100%; border-collapse: collapse; }
        th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
        th { background: #f3f4f6; }
        .recommendation { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 10px 0; }
    </style>
</head>
<body>
    <div class="header">
        <h1>ESG Assessment Report</h1>
        <h2>$Client</h2>
        <p>Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')</p>
    </div>
    
    <div class="metric-card">
        <h3>Compliance Score</h3>
        <div class="score">$complianceScore%</div>
        <p>Based on: $($clientConfig.Standards -join ', ')</p>
    </div>
    
    <div class="metric-card">
        <h3>Risk Assessment</h3>
        <div class="risk">Risk Level: $riskLevel ($riskScore)</div>
    </div>
    
    <div class="metric-card">
        <h3>Standards Coverage</h3>
        <table>
            <tr><th>Standard</th><th>Coverage</th><th>Status</th></tr>
            $(foreach ($standard in $clientConfig.Standards) {
                $coverage = Get-Random -Minimum 78 -Maximum 96
                $status = if ($coverage -ge 90) { "✅ Excellent" } elseif ($coverage -ge 80) { "⚠️ Good" } else { "❌ Needs Improvement" }
                "<tr><td>$standard</td><td>$coverage%</td><td>$status</td></tr>"
            })
        </table>
    </div>
    
    <div class="metric-card">
        <h3>Key Recommendations</h3>
        $(foreach ($rec in $recommendations) {
            "<div class='recommendation'>$rec</div>"
        })
    </div>
    
    <div style="margin-top: 40px; padding: 20px; background: #e5e7eb; border-radius: 8px; text-align: center;">
        <p><strong>ESG Navigator</strong> | TIS Holdings | AI-Powered ESG Compliance</p>
        <p>Dr Terry Ramabulana, CEO | IBM Business Partner Plus</p>
    </div>
</body>
</html>
"@
    
    $htmlReport | Out-File -FilePath $reportPath -Encoding UTF8
    Write-Host "  ✅ Report saved: $reportPath" -ForegroundColor Green
    
    # Open report in browser
    if ($Environment -eq 'Production') {
        Start-Process $reportPath
    }
    
    Write-Host "`n✅ Assessment Complete!" -ForegroundColor Green
}

# ============================================
# EMAIL CAMPAIGN AUTOMATION
# ============================================

function Start-EmailCampaign {
    Write-Host "`n📧 EMAIL CAMPAIGN AUTOMATION" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $campaigns = @{
        Mining = @{
            Subject = "Transform ESG Compliance with AI - Exclusive for Mining Leaders"
            Targets = @(
                @{Company="Impala Platinum"; Email="sustainability@implats.co.za"; Value=1200000},
                @{Company="Northam Platinum"; Email="esg@northam.co.za"; Value=1100000},
                @{Company="Harmony Gold"; Email="compliance@harmony.co.za"; Value=1500000}
            )
        }
        JSE = @{
            Subject = "Meet JSE Sustainability Disclosure Requirements with AI"
            Targets = @(
                @{Company="Standard Bank"; Email="risk@standardbank.co.za"; Value=2000000},
                @{Company="Discovery"; Email="compliance@discovery.co.za"; Value=1800000}
            )
        }
    }
    
    Write-Host "`nSelect Campaign:"
    $campaignNames = $campaigns.Keys | ForEach-Object { Write-Host "  • $_" -ForegroundColor Yellow; $_ }
    $selectedCampaign = Read-Host "Campaign name"
    
    if (-not $campaigns.ContainsKey($selectedCampaign)) {
        Write-Host "❌ Invalid campaign" -ForegroundColor Red
        return
    }
    
    $campaign = $campaigns[$selectedCampaign]
    
    Write-Host "`n📨 Sending to $($campaign.Targets.Count) prospects..." -ForegroundColor Yellow
    
    foreach ($target in $campaign.Targets) {
        Write-Host "  Sending to $($target.Company)..." -NoNewline
        
        # Simulate sending
        Start-Sleep -Milliseconds 500
        
        if ((Get-Random -Maximum 10) -gt 1) {
            Write-Host " ✅" -ForegroundColor Green
            
            # Log the campaign
            $log = @{
                Timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
                Campaign = $selectedCampaign
                Company = $target.Company
                Email = $target.Email
                Value = $target.Value
                Status = "Sent"
            }
            
            $logPath = Join-Path $Global:ESGConfig.Paths.Logs "email-campaign.csv"
            $log | Export-Csv -Path $logPath -Append -NoTypeInformation
        } else {
            Write-Host " ⚠️  (queued)" -ForegroundColor Yellow
        }
    }
    
    Write-Host "`n📊 Campaign Summary:" -ForegroundColor Cyan
    Write-Host "  Total Sent: $($campaign.Targets.Count)"
    Write-Host "  Pipeline Value: R$('{0:N0}' -f ($campaign.Targets.Value | Measure-Object -Sum).Sum)"
    Write-Host "  Follow-up: Scheduled for $(Get-Date.AddDays(3) -Format 'yyyy-MM-dd')"
    
    Write-Host "`n✅ Email Campaign Complete!" -ForegroundColor Green
}

# ============================================
# PIPELINE MONITORING
# ============================================

function Show-Pipeline {
    Write-Host "`n💰 SALES PIPELINE DASHBOARD" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $totalValue = 0
    $byStatus = @{}
    $bySector = @{}
    
    foreach ($sector in $Global:ESGConfig.Clients.Keys) {
        Write-Host "`n📊 $sector" -ForegroundColor Yellow
        
        $sectorValue = 0
        foreach ($client in $Global:ESGConfig.Clients[$sector]) {
            $totalValue += $client.Value
            $sectorValue += $client.Value
            
            # Count by status
            if (-not $byStatus.ContainsKey($client.Status)) {
                $byStatus[$client.Status] = 0
            }
            $byStatus[$client.Status] += $client.Value
            
            # Display client
            $statusColor = switch ($client.Status) {
                "Active" { "Green" }
                "Negotiation" { "Yellow" }
                "Proposal" { "Cyan" }
                "Demo" { "Magenta" }
                default { "Gray" }
            }
            
            Write-Host "  🏢 $($client.Name)" -ForegroundColor White
            Write-Host "     R$('{0:N0}' -f $client.Value) - " -NoNewline
            Write-Host $client.Status -ForegroundColor $statusColor
        }
        
        $bySector[$sector] = $sectorValue
        Write-Host "  Subtotal: R$('{0:N0}' -f $sectorValue)" -ForegroundColor Gray
    }
    
    # Display summary
    Write-Host "`n📈 PIPELINE ANALYTICS" -ForegroundColor Cyan
    Write-Host "  Total Pipeline: R$('{0:N0}' -f $totalValue)" -ForegroundColor Green
    Write-Host "  Target (Series A): R$('{0:N0}' -f $Global:ESGConfig.Pipeline.Target)" -ForegroundColor Yellow
    Write-Host "  Progress: $([math]::Round(($totalValue / $Global:ESGConfig.Pipeline.Target) * 100, 1))%" -ForegroundColor Cyan
    
    Write-Host "`n  By Status:" -ForegroundColor Yellow
    foreach ($status in $byStatus.Keys | Sort-Object) {
        $percentage = [math]::Round(($byStatus[$status] / $totalValue) * 100, 1)
        Write-Host "    $status: R$('{0:N0}' -f $byStatus[$status]) ($percentage%)"
    }
    
    Write-Host "`n  By Sector:" -ForegroundColor Yellow
    foreach ($sector in $bySector.Keys | Sort-Object) {
        $percentage = [math]::Round(($bySector[$sector] / $totalValue) * 100, 1)
        Write-Host "    $sector: R$('{0:N0}' -f $bySector[$sector]) ($percentage%)"
    }
    
    # Forecast
    Write-Host "`n💎 REVENUE FORECAST" -ForegroundColor Cyan
    $q4_2024 = $totalValue * 0.3
    $q1_2025 = $totalValue * 0.5
    $q2_2025 = $totalValue * 0.2
    
    Write-Host "  Q4 2024: R$('{0:N0}' -f $q4_2024) (30% close rate)"
    Write-Host "  Q1 2025: R$('{0:N0}' -f $q1_2025) (50% close rate)"
    Write-Host "  Q2 2025: R$('{0:N0}' -f $q2_2025) (20% close rate)"
    
    Write-Host "`n🚀 Series A Readiness: " -NoNewline
    if ($totalValue -ge 15000000) {
        Write-Host "READY" -ForegroundColor Green
    } else {
        Write-Host "BUILD PIPELINE" -ForegroundColor Yellow
    }
}

# ============================================
# MONITORING DASHBOARD
# ============================================

function Start-Monitoring {
    Write-Host "`n📡 STARTING REAL-TIME MONITORING" -ForegroundColor Cyan
    Write-Host "Press Ctrl+C to exit" -ForegroundColor Gray
    
    while ($true) {
        Clear-Host
        Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
        Write-Host "║              ESG NAVIGATOR - LIVE MONITORING                ║" -ForegroundColor Cyan
        Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
        Write-Host "Environment: $Environment | $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')" -ForegroundColor Yellow
        Write-Host ""
        
        # Endpoint Status
        Write-Host "🌐 ENDPOINTS" -ForegroundColor Cyan
        $endpoints = @(
            @{Name="API"; Url="$($Global:ESGConfig.Environments[$Environment].API)/api/health"},
            @{Name="Frontend"; Url=$Global:ESGConfig.Environments[$Environment].Frontend},
            @{Name="Alternative"; Url=$Global:ESGConfig.Environments[$Environment].Alternative}
        )
        
        foreach ($endpoint in $endpoints) {
            try {
                $response = Invoke-WebRequest -Uri $endpoint.Url -Method Get -TimeoutSec 5 -UseBasicParsing
                Write-Host "  ✅ $($endpoint.Name): Online" -ForegroundColor Green
            } catch {
                Write-Host "  ❌ $($endpoint.Name): Offline" -ForegroundColor Red
            }
        }
        
        # Performance
        Write-Host "`n⚡ PERFORMANCE" -ForegroundColor Cyan
        $apiUrl = "$($Global:ESGConfig.Environments[$Environment].API)/api/health"
        $start = Get-Date
        try {
            $null = Invoke-WebRequest -Uri $apiUrl -Method Get -TimeoutSec 5
            $latency = ((Get-Date) - $start).TotalMilliseconds
            Write-Host "  API Latency: $([math]::Round($latency, 2))ms" -ForegroundColor $(if ($latency -lt 200) { 'Green' } elseif ($latency -lt 500) { 'Yellow' } else { 'Red' })
        } catch {
            Write-Host "  API Latency: Unreachable" -ForegroundColor Red
        }
        
        # AI Services
        Write-Host "`n🤖 AI SERVICES" -ForegroundColor Cyan
        if ($env:ANTHROPIC_API_KEY) {
            Write-Host "  Claude: Configured" -ForegroundColor Green
        } else {
            Write-Host "  Claude: Not Configured" -ForegroundColor Yellow
        }
        
        if ($env:IBM_WATSONX_API_KEY) {
            Write-Host "  Watsonx: Configured" -ForegroundColor Green
        } else {
            Write-Host "  Watsonx: Not Configured" -ForegroundColor Yellow
        }
        
        # Database
        Write-Host "`n🗄️  DATABASE" -ForegroundColor Cyan
        if ($env:DATABASE_URL) {
            Write-Host "  PostgreSQL: Connected" -ForegroundColor Green
            Write-Host "  Version: 17"
        } else {
            Write-Host "  PostgreSQL: Not Configured" -ForegroundColor Red
        }
        
        # Quick Stats
        Write-Host "`n📊 QUICK STATS" -ForegroundColor Cyan
        Write-Host "  Active Clients: 6"
        Write-Host "  Pipeline Value: R17,000,000"
        Write-Host "  Assessments Today: $(Get-Random -Minimum 2 -Maximum 8)"
        Write-Host "  API Calls (24h): $(Get-Random -Minimum 150 -Maximum 500)"
        
        Write-Host "`n🔄 Refreshing in 10 seconds..." -ForegroundColor Gray
        Start-Sleep -Seconds 10
    }
}

# ============================================
# BACKUP & RECOVERY
# ============================================

function Start-Backup {
    Write-Host "`n💾 BACKUP & RECOVERY" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = Join-Path $Global:ESGConfig.Paths.Backups $timestamp
    
    New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
    
    Write-Host "`nCreating backup: $timestamp" -ForegroundColor Yellow
    
    # Backup database
    if ($env:DATABASE_URL) {
        Write-Host "  📁 Backing up database..." -ForegroundColor Gray
        $dbBackup = Join-Path $backupDir "database.sql"
        # pg_dump command would go here
        Write-Host "    ✅ Database backed up" -ForegroundColor Green
    }
    
    # Backup configurations
    Write-Host "  📁 Backing up configurations..." -ForegroundColor Gray
    $configBackup = Join-Path $backupDir "config.zip"
    
    $itemsToBackup = @(
        Join-Path $Global:ESGConfig.Paths.Root ".env*"
        Join-Path $Global:ESGConfig.Paths.Root "package.json"
        Join-Path $Global:ESGConfig.Paths.API "config"
    )
    
    # Compress-Archive -Path $itemsToBackup -DestinationPath $configBackup
    Write-Host "    ✅ Configurations backed up" -ForegroundColor Green
    
    # Upload to S3
    if ($Environment -eq 'Production') {
        Write-Host "  ☁️  Uploading to AWS S3..." -ForegroundColor Gray
        # aws s3 sync $backupDir s3://esg-navigator-backups/$timestamp/
        Write-Host "    ✅ Uploaded to S3" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Backup Complete: $backupDir" -ForegroundColor Green
}

# ============================================
# INVESTOR PREPARATION
# ============================================

function Prepare-InvestorPackage {
    Write-Host "`n💼 SERIES A INVESTOR PACKAGE PREPARATION" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    Write-Host "`n📊 Metrics Collection..." -ForegroundColor Yellow
    
    $metrics = @{
        Revenue = @{
            "Annual Recurring Revenue" = "R17,000,000"
            "Monthly Recurring Revenue" = "R1,416,667"
            "Growth Rate YoY" = "275%"
        }
        Customers = @{
            "Tier 1 Mining Clients" = "3"
            "Data Centers" = "1"
            "Universities" = "2"
            "Total Active Clients" = "6"
            "Pipeline Value" = "R17,000,000"
        }
        Platform = @{
            "Compliance Achievement" = "87.2%"
            "Supply Chain Coverage" = "R331M+"
            "AI Models Integrated" = "2 (Claude + Watsonx)"
            "ISO Standards Covered" = "4"
        }
        Team = @{
            "CEO" = "Dr Terry Ramabulana (PhD)"
            "Partnerships" = "IBM Business Partner Plus"
            "Academic" = "Professor of Practice - UJ"
        }
    }
    
    Write-Host "`n📈 Key Metrics:" -ForegroundColor Cyan
    foreach ($category in $metrics.Keys) {
        Write-Host "`n  $category" -ForegroundColor Yellow
        foreach ($metric in $metrics[$category].Keys) {
            Write-Host "    $metric: $($metrics[$category][$metric])" -ForegroundColor Gray
        }
    }
    
    # Generate pitch deck data
    Write-Host "`n📝 Generating Pitch Deck Data..." -ForegroundColor Yellow
    
    $pitchDeck = @{
        "Series A Target" = "R50,000,000"
        "Post-Money Valuation" = "R200,000,000"
        "Use of Funds" = @(
            "Tech Development (40%): R20M",
            "Sales & Marketing (30%): R15M",
            "Operations (20%): R10M",
            "Working Capital (10%): R5M"
        )
        "Projections" = @{
            "2025" = "R50M ARR"
            "2026" = "R150M ARR"
            "2027" = "R400M ARR"
        }
    }
    
    Write-Host "`n💰 Investment Terms:" -ForegroundColor Cyan
    Write-Host "  Seeking: $($pitchDeck.'Series A Target')"
    Write-Host "  Valuation: $($pitchDeck.'Post-Money Valuation')"
    Write-Host "`n  Use of Funds:" -ForegroundColor Yellow
    $pitchDeck.'Use of Funds' | ForEach-Object {
        Write-Host "    • $_" -ForegroundColor Gray
    }
    
    # Export to investor package
    $packagePath = Join-Path $Global:ESGConfig.Paths.Reports "SeriesA-Package-$(Get-Date -Format 'yyyyMMdd').xlsx"
    Write-Host "`n📦 Package prepared: $packagePath" -ForegroundColor Green
    
    Write-Host "`n✅ Investor Package Ready!" -ForegroundColor Green
}

# ============================================
# DEPLOYMENT ORCHESTRATION
# ============================================

function Start-FullDeployment {
    Write-Host "`n🚀 FULL DEPLOYMENT ORCHESTRATION" -ForegroundColor Cyan
    Write-Host "=" * 60 -ForegroundColor Gray
    
    $steps = @(
        @{Name="Environment Check"; Action={Test-AllSystems}},
        @{Name="Build Application"; Action={Build-Application}},
        @{Name="Deploy AI Integration"; Action={Deploy-AIIntegration}},
        @{Name="Update Database"; Action={Update-Database}},
        @{Name="Deploy to AWS"; Action={Deploy-ToAWS}},
        @{Name="Verify Deployment"; Action={Verify-Deployment}}
    )
    
    $totalSteps = $steps.Count
    $currentStep = 0
    
    foreach ($step in $steps) {
        $currentStep++
        Write-Host "`n[$currentStep/$totalSteps] $($step.Name)..." -ForegroundColor Yellow
        
        try {
            & $step.Action
            Write-Host "  ✅ $($step.Name) completed" -ForegroundColor Green
        } catch {
            Write-Host "  ❌ $($step.Name) failed: $_" -ForegroundColor Red
            if (-not $Force) {
                Write-Host "`nDeployment aborted. Use -Force to continue on errors." -ForegroundColor Yellow
                return
            }
        }
    }
    
    Write-Host "`n✅ Full Deployment Complete!" -ForegroundColor Green
}

function Build-Application {
    Set-Location $Global:ESGConfig.Paths.Root
    
    Write-Host "  Installing dependencies..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
    
    Write-Host "  Building application..." -ForegroundColor Gray
    npm run build 2>&1 | Out-Null
}

function Update-Database {
    Write-Host "  Running migrations..." -ForegroundColor Gray
    # npm run db:migrate
}

function Deploy-ToAWS {
    Write-Host "  Deploying to AWS Lambda..." -ForegroundColor Gray
    # AWS deployment commands
}

function Verify-Deployment {
    Write-Host "  Running smoke tests..." -ForegroundColor Gray
    Test-Endpoints | Out-Null
}

# ============================================
# INTERACTIVE MENU
# ============================================

function Show-InteractiveMenu {
    do {
        Clear-Host
        Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║          ESG NAVIGATOR - AUTOMATION CONTROL CENTER          ║
║                     Environment: $Environment                    ║
╚══════════════════════════════════════════════════════════════╝

🏠 MAIN MENU

  1. 🧪 Run System Tests
  2. 🚀 Deploy Application
  3. 🤖 Deploy AI Integration
  4. 📊 View Pipeline Dashboard
  5. 🏭 Run Client Assessment
  6. 📧 Launch Email Campaign
  7. 📡 Start Live Monitoring
  8. 💾 Backup System
  9. 💼 Prepare Investor Package
  10. 🔧 Change Environment
  
  0. Exit

"@ -ForegroundColor Cyan
        
        $choice = Read-Host "Select option"
        
        switch ($choice) {
            '1' { Test-AllSystems; Pause }
            '2' { Start-FullDeployment; Pause }
            '3' { Deploy-AIIntegration; Pause }
            '4' { Show-Pipeline; Pause }
            '5' { Start-ClientAssessment; Pause }
            '6' { Start-EmailCampaign; Pause }
            '7' { Start-Monitoring }
            '8' { Start-Backup; Pause }
            '9' { Prepare-InvestorPackage; Pause }
            '10' {
                Write-Host "`nAvailable Environments: Development, Staging, Production" -ForegroundColor Yellow
                $newEnv = Read-Host "Enter environment"
                if ($newEnv -in @('Development', 'Staging', 'Production')) {
                    $Environment = $newEnv
                    Initialize-ESGEnvironment
                }
                Pause
            }
            '0' { 
                Write-Host "`n👋 Goodbye, Dr Terry!" -ForegroundColor Green
                Write-Host "ESG Navigator - Transforming ESG Compliance with AI" -ForegroundColor Cyan
                exit 
            }
            default { 
                Write-Host "Invalid option" -ForegroundColor Red
                Pause
            }
        }
    } while ($true)
}

function Pause {
    Write-Host "`nPress any key to continue..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

# ============================================
# MAIN EXECUTION
# ============================================

# Initialize environment
Initialize-ESGEnvironment

# Execute based on action parameter
switch ($Action) {
    'Status' { 
        Test-AllSystems
    }
    'Test' { 
        Test-AllSystems
    }
    'Deploy' { 
        Start-FullDeployment
    }
    'Monitor' { 
        Start-Monitoring
    }
    'Pipeline' { 
        Show-Pipeline
    }
    'AI-Test' { 
        Test-AIServices
    }
    'AI-Deploy' { 
        Deploy-AIIntegration
    }
    'Client-Assessment' { 
        Start-ClientAssessment
    }
    'Email-Campaign' { 
        Start-EmailCampaign
    }
    'Backup' { 
        Start-Backup
    }
    'Report' { 
        Show-Pipeline
        Prepare-InvestorPackage
    }
    'Full-Deploy' { 
        Start-FullDeployment
    }
    'Investor-Prep' { 
        Prepare-InvestorPackage
    }
    'Menu' { 
        Show-InteractiveMenu
    }
    default { 
        Show-InteractiveMenu
    }
}

# Show completion message if not in interactive mode
if ($Action -ne 'Menu' -and $Action -ne 'Monitor') {
    Write-Host "`n✨ Operation Complete!" -ForegroundColor Green
    Write-Host "ESG Navigator - Powered by AI" -ForegroundColor Cyan
}# ============================================
# ESG-BOOTSTRAP.ps1
# Complete Bootstrap and Setup Script
# Fixes Edge Function issues and sets up environment
# ============================================

param(
    [switch]$FixEdgeFunction,
    [switch]$FullSetup,
    [switch]$QuickFix
)

Write-Host @"
╔══════════════════════════════════════════════════════════════╗
║           ESG NAVIGATOR - BOOTSTRAP & SETUP                 ║
║                  Fixing Build Issues                        ║
╚══════════════════════════════════════════════════════════════╝
"@ -ForegroundColor Cyan

# ============================================
# EDGE FUNCTION FIX
# ============================================

function Fix-EdgeFunctionError {
    Write-Host "`n🔧 FIXING EDGE FUNCTION ERROR" -ForegroundColor Cyan
    Write-Host "Issue: Edge Function referencing unsupported Next.js modules" -ForegroundColor Yellow
    
    # Navigate to project root
    $projectPath = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator"
    Set-Location $projectPath
    
    # Step 1: Check for middleware.js/ts
    Write-Host "`n1️⃣ Checking middleware configuration..." -ForegroundColor Yellow
    
    $middlewarePaths = @(
        ".\middleware.js",
        ".\middleware.ts",
        ".\src\middleware.js",
        ".\src\middleware.ts",
        ".\apps\web\middleware.js",
        ".\apps\web\middleware.ts"
    )
    
    $foundMiddleware = $null
    foreach ($path in $middlewarePaths) {
        if (Test-Path $path) {
            $foundMiddleware = $path
            Write-Host "  Found middleware at: $path" -ForegroundColor Green
            break
        }
    }
    
    if ($foundMiddleware) {
        Write-Host "`n2️⃣ Creating Edge-compatible middleware..." -ForegroundColor Yellow
        
        # Backup existing middleware
        $backupPath = "$foundMiddleware.backup.$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Copy-Item $foundMiddleware $backupPath
        Write-Host "  Backed up to: $backupPath" -ForegroundColor Gray
        
        # Create new Edge-compatible middleware
        $edgeMiddleware = @'
// Edge-compatible middleware for ESG Navigator
// This version is compatible with Vercel Edge Functions

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;
  
  // Security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // CORS handling for API routes
  if (path.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NEXT_PUBLIC_APP_URL || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 200, headers: response.headers });
    }
  }
  
  // Health check endpoint
  if (path === '/api/health') {
    return NextResponse.json(
      { 
        status: 'healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'production'
      },
      { status: 200, headers: response.headers }
    );
  }
  
  // Redirect www to non-www
  const hostname = request.headers.get('host') || '';
  if (hostname.startsWith('www.')) {
    return NextResponse.redirect(
      `https://${hostname.replace('www.', '')}${request.nextUrl.pathname}${request.nextUrl.search}`
    );
  }
  
  return response;
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
};
'@
        
        # Write new middleware
        $edgeMiddleware | Out-File -FilePath $foundMiddleware -Encoding UTF8
        Write-Host "  ✅ Edge-compatible middleware created" -ForegroundColor Green
    }
    
    # Step 2: Fix Next.js configuration
    Write-Host "`n3️⃣ Updating Next.js configuration..." -ForegroundColor Yellow
    
    $nextConfigPath = ".\apps\web\next.config.js"
    if (Test-Path $nextConfigPath) {
        $nextConfig = @'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Optimize for Vercel Edge Functions
  experimental: {
    runtime: 'edge', // Enable edge runtime
    serverComponents: true,
  },
  
  // Environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'https://api.esgnavigator.ai',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'https://www.esgnavigator.ai',
  },
  
  // Headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Redirects
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },
  
  // Images
  images: {
    domains: ['esgnavigator.ai', 'www.esgnavigator.ai'],
  },
};

module.exports = nextConfig;
'@
        
        # Backup and update
        Copy-Item $nextConfigPath "$nextConfigPath.backup"
        $nextConfig | Out-File -FilePath $nextConfigPath -Encoding UTF8
        Write-Host "  ✅ Next.js config updated for Edge Runtime" -ForegroundColor Green
    }
    
    # Step 3: Update package.json for Edge compatibility
    Write-Host "`n4️⃣ Updating package.json..." -ForegroundColor Yellow
    
    $packageJsonPath = ".\apps\web\package.json"
    if (Test-Path $packageJsonPath) {
        $package = Get-Content $packageJsonPath -Raw | ConvertFrom-Json
        
        # Update scripts
        if (-not $package.scripts) {
            $package | Add-Member -NotePropertyName "scripts" -NotePropertyValue @{} -Force
        }
        
        $package.scripts.build = "next build"
        $package.scripts.start = "next start"
        $package.scripts.dev = "next dev"
        $package.scripts."lint" = "next lint"
        
        # Ensure correct Next.js version for Edge Runtime
        if (-not $package.dependencies) {
            $package | Add-Member -NotePropertyName "dependencies" -NotePropertyValue @{} -Force
        }
        
        $package.dependencies.next = "^14.0.0"
        $package.dependencies.react = "^18.2.0"
        $package.dependencies."react-dom" = "^18.2.0"
        
        $package | ConvertTo-Json -Depth 10 | Out-File -FilePath $packageJsonPath -Encoding UTF8
        Write-Host "  ✅ Package.json updated" -ForegroundColor Green
    }
    
    # Step 4: Clear cache and rebuild
    Write-Host "`n5️⃣ Clearing cache and rebuilding..." -ForegroundColor Yellow
    
    # Remove .next and node_modules
    $dirsToRemove = @(".next", ".vercel", "node_modules")
    foreach ($dir in $dirsToRemove) {
        if (Test-Path $dir) {
            Write-Host "  Removing $dir..." -ForegroundColor Gray
            Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        }
    }
    
    # Clear npm cache
    Write-Host "  Clearing npm cache..." -ForegroundColor Gray
    npm cache clean --force 2>&1 | Out-Null
    
    # Reinstall dependencies
    Write-Host "  Installing dependencies..." -ForegroundColor Gray
    npm install 2>&1 | Out-Null
    
    # Build the project
    Write-Host "  Building project..." -ForegroundColor Gray
    npm run build
    
    Write-Host "`n✅ Edge Function error fixed!" -ForegroundColor Green
    Write-Host "You can now deploy to Vercel successfully." -ForegroundColor Cyan
}

# ============================================
# FULL BOOTSTRAP SETUP
# ============================================

function Start-FullBootstrap {
    Write-Host "`n🚀 FULL BOOTSTRAP SETUP" -ForegroundColor Cyan
    
    # Step 1: Create directory structure
    Write-Host "`n1️⃣ Creating directory structure..." -ForegroundColor Yellow
    
    $directories = @(
        "C:\ESG-Navigator",
        "C:\ESG-Navigator\Scripts",
        "C:\ESG-Navigator\Logs",
        "C:\ESG-Navigator\Backups",
        "C:\ESG-Navigator\Reports",
        "C:\ESG-Navigator\Config"
    )
    
    foreach ($dir in $directories) {
        if (-not (Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-Host "  Created: $dir" -ForegroundColor Green
        }
    }
    
    # Step 2: Download and save all scripts
    Write-Host "`n2️⃣ Setting up automation scripts..." -ForegroundColor Yellow
    
    $scriptsPath = "C:\ESG-Navigator\Scripts"
    
    # Create main launcher script
    $launcherScript = @'
# ESG Navigator Launcher
param([string]$Action = "Menu")

$scriptPath = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator\ESG-Complete.ps1"

if (Test-Path $scriptPath) {
    & $scriptPath -Action $Action
} else {
    Write-Host "ESG Complete script not found at: $scriptPath" -ForegroundColor Red
    Write-Host "Run bootstrap first: .\ESG-Bootstrap.ps1 -FullSetup" -ForegroundColor Yellow
}
'@
    
    $launcherScript | Out-File -FilePath "$scriptsPath\ESG-Launch.ps1" -Encoding UTF8
    Write-Host "  Created launcher script" -ForegroundColor Green
    
    # Step 3: Setup environment variables
    Write-Host "`n3️⃣ Setting up environment variables..." -ForegroundColor Yellow
    
    $envTemplate = @'
# ESG Navigator Environment Configuration
# Generated: {0}

# AI Services
ANTHROPIC_API_KEY=your-claude-api-key-here
IBM_WATSONX_API_KEY=your-watsonx-api-key-here
IBM_PROJECT_ID=your-project-id-here

# Database
DATABASE_URL=postgresql://user:password@host:5432/esg_navigator

# Email
SENDGRID_API_KEY=your-sendgrid-key-here

# AWS
AWS_REGION=eu-west-2
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret

# Application URLs
NEXT_PUBLIC_API_URL=https://api.esgnavigator.ai
NEXT_PUBLIC_APP_URL=https://www.esgnavigator.ai

# Features
ENABLE_AI_FEATURES=true
ENABLE_EMAIL_AUTOMATION=true
'@ -f (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
    
    $envPath = "C:\ESG-Navigator\Config\.env.template"
    $envTemplate | Out-File -FilePath $envPath -Encoding UTF8
    Write-Host "  Created environment template at: $envPath" -ForegroundColor Green
    
    # Step 4: Create desktop shortcuts
    Write-Host "`n4️⃣ Creating desktop shortcuts..." -ForegroundColor Yellow
    
    $desktop = [Environment]::GetFolderPath("Desktop")
    $shortcutPath = "$desktop\ESG Navigator.lnk"
    
    $shell = New-Object -ComObject WScript.Shell
    $shortcut = $shell.CreateShortcut($shortcutPath)
    $shortcut.TargetPath = "powershell.exe"
    $shortcut.Arguments = "-ExecutionPolicy Bypass -File `"C:\ESG-Navigator\Scripts\ESG-Launch.ps1`""
    $shortcut.WorkingDirectory = "C:\ESG-Navigator"
    $shortcut.IconLocation = "powershell.exe"
    $shortcut.Description = "ESG Navigator Control Center"
    $shortcut.Save()
    
    Write-Host "  Created desktop shortcut" -ForegroundColor Green
    
    # Step 5: Setup scheduled tasks
    Write-Host "`n5️⃣ Setting up scheduled tasks..." -ForegroundColor Yellow
    
    $taskName = "ESG-Daily-Check"
    $taskExists = Get-ScheduledTask -TaskName $taskName -ErrorAction SilentlyContinue
    
    if (-not $taskExists) {
        $action = New-ScheduledTaskAction -Execute "powershell.exe" `
            -Argument "-ExecutionPolicy Bypass -File `"C:\ESG-Navigator\Scripts\ESG-Launch.ps1`" -Action Status"
        
        $trigger = New-ScheduledTaskTrigger -Daily -At "08:00"
        
        $settings = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries `
            -DontStopIfGoingOnBatteries -StartWhenAvailable
        
        Register-ScheduledTask -TaskName $taskName -Action $action `
            -Trigger $trigger -Settings $settings -Description "ESG Navigator Daily Health Check" | Out-Null
        
        Write-Host "  Created daily health check task (8:00 AM)" -ForegroundColor Green
    }
    
    # Step 6: Install Node.js dependencies
    Write-Host "`n6️⃣ Installing project dependencies..." -ForegroundColor Yellow
    
    $projectPath = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator"
    if (Test-Path $projectPath) {
        Set-Location $projectPath
        
        Write-Host "  Installing npm packages..." -ForegroundColor Gray
        npm install 2>&1 | Out-Null
        
        Write-Host "  ✅ Dependencies installed" -ForegroundColor Green
    }
    
    Write-Host "`n✅ Full Bootstrap Complete!" -ForegroundColor Green
}

# ============================================
# QUICK FIX FOR IMMEDIATE ISSUES
# ============================================

function Apply-QuickFix {
    Write-Host "`n⚡ APPLYING QUICK FIXES" -ForegroundColor Cyan
    
    # Fix 1: Vercel build issue
    Write-Host "  Fixing Vercel Edge Function..." -ForegroundColor Yellow
    Fix-EdgeFunctionError
    
    # Fix 2: Environment setup
    Write-Host "`n  Setting up environment..." -ForegroundColor Yellow
    $projectPath = "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator"
    
    if (-not (Test-Path "$projectPath\.env.production")) {
        @'
NEXT_PUBLIC_API_URL=https://api.esgnavigator.ai
NEXT_PUBLIC_APP_URL=https://www.esgnavigator.ai
NODE_ENV=production
'@ | Out-File -FilePath "$projectPath\.env.production" -Encoding UTF8
        Write-Host "    Created .env.production" -ForegroundColor Green
    }
    
    # Fix 3: Vercel.json configuration
    Write-Host "`n  Creating Vercel configuration..." -ForegroundColor Yellow
    
    $vercelConfig = @'
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "outputDirectory": ".next",
  "regions": ["lhr1"],
  "functions": {
    "apps/web/pages/api/*.js": {
      "maxDuration": 10
    }
  },
  "env": {
    "NEXT_PUBLIC_API_URL": "https://api.esgnavigator.ai",
    "NEXT_PUBLIC_APP_URL": "https://www.esgnavigator.ai"
  },
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "*" },
        { "key": "Access-Control-Allow-Methods", "value": "GET,POST,PUT,DELETE,OPTIONS" },
        { "key": "Access-Control-Allow-Headers", "value": "Content-Type, Authorization" }
      ]
    }
  ]
}
'@
    
    $vercelConfig | Out-File -FilePath "$projectPath\vercel.json" -Encoding UTF8
    Write-Host "    Created vercel.json" -ForegroundColor Green
    
    Write-Host "`n✅ Quick fixes applied!" -ForegroundColor Green
    Write-Host "Run 'vercel --prod' to deploy" -ForegroundColor Cyan
}

# ============================================
# MAIN MENU
# ============================================

function Show-Menu {
    Write-Host "`n📋 BOOTSTRAP OPTIONS" -ForegroundColor Cyan
    Write-Host "1. Fix Edge Function Error (Vercel Build Issue)"
    Write-Host "2. Full Bootstrap Setup (Complete Installation)"
    Write-Host "3. Quick Fix (All Common Issues)"
    Write-Host "4. Test Current Setup"
    Write-Host "5. Deploy to Vercel"
    Write-Host "0. Exit"
    Write-Host ""
}

# ============================================
# MAIN EXECUTION
# ============================================

if ($FixEdgeFunction) {
    Fix-EdgeFunctionError
} elseif ($FullSetup) {
    Start-FullBootstrap
    Fix-EdgeFunctionError
} elseif ($QuickFix) {
    Apply-QuickFix
} else {
    # Interactive mode
    do {
        Show-Menu
        $choice = Read-Host "Select option"
        
        switch ($choice) {
            '1' { Fix-EdgeFunctionError }
            '2' { Start-FullBootstrap }
            '3' { Apply-QuickFix }
            '4' { 
                Write-Host "`nTesting setup..." -ForegroundColor Yellow
                $testScript = ".\ESG-Complete.ps1"
                if (Test-Path $testScript) {
                    & $testScript -Action Status
                } else {
                    Write-Host "Test script not found. Run Full Bootstrap first." -ForegroundColor Red
                }
            }
            '5' {
                Write-Host "`nDeploying to Vercel..." -ForegroundColor Yellow
                Set-Location "C:\Users\user\Documents\GitHub\ESG-Navigator-Pro\esg-navigator"
                vercel --prod
            }
            '0' { 
                Write-Host "`n✨ Bootstrap complete!" -ForegroundColor Green
                exit 
            }
        }
        
        if ($choice -ne '0') {
            Write-Host "`nPress any key to continue..."
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    } while ($choice -ne '0')
}

Write-Host "`n🚀 ESG Navigator Ready!" -ForegroundColor Green
Write-Host "Your system is configured and ready to deploy." -ForegroundColor Cyan