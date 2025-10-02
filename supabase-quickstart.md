# 🚀 Supabase Quick Start Guide

## ⚡ Setup dalam 5 Menit

### 1. Buat Project Supabase (2 menit)
1. Kunjungi [supabase.com](https://supabase.com)
2. Login/daftar akun
3. Klik "New Project"
4. Isi:
   - **Name**: pelayanan-keswan
   - **Database Password**: buat password kuat
   - **Region**: Singapore
5. Klik "Create new project"
6. Tunggu 2-3 menit hingga selesai

### 2. Dapatkan API Keys (1 menit)
1. Di dashboard, klik **Settings** → **API**
2. Copy **Project URL** dan **anon public** key
3. Update file `supabase-config.js`:
   ```javascript
   const SUPABASE_URL = 'https://your-project-ref.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

### 3. Setup Database (1 menit)
1. Klik **SQL Editor**
2. Copy semua isi file `supabase-schema.sql`
3. Paste dan klik **Run**
4. Pastikan tidak ada error

### 4. Test Koneksi (1 menit)
1. Buka `index.html` di browser
2. Buka **Developer Console** (F12)
3. Lihat log untuk status koneksi
4. Jika ada error, check API keys

## ✅ Selesai!

Aplikasi sekarang sudah terhubung dengan Supabase dan siap digunakan!

### 🔧 Default Login
- **Admin**: NIK: 1234567890123456, Password: admin123
- **Petugas**: NIK: 1234567890123457, Password: petugas123

### 📊 Monitoring
- **Supabase Dashboard**: Monitor database dan API
- **Browser Console**: Lihat logs dan status
- **Network Tab**: Monitor API calls

### 🚨 Troubleshooting
- **Error "Invalid API key"**: Check API keys di supabase-config.js
- **Error "CORS"**: Check URL di Supabase settings
- **Error "Database"**: Check SQL schema sudah dijalankan

### 📞 Butuh Bantuan?
- Lihat `README-SUPABASE.md` untuk panduan lengkap
- Lihat `supabase-deployment.md` untuk production setup
- Check console logs untuk error details

## 🎯 Next Steps
1. **Test semua fitur** dengan user default
2. **Register user baru** untuk test registrasi
3. **Monitor performance** di Supabase dashboard
4. **Setup backup** jika diperlukan

**Aplikasi siap digunakan!** 🎉
