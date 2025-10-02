@echo off
REM Deploy Pelayanan Keswan to Vercel
REM Batch script for Windows

echo 🚀 Starting deployment process...
echo =====================================

REM Check if git is initialized
if not exist ".git" (
    echo [INFO] Initializing git repository...
    git init
    if %errorlevel% equ 0 (
        echo [SUCCESS] Git repository initialized
    ) else (
        echo [ERROR] Failed to initialize git repository
        exit /b 1
    )
)

REM Check if remote origin exists
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] No remote origin found
    set /p repo_url="Enter your GitHub repository URL: "
    if defined repo_url (
        git remote add origin "%repo_url%"
        echo [SUCCESS] Remote origin added: %repo_url%
    ) else (
        echo [ERROR] No repository URL provided
        exit /b 1
    )
)

REM Add all files
echo [INFO] Adding files to git...
git add .

REM Check if there are changes to commit
git diff --staged --quiet
if %errorlevel% equ 0 (
    echo [WARNING] No changes to commit
) else (
    REM Commit changes
    echo [INFO] Committing changes...
    git commit -m "Update: Ready for deployment to Vercel"
    if %errorlevel% equ 0 (
        echo [SUCCESS] Changes committed successfully
    ) else (
        echo [ERROR] Failed to commit changes
        exit /b 1
    )
)

REM Push to GitHub
echo [INFO] Pushing to GitHub...
git push origin main
if %errorlevel% equ 0 (
    echo [SUCCESS] Successfully pushed to GitHub
) else (
    echo [ERROR] Failed to push to GitHub
    exit /b 1
)

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Vercel CLI not found. Installing...
    npm install -g vercel
    if %errorlevel% equ 0 (
        echo [SUCCESS] Vercel CLI installed successfully
    ) else (
        echo [ERROR] Failed to install Vercel CLI
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
        exit /b 1
    )
)

REM Deploy to Vercel
echo [INFO] Deploying to Vercel...
vercel --prod
if %errorlevel% equ 0 (
    echo [SUCCESS] Successfully deployed to Vercel!
    echo.
    echo 🌐 Your application is now live!
    echo 📱 Access your app at the URL provided above
    echo 🔧 Check deployment status: vercel ls
    echo 📊 View logs: vercel logs
) else (
    echo [ERROR] Failed to deploy to Vercel
    exit /b 1
)

echo.
echo =====================================
echo [SUCCESS] Deployment process completed!
echo =====================================
