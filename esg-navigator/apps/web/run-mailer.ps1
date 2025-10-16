# file: run-mailer.ps1
param([Parameter(ValueFromRemainingArguments=$true)][string[]]$Args)
function Write-Err([string]$m){ Write-Host "[ERROR] $m" -ForegroundColor Red }
function Write-Info([string]$m){ Write-Host "[INFO] $m" -ForegroundColor Cyan }
if ($PSVersionTable.PSEdition -eq 'Core' -and $PSVersionTable.PSVersion.Major -ge 7) { & (Join-Path $PSScriptRoot 'mailer.ps1') @Args; exit $LASTEXITCODE }
$pwsh = (Get-Command pwsh -ErrorAction SilentlyContinue | Select-Object -First 1 -ExpandProperty Source)
if(-not $pwsh){
  $common=@("$env:ProgramFiles\PowerShell\7\pwsh.exe","$env:ProgramFiles\PowerShell\7-preview\pwsh.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
  if($common){ $pwsh=$common }
}
if(-not $pwsh){ Write-Err "PowerShell 7 (pwsh) not found. Install from https://aka.ms/powershell and retry."; exit 2 }
Write-Info "Re-launching under: $pwsh"
& $pwsh -NoLogo -ExecutionPolicy Bypass -File (Join-Path $PSScriptRoot 'mailer.ps1') @Args
exit $LASTEXITCODE
