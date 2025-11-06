# Start TIS Holdings Production Platform
Write-Host "🚀 Starting TIS Holdings Production Platform..." -ForegroundColor Cyan

Write-Host "Starting Docker services..." -ForegroundColor Yellow
docker-compose up -d

Write-Host "⏳ Waiting for services to initialize..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n🔍 Checking service health..." -ForegroundColor Yellow
docker-compose ps

Write-Host "`n✅ Production platform started!" -ForegroundColor Green
Write-Host "📊 Dashboard: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔗 API Health: http://localhost:3000/api/health" -ForegroundColor Cyan
Write-Host "🗄️  Database: localhost:5432" -ForegroundColor Cyan

Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run: .\Test-Opportunities.ps1"
Write-Host "2. Open http://localhost:3000 in your browser"
