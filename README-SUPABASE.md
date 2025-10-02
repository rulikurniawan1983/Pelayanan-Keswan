# Setup Supabase untuk Aplikasi Pelayanan Keswan

## 🚀 Langkah-langkah Setup

### 1. Buat Project Supabase
1. Kunjungi [supabase.com](https://supabase.com)
2. Login atau daftar akun
3. Klik "New Project"
4. Pilih organization dan isi:
   - **Name**: pelayanan-keswan
   - **Database Password**: buat password yang kuat (simpan dengan baik!)
   - **Region**: pilih yang terdekat (Singapore untuk Indonesia)
5. Klik "Create new project"
6. Tunggu hingga project selesai dibuat (biasanya 2-3 menit)

### 2. Dapatkan API Keys
1. Di dashboard project, klik **Settings** → **API**
2. Copy **Project URL** dan **anon public** key
3. Update file `supabase-config.js`:
   ```javascript
   const SUPABASE_URL = 'https://your-project-ref.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

### 3. Setup Database Schema
1. Di Supabase dashboard, klik **SQL Editor**
2. Copy dan paste isi file `supabase-schema.sql`
3. Klik **Run** untuk menjalankan SQL
4. Pastikan tidak ada error

### 4. Setup Authentication
1. Di dashboard, klik **Authentication** → **Settings**
2. Disable **Enable email confirmations** (untuk development)
3. Di **URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (atau URL aplikasi Anda)
   - **Redirect URLs**: `http://localhost:3000/**`

### 5. Test Koneksi
1. Buka browser console
2. Ketik: `console.log(supabaseClient)`
3. Seharusnya menampilkan object Supabase client

## 📁 File yang Dibuat

- `supabase-config.js` - Konfigurasi Supabase client
- `supabase-schema.sql` - SQL schema untuk database
- `supabase-setup.md` - Panduan setup lengkap

## 🔧 Konfigurasi yang Diperlukan

### Update supabase-config.js
```javascript
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

### Database Tables yang Dibuat
- `users` - Data pengguna (masyarakat, petugas, admin)
- `animals` - Data hewan peliharaan
- `services` - Data layanan kesehatan hewan
- `medicines` - Data obat-obatan
- `vaccinations` - Data vaksinasi
- `telemedicine_sessions` - Data sesi telemedicine

## 🔐 Security Features

### Row Level Security (RLS)
- **Users** hanya bisa melihat data mereka sendiri
- **Staff** bisa melihat semua data
- **Admin** bisa mengelola semua data

### Default Users
- **Admin**: NIK: 1234567890123456, Password: admin123
- **Petugas**: NIK: 1234567890123457, Password: petugas123

## 🚨 Troubleshooting

### Error: "Invalid API key"
- Pastikan API key sudah benar
- Pastikan project sudah aktif

### Error: "Row Level Security"
- Pastikan RLS policies sudah dibuat
- Test dengan user yang berbeda

### Error: "CORS"
- Pastikan URL sudah diatur di Supabase settings
- Pastikan domain sudah ditambahkan di allowed origins

### Error: "Database connection"
- Pastikan database password sudah benar
- Pastikan project sudah fully provisioned

## 📊 Monitoring

### Supabase Dashboard
- **Database**: Monitor query performance
- **Authentication**: Monitor user logins
- **API**: Monitor API usage
- **Logs**: Monitor error logs

### Performance Tips
- Gunakan indexes untuk query yang sering
- Monitor slow queries
- Optimize RLS policies
- Monitor API rate limits

## 🔄 Backup & Recovery

### Database Backup
1. Di Supabase dashboard, klik **Settings** → **Database**
2. Klik **Backup** untuk membuat backup manual
3. Atau gunakan **Point-in-time recovery**

### Data Export
```sql
-- Export users
SELECT * FROM users;

-- Export animals
SELECT * FROM animals;

-- Export services
SELECT * FROM services;
```

## 🚀 Production Deployment

### Environment Variables
```bash
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### Security Checklist
- [ ] Enable email confirmations
- [ ] Set up proper CORS
- [ ] Review RLS policies
- [ ] Monitor API usage
- [ ] Set up alerts

## 📞 Support

Jika mengalami masalah:
1. Cek [Supabase Documentation](https://supabase.com/docs)
2. Cek [Supabase Community](https://github.com/supabase/supabase/discussions)
3. Cek error logs di Supabase dashboard

## 🎯 Next Steps

1. **Setup monitoring** untuk production
2. **Implement caching** untuk performance
3. **Add real-time features** dengan Supabase Realtime
4. **Setup CI/CD** untuk deployment
5. **Add analytics** untuk insights
