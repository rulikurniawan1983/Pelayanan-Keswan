@echo off
echo ============================================================
echo 🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT
echo ============================================================
echo.
echo 🚀 Mencari server yang tersedia...
echo.

REM Check if Node.js is available
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js ditemukan
    echo 🚀 Menjalankan dengan Node.js...
    echo.
    node start-node.js
    goto :end
)

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python ditemukan
    echo 🚀 Menjalankan dengan Python...
    echo.
    python start-simple.py
    goto :end
)

REM Check if Python3 is available
python3 --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Python3 ditemukan
    echo 🚀 Menjalankan dengan Python3...
    echo.
    python3 start-simple.py
    goto :end
)

REM Check if PHP is available
php --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ PHP ditemukan
    echo 🚀 Menjalankan dengan PHP...
    echo.
    php start-php.php
    goto :end
)

REM If no server is available, open directly
echo ❌ Tidak ada server yang tersedia
echo 💡 Alternatif:
echo    1. Install Node.js dari https://nodejs.org/
echo    2. Install Python dari https://python.org/
echo    3. Install PHP dari https://php.net/
echo    4. Buka file index.html langsung di browser
echo.
echo 🌐 Membuka file index.html di browser...
start index.html

:end