param(
    [switch]$Move
)

# Script to copy & sanitize image filenames from the user's "Visit to wild-life" folder
# - Copies files from `public/Visit to wild-life` to `public/visit-wildlife-renamed`
# - Generates `scripts/wildlife_image_mapping.csv` with original -> new paths
# - Prints a JSON array you can paste into the `images` JSONB in the seed SQL

$src = "public/Visit to wild-life"
$dst = "public/visit-wildlife-renamed"

if (-not (Test-Path $src)) {
    Write-Error "Source folder not found: $src"
    exit 1
}

New-Item -ItemType Directory -Path $dst -Force | Out-Null

$mapping = @()

Get-ChildItem -Path $src -File | ForEach-Object {
    $file = $_
    $orig = $file.FullName
    $name = $file.Name
    $ext = $file.Extension.ToLower()
    $base = [System.IO.Path]::GetFileNameWithoutExtension($name)

    $regex = [regex]::new('WhatsApp Image (\d{4})-(\d{2})-(\d{2}) at (\d{2})\.(\d{2})\.(\d{2})(?: \((\d+)\))?','IgnoreCase')
    $m = $regex.Match($name)
    if ($m.Success) {
        $year=$m.Groups[1].Value; $mon=$m.Groups[2].Value; $day=$m.Groups[3].Value
        $hour=$m.Groups[4].Value; $min=$m.Groups[5].Value; $sec=$m.Groups[6].Value
        $seq = $m.Groups[7].Value
        $newBase = "jos-wildlife-$($year)$($mon)$($day)-$($hour)$($min)$($sec)"
        if ($seq) { $newBase += "-$seq" }
    } else {
        # fallback: slugify filename
        $newBase = $base.ToLower() -replace '[^a-z0-9]+','-' -replace '(^-|-$)',''
        if (-not $newBase) { $newBase = [guid]::NewGuid().ToString() }
    }

    $newExt = if ($ext -in '.jpeg','.jpg') { '.jpg' } else { $ext }
    $newName = "$newBase$newExt"
    $i = 1
    while (Test-Path (Join-Path $dst $newName)) {
        $newName = "$newBase-$i$newExt"
        $i++
    }

    $dstPath = Join-Path $dst $newName
    if ($Move) { Move-Item -Path $orig -Destination $dstPath -Force }
    else { Copy-Item -Path $orig -Destination $dstPath -Force }

    $mapping += [PSCustomObject]@{ original = $orig; new = $dstPath }
}

#$mapCsv relative to repo root
$mapCsv = "scripts/wildlife_image_mapping.csv"
$mapping | Export-Csv -Path $mapCsv -NoTypeInformation -Encoding UTF8

Write-Host "Copied and renamed $($mapping.Count) files. Mapping written to $mapCsv"
Write-Host "-- Ready-to-use JSON array (paths start with '/visit-wildlife-renamed/') --"
$paths = $mapping | ForEach-Object { "/visit-wildlife-renamed/" + [System.IO.Path]::GetFileName($_.new) }
$json = $paths | ConvertTo-Json -Depth 3
Write-Host $json

Write-Host "Example SQL snippet to use in the seed (paste into images JSONB column):"
Write-Host "('" + ($paths -join '", "') + "')::jsonb" -ForegroundColor Yellow

Write-Host "Note: Files were copied (originals preserved). Rerun with -Move to move files instead of copying."
