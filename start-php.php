<?php
/**
 * Simple PHP server untuk menjalankan aplikasi Pelayanan Keswan
 * Alternatif jika Node.js dan Python tidak tersedia
 */

// Konfigurasi server
$host = 'localhost';
$port = 3000;
$root = __DIR__;

echo "=" . str_repeat("=", 58) . "\n";
echo "🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT\n";
echo "=" . str_repeat("=", 58) . "\n\n";

echo "🚀 Starting PHP server...\n";
echo "📍 Server running at: http://{$host}:{$port}\n\n";

echo "📱 Fitur yang tersedia:\n";
echo "   • Halaman Utama - http://localhost:{$port}\n";
echo "   • Panel Petugas - http://localhost:{$port}/petugas.html\n";
echo "   • Panel Admin - http://localhost:{$port}/admin.html\n\n";

echo "🔐 Kredensial Login:\n";
echo "   Petugas: username=petugas, password=petugas123\n";
echo "   Admin: username=admin, password=admin123\n\n";

echo "💡 Tips:\n";
echo "   • Registrasi masyarakat dengan NIK 16 digit\n";
echo "   • Gunakan data demo yang sudah tersedia\n";
echo "   • Tekan Ctrl+C untuk menghentikan server\n\n";

echo "=" . str_repeat("=", 58) . "\n";

// Cek apakah file index.html ada
if (!file_exists('index.html')) {
    echo "❌ Error: File index.html tidak ditemukan!\n";
    echo "   Pastikan Anda menjalankan script ini dari direktori aplikasi.\n";
    exit(1);
}

// Jalankan PHP built-in server
$command = "php -S {$host}:{$port} -t {$root}";
echo "🔄 Server sedang berjalan...\n";
echo "   Tekan Ctrl+C untuk menghentikan\n\n";

// Buka browser otomatis (Windows)
if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
    echo "🌐 Membuka browser...\n";
    exec("start http://{$host}:{$port}");
} else {
    echo "🌐 Silakan buka browser manual: http://{$host}:{$port}\n";
}

echo "\n✅ Server berhasil dijalankan!\n";
echo "👋 Terima kasih telah menggunakan Pelayanan Keswan!\n\n";

// Jalankan server
passthru($command);
?>
