[CmdletBinding()]
param(
  [string]$Root = "",
  [int]$WebPort = 3000
)
if (-not $Root -or $Root -eq "") { $Root = (Get-Location).Path }
$ErrorActionPreference = 'Stop'

function Ensure-Dir { param([string]$p) if(!(Test-Path $p)){ New-Item -ItemType Directory -Path $p | Out-Null } }
function Write-Utf8NoBom { param([string]$Path,[string]$Text)
  $enc = New-Object System.Text.UTF8Encoding($false)
  [IO.File]::WriteAllText($Path,$Text,$enc)
}
function Free-Port([int]$Port){
  try{
    Get-NetTCPConnection -LocalPort $Port -State Listen -EA Stop |
      Select-Object -ExpandProperty OwningProcess -Unique |
      ForEach-Object { try{ Stop-Process -Id $_ -Force -EA SilentlyContinue }catch{} }
  }catch{}
}
function PSExe(){
  $cmd = Get-Command pwsh -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  $cmd = Get-Command powershell -ErrorAction SilentlyContinue
  if ($cmd) { return $cmd.Source }
  return "$env:SystemRoot\System32\WindowsPowerShell\v1.0\powershell.exe"
}

$web = Join-Path $Root "apps\web"
if(!(Test-Path $web)){ throw "Web folder not found: $web" }

# 1) Backup & remove Pages Router duplicates
$stamp = Get-Date -Format "yyyyMMdd_HHmmss"
$bk = Join-Path $web ("pages__backup_{0}" -f $stamp)
Ensure-Dir $bk

$pagesIdx   = Join-Path $web "pages\index.tsx"
$pagesProxy = Join-Path $web "pages\api\proxy\[...path].ts"

if (Test-Path -LiteralPath $pagesProxy) {
  $dest = Join-Path $bk "pages\api\proxy\[...path].ts"
  Ensure-Dir (Split-Path $dest -Parent)
  Move-Item -LiteralPath $pagesProxy -Destination $dest
  Write-Host "Moved duplicate route: $pagesProxy -> $dest"
}
if (Test-Path $pagesIdx) {
  $dest = Join-Path $bk "pages\index.tsx"
  Ensure-Dir (Split-Path $dest -Parent)
  Move-Item -LiteralPath $pagesIdx -Destination $dest
  Write-Host "Moved home page: $pagesIdx -> $dest"
}

# 2) Patch Tailwind CSS: shadow-soft -> shadow
$css = Join-Path $web "styles\globals.css"
if (Test-Path $css) {
  $txt = Get-Content -LiteralPath $css -Raw
  $new = $txt -replace '\bshadow-soft\b','shadow'
  if ($new -ne $txt) {
    Write-Utf8NoBom -Path $css -Text $new
    Write-Host "Patched styles/globals.css (shadow-soft -> shadow)"
  }
} else {
  Write-Host "styles/globals.css not found; skipping CSS patch"
}

# 3) Clear Next.js cache
$next = Join-Path $web ".next"
if (Test-Path $next) { try{ Remove-Item -Recurse -Force -LiteralPath $next }catch{} }

# 4) Restart dev server and open /demo
Free-Port $WebPort
$ps = PSExe
Start-Process -FilePath $ps -ArgumentList "-NoExit","-Command","cd `"$web`"; cmd.exe /d /c `"npm run dev`""
Start-Sleep 8
Start-Process ("http://localhost:{0}/demo" -f $WebPort)

