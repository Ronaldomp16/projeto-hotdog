Add-Type -AssemblyName System.Drawing

function Trim-And-Transparentize {
    param(
        [string]$InPath,
        [string]$OutPath,
        [bool]$FlipX = $false
    )

    $loaded = [System.Drawing.Bitmap]::FromFile($InPath)
    $src = New-Object System.Drawing.Bitmap($loaded)
    $loaded.Dispose()

    $w = $src.Width
    $h = $src.Height

    # lock bits for fast pixel access
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bmpData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $bytes = New-Object byte[] ($bmpData.Stride * $h)
    [System.Runtime.InteropServices.Marshal]::Copy($bmpData.Scan0, $bytes, 0, $bytes.Length)
    $src.UnlockBits($bmpData)
    $stride = $bmpData.Stride

    # output bitmap (transparent background)
    $out = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outData = $out.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $outBytes = New-Object byte[] ($outData.Stride * $h)
    $outStride = $outData.Stride

    $minX = $w; $maxX = 0; $minY = $h; $maxY = 0

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $idx = $y * $stride + $x * 4
            $b = $bytes[$idx]
            $g = $bytes[$idx + 1]
            $r = $bytes[$idx + 2]
            $a = 255

            $brightness = ($r + $g + $b) / 3.0
            if ($brightness -ge 250) {
                $a = 0
            } elseif ($brightness -ge 232) {
                $a = [int](255 * (1 - (($brightness - 232) / (250 - 232))))
            }

            if ($a -gt 128) {
                if ($x -lt $minX) { $minX = $x }
                if ($x -gt $maxX) { $maxX = $x }
                if ($y -lt $minY) { $minY = $y }
                if ($y -gt $maxY) { $maxY = $y }
            }

            $oIdx = $y * $outStride + $x * 4
            $outBytes[$oIdx] = $b
            $outBytes[$oIdx + 1] = $g
            $outBytes[$oIdx + 2] = $r
            $outBytes[$oIdx + 3] = $a
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($outBytes, 0, $outData.Scan0, $outBytes.Length)
    $out.UnlockBits($outData)

    if ($FlipX) {
        $out.RotateFlip([System.Drawing.RotateFlipType]::RotateNoneFlipX)
        $tmpMinX = $minX
        $minX = $w - 1 - $maxX
        $maxX = $w - 1 - $tmpMinX
    }

    $pad = 4
    $cropX = [Math]::Max(0, $minX - $pad)
    $cropY = [Math]::Max(0, $minY - $pad)
    $cropW = [Math]::Min($w - $cropX, $maxX - $minX + 1 + $pad * 2)
    $cropH = [Math]::Min($h - $cropY, $maxY - $minY + 1 + $pad * 2)

    $cropRect = New-Object System.Drawing.Rectangle($cropX, $cropY, $cropW, $cropH)
    $cropped = $out.Clone($cropRect, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

    $tmpOut = "$OutPath.tmp.png"
    $cropped.Save($tmpOut, [System.Drawing.Imaging.ImageFormat]::Png)
    $cropped.Dispose()
    $out.Dispose()
    $src.Dispose()

    Move-Item -Force $tmpOut $OutPath
    Write-Output "Saved $OutPath ($cropW x $cropH)"
}

function Resize-Sharp {
    param([string]$Path, [int]$TargetWidth)

    $loaded = [System.Drawing.Bitmap]::FromFile($Path)
    $src = New-Object System.Drawing.Bitmap($loaded)
    $loaded.Dispose()

    $targetH = [int]([Math]::Round($src.Height * ($TargetWidth / $src.Width)))
    $resized = New-Object System.Drawing.Bitmap($TargetWidth, $targetH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($resized)
    $g.CompositingMode = [System.Drawing.Drawing2D.CompositingMode]::SourceCopy
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.DrawImage($src, 0, 0, $TargetWidth, $targetH)
    $g.Dispose()
    $src.Dispose()

    # mild unsharp mask on RGB only (leave alpha untouched to avoid edge ringing)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $TargetWidth, $targetH)
    $bd = $resized.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadWrite, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $bd.Stride
    $len = $stride * $targetH
    $orig = New-Object byte[] $len
    [System.Runtime.InteropServices.Marshal]::Copy($bd.Scan0, $orig, 0, $len)
    $out = [byte[]]$orig.Clone()

    $amount = 0.6
    for ($y = 1; $y -lt $targetH - 1; $y++) {
        for ($x = 1; $x -lt $TargetWidth - 1; $x++) {
            $idx = $y * $stride + $x * 4
            for ($c = 0; $c -lt 3; $c++) {
                $center = $orig[$idx + $c]
                $up = $orig[$idx - $stride + $c]
                $down = $orig[$idx + $stride + $c]
                $left = $orig[$idx - 4 + $c]
                $right = $orig[$idx + 4 + $c]
                $blur = ($up + $down + $left + $right) / 4.0
                $sharp = $center + ($center - $blur) * $amount
                if ($sharp -lt 0) { $sharp = 0 }; if ($sharp -gt 255) { $sharp = 255 }
                $out[$idx + $c] = [byte]$sharp
            }
        }
    }
    [System.Runtime.InteropServices.Marshal]::Copy($out, 0, $bd.Scan0, $len)
    $resized.UnlockBits($bd)

    # bicubic resize can bleed a faint low-alpha halo along the outer 1-2px (edge-clamp
    # artifact) even where the source was fully transparent -- inset-crop it away
    $inset = 2
    $trimW = $TargetWidth - ($inset * 2)
    $trimH = $targetH - ($inset * 2)
    $insetRect = New-Object System.Drawing.Rectangle($inset, $inset, $trimW, $trimH)
    $trimmed = New-Object System.Drawing.Bitmap($trimW, $trimH, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g2 = [System.Drawing.Graphics]::FromImage($trimmed)
    $g2.DrawImage($resized, (New-Object System.Drawing.Rectangle(0, 0, $trimW, $trimH)), $insetRect, [System.Drawing.GraphicsUnit]::Pixel)
    $g2.Dispose()
    $resized.Dispose()

    $tmp = "$Path.tmp.png"
    $trimmed.Save($tmp, [System.Drawing.Imaging.ImageFormat]::Png)
    $trimmed.Dispose()
    Move-Item -Force $tmp $Path
    Write-Output "Resized+sharpened $Path to ${trimW}x$trimH"
}

$dir = "C:\Users\ronal\Projetos_local\projetos_site\projeto_dogquadradinho"

Trim-And-Transparentize -InPath "$dir\imagens\referencias\honda_carro.jpeg" -OutPath "$dir\public\intro-car.png" -FlipX $true
Trim-And-Transparentize -InPath "$dir\imagens\referencias\carrinho_hotdog.jpeg" -OutPath "$dir\public\intro-cart.png" -FlipX $false

Resize-Sharp -Path "$dir\public\intro-car.png" -TargetWidth 420
Resize-Sharp -Path "$dir\public\intro-cart.png" -TargetWidth 350
