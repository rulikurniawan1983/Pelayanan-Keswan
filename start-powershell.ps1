# PowerShell script untuk menjalankan aplikasi Pelayanan Keswan
# Alternatif untuk Windows dengan PowerShell

Write-Host "=" -NoNewline
Write-Host ("=" * 58) -NoNewline
Write-Host ""
Write-Host "🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT" -ForegroundColor Cyan
Write-Host "=" -NoNewline
Write-Host ("=" * 58) -NoNewline
Write-Host ""
Write-Host ""

Write-Host "🚀 Starting server..." -ForegroundColor Green
Write-Host "📍 Server running at: http://localhost:3000" -ForegroundColor Yellow
Write-Host ""

Write-Host "📱 Fitur yang tersedia:" -ForegroundColor Cyan
Write-Host "   • Halaman Utama - http://localhost:3000" -ForegroundColor White
Write-Host "   • Panel Petugas - http://localhost:3000/petugas.html" -ForegroundColor White
Write-Host "   • Panel Admin - http://localhost:3000/admin.html" -ForegroundColor White
Write-Host ""

Write-Host "🔐 Kredensial Login:" -ForegroundColor Cyan
Write-Host "   Petugas: username=petugas, password=petugas123" -ForegroundColor White
Write-Host "   Admin: username=admin, password=admin123" -ForegroundColor White
Write-Host ""

Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Registrasi masyarakat dengan NIK 16 digit" -ForegroundColor White
Write-Host "   • Gunakan data demo yang sudah tersedia" -ForegroundColor White
Write-Host "   • Tekan Ctrl+C untuk menghentikan server" -ForegroundColor White
Write-Host ""

Write-Host "=" -NoNewline
Write-Host ("=" * 58) -NoNewline
Write-Host ""

# Cek apakah file index.html ada
if (-not (Test-Path "index.html")) {
    Write-Host "❌ Error: File index.html tidak ditemukan!" -ForegroundColor Red
    Write-Host "   Pastikan Anda menjalankan script ini dari direktori aplikasi." -ForegroundColor Red
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}

# Cek apakah Python tersedia
try {
    $pythonVersion = python --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Python ditemukan: $pythonVersion" -ForegroundColor Green
        Write-Host "🔄 Menjalankan server dengan Python..." -ForegroundColor Yellow
        Write-Host ""
        
        # Buka browser otomatis
        Start-Process "http://localhost:3000"
        Write-Host "🌐 Browser berhasil dibuka!" -ForegroundColor Green
        Write-Host ""
        
        # Jalankan Python server
        python start-simple.py
    }
} catch {
    Write-Host "❌ Python tidak ditemukan!" -ForegroundColor Red
    Write-Host "   Silakan install Python dari: https://www.python.org/downloads/" -ForegroundColor Yellow
    Write-Host "   Atau buka file index.html langsung di browser" -ForegroundColor Yellow
    Read-Host "Tekan Enter untuk keluar"
    exit 1
}
