@echo off
setlocal
cd /d "%~dp0"

set PORT=8080
set URL=http://127.0.0.1:%PORT%/

echo.
echo  ============================================
echo   Yan Dong Sui Xu - local preview
echo  ============================================
echo   URL: %URL%
echo   Press Ctrl+C to stop the server.
echo.

start "" "%URL%"

where py >nul 2>nul
if %errorlevel%==0 (
  py -m http.server %PORT% --bind 127.0.0.1
  goto :end
)

where python >nul 2>nul
if %errorlevel%==0 (
  python -m http.server %PORT% --bind 127.0.0.1
  goto :end
)

echo Python was not found. Install Python or run a static server manually.
pause

:end
endlocal
