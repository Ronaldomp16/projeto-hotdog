Add-Type -AssemblyName System.Drawing

$dir = "C:\Users\ronal\Projetos_local\projetos_site\projeto_dogquadradinho"
$srcPath = "$dir\Logo\logomarca.jpeg"
$outPath = "$dir\public\logo-transparent.png"

$loaded = [System.Drawing.Bitmap]::FromFile($srcPath)
$src = New-Object System.Drawing.Bitmap($loaded)
$loaded.Dispose()

# upscale with high-quality bicubic to a comfortable texture size (well above any on-screen use)
$targetSize = 900
$upscaled = New-Object System.Drawing.Bitmap($targetSize, $targetSize, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($upscaled)
$g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.DrawImage($src, 0, 0, $targetSize, $targetSize)
$g.Dispose()
$src.Dispose()

$w = $targetSize; $h = $targetSize
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bd = $upscaled.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride = $bd.Stride
$len = $stride * $h
$bytes = New-Object byte[] $len
[System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $bytes, 0, $len)

# pass 1: chroma-key the white background to transparent + find the badge's content bbox
$minX = $w; $maxX = 0; $minY = $h; $maxY = 0
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $idx = $y * $stride + $x * 4
        $b = $bytes[$idx]; $gC = $bytes[$idx + 1]; $r = $bytes[$idx + 2]
        $brightness = ($r + $gC + $b) / 3.0
        $a = 255
        if ($brightness -ge 248) { $a = 0 }
        elseif ($brightness -ge 225) { $a = [int](255 * (1 - (($brightness - 225) / (248 - 225)))) }
        $bytes[$idx + 3] = $a
        if ($a -gt 128) {
            if ($x -lt $minX) { $minX = $x }
            if ($x -gt $maxX) { $maxX = $x }
            if ($y -lt $minY) { $minY = $y }
            if ($y -gt $maxY) { $maxY = $y }
        }
    }
}

# circle center/radius from the detected content bbox (badge is round, so bbox is square-ish)
$cx = ($minX + $maxX) / 2.0
$cy = ($minY + $maxY) / 2.0
$radius = (($maxX - $minX) + ($maxY - $minY)) / 4.0
Write-Output "Detected badge center=($cx,$cy) radius=$radius"

# pass 2: mask anything outside the circle to transparent, with a 1.5px antialiased edge falloff
$feather = 2.0
for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $dx = $x - $cx
        $dy = $y - $cy
        $dist = [Math]::Sqrt($dx * $dx + $dy * $dy)
        if ($dist -gt $radius + $feather) {
            $idx = $y * $stride + $x * 4
            $bytes[$idx + 3] = 0
        } elseif ($dist -gt $radius - $feather) {
            $idx = $y * $stride + $x * 4
            $edgeAlpha = [int](255 * (1 - (($dist - ($radius - $feather)) / ($feather * 2))))
            if ($edgeAlpha -lt 0) { $edgeAlpha = 0 }
            if ($bytes[$idx + 3] -gt $edgeAlpha) { $bytes[$idx + 3] = [byte]$edgeAlpha }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bd.Scan0, $len)
$upscaled.UnlockBits($bd)

# crop tight to the circle (plus small pad) and re-lock for the sharpen pass
$pad = 6
$cropSize = [int]($radius * 2 + $pad * 2)
$cropX = [Math]::Max(0, [int]($cx - $radius - $pad))
$cropY = [Math]::Max(0, [int]($cy - $radius - $pad))
if ($cropX + $cropSize -gt $w) { $cropSize = $w - $cropX }
if ($cropY + $cropSize -gt $h) { $cropSize = [Math]::Min($cropSize, $h - $cropY) }
$cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropSize, $cropSize)
$cropped = $upscaled.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$upscaled.Dispose()

# mild unsharp mask on RGB only (the 372x367 source is soft after 4x+ upscale)
$rect2 = New-Object System.Drawing.Rectangle(0, 0, $cropSize, $cropSize)
$bd2 = $cropped.LockBits($rect2, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$stride2 = $bd2.Stride
$len2 = $stride2 * $cropSize
$orig = New-Object byte[] $len2
[System.Runtime.InteropServices.Marshal]::Copy($bd2.Scan0, $orig, 0, $len2)
$out = [byte[]]$orig.Clone()
$amount = 0.7
for ($y = 1; $y -lt $cropSize - 1; $y++) {
    for ($x = 1; $x -lt $cropSize - 1; $x++) {
        $idx = $y * $stride2 + $x * 4
        for ($c = 0; $c -lt 3; $c++) {
            $center = $orig[$idx + $c]
            $up = $orig[$idx - $stride2 + $c]
            $down = $orig[$idx + $stride2 + $c]
            $left = $orig[$idx - 4 + $c]
            $right = $orig[$idx + 4 + $c]
            $blur = ($up + $down + $left + $right) / 4.0
            $sharp = $center + ($center - $blur) * $amount
            if ($sharp -lt 0) { $sharp = 0 }; if ($sharp -gt 255) { $sharp = 255 }
            $out[$idx + $c] = [byte]$sharp
        }
    }
}
[System.Runtime.InteropServices.Marshal]::Copy($out, 0, $bd2.Scan0, $len2)
$cropped.UnlockBits($bd2)

$tmp = "$outPath.tmp.png"
$cropped.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Move-Item -Force $tmp $outPath
Write-Output "Saved $outPath (${cropSize}x$cropSize)"
