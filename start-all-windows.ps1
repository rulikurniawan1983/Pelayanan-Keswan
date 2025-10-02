# PowerShell script untuk menjalankan aplikasi Pelayanan Keswan di Windows
# Mencoba berbagai alternatif server

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 Mencari server yang tersedia..." -ForegroundColor Green
Write-Host ""

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Node.js ditemukan: $nodeVersion" -ForegroundColor Green
        Write-Host "🚀 Menjalankan dengan Node.js..." -ForegroundColor Yellow
        Write-Host ""
        node start-node.js
        exit 0
    }
} catch {
    # Node.js not found, continue
}

# Check if Python is available
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python ditemukan: $pythonVersion" -ForegroundColor Green
        Write-Host "🚀 Menjalankan dengan Python..." -ForegroundColor Yellow
        Write-Host ""
        python start-simple.py
        exit 0
    }
} catch {
    # Python not found, continue
}

# Check if Python3 is available
try {
    $python3Version = python3 --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python3 ditemukan: $python3Version" -ForegroundColor Green
        Write-Host "🚀 Menjalankan dengan Python3..." -ForegroundColor Yellow
        Write-Host ""
        python3 start-simple.py
        exit 0
    }
} catch {
    # Python3 not found, continue
}

# Check if PHP is available
try {
    $phpVersion = php --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PHP ditemukan: $phpVersion" -ForegroundColor Green
        Write-Host "🚀 Menjalankan dengan PHP..." -ForegroundColor Yellow
        Write-Host ""
        php start-php.php
        exit 0
    }
} catch {
    # PHP not found, continue
}

# If no server is available, open directly
Write-Host "❌ Tidak ada server yang tersedia" -ForegroundColor Red
Write-Host "💡 Alternatif:" -ForegroundColor Yellow
Write-Host "   1. Install Node.js dari https://nodejs.org/" -ForegroundColor White
Write-Host "   2. Install Python dari https://python.org/" -ForegroundColor White
Write-Host "   3. Install PHP dari https://php.net/" -ForegroundColor White
Write-Host "   4. Buka file index.html langsung di browser" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Membuka file index.html di browser..." -ForegroundColor Green

# Try to open browser
try {
    Start-Process "index.html"
    Write-Host "✅ Browser berhasil dibuka!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Tidak dapat membuka browser otomatis" -ForegroundColor Yellow
    Write-Host "   Silakan buka file index.html manual" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "👋 Terima kasih telah menggunakan Pelayanan Keswan!" -ForegroundColor Cyan
