#!/bin/bash

# Bash script untuk menjalankan aplikasi Pelayanan Keswan
# Untuk Linux dan macOS

echo "============================================================"
echo "🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT"
echo "============================================================"
echo ""
echo "🚀 Starting server..."
echo "📍 Server running at: http://localhost:3000"
echo ""
echo "📱 Fitur yang tersedia:"
echo "   • Halaman Utama - http://localhost:3000"
echo "   • Panel Petugas - http://localhost:3000/petugas.html"
echo "   • Panel Admin - http://localhost:3000/admin.html"
echo ""
echo "🔐 Kredensial Login:"
echo "   Petugas: username=petugas, password=petugas123"
echo "   Admin: username=admin, password=admin123"
echo ""
echo "💡 Tips:"
echo "   • Registrasi masyarakat dengan NIK 16 digit"
echo "   • Gunakan data demo yang sudah tersedia"
echo "   • Tekan Ctrl+C untuk menghentikan server"
echo ""
echo "============================================================"

# Cek apakah file index.html ada
if [ ! -f "index.html" ]; then
    echo "❌ Error: File index.html tidak ditemukan!"
    echo "   Pastikan Anda menjalankan script ini dari direktori aplikasi."
    exit 1
fi

# Cek apakah Python tersedia
if command -v python3 &> /dev/null; then
    echo "✅ Python3 ditemukan"
    echo "🔄 Menjalankan server dengan Python3..."
    echo ""
    
    # Buka browser otomatis
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000" &
    elif command -v open &> /dev/null; then
        open "http://localhost:3000" &
    fi
    
    echo "🌐 Browser berhasil dibuka!"
    echo ""
    
    # Jalankan Python server
    python3 start-simple.py
    
elif command -v python &> /dev/null; then
    echo "✅ Python ditemukan"
    echo "🔄 Menjalankan server dengan Python..."
    echo ""
    
    # Buka browser otomatis
    if command -v xdg-open &> /dev/null; then
        xdg-open "http://localhost:3000" &
    elif command -v open &> /dev/null; then
        open "http://localhost:3000" &
    fi
    
    echo "🌐 Browser berhasil dibuka!"
    echo ""
    
    # Jalankan Python server
    python start-simple.py
    
else
    echo "❌ Python tidak ditemukan!"
    echo "   Silakan install Python dari: https://www.python.org/downloads/"
    echo "   Atau buka file index.html langsung di browser"
    exit 1
fi
