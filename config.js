// Configuration file for Pelayanan Keswan Application

const CONFIG = {
    // Application Information
    APP_NAME: 'Pelayanan Keswan',
    APP_VERSION: '1.0.0',
    APP_DESCRIPTION: 'Aplikasi Layanan Masyarakat untuk Pelayanan Kesehatan Hewan',
    
    // API Configuration (for future backend integration)
    API: {
        BASE_URL: 'https://api.pelayanankeswan.id',
        TIMEOUT: 30000,
        RETRY_ATTEMPTS: 3
    },
    
    // Authentication Configuration
    AUTH: {
        SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24 hours in milliseconds
        PASSWORD_MIN_LENGTH: 6,
        NIK_LENGTH: 16,
        TOKEN_STORAGE_KEY: 'auth_token'
    },
    
    // Default Credentials (for demo purposes)
    DEFAULT_CREDENTIALS: {
        PETUGAS: {
            username: 'petugas',
            password: 'petugas123',
            role: 'petugas'
        },
        ADMIN: {
            username: 'admin',
            password: 'admin123',
            role: 'admin'
        }
    },
    
    // Service Types
    SERVICE_TYPES: {
        PENGOBATAN: 'pengobatan',
        VAKSINASI: 'vaksinasi',
        KONSULTASI: 'konsultasi',
        TELEMEDICINE: 'telemedicine',
        PEMERIKSAAN: 'pemeriksaan',
        OPERASI: 'operasi'
    },
    
    // Animal Types
    ANIMAL_TYPES: {
        ANJING: 'anjing',
        KUCING: 'kucing',
        BURUNG: 'burung',
        KELINCI: 'kelinci',
        LAINNYA: 'lainnya'
    },
    
    // Medicine Categories
    MEDICINE_CATEGORIES: {
        ANTIBIOTIK: 'antibiotik',
        VITAMIN: 'vitamin',
        VAKSIN: 'vaksin',
        OBAT_LUAR: 'obat_luar',
        LAINNYA: 'lainnya'
    },
    
    // Service Status
    SERVICE_STATUS: {
        PENDING: 'pending',
        IN_PROGRESS: 'in_progress',
        COMPLETED: 'completed',
        CANCELLED: 'cancelled'
    },
    
    // Medicine Status
    MEDICINE_STATUS: {
        AVAILABLE: 'available',
        LOW_STOCK: 'low_stock',
        OUT_OF_STOCK: 'out_of_stock'
    },
    
    // User Status
    USER_STATUS: {
        ACTIVE: 'active',
        INACTIVE: 'inactive',
        SUSPENDED: 'suspended'
    },
    
    // Stock Alerts
    STOCK_ALERTS: {
        LOW_STOCK_THRESHOLD: 10,
        CRITICAL_STOCK_THRESHOLD: 5
    },
    
    // Chart Configuration
    CHARTS: {
        COLORS: {
            PRIMARY: '#1e3a8a',
            SECONDARY: '#3b82f6',
            SUCCESS: '#10b981',
            WARNING: '#f59e0b',
            DANGER: '#ef4444',
            INFO: '#3b82f6'
        },
        GRADIENT_COLORS: [
            '#1e3a8a',
            '#3b82f6',
            '#60a5fa',
            '#93c5fd',
            '#dbeafe'
        ]
    },
    
    // Notification Settings
    NOTIFICATIONS: {
        AUTO_HIDE_DELAY: 5000, // 5 seconds
        MAX_NOTIFICATIONS: 5,
        POSITION: 'top-right'
    },
    
    // Pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 10,
        MAX_PAGE_SIZE: 100
    },
    
    // Date and Time Format
    DATE_FORMAT: {
        DISPLAY: 'DD/MM/YYYY HH:mm',
        API: 'YYYY-MM-DDTHH:mm:ss.sssZ',
        SHORT: 'DD/MM/YYYY'
    },
    
    // File Upload
    FILE_UPLOAD: {
        MAX_SIZE: 5 * 1024 * 1024, // 5MB
        ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
        MAX_FILES: 5
    },
    
    // Telemedicine Settings
    TELEMEDICINE: {
        SESSION_TIMEOUT: 60 * 60 * 1000, // 1 hour
        MAX_PARTICIPANTS: 4,
        RECORDING_ENABLED: false
    },
    
    // Report Settings
    REPORTS: {
        PDF_OPTIONS: {
            format: 'A4',
            margin: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20
            }
        },
        EXCEL_OPTIONS: {
            sheetName: 'Data Export',
            dateFormat: 'DD/MM/YYYY'
        }
    },
    
    // Feature Flags
    FEATURES: {
        TELEMEDICINE_ENABLED: true,
        STOCK_MANAGEMENT_ENABLED: true,
        REPORTING_ENABLED: true,
        ANALYTICS_ENABLED: true,
        NOTIFICATIONS_ENABLED: true
    },
    
    // Development Settings
    DEVELOPMENT: {
        DEBUG_MODE: false,
        LOG_LEVEL: 'info',
        MOCK_DATA: true
    }
};

// Utility functions for configuration
const ConfigUtils = {
    // Get configuration value by path
    get: (path) => {
        return path.split('.').reduce((obj, key) => obj && obj[key], CONFIG);
    },
    
    // Set configuration value by path
    set: (path, value) => {
        const keys = path.split('.');
        const lastKey = keys.pop();
        const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, CONFIG);
        target[lastKey] = value;
    },
    
    // Check if feature is enabled
    isFeatureEnabled: (feature) => {
        return CONFIG.FEATURES[feature] === true;
    },
    
    // Get service type display name
    getServiceTypeDisplayName: (type) => {
        const displayNames = {
            [CONFIG.SERVICE_TYPES.PENGOBATAN]: 'Pengobatan',
            [CONFIG.SERVICE_TYPES.VAKSINASI]: 'Vaksinasi',
            [CONFIG.SERVICE_TYPES.KONSULTASI]: 'Konsultasi',
            [CONFIG.SERVICE_TYPES.TELEMEDICINE]: 'Telemedicine',
            [CONFIG.SERVICE_TYPES.PEMERIKSAAN]: 'Pemeriksaan',
            [CONFIG.SERVICE_TYPES.OPERASI]: 'Operasi'
        };
        return displayNames[type] || type;
    },
    
    // Get animal type display name
    getAnimalTypeDisplayName: (type) => {
        const displayNames = {
            [CONFIG.ANIMAL_TYPES.ANJING]: 'Anjing',
            [CONFIG.ANIMAL_TYPES.KUCING]: 'Kucing',
            [CONFIG.ANIMAL_TYPES.BURUNG]: 'Burung',
            [CONFIG.ANIMAL_TYPES.KELINCI]: 'Kelinci',
            [CONFIG.ANIMAL_TYPES.LAINNYA]: 'Lainnya'
        };
        return displayNames[type] || type;
    },
    
    // Get medicine category display name
    getMedicineCategoryDisplayName: (category) => {
        const displayNames = {
            [CONFIG.MEDICINE_CATEGORIES.ANTIBIOTIK]: 'Antibiotik',
            [CONFIG.MEDICINE_CATEGORIES.VITAMIN]: 'Vitamin',
            [CONFIG.MEDICINE_CATEGORIES.VAKSIN]: 'Vaksin',
            [CONFIG.MEDICINE_CATEGORIES.OBAT_LUAR]: 'Obat Luar',
            [CONFIG.MEDICINE_CATEGORIES.LAINNYA]: 'Lainnya'
        };
        return displayNames[category] || category;
    },
    
    // Format currency
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },
    
    // Format date
    formatDate: (date, format = 'display') => {
        const d = new Date(date);
        const options = {
            display: {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            },
            short: {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        };
        
        return d.toLocaleDateString('id-ID', options[format] || options.display);
    },
    
    // Validate NIK
    validateNIK: (nik) => {
        return /^\d{16}$/.test(nik);
    },
    
    // Validate email
    validateEmail: (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },
    
    // Validate phone number
    validatePhone: (phone) => {
        return /^(\+62|62|0)[0-9]{9,13}$/.test(phone);
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.CONFIG = CONFIG;
    window.ConfigUtils = ConfigUtils;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        ConfigUtils
    };
}
