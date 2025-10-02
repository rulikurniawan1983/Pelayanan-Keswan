# Supabase Deployment Guide

## 🚀 Production Deployment

### 1. Environment Setup

#### Production Environment Variables
```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Configuration
NODE_ENV=production
PORT=3000
```

#### Update supabase-config.js for Production
```javascript
// Production Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### 2. Database Security

#### Row Level Security (RLS) Policies
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;

-- Create comprehensive policies
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Staff and admin policies
CREATE POLICY "Staff can view all data" ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);
```

#### API Rate Limiting
```sql
-- Set up rate limiting
CREATE OR REPLACE FUNCTION rate_limit_check()
RETURNS TRIGGER AS $$
BEGIN
    -- Implement rate limiting logic
    RETURN NEW;
END;
$$ language 'plpgsql';
```

### 3. Performance Optimization

#### Database Indexes
```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_users_nik ON users(nik);
CREATE INDEX CONCURRENTLY idx_users_email ON users(email);
CREATE INDEX CONCURRENTLY idx_animals_owner_nik ON animals(owner_nik);
CREATE INDEX CONCURRENTLY idx_services_owner_nik ON services(owner_nik);
CREATE INDEX CONCURRENTLY idx_services_status ON services(status);
CREATE INDEX CONCURRENTLY idx_medicines_status ON medicines(status);
```

#### Query Optimization
```sql
-- Optimize common queries
CREATE MATERIALIZED VIEW user_stats AS
SELECT 
    u.nik,
    u.full_name,
    COUNT(a.id) as animal_count,
    COUNT(s.id) as service_count
FROM users u
LEFT JOIN animals a ON u.nik = a.owner_nik
LEFT JOIN services s ON u.nik = s.owner_nik
GROUP BY u.nik, u.full_name;

-- Refresh materialized view
CREATE OR REPLACE FUNCTION refresh_user_stats()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW user_stats;
END;
$$ language 'plpgsql';
```

### 4. Monitoring & Logging

#### Supabase Dashboard Monitoring
1. **Database Performance**
   - Monitor slow queries
   - Check connection pool usage
   - Monitor database size

2. **API Usage**
   - Monitor API calls per minute
   - Check rate limit usage
   - Monitor error rates

3. **Authentication**
   - Monitor login attempts
   - Check failed logins
   - Monitor user registrations

#### Custom Logging
```javascript
// Add logging to Supabase operations
const logOperation = async (operation, data) => {
    try {
        const result = await operation(data);
        console.log(`✅ ${operation.name} successful:`, result);
        return result;
    } catch (error) {
        console.error(`❌ ${operation.name} failed:`, error);
        throw error;
    }
};

// Enhanced UserService with logging
const LoggedUserService = {
    async register(userData) {
        return await logOperation(UserService.register, userData);
    },
    
    async login(nik, password) {
        return await logOperation(UserService.login, { nik, password });
    }
};
```

### 5. Backup & Recovery

#### Automated Backups
```sql
-- Create backup function
CREATE OR REPLACE FUNCTION create_backup()
RETURNS void AS $$
BEGIN
    -- Backup users table
    COPY users TO '/tmp/users_backup.csv' WITH CSV HEADER;
    
    -- Backup animals table
    COPY animals TO '/tmp/animals_backup.csv' WITH CSV HEADER;
    
    -- Backup services table
    COPY services TO '/tmp/services_backup.csv' WITH CSV HEADER;
END;
$$ language 'plpgsql';
```

#### Point-in-Time Recovery
```sql
-- Enable WAL archiving
ALTER SYSTEM SET wal_level = replica;
ALTER SYSTEM SET archive_mode = on;
ALTER SYSTEM SET archive_command = 'cp %p /backup/%f';
```

### 6. Security Hardening

#### API Security
```javascript
// Add request validation
const validateRequest = (req, res, next) => {
    // Validate API key
    const apiKey = req.headers['x-api-key'];
    if (!apiKey || apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    next();
};

// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
```

#### Database Security
```sql
-- Create secure views
CREATE VIEW secure_users AS
SELECT 
    id,
    nik,
    full_name,
    email,
    phone,
    address,
    role,
    status,
    created_at
FROM users
WHERE status = 'active';

-- Grant permissions
GRANT SELECT ON secure_users TO authenticated;
GRANT SELECT ON secure_users TO anon;
```

### 7. Deployment Checklist

#### Pre-Deployment
- [ ] Test all Supabase connections
- [ ] Verify RLS policies
- [ ] Check API rate limits
- [ ] Test backup procedures
- [ ] Verify security settings

#### Post-Deployment
- [ ] Monitor error logs
- [ ] Check performance metrics
- [ ] Verify user registrations
- [ ] Test all functionality
- [ ] Monitor database usage

### 8. Troubleshooting

#### Common Issues

**Connection Timeout**
```javascript
// Add connection timeout
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    db: {
        schema: 'public'
    },
    auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
    },
    global: {
        headers: {
            'x-my-custom-header': 'my-app-name'
        }
    }
});
```

**Rate Limit Exceeded**
```javascript
// Add retry logic
const retryOperation = async (operation, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await operation();
        } catch (error) {
            if (error.message.includes('rate limit') && i < maxRetries - 1) {
                await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
                continue;
            }
            throw error;
        }
    }
};
```

**Database Lock**
```sql
-- Check for locks
SELECT 
    pid,
    usename,
    application_name,
    client_addr,
    state,
    query
FROM pg_stat_activity
WHERE state = 'active';
```

### 9. Performance Monitoring

#### Key Metrics to Monitor
- **Database Performance**
  - Query execution time
  - Connection pool usage
  - Database size growth

- **API Performance**
  - Response times
  - Error rates
  - Request volume

- **User Experience**
  - Login success rates
  - Registration completion rates
  - Service request success rates

#### Alerting Setup
```javascript
// Set up alerts for critical metrics
const alertThresholds = {
    errorRate: 0.05, // 5% error rate
    responseTime: 2000, // 2 seconds
    databaseSize: 1000000000 // 1GB
};

const checkAlerts = () => {
    // Implement alert checking logic
    if (currentErrorRate > alertThresholds.errorRate) {
        sendAlert('High error rate detected');
    }
};
```

### 10. Scaling Considerations

#### Horizontal Scaling
- Use Supabase Edge Functions for compute
- Implement caching with Redis
- Use CDN for static assets

#### Vertical Scaling
- Upgrade Supabase plan
- Optimize database queries
- Implement connection pooling

#### Cost Optimization
- Monitor API usage
- Optimize database queries
- Use appropriate Supabase plan
- Implement data archiving

## 🎯 Next Steps

1. **Set up monitoring** for production
2. **Implement caching** for better performance
3. **Add real-time features** with Supabase Realtime
4. **Set up CI/CD** for automated deployment
5. **Add analytics** for business insights
