@echo off
echo Starting Pelayanan Keswan Application with PHP...
echo.

REM Check if PHP is installed
php --version >nul 2>&1
if %errorlevel% neq 0 (
    echo PHP is not installed. Please install PHP first.
    echo Download from: https://www.php.net/downloads.php
    pause
    exit /b 1
)

REM Start the PHP server
php start-php.php
