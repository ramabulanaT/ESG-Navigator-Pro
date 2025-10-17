param(
  [string]$RailwayUrl,
  [string]$VercelUrl,
  [string]$Domain = 'esgnavigator.ai'
)
Set-StrictMode -Version Latest
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

function Banner([string]$m){ $l='━'*70; Write-Host "`n$l`n$m`n$l" -ForegroundColor Cyan }
function TryGET($u){
  try{ $r=Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 12; @{ ok=$true; code=$r.StatusCode; headers=$r.Headers } }
  catch{ @{ ok=$false; err=$_.Exception.Message } }
}
function IsHttpsUrl([string]$u){ if([string]::IsNullOrWhiteSpace($u)){return $false}; return [bool]($u -match '^https://[^\s]+$') }
function LoadState(){
  $p = Join-Path (Get-Location) 'deploy-state.json'
  if (Test-Path $p) { try { return (Get-Content $p -Raw | ConvertFrom-Json -AsHashtable) } catch { return $null } }
  return $null
}

# Gather inputs: params → env → deploy-state.json
if (-not $RailwayUrl -and $env:RAILWAY_URL) { $RailwayUrl = $env:RAILWAY_URL }
if (-not $VercelUrl  -and $env:VERCEL_URL)  { $VercelUrl  = $env:VERCEL_URL  }
$st = LoadState
if (-not $RailwayUrl -and $st?.steps?.RailwayUrl?.url) { $RailwayUrl = $st.steps.RailwayUrl.url }
if (-not $VercelUrl  -and $st?.steps?.VercelUrl?.url)  { $VercelUrl  = $st.steps.VercelUrl.url }

if ($RailwayUrl) { $RailwayUrl = $RailwayUrl.TrimEnd('/') }
if ($VercelUrl)  { $VercelUrl  = $VercelUrl.TrimEnd('/') }

Banner 'INPUTS'
if ($RailwayUrl) { Write-Host "Railway: $RailwayUrl" } else { Write-Host "Railway: (missing) — set `$env:RAILWAY_URL=https://<app>.up.railway.app" -ForegroundColor Yellow }
if ($VercelUrl)  { Write-Host "Vercel : $VercelUrl"  } else { Write-Host "Vercel : (missing) — set `$env:VERCEL_URL=https://<proj>.vercel.app" -ForegroundColor Yellow }
Write-Host "Domain : $Domain"

# API health
Banner 'API HEALTH'
if (IsHttpsUrl $RailwayUrl) {
  $paths = @('/health','/api/health','/v1/health','/')
  $hit=$null
  foreach($p in $paths){
    $res = TryGET "$RailwayUrl$p"
    if ($res.ok) { Write-Host "✅ $RailwayUrl$p (HTTP $($res.code))" -ForegroundColor Green; $hit="$RailwayUrl$p"; break }
  }
  if (-not $hit) { Write-Host "⚠️ API not responding yet; check Railway logs and binding to 0.0.0.0:PORT" -ForegroundColor Yellow }
} else {
  Write-Host "⏭️ Skipped (no Railway URL)" -ForegroundColor DarkGray
}

# Frontend
Banner 'FRONTEND'
if (IsHttpsUrl $VercelUrl) {
  $web = TryGET $VercelUrl
  if ($web.ok) {
    $isVercel = [bool]$web.headers['x-vercel-id']
    $tag = if ($isVercel) { 'Vercel' } else { 'Unknown host' }
    Write-Host "✅ $VercelUrl (HTTP $($web.code)) [$tag]" -ForegroundColor Green
  } else {
    Write-Host "⚠️ $($web.err)" -ForegroundColor Yellow
  }
} else {
  Write-Host "⏭️ Skipped (no Vercel URL)" -ForegroundColor DarkGray
}

# CORS preflight
Banner 'CORS PREFLIGHT'
if (IsHttpsUrl $RailwayUrl -and IsHttpsUrl $VercelUrl) {
  try{
    $u = "$RailwayUrl/health"
    $req = [System.Net.WebRequest]::Create($u)
    $req.Method = 'OPTIONS'
    $req.Headers.Add('Origin', $VercelUrl)
    $req.Headers.Add('Access-Control-Request-Method', 'GET')
    $resp = $req.GetResponse()
    $ao = $resp.Headers['Access-Control-Allow-Origin']
    if ($ao -and ($ao -eq $VercelUrl -or $ao -eq '*')) {
      Write-Host "✅ Allowed origin: $ao" -ForegroundColor Green
    } else {
      Write-Host "⚠️ Not explicitly allowed (Allow-Origin='$ao'). Add $VercelUrl to ALLOWED_ORIGINS in Railway and redeploy." -ForegroundColor Yellow
    }
  } catch { Write-Host "❌ Preflight failed: $($_.Exception.Message)" -ForegroundColor Yellow }
} else {
  Write-Host "⏭️ Skipped (need both Railway + Vercel URLs)" -ForegroundColor DarkGray
}

# DNS
Banner 'DNS (Optional Custom Domain)'
try{
  $a = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop | Where-Object {$_.QueryType -eq 'A'} | Select-Object -ExpandProperty IPAddress
  if ($a -contains '76.76.21.21') { Write-Host "✅ A $Domain → 76.76.21.21" -ForegroundColor Green } else { Write-Host "ℹ️ A $Domain → $($a -join ', ')" -ForegroundColor Yellow }
} catch { Write-Host "ℹ️ A lookup failed: $($_.Exception.Message)" -ForegroundColor Yellow }
try{
  $cn = Resolve-DnsName -Name "www.$Domain" -Type CNAME -ErrorAction Stop | Where-Object {$_.QueryType -eq 'CNAME'} | Select-Object -ExpandProperty NameHost
  if ($cn -match 'cname\.vercel-dns\.com\.?$') { Write-Host "✅ CNAME www.$Domain → $cn" -ForegroundColor Green } else { Write-Host "ℹ️ CNAME www.$Domain → $cn" -ForegroundColor Yellow }
} catch { Write-Host "ℹ️ CNAME lookup failed: $($_.Exception.Message)" -ForegroundColor Yellow }

Write-Host "`nDone." -ForegroundColor Cyan
