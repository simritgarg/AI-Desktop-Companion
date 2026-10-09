# Fix text-white in headings and remaining isCoffee ternaries
$pagesDir = "d:\Reminder\desktop\src\app"
$files = Get-ChildItem -Path $pagesDir -Recurse -Filter "page.tsx"

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $original = $content
    
    # Fix heading text-white → text-espresso (h2, h3, h4 with text-white)
    $content = $content -replace 'font-extrabold text-white', 'font-extrabold text-espresso'
    $content = $content -replace 'font-bold text-white', 'font-bold text-espresso'
    $content = $content -replace 'font-bold text-base text-white', 'font-bold text-base text-espresso'
    
    # Fix remaining isCoffee ternaries - simplify to just the coffee branch (which is now light)
    # Pattern: isCoffee ? 'LIGHT_CLASSES' : 'DARK_CLASSES'
    # Since we always use coffee theme, simplify:
    
    # Simple common pattern: remove the isCoffee conditional and just use coffee classes
    # These patterns: isCoffee ? 'bg-cocoa text-white' : 'bg-X text-Y ...'
    # → just 'bg-cocoa text-white' (buttons are fine with text-white on cocoa bg)
    
    # Fix modal bg-white border text-white → text-espresso
    $content = $content -replace "text-white'`n", "text-espresso'`n"
    
    # Fix: border-border text-white' → text-espresso (in dark mode branches of modals)
    $content = $content -replace "border-border text-white'", "border-border text-espresso'"
    $content = $content -replace "hover:text-white'", "hover:text-espresso'"
    
    # Fix remaining purple references
    $content = $content -replace "border-purple-500", "border-cocoa/20"
    $content = $content -replace "text-cyan-200", "text-cocoa"
    $content = $content -replace "bg-cyan-600/30", "bg-cocoa/10"
    $content = $content -replace "bg-cyan-600", "bg-cocoa"
    $content = $content -replace "hover:bg-cyan-500", "hover:bg-espresso"
    $content = $content -replace "shadow-cyan-600/30", "shadow-soft"
    $content = $content -replace "shadow-cyan-600/20", "shadow-soft"
    $content = $content -replace "text-gray-950", "text-espresso"
    $content = $content -replace "shadow-amber-500/20", "shadow-soft"
    $content = $content -replace "hover:bg-amber-400", "hover:bg-espresso"
    $content = $content -replace "shadow-rose-600/30", "shadow-soft"
    $content = $content -replace "shadow-rose-600/20", "shadow-soft"
    
    if ($content -ne $original) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "FIXED: $($file.Name)" -ForegroundColor Green
    }
}
Write-Host "Heading fixes complete." -ForegroundColor Cyan
