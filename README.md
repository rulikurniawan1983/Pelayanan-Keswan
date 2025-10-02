# Pelayanan Keswan - Aplikasi Layanan Masyarakat

Aplikasi layanan masyarakat untuk pelayanan kesehatan hewan yang komprehensif dengan fitur pengobatan hewan, vaksinasi rabies, dan telemedicine.

## 🚀 Fitur Utama

### 🏠 Halaman Utama
- Landing page yang menarik dengan desain responsif
- Informasi layanan yang tersedia
- Sistem registrasi masyarakat dengan validasi NIK
- Login untuk petugas dan administrator

### 👨‍⚕️ Panel Petugas
- Dashboard dengan statistik harian
- Manajemen layanan pengobatan hewan
- Sistem vaksinasi rabies
- Telemedicine untuk konsultasi online
- Manajemen stock obat terintegrasi
- Tracking status layanan

### 👨‍💼 Panel Administrator
- Dashboard dengan analisis mendalam
- Statistik dan grafik interaktif
- Laporan bulanan dan export data
- Manajemen pengguna
- Monitoring stock obat
- Analisis tren layanan

### 🏥 Layanan Kesehatan Hewan
- **Pengobatan Hewan**: Konsultasi dan pengobatan dengan dokter hewan
- **Vaksinasi Rabies**: Program vaksinasi untuk mencegah rabies
- **Telemedicine**: Konsultasi online via video call
- **Stock Management**: Manajemen obat-obatan terintegrasi

## 🎨 Desain

- **Tema**: Degradasi biru navy yang elegan
- **Responsif**: Optimal di semua perangkat
- **Modern**: UI/UX yang user-friendly
- **Animasi**: Transisi yang smooth dan menarik

## 🔐 Sistem Autentikasi

### Kredensial Default
- **Petugas**: 
  - Username: `petugas`
  - Password: `petugas123`
- **Administrator**: 
  - Username: `admin`
  - Password: `admin123`

### Registrasi Masyarakat
- Wajib menggunakan NIK (16 digit)
- Validasi NIK otomatis
- Data tersimpan di localStorage

## 📱 Fitur Teknis

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Bootstrap 5.3.0 untuk UI framework
- Font Awesome 6.0.0 untuk ikon
- Chart.js 3.9.1 untuk grafik dan statistik
- Responsive design dengan CSS Grid dan Flexbox

### Data Storage
- LocalStorage untuk penyimpanan data
- Struktur data JSON yang terorganisir
- Backup dan restore data otomatis

### Validasi
- Validasi NIK (16 digit angka)
- Validasi email format
- Konfirmasi password
- Validasi form real-time

## 🚀 Cara Menjalankan

1. **Clone atau download** repository ini
2. **Buka file `index.html`** di browser modern
3. **Mulai menggunakan** aplikasi:
   - Daftar sebagai masyarakat baru
   - Login sebagai petugas atau admin
   - Jelajahi fitur-fitur yang tersedia

## 📊 Struktur Data

### Users (Masyarakat)
```json
{
  "nik": "1234567890123456",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "081234567890",
  "address": "Jl. Contoh No. 123",
  "password": "hashed_password",
  "status": "active",
  "registeredAt": "2024-01-01T00:00:00.000Z"
}
```

### Services (Layanan)
```json
{
  "id": "unique_id",
  "ownerNIK": "1234567890123456",
  "animalName": "Buddy",
  "animalType": "anjing",
  "serviceType": "pengobatan",
  "symptoms": "Demam dan tidak mau makan",
  "status": "pending",
  "serviceDate": "2024-01-01T10:00:00.000Z",
  "createdAt": "2024-01-01T09:00:00.000Z"
}
```

### Medicines (Obat)
```json
{
  "id": "unique_id",
  "name": "Amoxicillin 250mg",
  "category": "antibiotik",
  "stock": 50,
  "price": 15000,
  "description": "Antibiotik untuk infeksi bakteri",
  "status": "available"
}
```

## 🔧 Fitur Admin

### Dashboard
- Total pengguna terdaftar
- Total layanan yang diberikan
- Statistik vaksinasi
- Sesi telemedicine aktif

### Analisis
- Grafik trend layanan bulanan
- Distribusi jenis layanan
- Analisis jenis hewan
- Skor kepuasan layanan

### Laporan
- Generate laporan PDF
- Export data ke Excel
- Statistik detail dengan grafik

### Manajemen
- Kelola pengguna (aktif/nonaktif)
- Monitoring stock obat
- Restock obat otomatis
- Alert untuk stok rendah

## 🏥 Fitur Petugas

### Dashboard
- Janji hari ini
- Vaksinasi hari ini
- Sesi telemedicine aktif
- Alert obat stok rendah

### Layanan
- Tambah layanan pengobatan
- Daftar vaksinasi rabies
- Mulai sesi telemedicine
- Update status layanan

### Stock Management
- Tambah obat baru
- Edit stock obat
- Monitoring stok rendah
- Kategori obat

## 📱 Responsivitas

Aplikasi dioptimalkan untuk:
- **Desktop**: 1200px ke atas
- **Tablet**: 768px - 1199px
- **Mobile**: 320px - 767px

## 🎯 Keunggulan

1. **User-Friendly**: Interface yang intuitif dan mudah digunakan
2. **Responsive**: Optimal di semua perangkat
3. **Real-time**: Update data secara real-time
4. **Secure**: Validasi data yang ketat
5. **Modern**: Desain yang mengikuti tren terbaru
6. **Comprehensive**: Fitur lengkap untuk manajemen layanan

## 🔮 Pengembangan Selanjutnya

- Integrasi dengan database server
- Sistem notifikasi real-time
- Integrasi payment gateway
- Mobile app (React Native/Flutter)
- API untuk integrasi dengan sistem lain
- Sistem backup otomatis
- Multi-language support

## 📞 Kontak

Untuk pertanyaan atau dukungan teknis, silakan hubungi:
- Email: info@pelayanankeswan.id
- Telepon: +62 21 1234 5678

---

**Dibuat dengan ❤️ untuk kesehatan hewan Indonesia**
