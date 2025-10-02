#!/bin/bash

# Script untuk menjalankan aplikasi Pelayanan Keswan di Linux
# Mencoba berbagai alternatif server

echo "============================================================"
echo "🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT"
echo "============================================================"
echo ""
echo "🚀 Mencari server yang tersedia..."
echo ""

# Check if Node.js is available
if command -v node &> /dev/null; then
    echo "✅ Node.js ditemukan"
    echo "🚀 Menjalankan dengan Node.js..."
    echo ""
    node start-node.js
    exit 0
fi

# Check if Python3 is available
if command -v python3 &> /dev/null; then
    echo "✅ Python3 ditemukan"
    echo "🚀 Menjalankan dengan Python3..."
    echo ""
    python3 start-simple.py
    exit 0
fi

# Check if Python is available
if command -v python &> /dev/null; then
    echo "✅ Python ditemukan"
    echo "🚀 Menjalankan dengan Python..."
    echo ""
    python start-simple.py
    exit 0
fi

# Check if PHP is available
if command -v php &> /dev/null; then
    echo "✅ PHP ditemukan"
    echo "🚀 Menjalankan dengan PHP..."
    echo ""
    php start-php.php
    exit 0
fi

# If no server is available, open directly
echo "❌ Tidak ada server yang tersedia"
echo "💡 Alternatif:"
echo "   1. Install Node.js dari https://nodejs.org/"
echo "   2. Install Python dari https://python.org/"
echo "   3. Install PHP dari https://php.net/"
echo "   4. Buka file index.html langsung di browser"
echo ""
echo "🌐 Membuka file index.html di browser..."

# Try to open browser
if command -v xdg-open &> /dev/null; then
    xdg-open "index.html"
    echo "✅ Browser berhasil dibuka!"
elif command -v firefox &> /dev/null; then
    firefox "index.html" &
    echo "✅ Firefox berhasil dibuka!"
elif command -v chromium-browser &> /dev/null; then
    chromium-browser "index.html" &
    echo "✅ Chromium berhasil dibuka!"
elif command -v google-chrome &> /dev/null; then
    google-chrome "index.html" &
    echo "✅ Chrome berhasil dibuka!"
else
    echo "⚠️  Tidak dapat membuka browser otomatis"
    echo "   Silakan buka file index.html manual"
fi
