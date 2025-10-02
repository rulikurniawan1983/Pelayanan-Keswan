# 🚀 Cara Menjalankan Aplikasi Pelayanan Keswan

## 📋 Persyaratan Sistem

- **Browser Modern**: Chrome, Firefox, Safari, Edge (versi terbaru)
- **Node.js** (opsional, untuk live server)
- **Python 3** (opsional, untuk HTTP server)

## 🎯 Cara Menjalankan

### Metode 1: Langsung Buka File (Paling Mudah)
1. **Buka file `index.html`** langsung di browser
2. **Aplikasi siap digunakan!**

### Metode 2: Menggunakan Node.js Live Server
1. **Install Node.js** dari [nodejs.org](https://nodejs.org/)
2. **Jalankan perintah**:
   ```bash
   # Windows
   start.bat
   
   # Linux/Mac
   chmod +x start.sh
   ./start.sh
   
   # Atau manual
   npx live-server --port=3000 --open=/index.html
   ```

### Metode 3: Menggunakan Python HTTP Server
1. **Install Python 3** dari [python.org](https://python.org/)
2. **Jalankan perintah**:
   ```bash
   python start-python.py
   ```

## 🔐 Kredensial Login

### Petugas
- **Username**: `petugas`
- **Password**: `petugas123`

### Administrator
- **Username**: `admin`
- **Password**: `admin123`

## 👥 Registrasi Masyarakat

1. **Klik "Daftar Sekarang"** di halaman utama
2. **Isi form** dengan data yang valid:
   - NIK: 16 digit angka (contoh: 1234567890123456)
   - Nama lengkap
   - Email valid
   - No. telepon
   - Alamat lengkap
   - Password (minimal 6 karakter)

## 🏥 Fitur Aplikasi

### Halaman Utama
- ✅ Landing page yang menarik
- ✅ Informasi layanan
- ✅ Registrasi masyarakat
- ✅ Login petugas/admin

### Panel Petugas
- ✅ Dashboard dengan statistik
- ✅ Manajemen layanan pengobatan
- ✅ Sistem vaksinasi rabies
- ✅ Telemedicine
- ✅ Kelola stock obat

### Panel Administrator
- ✅ Dashboard dengan analisis
- ✅ Grafik dan statistik
- ✅ Laporan dan export
- ✅ Manajemen pengguna
- ✅ Monitoring stock obat

## 📊 Data Demo

Aplikasi sudah dilengkapi dengan data demo untuk testing:

### Pengguna Demo
- **Ahmad Wijaya** (NIK: 1234567890123456)
- **Siti Nurhaliza** (NIK: 2345678901234567)
- **Budi Santoso** (NIK: 3456789012345678)

### Layanan Demo
- Pengobatan hewan
- Vaksinasi rabies
- Konsultasi kesehatan
- Telemedicine

### Obat Demo
- Amoxicillin 250mg
- Vitamin B Complex
- Vaksin Rabies
- Paracetamol 500mg
- Salep Antibiotik

## 🛠️ Troubleshooting

### Browser tidak membuka otomatis
- Buka manual: `http://localhost:3000`
- Pastikan port 3000 tidak digunakan aplikasi lain

### Error "Port sudah digunakan"
- Tutup aplikasi lain yang menggunakan port 3000
- Atau ubah port di file `start-python.py`

### Data tidak tersimpan
- Pastikan browser mendukung localStorage
- Cek console browser untuk error

### Styling tidak muncul
- Pastikan file `styles.css` ada
- Cek koneksi internet untuk CDN

## 📱 Browser yang Didukung

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

## 🔧 Pengembangan

### Struktur File
```
pelayanan-keswan/
├── index.html          # Halaman utama
├── petugas.html        # Panel petugas
├── admin.html          # Panel administrator
├── styles.css          # Styling aplikasi
├── script.js           # JavaScript utama
├── petugas.js          # JavaScript petugas
├── admin.js            # JavaScript admin
├── config.js           # Konfigurasi
├── demo-data.js        # Data demo
├── package.json        # Dependencies
├── README.md           # Dokumentasi
└── start-*.py/bat/sh   # Script menjalankan
```

### Customization
- Edit `config.js` untuk mengubah pengaturan
- Edit `styles.css` untuk mengubah tampilan
- Edit `demo-data.js` untuk mengubah data demo

## 📞 Bantuan

Jika mengalami masalah:

1. **Cek Console Browser** (F12) untuk error
2. **Pastikan semua file** ada di direktori yang sama
3. **Gunakan browser terbaru**
4. **Coba metode lain** untuk menjalankan

## 🎉 Selamat Menggunakan!

Aplikasi Pelayanan Keswan siap digunakan untuk:
- 🏥 Layanan kesehatan hewan
- 💉 Vaksinasi rabies
- 📹 Telemedicine
- 💊 Manajemen stock obat
- 📊 Analisis dan laporan

**Dibuat dengan ❤️ untuk kesehatan hewan Indonesia**
