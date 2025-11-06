# Test Current Opportunities
Write-Host "🧪 Testing TIS Holdings Current Opportunities" -ForegroundColor Cyan

$apiBase = "http://localhost:3000"

# Wait for API readiness
Write-Host "⏳ Waiting for API to be ready..." -ForegroundColor Yellow
for ($i = 1; $i -le 30; $i++) {
    try {
        $health = Invoke-RestMethod "$apiBase/api/health" -Method Get -ErrorAction Stop
        Write-Host "✅ API is ready" -ForegroundColor Green
        break
    }
    catch {
        Write-Host "Waiting... ($i/30)" -ForegroundColor Yellow
        Start-Sleep -Seconds 2
    }
}

# UNIVEN
Write-Host "`n📚 Testing University of Venda opportunity..." -ForegroundColor Yellow
$univenData = @{
    company = "University of Venda"
    industry = "Education"
    contact_name = "Dr. Partnership Director"
    contact_email = "partnerships@univen.ac.za"
    country = "South Africa"
    region = "Limpopo"
    employee_count = 2500
    source = "UNIVEN"
} | ConvertTo-Json

try {
    $univenResult = Invoke-RestMethod "$apiBase/api/sales/qualify" -Method Post -Body $univenData -ContentType "application/json"
    Write-Host "✅ UNIVEN qualified - Score: $($univenResult.qualification.overall_score)" -ForegroundColor Green
} catch {
    Write-Host "❌ UNIVEN test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Sibanye
Write-Host "`n⛏️ Testing Sibanye-Stillwater opportunity..." -ForegroundColor Yellow
$sibanyeData = @{
    company = "Sibanye-Stillwater"
    industry = "Mining"
    contact_name = "ESG Director"
    contact_email = "esg@sibanyestillwater.com"
    country = "South Africa"
    employee_count = 80000
    revenue_usd = 5200000000
    has_global_footprint = $true
    is_jse_listed = $true
    source = "Direct"
} | ConvertTo-Json

try {
    $sibanyeResult = Invoke-RestMethod "$apiBase/api/sales/qualify" -Method Post -Body $sibanyeData -ContentType "application/json"
    Write-Host "✅ Sibanye qualified - Score: $($sibanyeResult.qualification.overall_score)" -ForegroundColor Green
} catch {
    Write-Host "❌ Sibanye test failed: $($_.Exception.Message)" -ForegroundColor Red
}

# JSE SME
Write-Host "`n📈 Testing JSE SME opportunity..." -ForegroundColor Yellow
$smeData = @{
    company = "Kaap Agri Ltd"
    industry = "Agriculture"
    contact_name = "CEO"
    contact_email = "info@kaapagri.co.za"
    country = "South Africa"
    employee_count = 800
    revenue_usd = 200000000
    is_jse_listed = $true
    source = "Direct"
} | ConvertTo-Json

try {
    $smeResult = Invoke-RestMethod "$apiBase/api/sales/qualify" -Method Post -Body $smeData -ContentType "application/json"
    Write-Host "✅ JSE SME qualified - Score: $($smeResult.qualification.overall_score)" -ForegroundColor Green
} catch {
    Write-Host "❌ JSE SME test failed: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n🎉 Opportunity testing complete!" -ForegroundColor Green
Write-Host "🔗 Dashboard: http://localhost:3000" -ForegroundColor Cyan
