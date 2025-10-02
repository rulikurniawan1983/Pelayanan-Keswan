#!/usr/bin/env node

/**
 * Simple Node.js server untuk menjalankan aplikasi Pelayanan Keswan
 * Alternatif jika live-server tidak tersedia
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Konfigurasi server
const PORT = 3000;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

// Function untuk mendapatkan MIME type
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'text/plain';
}

// Function untuk membuka browser
function openBrowser(url) {
    const start = process.platform === 'darwin' ? 'open' :
                  process.platform === 'win32' ? 'start' :
                  'xdg-open';
    exec(`${start} ${url}`);
}

// Function untuk menangani routing
function handleRouting(url) {
    if (url === '/' || url === '') {
        return '/index.html';
    } else if (url.startsWith('/petugas')) {
        return '/petugas.html';
    } else if (url.startsWith('/admin')) {
        return '/admin.html';
    }
    return url;
}

// Server handler
const server = http.createServer((req, res) => {
    let filePath = handleRouting(req.url);
    
    // Jika file tidak ada, coba dengan index.html
    if (!fs.existsSync('.' + filePath)) {
        filePath = '/index.html';
    }
    
    const fullPath = path.join(__dirname, filePath);
    
    // Cek apakah file ada
    if (!fs.existsSync(fullPath)) {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
                <head><title>404 - File Not Found</title></head>
                <body>
                    <h1>404 - File Not Found</h1>
                    <p>The requested file was not found.</p>
                    <a href="/">Go to Home</a>
                </body>
            </html>
        `);
        return;
    }
    
    // Baca file
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            res.writeHead(500, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <head><title>500 - Server Error</title></head>
                    <body>
                        <h1>500 - Server Error</h1>
                        <p>An error occurred while reading the file.</p>
                    </body>
                </html>
            `);
            return;
        }
        
        // Set header
        const mimeType = getMimeType(fullPath);
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        
        // Kirim file
        res.end(data);
    });
});

// Jalankan server
server.listen(PORT, HOST, () => {
    console.log('='.repeat(60));
    console.log('🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT');
    console.log('='.repeat(60));
    console.log('');
    console.log('🚀 Starting server...');
    console.log(`📍 Server running at: http://${HOST}:${PORT}`);
    console.log('');
    console.log('📱 Fitur yang tersedia:');
    console.log(`   • Halaman Utama - http://${HOST}:${PORT}`);
    console.log(`   • Panel Petugas - http://${HOST}:${PORT}/petugas.html`);
    console.log(`   • Panel Admin - http://${HOST}:${PORT}/admin.html`);
    console.log('');
    console.log('🔐 Kredensial Login:');
    console.log('   Petugas: username=petugas, password=petugas123');
    console.log('   Admin: username=admin, password=admin123');
    console.log('');
    console.log('💡 Tips:');
    console.log('   • Registrasi masyarakat dengan NIK 16 digit');
    console.log('   • Gunakan data demo yang sudah tersedia');
    console.log('   • Tekan Ctrl+C untuk menghentikan server');
    console.log('');
    console.log('='.repeat(60));
    
    // Cek apakah file index.html ada
    if (!fs.existsSync('index.html')) {
        console.log('❌ Error: File index.html tidak ditemukan!');
        console.log('   Pastikan Anda menjalankan script ini dari direktori aplikasi.');
        process.exit(1);
    }
    
    console.log('✅ Server berhasil dijalankan!');
    console.log('🌐 Membuka browser...');
    
    // Buka browser otomatis
    try {
        openBrowser(`http://${HOST}:${PORT}`);
        console.log('✅ Browser berhasil dibuka!');
    } catch (error) {
        console.log('⚠️  Tidak dapat membuka browser otomatis');
        console.log(`   Silakan buka manual: http://${HOST}:${PORT}`);
    }
    
    console.log('');
    console.log('🔄 Server sedang berjalan...');
    console.log('   Tekan Ctrl+C untuk menghentikan');
    console.log('');
});

// Handle server errors
server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Error: Port ${PORT} sudah digunakan!`);
        console.log(`   Silakan tutup aplikasi lain yang menggunakan port ${PORT}`);
        console.log(`   Atau ubah PORT di script ini`);
    } else {
        console.log(`❌ Error: ${err.message}`);
    }
    process.exit(1);
});

// Handle process termination
process.on('SIGINT', () => {
    console.log('');
    console.log('🛑 Server dihentikan oleh user');
    console.log('👋 Terima kasih telah menggunakan Pelayanan Keswan!');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('');
    console.log('🛑 Server dihentikan');
    console.log('👋 Terima kasih telah menggunakan Pelayanan Keswan!');
    process.exit(0);
});
