# 🔧 Supabase Troubleshooting Guide

## 🚨 Common Issues & Solutions

### 1. Connection Issues

#### Error: "Supabase client not found"
```javascript
// Problem: Supabase client tidak ter-load
// Solution: Check script order di HTML

// ✅ Correct order:
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
<script src="supabase-integration.js"></script>
```

#### Error: "Invalid API key"
```javascript
// Problem: API key salah atau tidak valid
// Solution: Check supabase-config.js

// ✅ Correct format:
const SUPABASE_URL = 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';

// ❌ Wrong format:
const SUPABASE_URL = 'https://your-project-ref.supabase.co/';
const SUPABASE_ANON_KEY = 'your-anon-key';
```

#### Error: "CORS policy"
```javascript
// Problem: CORS error saat akses API
// Solution: Check Supabase settings

// 1. Go to Supabase Dashboard → Settings → API
// 2. Add your domain to allowed origins
// 3. For development: http://localhost:3000
// 4. For production: your-domain.com
```

### 2. Database Issues

#### Error: "Table doesn't exist"
```sql
-- Problem: Tabel belum dibuat
-- Solution: Jalankan SQL schema

-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy semua isi file supabase-schema.sql
-- 3. Paste dan klik Run
-- 4. Check tidak ada error
```

#### Error: "Row Level Security"
```sql
-- Problem: RLS policies belum dibuat
-- Solution: Enable RLS dan buat policies

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
```

#### Error: "Permission denied"
```sql
-- Problem: User tidak punya permission
-- Solution: Check RLS policies

-- Check current policies
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Create missing policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
```

### 3. Authentication Issues

#### Error: "User not found"
```javascript
// Problem: User tidak terdaftar di database
// Solution: Check user data

// 1. Check di Supabase Dashboard → Table Editor → users
// 2. Pastikan user ada dengan NIK yang benar
// 3. Check password sudah benar
```

#### Error: "Invalid credentials"
```javascript
// Problem: NIK atau password salah
// Solution: Check credentials

// Default credentials:
// Admin: NIK: 1234567890123456, Password: admin123
// Petugas: NIK: 1234567890123457, Password: petugas123
```

#### Error: "Account inactive"
```sql
-- Problem: User status tidak aktif
-- Solution: Update user status

UPDATE users SET status = 'active' WHERE nik = 'user-nik';
```

### 4. Migration Issues

#### Error: "Migration failed"
```javascript
// Problem: Data tidak bisa di-migrate
// Solution: Check migration status

// Check migration status
console.log(migrationStatus);

// Run migration manual
runMigration();

// Check local data
console.log(localStorage.getItem('users'));
```

#### Error: "Data already exists"
```javascript
// Problem: Data sudah ada di Supabase
// Solution: Skip atau update data

// Check if data exists
const existingData = await UserService.getUserByNIK(nik);
if (existingData.success) {
    console.log('Data already exists, skipping...');
}
```

### 5. Performance Issues

#### Error: "Slow queries"
```sql
-- Problem: Query terlalu lambat
-- Solution: Add indexes

-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_nik ON users(nik);
CREATE INDEX CONCURRENTLY idx_animals_owner_nik ON animals(owner_nik);
CREATE INDEX CONCURRENTLY idx_services_owner_nik ON services(owner_nik);
```

#### Error: "Rate limit exceeded"
```javascript
// Problem: Terlalu banyak API calls
// Solution: Implement rate limiting

// Add delay between requests
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Use in loops
for (const item of items) {
    await processItem(item);
    await delay(1000); // Wait 1 second
}
```

### 6. Production Issues

#### Error: "Environment variables"
```javascript
// Problem: Environment variables tidak ter-set
// Solution: Set environment variables

// For production
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';
```

#### Error: "SSL certificate"
```javascript
// Problem: SSL certificate error
// Solution: Check Supabase SSL settings

// Check Supabase Dashboard → Settings → Database
// Ensure SSL is enabled
```

### 7. Debugging Tools

#### Check Connection Status
```javascript
// Test Supabase connection
testSupabaseConnection();

// Check database tables
testDatabaseTables();

// Run all tests
runAllTests();
```

#### Check Data Status
```javascript
// Check local data
console.log('Users:', localStorage.getItem('users'));
console.log('Animals:', localStorage.getItem('userAnimals'));
console.log('Services:', localStorage.getItem('userServices'));

// Check Supabase data
const { data, error } = await supabaseClient
    .from('users')
    .select('*');
console.log('Supabase users:', data);
```

#### Monitor API Calls
```javascript
// Add logging to all Supabase calls
const originalFrom = supabaseClient.from;
supabaseClient.from = function(table) {
    console.log(`🔍 Querying table: ${table}`);
    return originalFrom.call(this, table);
};
```

### 8. Performance Optimization

#### Database Optimization
```sql
-- Analyze query performance
EXPLAIN ANALYZE SELECT * FROM users WHERE nik = '1234567890123456';

-- Check slow queries
SELECT query, mean_time, calls 
FROM pg_stat_statements 
ORDER BY mean_time DESC 
LIMIT 10;
```

#### Application Optimization
```javascript
// Implement caching
const cache = new Map();

const getCachedData = async (key, fetchFunction) => {
    if (cache.has(key)) {
        return cache.get(key);
    }
    
    const data = await fetchFunction();
    cache.set(key, data);
    return data;
};
```

### 9. Monitoring & Alerts

#### Setup Monitoring
```javascript
// Monitor API calls
const monitorAPI = (operation) => {
    const start = Date.now();
    return operation().then(result => {
        const duration = Date.now() - start;
        console.log(`⏱️ ${operation.name} took ${duration}ms`);
        return result;
    });
};
```

#### Error Tracking
```javascript
// Track errors
const trackError = (error, context) => {
    console.error('🚨 Error:', error);
    console.error('📍 Context:', context);
    
    // Send to monitoring service
    if (window.gtag) {
        gtag('event', 'exception', {
            description: error.message,
            fatal: false
        });
    }
};
```

### 10. Recovery Procedures

#### Database Recovery
```sql
-- Check database health
SELECT * FROM pg_stat_activity WHERE state = 'active';

-- Check table sizes
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Data Recovery
```javascript
// Backup local data
const backupData = () => {
    const data = {
        users: localStorage.getItem('users'),
        animals: localStorage.getItem('userAnimals'),
        services: localStorage.getItem('userServices'),
        medicines: localStorage.getItem('medicines')
    };
    
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    a.click();
};
```

## 📞 Support

### Documentation
- `README-SUPABASE.md` - Setup guide
- `supabase-deployment.md` - Production guide
- `supabase-quickstart.md` - Quick start

### Testing
- `supabase-test.js` - Test suite
- `supabase-migration.js` - Migration tools
- `supabase-integration.js` - Integration layer

### Community
- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Community](https://github.com/supabase/supabase/discussions)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/supabase)

## 🎯 Best Practices

1. **Always test** di development environment
2. **Monitor performance** dan error logs
3. **Backup data** secara berkala
4. **Use indexes** untuk query optimization
5. **Implement caching** untuk performance
6. **Handle errors** dengan proper error handling
7. **Monitor costs** dan usage
8. **Keep documentation** up to date
