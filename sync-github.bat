@echo off
REM Auto Sync with GitHub Script (Windows CMD)
REM This script will automatically sync all changes with GitHub

echo 🔄 Auto Sync with GitHub
echo =================================

REM Check if we're in a git repository
if not exist ".git" (
    echo [ERROR] Not a git repository. Please initialize git first.
    exit /b 1
)

echo [INFO] Starting GitHub sync process...

REM Check git status
echo [INFO] Checking git status...
git status --porcelain > temp_status.txt
if %errorlevel% neq 0 (
    echo [ERROR] Failed to check git status
    exit /b 1
)

REM Check if there are changes
for /f %%i in ('type temp_status.txt ^| find /c /v ""') do set line_count=%%i
if %line_count% equ 0 (
    echo [SUCCESS] No changes to commit. Repository is up to date.
    del temp_status.txt
    exit /b 0
)

del temp_status.txt

REM Add all changes
echo [INFO] Adding all changes to staging...
git add .
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add changes to staging
    exit /b 1
)
echo [SUCCESS] All changes added to staging

REM Create commit message with timestamp
for /f "tokens=1-3 delims=/ " %%a in ('date /t') do set mydate=%%c-%%a-%%b
for /f "tokens=1-2 delims=: " %%a in ('time /t') do set mytime=%%a:%%b
set commit_message=Auto sync: %mydate% %mytime% - Pelayanan Keswan updates

echo [INFO] Creating commit with message: %commit_message%
git commit -m "%commit_message%"
if %errorlevel% neq 0 (
    echo [ERROR] Failed to create commit
    exit /b 1
)
echo [SUCCESS] Commit created successfully

REM Push to GitHub
echo [INFO] Pushing changes to GitHub...
git push origin main
if %errorlevel% neq 0 (
    echo [WARNING] Failed to push to GitHub. Trying to pull first...
    
    REM Try to pull and merge
    echo [INFO] Pulling latest changes from GitHub...
    git pull origin main
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to pull from GitHub
        exit /b 1
    )
    echo [SUCCESS] Successfully pulled latest changes
    
    REM Try to push again
    echo [INFO] Pushing changes to GitHub again...
    git push origin main
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to push to GitHub after pull
        exit /b 1
    )
    echo [SUCCESS] Changes pushed to GitHub successfully!
) else (
    echo [SUCCESS] Changes pushed to GitHub successfully!
)

REM Show final status
echo [INFO] Checking final git status...
git status --short

echo.
echo =================================
echo [SUCCESS] GitHub sync completed successfully!
echo =================================

REM Show recent commits
echo.
echo 📊 Recent commits:
git log --oneline -5

echo.
echo 🌐 GitHub Repository:
echo https://github.com/rulikurniawan1983/Pelayanan-Keswan

echo.
pause
