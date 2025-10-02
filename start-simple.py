#!/usr/bin/env python3
"""
Simple HTTP server untuk menjalankan aplikasi Pelayanan Keswan
Versi sederhana tanpa dependencies tambahan
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Konfigurasi
PORT = 3000
HOST = 'localhost'

def main():
    print("=" * 60)
    print("🐾 PELAYANAN KESWAN - APLIKASI LAYANAN MASYARAKAT")
    print("=" * 60)
    print()
    print("🚀 Starting server...")
    print(f"📍 Server running at: http://{HOST}:{PORT}")
    print()
    print("🔐 Kredensial Login:")
    print("   Petugas: username=petugas, password=petugas123")
    print("   Admin: username=admin, password=admin123")
    print()
    print("💡 Tekan Ctrl+C untuk menghentikan server")
    print("=" * 60)
    
    try:
        # Buat server
        with socketserver.TCPServer((HOST, PORT), http.server.SimpleHTTPRequestHandler) as httpd:
            print(f"✅ Server berhasil dijalankan di port {PORT}")
            print("🌐 Membuka browser...")
            
            # Buka browser otomatis
            try:
                webbrowser.open(f'http://{HOST}:{PORT}')
                print("✅ Browser berhasil dibuka!")
            except:
                print(f"⚠️  Silakan buka manual: http://{HOST}:{PORT}")
            
            print("🔄 Server sedang berjalan...")
            print("   Tekan Ctrl+C untuk menghentikan")
            print()
            
            # Jalankan server
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n🛑 Server dihentikan oleh user")
        print("👋 Terima kasih telah menggunakan Pelayanan Keswan!")
        
    except OSError as e:
        if e.errno == 48:
            print(f"❌ Error: Port {PORT} sudah digunakan!")
            print(f"   Silakan tutup aplikasi lain yang menggunakan port {PORT}")
        else:
            print(f"❌ Error: {e}")
        sys.exit(1)
        
    except Exception as e:
        print(f"❌ Error tidak terduga: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
