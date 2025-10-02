# 🔧 Environment Configuration

## 📋 **Environment Variables Setup**

### 🚀 **Quick Setup:**

#### **1. Copy Environment Template**
```bash
# Copy the example file
cp env.example .env

# Edit the .env file
nano .env
```

#### **2. Required Variables (Minimum)**
```env
# Supabase Configuration (Required)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here

# Application Configuration
NODE_ENV=development
APP_NAME=Pelayanan Keswan
APP_URL=https://pelayanan-keswan.vercel.app
```

#### **3. Production Variables**
```env
# Production Environment
NODE_ENV=production
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-production-anon-key
APP_URL=https://pelayanan-keswan.vercel.app
```

---

## 🔧 **Environment Setup by Platform:**

### **1. Local Development**
```env
# Development Environment
NODE_ENV=development
DEBUG=true
PORT=3000
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

### **2. Vercel Deployment**
```bash
# Set environment variables in Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add NODE_ENV
```

### **3. GitHub Actions**
```yaml
# .github/workflows/deploy.yml
env:
  SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
  SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
  NODE_ENV: production
```

---

## 🔒 **Security Configuration:**

### **1. Supabase Keys**
```env
# Public Key (Safe to expose)
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Service Role Key (Keep secret)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **2. JWT Configuration**
```env
# JWT Secret (Generate strong secret)
JWT_SECRET=your-very-strong-jwt-secret-here

# Session Secret
SESSION_SECRET=your-session-secret-here
```

### **3. Encryption**
```env
# Encryption Key (32 characters)
ENCRYPTION_KEY=your-32-character-encryption-key
```

---

## 🌐 **CORS Configuration:**

### **1. Development CORS**
```env
CORS_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
```

### **2. Production CORS**
```env
CORS_ORIGINS=https://pelayanan-keswan.vercel.app
CORS_CREDENTIALS=true
CORS_METHODS=GET,POST,PUT,DELETE,OPTIONS
```

---

## 📧 **Email Configuration:**

### **1. SMTP Settings**
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL=noreply@pelayanan-keswan.com
```

### **2. Email Templates**
```env
EMAIL_TEMPLATE_DIR=emails/templates
EMAIL_FROM_NAME=Pelayanan Keswan
EMAIL_REPLY_TO=support@pelayanan-keswan.com
```

---

## 📱 **Notification Configuration:**

### **1. Push Notifications**
```env
PUSH_NOTIFICATION_KEY=your-push-notification-key
PUSH_NOTIFICATION_SENDER_ID=your-sender-id
```

### **2. SMS Configuration**
```env
SMS_API_KEY=your-sms-api-key
SMS_SENDER_ID=PELAYANAN
```

### **3. WhatsApp Integration**
```env
WHATSAPP_TOKEN=your-whatsapp-token
WHATSAPP_PHONE_NUMBER=+1234567890
```

---

## 💾 **Database Configuration:**

### **1. Connection Settings**
```env
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
DB_POOL_SIZE=10
DB_TIMEOUT=30000
```

### **2. Backup Configuration**
```env
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
BACKUP_STORAGE=s3
```

---

## 📊 **Analytics Configuration:**

### **1. Google Analytics**
```env
GA_TRACKING_ID=G-XXXXXXXXXX
GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### **2. Error Tracking**
```env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### **3. Performance Monitoring**
```env
MIXPANEL_TOKEN=your-mixpanel-token
HOTJAR_ID=your-hotjar-id
```

---

## 🔧 **Development Configuration:**

### **1. Debug Settings**
```env
DEBUG=true
LOG_LEVEL=debug
HOT_RELOAD=true
SOURCE_MAPS=true
```

### **2. Testing**
```env
TEST_ENV=true
TEST_DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
TEST_SEED=true
```

---

## 🚀 **Production Configuration:**

### **1. Performance**
```env
CACHE_TTL=3600
CACHE_PREFIX=pelayanan_keswan
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### **2. Security**
```env
HTTPS_ONLY=true
SECURE_COOKIES=true
CSRF_PROTECTION=true
```

---

## 📋 **Environment Checklist:**

### **✅ Development Setup:**
- [ ] Copy `env.example` to `.env`
- [ ] Set `NODE_ENV=development`
- [ ] Configure Supabase URL and key
- [ ] Set debug mode to true
- [ ] Configure local CORS

### **✅ Production Setup:**
- [ ] Set `NODE_ENV=production`
- [ ] Use production Supabase keys
- [ ] Configure production CORS
- [ ] Set up monitoring
- [ ] Configure backup

### **✅ Security Setup:**
- [ ] Generate strong JWT secret
- [ ] Set encryption key
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable HTTPS

### **✅ Monitoring Setup:**
- [ ] Configure error tracking
- [ ] Set up analytics
- [ ] Configure logging
- [ ] Set up health checks
- [ ] Configure alerts

---

## 🚨 **Security Best Practices:**

### **1. Never Commit Secrets**
```bash
# Add .env to .gitignore
echo ".env" >> .gitignore
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
```

### **2. Use Different Keys**
```env
# Development
SUPABASE_ANON_KEY=dev-key-here

# Production
SUPABASE_ANON_KEY=prod-key-here
```

### **3. Rotate Keys Regularly**
- Rotate Supabase keys monthly
- Change JWT secrets quarterly
- Update encryption keys annually

### **4. Environment Validation**
```javascript
// Validate required environment variables
const requiredEnvVars = [
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'NODE_ENV'
];

requiredEnvVars.forEach(envVar => {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
});
```

---

## 📞 **Support:**

### **Common Issues:**
1. **Missing Environment Variables**: Check all required variables are set
2. **CORS Errors**: Verify CORS origins are correct
3. **Database Connection**: Check Supabase URL and keys
4. **Build Errors**: Ensure all environment variables are available

### **Debug Commands:**
```bash
# Check environment variables
npm run env:check

# Validate configuration
npm run env:validate

# Test database connection
npm run db:test
```

**Environment configuration is ready!** 🎉

**Copy `env.example` to `.env` and configure your values!** 🔧
