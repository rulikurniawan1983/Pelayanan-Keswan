@echo off
echo Starting Pelayanan Keswan Application...
echo.
echo Opening application in browser...
echo.
echo If the browser doesn't open automatically, please open:
echo http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

REM Check if live-server is installed
npx live-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing live-server...
    npm install -g live-server
)

REM Start the live server
npx live-server --port=3000 --open=/index.html --no-browser
