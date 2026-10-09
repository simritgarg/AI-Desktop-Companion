# Bulk theme transformation script
# Converts all remaining page files from dark theme to light coffee theme

$pagesDir = "d:\Reminder\desktop\src\app"

# Get all page.tsx files except the ones already updated
$files = Get-ChildItem -Path $pagesDir -Recurse -Filter "page.tsx" | Where-Object {
    $_.DirectoryName -ne $pagesDir -and   # skip root page.tsx (already done)
    $_.DirectoryName -notlike "*\tasks"     # skip tasks (already done)
}

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $relPath = $file.FullName.Replace($pagesDir, "")
    
    # ── Remove isCoffee variable declarations ──
    # Keep the line but we won't need it
    
    # ── Outer wrapper: dark backgrounds → light ──
    $content = $content -replace "bg-\[#2A1816\]\s+text-\[#FFF8EE\]", "bg-linen/30"
    $content = $content -replace "bg-background\s+text-gray-100", "bg-linen/30"
    
    # ── Simplify isCoffee ternaries ── 
    # Pattern: isCoffee ? 'COFFEE_CLASSES' : 'DARK_CLASSES'
    # We want to keep only coffee classes but mapped to light
    
    # Card backgrounds
    $content = $content -replace "bg-\[#3D2522\]\s+border-\[#5A3834\]", "bg-white border-border"
    $content = $content -replace "bg-\[#3D2522\]\s*border-\[#5A3834\]", "bg-white border-border"
    $content = $content -replace "bg-\[#4B2E2B\]\s+border-\[#6F4E37\]", "bg-linen border-khaki"
    $content = $content -replace "bg-\[#4B2E2B\]/80\s+border-\[#6F4E37\]/60", "bg-linen border-khaki"
    $content = $content -replace "bg-\[#4B2E2B\]", "bg-linen"
    $content = $content -replace "bg-\[#3D2522\]", "bg-white"
    $content = $content -replace "bg-\[#2A1816\]", "bg-white"
    
    # Border colors
    $content = $content -replace "border-\[#5A3834\]", "border-border"
    $content = $content -replace "border-\[#6F4E37\]/60", "border-khaki/40"
    $content = $content -replace "border-\[#6F4E37\]", "border-khaki"
    $content = $content -replace "border-\[#D9A066\]/40", "border-camel/30"
    $content = $content -replace "border-\[#D9A066\]", "border-camel"
    
    # Accent / highlight backgrounds  
    $content = $content -replace "bg-\[#D9A066\]", "bg-cocoa"
    $content = $content -replace "bg-\[#6F4E37\]", "bg-cocoa/10"
    
    # Text colors - coffee specific
    $content = $content -replace "text-\[#FFF8EE\]", "text-espresso"
    $content = $content -replace "text-\[#D9A066\]", "text-cocoa"
    $content = $content -replace "text-\[#EADBC8\]", "text-camel"
    $content = $content -replace "text-\[#C8A27A\]", "text-camel"
    $content = $content -replace "text-\[#A8B5A0\]", "text-emerald-600"
    $content = $content -replace "text-\[#2A1816\]", "text-white"
    
    # Hover states
    $content = $content -replace "hover:bg-\[#D9A066\]", "hover:bg-cocoa"
    $content = $content -replace "hover:bg-\[#C8A27A\]", "hover:bg-espresso"
    $content = $content -replace "hover:text-\[#2A1816\]", "hover:text-white"
    $content = $content -replace "hover:text-\[#FFF8EE\]", "hover:text-espresso"
    $content = $content -replace "hover:bg-\[#4B2E2B\]", "hover:bg-linen"
    $content = $content -replace "hover:border-\[#D9A066\]", "hover:border-cocoa"
    $content = $content -replace "hover:border-\[#6F4E37\]", "hover:border-camel"
    
    # Shadow colors
    $content = $content -replace "shadow-\[#2A1816\]/\d+", "shadow-soft"
    $content = $content -replace "shadow-\[#1E100F\]/\d+", "shadow-soft"
    
    # ── Dark mode classes → light equivalents ──
    $content = $content -replace "bg-card/60\s+border-border", "bg-white border-border"
    $content = $content -replace "bg-card/60", "bg-white"
    $content = $content -replace "bg-card/30", "bg-white/80"
    
    # Gray text → warm text
    $content = $content -replace "text-gray-100", "text-espresso"
    $content = $content -replace "text-gray-200", "text-espresso"
    $content = $content -replace "text-gray-300", "text-cocoa"
    $content = $content -replace "text-gray-400", "text-camel"
    $content = $content -replace "text-gray-500", "text-khaki"
    
    # Gray backgrounds → linen/white
    $content = $content -replace "bg-gray-950", "bg-white"
    $content = $content -replace "bg-gray-900", "bg-linen"
    $content = $content -replace "bg-gray-800/60", "bg-linen/60"
    $content = $content -replace "bg-gray-800/40", "bg-linen/40"
    $content = $content -replace "bg-gray-800", "bg-linen"
    
    # Gray borders
    $content = $content -replace "border-gray-800", "border-border"
    $content = $content -replace "border-gray-700", "border-border"
    $content = $content -replace "border-gray-600", "border-khaki"
    
    # Purple → cocoa/camel  
    $content = $content -replace "bg-purple-600/30", "bg-cocoa/10"
    $content = $content -replace "bg-purple-500/20", "bg-cocoa/10"
    $content = $content -replace "bg-purple-500/10", "bg-cocoa/5"
    $content = $content -replace "bg-purple-900/40", "bg-cocoa/10"
    $content = $content -replace "bg-purple-600", "bg-cocoa"
    $content = $content -replace "bg-purple-500", "bg-cocoa"
    $content = $content -replace "text-purple-200", "text-cocoa"
    $content = $content -replace "text-purple-300", "text-cocoa"
    $content = $content -replace "text-purple-400", "text-cocoa"
    $content = $content -replace "border-purple-500/40", "border-cocoa/20"
    $content = $content -replace "border-purple-500/30", "border-cocoa/15"
    $content = $content -replace "border-purple-500/20", "border-cocoa/10"
    $content = $content -replace "hover:bg-purple-600", "hover:bg-cocoa"
    $content = $content -replace "hover:bg-purple-500", "hover:bg-cocoa"
    $content = $content -replace "shadow-purple-900/30", "shadow-soft"
    $content = $content -replace "shadow-purple-600/30", "shadow-soft"
    $content = $content -replace "shadow-purple-600/20", "shadow-soft"
    
    # Amber accents → cocoa/warm
    $content = $content -replace "text-amber-400", "text-cocoa"
    $content = $content -replace "text-amber-300", "text-cocoa"
    $content = $content -replace "bg-amber-500/20", "bg-cocoa/10"
    $content = $content -replace "bg-amber-500/10", "bg-cocoa/5"
    $content = $content -replace "border-amber-500/20", "border-cocoa/15"
    $content = $content -replace "border-amber-500/30", "border-cocoa/20"
    $content = $content -replace "bg-amber-500", "bg-cocoa"
    $content = $content -replace "text-amber-500", "text-cocoa"
    
    # Cyan → blue (lighter)
    $content = $content -replace "text-cyan-400", "text-blue-600"
    $content = $content -replace "text-cyan-300", "text-blue-600"
    $content = $content -replace "bg-cyan-500/20", "bg-blue-50"
    $content = $content -replace "bg-cyan-500/30", "bg-blue-100"
    $content = $content -replace "border-cyan-500/30", "border-blue-200"
    $content = $content -replace "hover:bg-cyan-500/30", "hover:bg-blue-100"
    
    # Rose adjustments for light
    $content = $content -replace "bg-rose-500/20", "bg-rose-50"
    $content = $content -replace "text-rose-300", "text-rose-600"
    $content = $content -replace "text-rose-400", "text-rose-600"
    $content = $content -replace "border-rose-500/30", "border-rose-200"
    
    # Emerald adjustments for light
    $content = $content -replace "bg-emerald-500/20", "bg-emerald-50"
    $content = $content -replace "bg-emerald-500/10", "bg-emerald-50"
    $content = $content -replace "text-emerald-300", "text-emerald-600"
    $content = $content -replace "text-emerald-400", "text-emerald-600"
    $content = $content -replace "border-emerald-500/20", "border-emerald-200"
    $content = $content -replace "border-emerald-500/30", "border-emerald-200"
    $content = $content -replace "fill-emerald-400/20", "fill-emerald-100"
    
    # Indigo → cocoa
    $content = $content -replace "bg-indigo-900/40", "bg-cocoa/5"
    
    # Generic text-white for headings → espresso
    # Be careful: only do this for heading-like contexts
    $content = $content -replace "text-white`"", "text-espresso`""
    
    # bg-black/70 modals → lighter overlay
    $content = $content -replace "bg-black/70", "bg-espresso/40"
    $content = $content -replace "bg-black/60", "bg-espresso/30"
    $content = $content -replace "bg-black/50", "bg-espresso/20"
    
    # Clean up any remaining isCoffee conditional blocks
    # Replace entire ternary: isCoffee ? 'A' : 'B' → just the result (already mapped)
    # Most should be handled by the color replacements above
    
    # Fix the outer wrapper to use consistent class
    $content = $content -replace "className=\{``flex min-h-screen transition-colors duration-300 \$\{[^}]+\}``\}", 'className="flex min-h-screen bg-linen/30"'
    
    Set-Content -Path $file.FullName -Value $content -NoNewline
    Write-Host "UPDATED: $relPath" -ForegroundColor Green
}

Write-Host "`nDone! Updated $($files.Count) page files." -ForegroundColor Cyan
