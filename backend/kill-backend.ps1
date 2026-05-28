$processes = Get-CimInstance Win32_Process -Filter "Name = 'node.exe'"
foreach ($p in $processes) {
    if ($p.CommandLine -match "backend") {
        Write-Host "Killing process: $($p.ProcessId) - $($p.CommandLine)"
        Stop-Process -Id $p.ProcessId -Force
    } elseif ($p.CommandLine -match "index.js") {
        Write-Host "Killing process: $($p.ProcessId) - $($p.CommandLine)"
        Stop-Process -Id $p.ProcessId -Force
    }
}
