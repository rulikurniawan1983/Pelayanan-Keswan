# Setup Supabase untuk Aplikasi Pelayanan Keswan

## 1. Buat Project Supabase

1. Kunjungi [supabase.com](https://supabase.com)
2. Login atau daftar akun
3. Klik "New Project"
4. Pilih organization dan isi:
   - **Name**: pelayanan-keswan
   - **Database Password**: buat password yang kuat
   - **Region**: pilih yang terdekat (Singapore untuk Indonesia)
5. Klik "Create new project"

## 2. Dapatkan API Keys

1. Di dashboard project, klik **Settings** → **API**
2. Copy **Project URL** dan **anon public** key
3. Update file `supabase-config.js`:
   ```javascript
   const SUPABASE_URL = 'https://your-project-ref.supabase.co';
   const SUPABASE_ANON_KEY = 'your-anon-key';
   ```

## 3. Setup Database Schema

1. Di Supabase dashboard, klik **SQL Editor**
2. Copy dan paste isi file `supabase-schema.sql`
3. Klik **Run** untuk menjalankan SQL

## 4. Setup Authentication

1. Di dashboard, klik **Authentication** → **Settings**
2. Disable **Enable email confirmations** (untuk development)
3. Di **URL Configuration**, set:
   - **Site URL**: `http://localhost:3000` (atau URL aplikasi Anda)
   - **Redirect URLs**: `http://localhost:3000/**`

## 5. Setup Row Level Security (RLS)

RLS sudah diatur di schema SQL, tapi pastikan:
1. Klik **Authentication** → **Policies**
2. Pastikan semua tabel memiliki policies yang benar
3. Test dengan user yang berbeda

## 6. Update Aplikasi

1. Tambahkan script Supabase di `index.html`:
   ```html
   <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
   <script src="supabase-config.js"></script>
   ```

2. Update semua file JavaScript untuk menggunakan Supabase services

## 7. Test Koneksi

1. Buka browser console
2. Ketik: `console.log(supabaseClient)`
3. Seharusnya menampilkan object Supabase client

## 8. Deploy ke Production

1. Update **Site URL** di Supabase settings
2. Update `SUPABASE_URL` dan `SUPABASE_ANON_KEY` di production
3. Pastikan RLS policies sesuai dengan kebutuhan production

## Troubleshooting

### Error: "Invalid API key"
- Pastikan API key sudah benar
- Pastikan project sudah aktif

### Error: "Row Level Security"
- Pastikan RLS policies sudah dibuat
- Test dengan user yang berbeda

### Error: "CORS"
- Pastikan URL sudah diatur di Supabase settings
- Pastikan domain sudah ditambahkan di allowed origins

## Security Notes

1. **Jangan expose** service role key di frontend
2. **Gunakan RLS** untuk proteksi data
3. **Validasi input** di frontend dan backend
4. **Monitor** usage dan performance di Supabase dashboard
