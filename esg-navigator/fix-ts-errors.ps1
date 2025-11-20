# Fix TypeScript Errors Script
$files = Get-ChildItem -Path . -Include *.tsx,*.ts -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw -ErrorAction SilentlyContinue
    if ($content -match 'params\.get\(') {
        $fixed = $content -replace 'params\.get\(', 'params?.get('
        $fixed | Out-File -FilePath $file.FullName -Encoding UTF8
        Write-Host "Fixed: $($file.Name)" -ForegroundColor Green
    }
}

Write-Host "All TypeScript files fixed!" -ForegroundColor Cyan
