@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
for %%I in ("%SCRIPT_DIR%..\..") do set "PROJECT_ROOT=%%~fI"

cd /d "%PROJECT_ROOT%"

if not exist "logs" mkdir "logs"

echo.>> "logs\dashboard-run.log"
echo ===== Starting dashboard %DATE% %TIME% =====>> "logs\dashboard-run.log"
echo Project root: %PROJECT_ROOT%>> "logs\dashboard-run.log"

pnpm.cmd run dev >> "logs\dashboard-run.log" 2>&1

echo ===== Dashboard stopped %DATE% %TIME% with code %ERRORLEVEL% =====>> "logs\dashboard-run.log"
exit /b %ERRORLEVEL%
