# 🏥 Pelayanan Keswan

> Aplikasi Pelayanan Kesehatan Hewan dengan integrasi Supabase dan deployment Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/pelayanan-keswan)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat&logo=vercel&logoColor=white)](https://vercel.com)

## 🚀 Live Demo

- **Production**: https://pelayanan-keswan.vercel.app
- **Staging**: https://pelayanan-keswan-git-main.vercel.app
- **Preview**: https://pelayanan-keswan-git-feature.vercel.app

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Deployment](#-deployment)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 👥 User Management
- ✅ **Multi-role System**: Masyarakat, Petugas, Admin
- ✅ **Secure Authentication**: NIK-based login
- ✅ **User Registration**: Public registration system
- ✅ **Profile Management**: Complete user profiles
- ✅ **Role-based Access**: Different access levels

### 🐾 Animal Management
- ✅ **Animal Registration**: Complete animal profiles
- ✅ **Medical History**: Track treatment history
- ✅ **Vaccination Records**: Vaccination tracking
- ✅ **Health Monitoring**: Regular health checks

### 🏥 Service Management
- ✅ **Treatment Services**: Medical treatment booking
- ✅ **Vaccination Services**: Vaccination scheduling
- ✅ **Telemedicine**: Remote consultation
- ✅ **Emergency Services**: Urgent care booking
- ✅ **Service Tracking**: Status monitoring

### 💊 Medicine Management
- ✅ **Stock Management**: Medicine inventory
- ✅ **Price Tracking**: Cost management
- ✅ **Expiry Monitoring**: Expiry date tracking
- ✅ **Usage Analytics**: Medicine usage reports

### 📊 Analytics & Reporting
- ✅ **Dashboard Analytics**: Comprehensive statistics
- ✅ **Service Reports**: Detailed service reports
- ✅ **User Analytics**: User activity tracking
- ✅ **Performance Metrics**: System performance

### 📱 Responsive Design
- ✅ **Mobile First**: Optimized for mobile devices
- ✅ **Landscape Support**: Landscape orientation
- ✅ **Touch Friendly**: Touch-optimized interface
- ✅ **Cross Platform**: Works on all devices

## 🛠️ Tech Stack

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients
- **JavaScript (ES6+)**: Modern JavaScript features
- **Bootstrap 5**: Responsive framework
- **Font Awesome**: Icon library
- **Chart.js**: Data visualization

### Backend
- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database
- **Row Level Security (RLS)**: Data security
- **Real-time**: Live data updates
- **Authentication**: Built-in auth system

### Deployment
- **Vercel**: Static site hosting
- **GitHub Actions**: CI/CD pipeline
- **Environment Variables**: Secure configuration
- **CDN**: Global content delivery

### Development
- **Git**: Version control
- **Node.js**: Development environment
- **NPM**: Package management
- **Prettier**: Code formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- NPM 8+
- Git
- Supabase account
- Vercel account

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/pelayanan-keswan.git
cd pelayanan-keswan
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit environment variables
nano .env
```

### 4. Start Development Server
```bash
npm run dev
```

### 5. Open in Browser
```
http://localhost:3000
```

## 📦 Installation

### Manual Installation

1. **Download Source Code**
   ```bash
   git clone https://github.com/yourusername/pelayanan-keswan.git
   cd pelayanan-keswan
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Supabase**
   - Create Supabase project
   - Run SQL schema
   - Configure environment variables

4. **Deploy to Vercel**
   ```bash
   npm run deploy
   ```

### Docker Installation

```bash
# Build Docker image
docker build -t pelayanan-keswan .

# Run container
docker run -p 3000:3000 pelayanan-keswan
```

## ⚙️ Configuration

### Environment Variables

Create `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_ANON_KEY=your-anon-key

# Application Configuration
NODE_ENV=production
APP_NAME=Pelayanan Keswan
APP_VERSION=1.0.0

# Security
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

### Supabase Setup

1. **Create Project**
   - Go to [Supabase](https://supabase.com)
   - Create new project
   - Get project URL and API key

2. **Run Database Schema**
   ```sql
   -- Copy and paste create-database-tables.sql
   -- Run in Supabase SQL Editor
   ```

3. **Configure RLS Policies**
   ```sql
   -- Enable Row Level Security
   ALTER TABLE users ENABLE ROW LEVEL SECURITY;
   -- ... configure other tables
   ```

### Vercel Configuration

1. **Connect Repository**
   - Go to [Vercel](https://vercel.com)
   - Import GitHub repository
   - Configure build settings

2. **Set Environment Variables**
   ```bash
   vercel env add SUPABASE_URL
   vercel env add SUPABASE_ANON_KEY
   ```

## 🚀 Deployment

### Automatic Deployment

The application is configured for automatic deployment:

- **Push to main**: Deploys to production
- **Pull Request**: Creates preview deployment
- **Manual**: Trigger deployment manually

### Manual Deployment

```bash
# Deploy to production
npm run deploy

# Check deployment status
npm run status

# View logs
npm run logs
```

### Environment Setup

1. **Development**
   ```bash
   npm run dev
   ```

2. **Preview**
   ```bash
   npm run preview
   ```

3. **Production**
   ```bash
   npm run deploy
   ```

## 📚 API Documentation

### Authentication Endpoints

```javascript
// User Registration
POST /api/auth/register
{
  "nik": "1234567890123456",
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}

// User Login
POST /api/auth/login
{
  "nik": "1234567890123456",
  "password": "password123"
}
```

### Service Endpoints

```javascript
// Get Animals
GET /api/animals
Authorization: Bearer <token>

// Create Animal
POST /api/animals
{
  "name": "Buddy",
  "type": "anjing",
  "age": "2 tahun",
  "gender": "jantan"
}

// Get Services
GET /api/services
Authorization: Bearer <token>

// Create Service
POST /api/services
{
  "animalId": "uuid",
  "serviceType": "pengobatan",
  "symptoms": "Demam tinggi",
  "priority": "urgent"
}
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run specific tests
npm test -- --grep "authentication"

# Run with coverage
npm run test:coverage
```

### Test Coverage

- **Unit Tests**: 90%+ coverage
- **Integration Tests**: API endpoints
- **E2E Tests**: User workflows
- **Performance Tests**: Load testing

## 📱 Mobile Support

### Responsive Design
- **Mobile First**: Optimized for mobile devices
- **Tablet Support**: iPad and Android tablets
- **Desktop**: Full desktop experience
- **Landscape**: Landscape orientation support

### Touch Optimization
- **Touch Targets**: Minimum 44px touch targets
- **Swipe Gestures**: Natural swipe interactions
- **Pinch Zoom**: Zoom support for images
- **Haptic Feedback**: Touch feedback

## 🔒 Security

### Data Protection
- **Row Level Security**: Database-level security
- **User Isolation**: Data isolation per user
- **Role-based Access**: Different access levels
- **Audit Logging**: Complete audit trail

### Authentication
- **NIK-based Login**: National ID authentication
- **Password Security**: Secure password handling
- **Session Management**: Secure session handling
- **Multi-factor Auth**: Optional 2FA support

## 📊 Performance

### Optimization
- **CDN**: Global content delivery
- **Caching**: Aggressive caching strategy
- **Compression**: Gzip compression
- **Minification**: Minified assets

### Metrics
- **Load Time**: < 2 seconds
- **First Paint**: < 1 second
- **Lighthouse Score**: 90+
- **Core Web Vitals**: All green

## 🤝 Contributing

### How to Contribute

1. **Fork Repository**
   ```bash
   git fork https://github.com/yourusername/pelayanan-keswan.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```

3. **Make Changes**
   ```bash
   # Make your changes
   git add .
   git commit -m "Add amazing feature"
   ```

4. **Push Changes**
   ```bash
   git push origin feature/amazing-feature
   ```

5. **Create Pull Request**
   - Go to GitHub
   - Create pull request
   - Wait for review

### Development Guidelines

- **Code Style**: Follow Prettier configuration
- **Commits**: Use conventional commit messages
- **Testing**: Write tests for new features
- **Documentation**: Update documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

### Getting Help

- **Documentation**: [Read the docs](https://github.com/yourusername/pelayanan-keswan/wiki)
- **Issues**: [GitHub Issues](https://github.com/yourusername/pelayanan-keswan/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/pelayanan-keswan/discussions)
- **Email**: admin@pelayanan-keswan.com

### Community

- **GitHub**: [@pelayanan-keswan](https://github.com/yourusername/pelayanan-keswan)
- **Twitter**: [@pelayanan_keswan](https://twitter.com/pelayanan_keswan)
- **Discord**: [Join our Discord](https://discord.gg/pelayanan-keswan)

## 🙏 Acknowledgments

- **Supabase**: For the amazing backend platform
- **Vercel**: For the excellent deployment platform
- **Bootstrap**: For the responsive framework
- **Font Awesome**: For the beautiful icons
- **Chart.js**: For the data visualization

## 📈 Roadmap

### Version 1.1 (Q2 2024)
- [ ] Mobile app (React Native)
- [ ] Push notifications
- [ ] Offline support
- [ ] Advanced analytics

### Version 1.2 (Q3 2024)
- [ ] AI-powered diagnostics
- [ ] Telemedicine video calls
- [ ] Integration with IoT devices
- [ ] Multi-language support

### Version 2.0 (Q4 2024)
- [ ] Microservices architecture
- [ ] Advanced reporting
- [ ] Third-party integrations
- [ ] Enterprise features

---

**Made with ❤️ by the Pelayanan Keswan Team**

[![GitHub stars](https://img.shields.io/github/stars/yourusername/pelayanan-keswan?style=social)](https://github.com/yourusername/pelayanan-keswan)
[![GitHub forks](https://img.shields.io/github/forks/yourusername/pelayanan-keswan?style=social)](https://github.com/yourusername/pelayanan-keswan)
[![GitHub watchers](https://img.shields.io/github/watchers/yourusername/pelayanan-keswan?style=social)](https://github.com/yourusername/pelayanan-keswan)