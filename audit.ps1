$patterns = @('Skull', 'blood-text', 'shadow-blood', 'bg-card', 'border-border', 'text-foreground', 'preserve-3d', 'rotate-x-', 'noise-overlay', 'perspective-1000')
$wordPatterns = @('desgra', 'desespero', 'diabo', 'inferno', 'chifre', 'dem.nio', 'maldi', 'assombr', 'terror')
$imagePatterns = @('hero-bg', 'about.png', '/images/', 'coverUrl', 'cover_')
$emojiPatterns = @([char]0xD83D + [char]0xDC80)

Write-Host "=== 1. SKULL ICON ==="
Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern 'Skull' | ForEach-Object { Write-Host "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }

Write-Host "`n=== 2. SKULL EMOJI ==="
Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts','*.mdx','*.css' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern '\xF0\x9F\x92\x80' | ForEach-Object { Write-Host "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }

Write-Host "`n=== 3. CSS CLASSES ==="
foreach ($p in $patterns) {
    $r = Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern $p
    foreach ($m in $r) { Write-Host "$($m.Filename):$($m.LineNumber): [$p] $($m.Line.Trim())" }
}

Write-Host "`n=== 4. DARK WORDS ==="
foreach ($w in $wordPatterns) {
    $r = Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts','*.mdx' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern $w
    foreach ($m in $r) { Write-Host "$($m.Filename):$($m.LineNumber): [$w] $($m.Line.Trim())" }
}

Write-Host "`n=== 5. IMAGE REFERENCES ==="
Get-ChildItem -Path '.' -Recurse -Include '*.tsx','*.ts' | Where-Object { $_.FullName -notmatch 'node_modules|\.next' } | Select-String -Pattern 'hero-bg|about\.png|/images/|\.png|\.jpg|\.webp' | ForEach-Object { Write-Host "$($_.Filename):$($_.LineNumber): $($_.Line.Trim())" }

Write-Host "`n=== 6. PUBLIC FILES ==="
Get-ChildItem -Path './public' -Recurse -File | ForEach-Object { Write-Host $_.Name }
