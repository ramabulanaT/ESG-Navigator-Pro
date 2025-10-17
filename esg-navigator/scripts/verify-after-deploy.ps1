param(
  [Parameter(Mandatory=$true)][string]$RailwayUrl,
  [Parameter(Mandatory=$true)][string]$VercelUrl,
  [string]$Domain = "esgnavigator.ai"
)
$RailwayUrl = $RailwayUrl.TrimEnd('/')
$VercelUrl  = $VercelUrl.TrimEnd('/')

function TryGET($u){
  try{ $r=Invoke-WebRequest -Uri $u -UseBasicParsing -TimeoutSec 12; return @{ok=$true;code=$r.StatusCode} }
  catch{ return @{ok=$false;err=$_.Exception.Message} }
}

Write-Host "`n── API health ──"
$paths = @('/health','/api/health','/v1/health','/')
$hit = $null
foreach($p in $paths){ $res=TryGET("$RailwayUrl$p"); if($res.ok){ $hit="$RailwayUrl$p"; Write-Host "API ✅ $hit ($($res.code))" -ForegroundColor Green; break } }
if (-not $hit){ Write-Host "API not responding yet; check Railway logs." -ForegroundColor Yellow }

Write-Host "`n── Frontend ──"
$web=TryGET($VercelUrl)
if($web.ok){ Write-Host "Web ✅ $VercelUrl ($($web.code))" -ForegroundColor Green } else { Write-Host "Web ⚠️ $($web.err)" -ForegroundColor Yellow }

Write-Host "`n── CORS preflight ──"
try{
  $u = "$RailwayUrl/health"
  $req = [System.Net.WebRequest]::Create($u)
  $req.Method = 'OPTIONS'
  $req.Headers.Add('Origin', $VercelUrl)
  $req.Headers.Add('Access-Control-Request-Method','GET')
  $resp = $req.GetResponse()
  $ao = $resp.Headers['Access-Control-Allow-Origin']
  if ($ao -and ($ao -eq $VercelUrl -or $ao -eq '*')) {
    Write-Host "CORS ✅ Origin allowed ($ao)" -ForegroundColor Green
  } else {
    Write-Host "CORS ⚠️ Not explicitly allowed (Allow-Origin='$ao'). Add '$VercelUrl' to ALLOWED_ORIGINS on Railway and redeploy API." -ForegroundColor Yellow
  }
} catch { Write-Host "CORS ❌ $($_.Exception.Message)" -ForegroundColor Yellow }

Write-Host "`n── DNS (optional custom domain) ──"
try{
  $a = Resolve-DnsName -Name $Domain -Type A -ErrorAction Stop | Where-Object {$_.QueryType -eq 'A'} | Select-Object -ExpandProperty IPAddress
  if ($a -contains '76.76.21.21'){ Write-Host "A $Domain → 76.76.21.21 ✅ (Vercel)" -ForegroundColor Green } else { Write-Host "A $Domain → $($a -join ', ')" -ForegroundColor Yellow }
} catch { Write-Host "A lookup failed: $($_.Exception.Message)" -ForegroundColor Yellow }
try{
  $cn = Resolve-DnsName -Name "www.$Domain" -Type CNAME -ErrorAction Stop | Where-Object {$_.QueryType -eq 'CNAME'} | Select-Object -ExpandProperty NameHost
  if ($cn -match 'cname\.vercel-dns\.com\.?$'){ Write-Host "CNAME www.$Domain → $cn ✅ (Vercel)" -ForegroundColor Green } else { Write-Host "CNAME www.$Domain → $cn" -ForegroundColor Yellow }
} catch { Write-Host "CNAME lookup failed: $($_.Exception.Message)" -ForegroundColor Yellow }

Write-Host "`nDone."
