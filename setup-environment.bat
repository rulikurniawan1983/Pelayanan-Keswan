@echo off
REM Environment Setup Script for Windows
REM This script helps setup environment variables

echo 🔧 Environment Setup for Pelayanan Keswan
echo ==========================================

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js first.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js is installed

REM Check if .env file exists
if exist ".env" (
    echo ⚠️ .env file already exists
    set /p overwrite="Do you want to overwrite it? (y/N): "
    if /i not "%overwrite%"=="y" (
        echo Setup cancelled.
        pause
        exit /b 0
    )
)

REM Run environment setup
echo 🚀 Starting environment setup...
node setup-env.js setup

if %errorlevel% equ 0 (
    echo ✅ Environment setup completed successfully!
    echo.
    echo 📋 Next steps:
    echo 1. Review your .env file
    echo 2. Update any values if needed
    echo 3. Run 'npm run dev' to start development
    echo.
) else (
    echo ❌ Environment setup failed
    echo Please check the error messages above
)

pause
