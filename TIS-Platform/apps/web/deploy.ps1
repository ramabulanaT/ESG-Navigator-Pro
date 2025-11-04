param([switch]$Production)

Write-Host "`n🚀 Deploying TIS-IntelliMat Platform`n" -ForegroundColor Cyan

# 1. Build check
Write-Host "→ Building Next.js..." -ForegroundColor Yellow
npm run build

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Build failed!" -ForegroundColor Red
    exit 1
}

# 2. Git commit
Write-Host "`n→ Committing changes..." -ForegroundColor Yellow
git add .
git commit -m "deploy: unified interactive platform with dashboard"

# 3. Push to trigger Vercel
Write-Host "`n→ Pushing to GitHub..." -ForegroundColor Yellow
git push origin main

Write-Host "`n✅ Deployment triggered!" -ForegroundColor Green
Write-Host "`n📊 Monitor at: https://vercel.com/dashboard`n" -ForegroundColor Cyan
