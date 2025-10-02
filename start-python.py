#!/usr/bin/env python3
"""
Simple HTTP server untuk menjalankan aplikasi Pelayanan Keswan
Alternatif jika Node.js tidak tersedia
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Konfigurasi server
PORT = 3000
HOST = 'localhost'

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler untuk menangani routing"""
    
    def end_headers(self):
        # Tambahkan CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def do_GET(self):
        # Handle routing untuk SPA
        if self.path == '/' or self.path == '':
            self.path = '/index.html'
        elif self.path.startswith('/petugas'):
            self.path = '/petugas.html'
        elif self.path.startswith('/admin'):
            self.path = '/admin.html'
        
        return super().do_GET()

def main():
    """Main function untuk menjalankan server"""
    print("=" * 60)
    print("🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT")
    print("=" * 60)
    print()
    print("🚀 Starting server...")
    print(f"📍 Server running at: http://{HOST}:{PORT}")
    print()
    print("📱 Fitur yang tersedia:")
    print("   • Halaman Utama - http://localhost:3000")
    print("   • Panel Petugas - http://localhost:3000/petugas.html")
    print("   • Panel Admin - http://localhost:3000/admin.html")
    print()
    print("🔐 Kredensial Login:")
    print("   Petugas: username=petugas, password=petugas123")
    print("   Admin: username=admin, password=admin123")
    print()
    print("💡 Tips:")
    print("   • Registrasi masyarakat dengan NIK 16 digit")
    print("   • Gunakan data demo yang sudah tersedia")
    print("   • Tekan Ctrl+C untuk menghentikan server")
    print()
    print("=" * 60)
    
    # Pastikan kita berada di direktori yang benar
    script_dir = Path(__file__).parent
    os.chdir(script_dir)
    
    # Cek apakah file index.html ada
    if not os.path.exists('index.html'):
        print("❌ Error: File index.html tidak ditemukan!")
        print("   Pastikan Anda menjalankan script ini dari direktori aplikasi.")
        sys.exit(1)
    
    try:
        # Buat server
        with socketserver.TCPServer((HOST, PORT), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Server berhasil dijalankan di port {PORT}")
            print("🌐 Membuka browser...")
            
            # Buka browser otomatis
            try:
                webbrowser.open(f'http://{HOST}:{PORT}')
                print("✅ Browser berhasil dibuka!")
            except Exception as e:
                print(f"⚠️  Tidak dapat membuka browser otomatis: {e}")
                print(f"   Silakan buka manual: http://{HOST}:{PORT}")
            
            print()
            print("🔄 Server sedang berjalan...")
            print("   Tekan Ctrl+C untuk menghentikan")
            print()
            
            # Jalankan server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print()
        print("🛑 Server dihentikan oleh user")
        print("👋 Terima kasih telah menggunakan Pelayanan Keswan!")
        
    except OSError as e:
        if e.errno == 48:  # Address already in use
            print(f"❌ Error: Port {PORT} sudah digunakan!")
            print(f"   Silakan tutup aplikasi lain yang menggunakan port {PORT}")
            print(f"   Atau ubah PORT di script ini")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Error tidak terduga: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
