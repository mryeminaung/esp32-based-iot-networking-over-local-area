@echo off
echo ========================================
echo   Your Network IP Address
echo ========================================
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /i "IPv4" ^| findstr /v "127.0.0.1"') do (
    set "IP=%%a"
)
set "IP=%IP: =%"
echo.
echo   Dashboard URL: http://%IP%:3000
echo.
echo   Open this URL on your phone to access dashboard
echo ========================================
pause
