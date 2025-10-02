@echo off
REM Simple Deploy Script for Vercel
REM This script will deploy the static site to Vercel

echo 🚀 Simple Deploy to Vercel
echo ==========================

REM Check if we're in the right directory
if not exist "index.html" (
    echo [ERROR] index.html not found. Please run this script from the project root directory.
    pause
    exit /b 1
)

echo [SUCCESS] Project files found

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% equ 0 (
        echo [SUCCESS] Vercel CLI installed successfully
    ) else (
        echo [ERROR] Failed to install Vercel CLI
        pause
        exit /b 1
    )
)

REM Check if user is logged in to Vercel
vercel whoami >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Not logged in to Vercel. Please login...
    vercel login
    if %errorlevel% equ 0 (
        echo [SUCCESS] Successfully logged in to Vercel
    ) else (
        echo [ERROR] Failed to login to Vercel
        pause
        exit /b 1
    )
)

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
vercel --prod --yes
if %errorlevel% equ 0 (
    echo [SUCCESS] Successfully deployed to Vercel!
    echo.
    echo 🌐 Your application is now live!
    echo 📱 Check your Vercel dashboard for the URL
    echo 🔧 Run 'vercel ls' to see all deployments
) else (
    echo [ERROR] Failed to deploy to Vercel
    pause
    exit /b 1
)

echo.
echo ==========================
echo [SUCCESS] Deployment completed!
echo ==========================
pause
