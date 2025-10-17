[CmdletBinding()]
param(
  [Parameter(Mandatory=$true)][string]$Root,  # e.g. C:\Users\user\esg-navigator
  [int]$WebPort = 3000,
  [ValidateSet("app","pages")][string]$Keep = "app",
  [switch]$Restart
)
$ErrorActionPreference = "Stop"

function Ensure-Dir { param([string]$Path) if(!(Test-Path $Path)){ New-Item -ItemType Directory -Path $Path | Out-Null } }
function Backup-File {
  param([string]$File,[string]$WebDir)
  if(!(Test-Path $File)){ return $null }
  $stamp = Get-Date -Format "yyyyMMdd_HHmmss"
  $backupRoot = Join-Path $WebDir ("pages__backup_{0}" -f $stamp)
  $rel = (Resolve-Path $File).Path.Substring($WebDir.Length).TrimStart('\')
  $dest = Join-Path $backupRoot $rel
  Ensure-Dir (Split-Path $dest -Parent)
  Move-Item -LiteralPath $File -Destination $dest
  return $dest
}
function Free-Port([int]$Port){
  try{
    Get-NetTCPConnection -LocalPort $Port -State Listen -EA Stop |
      Select -Expand OwningProcess -Unique |
      % { try{ Stop-Process -Id $_ -Force -EA SilentlyContinue }catch{} }
  }catch{}
}
function Wait-HttpContains([string]$Url,[string]$Text,[int]$TimeoutSec=120){
  $sw=[Diagnostics.Stopwatch]::StartNew()
  while($sw.Elapsed.TotalSeconds -lt $TimeoutSec){
    try{
      $r=Invoke-WebRequest -Uri $Url -TimeoutSec 6 -UseBasicParsing
      if($r.StatusCode -ge 200 -and $r.StatusCode -lt 400 -and ($r.Content -match [Regex]::Escape($Text))){ return $true }
    }catch{}
    Start-Sleep 1
  }
  return $false
}

$WebDir = Join-Path $Root "apps\web"
if(!(Test-Path $WebDir)){ throw "Web folder not found: $WebDir" }

$conflicts = @(
  @{ app = Join-Path $WebDir "app\page.tsx";                     pages = Join-Path $WebDir "pages\index.tsx";              label = "home route" },
  @{ app = Join-Path $WebDir "app\api\proxy\[...path]\route.ts"; pages = Join-Path $WebDir "pages\api\proxy\[...path].ts"; label = "proxy api"  }
)

$changed=$false
foreach($c in $conflicts){
  $hasApp   = Test-Path $c.app
  $hasPages = Test-Path $c.pages
  if($hasApp -and $hasPages){
    if($Keep -eq "app"){
      $dst = Backup-File -File $c.pages -WebDir $WebDir
      Write-Host "Removed PAGES ($($c.label)): $($c.pages) -> $dst"
    } else {
      $dst = Backup-File -File $c.app -WebDir $WebDir
      Write-Host "Removed APP ($($c.label)): $($c.app) -> $dst"
    }
    $changed=$true
  }
}
if(-not $changed){ Write-Host "No conflicting files found." }

if($Restart){
  Free-Port $WebPort
  $ps = (Get-Command pwsh -EA SilentlyContinue).Source; if(-not $ps){ $ps=(Get-Command powershell -EA SilentlyContinue).Source }
  Start-Process -FilePath $ps -ArgumentList "-NoExit","-Command","cd `"$WebDir`"; cmd.exe /d /c `"npm run dev`""
  $url = "http://localhost:{0}/demo" -f $WebPort
  if(Wait-HttpContains $url "Suppliers"){ Start-Process $url | Out-Null; Write-Host "Web ready: $url" -ForegroundColor Green } else { Write-Warning "Open manually: $url" }
} else { Write-Host "Conflicts fixed. Restart your dev server." -ForegroundColor Cyan }
