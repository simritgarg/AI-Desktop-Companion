# Clean up remaining dark color hex codes in page files
$pagesDir = "d:\Reminder\desktop\src\app"
$files = Get-ChildItem -Path $pagesDir -Recurse -Filter "page.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Any remaining hex codes
    $content = $content -replace "border-\[#4B2E2B\]", "border-cocoa"
    $content = $content -replace "border-\[#FFF8EE\]", "border-camel"
    $content = $content -replace "bg-\[#4B2E2B\]", "bg-linen"
    $content = $content -replace "text-\[#4B2E2B\]", "text-espresso"
    $content = $content -replace "bg-\[#FFF8EE\]", "bg-linen"
    $content = $content -replace "hover:bg-linen/80", "hover:bg-khaki/20"
    $content = $content -replace "bg-white/60", "bg-white"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "CLEANED: $($file.FullName)" -ForegroundColor Green
    }
}
Write-Host "Cleanup complete." -ForegroundColor Cyan
