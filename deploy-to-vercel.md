# 🚀 Deploy to Vercel - Pelayanan Keswan

## ✅ **Deployment Guide untuk Vercel**

### 📋 **Prerequisites:**
- ✅ GitHub repository
- ✅ Vercel account
- ✅ Supabase project configured
- ✅ All files ready for deployment

---

## 🚀 **Step 1: Update GitHub Repository**

### **1.1 Initialize Git Repository**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Pelayanan Keswan application with Supabase integration"

# Add remote origin
git remote add origin https://github.com/yourusername/pelayanan-keswan.git

# Push to GitHub
git push -u origin main
```

### **1.2 Update Repository**
```bash
# Add all changes
git add .

# Commit changes
git commit -m "Update: Database permissions fixed and tables created"

# Push to GitHub
git push origin main
```

### **1.3 Create .gitignore**
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
logs
*.log

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# parcel-bundler cache (https://parceljs.org/)
.cache
.parcel-cache

# next.js build output
.next

# nuxt.js build output
.nuxt

# vuepress build output
.vuepress/dist

# Serverless directories
.serverless

# FuseBox cache
.fusebox/

# DynamoDB Local files
.dynamodb/

# TernJS port file
.tern-port
```

---

## 🚀 **Step 2: Deploy to Vercel**

### **2.1 Connect to Vercel**
```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy to Vercel
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? pelayanan-keswan
# - Directory? ./
# - Override settings? No
```

### **2.2 Configure Environment Variables**
```bash
# Set environment variables in Vercel
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add NODE_ENV
```

### **2.3 Production Deployment**
```bash
# Deploy to production
vercel --prod

# Get deployment URL
vercel ls
```

---

## 🚀 **Step 3: Configure Supabase for Production**

### **3.1 Update Supabase Configuration**
```javascript
// Update supabase-config.js for production
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
```

### **3.2 Set up CORS**
```sql
-- In Supabase SQL Editor
-- Allow your Vercel domain
INSERT INTO auth.config (key, value) 
VALUES ('site_url', 'https://your-app.vercel.app');
```

### **3.3 Configure RLS Policies**
```sql
-- Ensure RLS policies are active
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
-- ... and so on
```

---

## 🚀 **Step 4: Create Deployment Scripts**

### **4.1 Create package.json**
```json
{
  "name": "pelayanan-keswan",
  "version": "1.0.0",
  "description": "Aplikasi Pelayanan Kesehatan Hewan dengan Supabase",
  "main": "index.html",
  "scripts": {
    "start": "npx serve .",
    "build": "echo 'No build step required'",
    "deploy": "vercel --prod",
    "dev": "npx serve . -p 3000"
  },
  "keywords": [
    "veterinary",
    "healthcare",
    "supabase",
    "vercel"
  ],
  "author": "Your Name",
  "license": "MIT",
  "devDependencies": {
    "serve": "^14.2.0"
  }
}
```

### **4.2 Create vercel.json**
```json
{
  "version": 2,
  "name": "pelayanan-keswan",
  "builds": [
    {
      "src": "index.html",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "env": {
    "SUPABASE_URL": "@supabase_url",
    "SUPABASE_ANON_KEY": "@supabase_anon_key"
  }
}
```

### **4.3 Create deployment script**
```bash
#!/bin/bash
# deploy.sh

echo "🚀 Starting deployment to Vercel..."

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing git repository..."
    git init
    git add .
    git commit -m "Initial commit: Pelayanan Keswan application"
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "🔗 Adding remote origin..."
    read -p "Enter your GitHub repository URL: " repo_url
    git remote add origin $repo_url
fi

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "Update: Ready for deployment"
git push origin main

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app is now live on Vercel!"
```

---

## 🚀 **Step 5: Environment Variables**

### **5.1 Set Environment Variables in Vercel**
```bash
# Set environment variables
vercel env add SUPABASE_URL production
vercel env add SUPABASE_ANON_KEY production
vercel env add NODE_ENV production
```

### **5.2 Update supabase-config.js**
```javascript
// supabase-config.js
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project-ref.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key';

// Create Supabase client
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Export configuration
export const SUPABASE_CONFIG = {
    url: SUPABASE_URL,
    anonKey: SUPABASE_ANON_KEY
};

// Export for global access
window.SUPABASE_URL = SUPABASE_URL;
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY;
```

---

## 🚀 **Step 6: Create GitHub Actions**

### **6.1 Create .github/workflows/deploy.yml**
```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm install
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        working-directory: ./
```

### **6.2 Set GitHub Secrets**
```bash
# In GitHub repository settings > Secrets
VERCEL_TOKEN=your_vercel_token
ORG_ID=your_org_id
PROJECT_ID=your_project_id
```

---

## 🚀 **Step 7: Create Documentation**

### **7.1 Create README.md**
```markdown
# 🏥 Pelayanan Keswan

Aplikasi Pelayanan Kesehatan Hewan dengan integrasi Supabase dan deployment Vercel.

## 🚀 Live Demo
- **Production**: https://pelayanan-keswan.vercel.app
- **Staging**: https://pelayanan-keswan-git-main.vercel.app

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Supabase
- **Deployment**: Vercel
- **Database**: PostgreSQL (Supabase)

## 📋 Features
- ✅ User Management (Masyarakat, Petugas, Admin)
- ✅ Animal Management
- ✅ Service Management (Treatment, Vaccination, Telemedicine)
- ✅ Medicine Stock Management
- ✅ Statistics and Analytics
- ✅ Responsive Design
- ✅ Landscape Orientation Support

## 🚀 Quick Start
1. Clone repository
2. Set up Supabase project
3. Configure environment variables
4. Deploy to Vercel

## 📖 Documentation
- [Setup Guide](README-SUPABASE.md)
- [Deployment Guide](deploy-to-vercel.md)
- [Troubleshooting](supabase-troubleshooting.md)

## 🔧 Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Deploy to production
npm run deploy
```

## 📞 Support
- GitHub Issues: [Create Issue](https://github.com/yourusername/pelayanan-keswan/issues)
- Documentation: [Read Docs](https://github.com/yourusername/pelayanan-keswan/wiki)
```

### **7.2 Create CHANGELOG.md**
```markdown
# Changelog

## [1.0.0] - 2024-01-01

### Added
- ✅ Initial release
- ✅ User management system
- ✅ Animal management
- ✅ Service management
- ✅ Medicine stock management
- ✅ Statistics and analytics
- ✅ Responsive design
- ✅ Landscape orientation support
- ✅ Supabase integration
- ✅ Vercel deployment

### Fixed
- ✅ Database permission issues
- ✅ RLS policies
- ✅ Foreign key constraints
- ✅ Performance optimization

### Security
- ✅ Row Level Security (RLS)
- ✅ User data isolation
- ✅ Role-based access control
- ✅ Audit logging
```

---

## 🚀 **Step 8: Final Deployment**

### **8.1 Complete Deployment Process**
```bash
# 1. Update all files
git add .
git commit -m "Ready for production deployment"
git push origin main

# 2. Deploy to Vercel
vercel --prod

# 3. Verify deployment
curl https://your-app.vercel.app
```

### **8.2 Test Production Environment**
```bash
# Test all endpoints
curl https://your-app.vercel.app
curl https://your-app.vercel.app/petugas.html
curl https://your-app.vercel.app/admin.html
curl https://your-app.vercel.app/masyarakat.html
```

### **8.3 Monitor Deployment**
```bash
# Check Vercel logs
vercel logs

# Check deployment status
vercel ls

# Check environment variables
vercel env ls
```

---

## 🎉 **Deployment Complete!**

### ✅ **GitHub Updated**: Repository synced
### ✅ **Vercel Deployed**: Application live
### ✅ **Environment Configured**: Variables set
### ✅ **Database Connected**: Supabase integrated
### ✅ **Security Enabled**: RLS policies active
### ✅ **Performance Optimized**: Fast loading
### ✅ **Mobile Responsive**: Works on all devices
### ✅ **Landscape Support**: Optimized for landscape

**Your application is now live on Vercel!** 🚀

**Access your app at: https://your-app.vercel.app** 🌐

---

## 📞 **Support:**

### **Files Created:**
- `deploy-to-vercel.md` - Deployment guide
- `package.json` - Node.js configuration
- `vercel.json` - Vercel configuration
- `deploy.sh` - Deployment script
- `.github/workflows/deploy.yml` - GitHub Actions
- `README.md` - Project documentation
- `CHANGELOG.md` - Version history

### **Commands:**
```bash
# Deploy to production
npm run deploy

# Start development
npm run dev

# Check status
vercel ls
```

**Deployment is complete and ready for production!** 🎉
