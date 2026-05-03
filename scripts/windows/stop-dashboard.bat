@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..\..") do set "PROJECT_ROOT=%%~fI"

echo Stopping Node.js dashboard processes for:
echo %PROJECT_ROOT%
echo.

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "$root = $env:PROJECT_ROOT; $ids = @(); $ids += Get-CimInstance Win32_Process -Filter \"name = 'node.exe'\" | Where-Object { $_.CommandLine -and $_.CommandLine.Contains($root) } | ForEach-Object { $_.ProcessId }; $ids += Get-NetTCPConnection -LocalPort 20300,8080 -ErrorAction SilentlyContinue | Where-Object { $_.OwningProcess -gt 0 } | ForEach-Object { $_.OwningProcess }; $ids = $ids | Sort-Object -Unique; if (-not $ids) { Write-Host 'No matching dashboard Node.js processes found.'; exit 0 }; foreach ($id in $ids) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue; Write-Host ('Stopped process PID ' + $id) }"

exit /b %ERRORLEVEL%
