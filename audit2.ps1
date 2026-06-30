Write-Host "=== IMAGE REFERENCES ==="
Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern '\.png|\.jpg|\.webp|/images/' | ForEach-Object { Write-Host "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }

Write-Host ""
Write-Host "=== PUBLIC FILES ==="
Get-ChildItem -Path './public' -Recurse -File | ForEach-Object { Write-Host $_.Name }

Write-Host ""
Write-Host "=== MDX CONTENT FILES ==="
Get-ChildItem -Path './content' -Recurse -Include '*.mdx' | ForEach-Object { Write-Host $_.Name }

Write-Host ""
Write-Host "=== GLASS CLASS ==="
Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern ' glass ' | ForEach-Object { Write-Host "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }
