# Panduan Migrasi localStorage ke Supabase

## 🚀 Langkah-langkah Migrasi

### 1. **Persiapan**
- Pastikan koneksi internet stabil
- Buka browser dan navigasi ke aplikasi Pelayanan Keswan
- Pastikan ada data di localStorage (users, animals, services, dll)

### 2. **Perbaiki Permissions Supabase**
1. Buka **Supabase Dashboard**
2. Pergi ke **SQL Editor**
3. Copy dan paste isi file `quick-fix-permissions.sql`
4. Klik **Run**

### 3. **Jalankan Migrasi**
1. Buka file `migrate-localstorage-to-supabase.html` di browser
2. Klik tombol **"Start Migration"**
3. Tunggu proses migrasi selesai
4. Verifikasi data berhasil dimigrasi

### 4. **Verifikasi Hasil**
- Cek statistik database di halaman migrasi
- Pastikan jumlah data sesuai dengan localStorage
- Test aplikasi untuk memastikan data tersinkronisasi

## 📊 Data yang Dimigrasi

### **Users (Pengguna)**
- NIK, nama lengkap, email, telepon
- Alamat, password, role, status
- Tanggal registrasi

### **Animals (Hewan)**
- Nama hewan, jenis, umur, gender
- Deskripsi, pemilik (NIK)
- Tanggal pendaftaran

### **Services (Layanan)**
- ID hewan, nama hewan, jenis hewan
- Jenis layanan, gejala, tanggal layanan
- Prioritas, status, pemilik
- Catatan, tanggal pembuatan

### **Vet Practice Recommendations (Rekomendasi)**
- Data dokter hewan, STRV
- Alamat praktek, jenis praktek
- Kualifikasi, fasilitas
- Dokumen persyaratan

### **Medicines (Obat-obatan)**
- Nama obat, jenis, stok
- Unit, harga, deskripsi
- Status ketersediaan

## 🛡️ Fitur Keamanan

### **Backup Otomatis**
- Sistem akan membuat backup localStorage sebelum migrasi
- File backup akan didownload otomatis
- Format: `localStorage-backup-YYYY-MM-DD.json`

### **Verifikasi Migrasi**
- Sistem membandingkan jumlah data sebelum dan sesudah migrasi
- Menampilkan status verifikasi untuk setiap tabel
- Alert jika ada data yang tidak sesuai

### **Error Handling**
- Deteksi error koneksi Supabase
- Fallback ke localStorage jika Supabase tidak tersedia
- Logging detail untuk troubleshooting

## 🔧 Troubleshooting

### **Error: "must be owner of table"**
**Solusi:**
1. Jalankan `quick-fix-permissions.sql` di Supabase SQL Editor
2. Pastikan RLS (Row Level Security) sudah diperbaiki
3. Coba migrasi lagi

### **Error: "Supabase connection failed"**
**Solusi:**
1. Cek koneksi internet
2. Verifikasi API keys di `supabase-config.js`
3. Pastikan project Supabase aktif

### **Data tidak sesuai setelah migrasi**
**Solusi:**
1. Cek log di console browser
2. Verifikasi permissions di Supabase
3. Restore dari backup jika diperlukan

## 📈 Setelah Migrasi

### **Aplikasi akan otomatis:**
- Menggunakan data dari Supabase sebagai sumber utama
- Fallback ke localStorage jika Supabase tidak tersedia
- Update statistik real-time dari database
- Sinkronisasi data antar pengguna

### **Manfaat Migrasi:**
- ✅ Data tersimpan di cloud (tidak hilang)
- ✅ Dapat diakses dari berbagai device
- ✅ Backup otomatis di Supabase
- ✅ Statistik real-time
- ✅ Sinkronisasi multi-user

## 🗑️ Membersihkan localStorage (Opsional)

**⚠️ PERINGATAN: Hanya lakukan setelah memastikan migrasi berhasil!**

1. Buka halaman migrasi
2. Klik tombol **"Clear localStorage"**
3. Konfirmasi penghapusan
4. localStorage akan dikosongkan

## 📞 Bantuan

Jika mengalami masalah:
1. Cek console browser untuk error messages
2. Verifikasi koneksi Supabase
3. Pastikan permissions sudah diperbaiki
4. Coba restore dari backup jika diperlukan
