# Quick Production Deployment Script
# Run this on your production server

Write-Host "🚀 ESG Navigator - Quick Deployment" -ForegroundColor Cyan

# Check prerequisites
Write-Host "`nChecking prerequisites..." -ForegroundColor Yellow

if (!(Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker not found. Please install Docker first." -ForegroundColor Red
    exit 1
}

if (!(Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Docker Compose not found. Please install Docker Compose first." -ForegroundColor Red
    exit 1
}

Write-Host "✓ Docker found" -ForegroundColor Green
Write-Host "✓ Docker Compose found" -ForegroundColor Green

# Environment setup
Write-Host "`nSetting up environment..." -ForegroundColor Yellow

if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..."
    @"
DB_PASSWORD=$(New-Guid)
ANTHROPIC_API_KEY=sk-ant-api03-REPLACE-WITH-YOUR-KEY
JWT_SECRET=$(New-Guid)
"@ | Out-File -FilePath ".env" -Encoding UTF8
    
    Write-Host "⚠️  Please edit .env file and add your API keys!" -ForegroundColor Yellow
    $continue = Read-Host "Have you updated the .env file? (yes/no)"
    if ($continue -ne "yes") {
        Write-Host "❌ Please update .env file first, then run this script again." -ForegroundColor Red
        exit 1
    }
}

# SSL Check
Write-Host "`nChecking SSL certificates..." -ForegroundColor Yellow

if (!(Test-Path "infrastructure\ssl\fullchain.pem") -or !(Test-Path "infrastructure\ssl\privkey.pem")) {
    Write-Host "⚠️  SSL certificates not found!" -ForegroundColor Yellow
    Write-Host "Please place your SSL certificates in infrastructure/ssl/" -ForegroundColor Yellow
    Write-Host "  - fullchain.pem" -ForegroundColor White
    Write-Host "  - privkey.pem" -ForegroundColor White
    
    $continue = Read-Host "Continue without SSL? (Development only!) (yes/no)"
    if ($continue -ne "yes") {
        exit 1
    }
}

# Deploy
Write-Host "`n🚀 Starting deployment..." -ForegroundColor Cyan

docker-compose down
docker-compose build
docker-compose up -d

Write-Host "`n✅ Deployment started!" -ForegroundColor Green

# Wait for services
Write-Host "`nWaiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Health check
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8080/health" -TimeoutSec 5
    Write-Host "✅ API is healthy!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  API not responding yet. Check logs with: docker-compose logs -f api" -ForegroundColor Yellow
}

Write-Host "`n╔═══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║           🎉 DEPLOYMENT COMPLETE!                    ║" -ForegroundColor Green
Write-Host "╚═══════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n🌐 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend: https://www.esgnavigator.ai" -ForegroundColor White
Write-Host "   API: https://www.esgnavigator.ai/api/health" -ForegroundColor White

Write-Host "`n📊 Monitor your deployment:" -ForegroundColor Cyan
Write-Host "   docker-compose ps" -ForegroundColor White
Write-Host "   docker-compose logs -f" -ForegroundColor White

Write-Host "`n📖 Full documentation: DEPLOYMENT.md" -ForegroundColor Yellow
