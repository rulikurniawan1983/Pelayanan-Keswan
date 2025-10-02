// Environment Setup Script
// This script helps setup environment variables for the application

const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Colors for console output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};

// Console logging functions
function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSuccess(message) {
    log(`✅ ${message}`, 'green');
}

function logError(message) {
    log(`❌ ${message}`, 'red');
}

function logWarning(message) {
    log(`⚠️ ${message}`, 'yellow');
}

function logInfo(message) {
    log(`ℹ️ ${message}`, 'blue');
}

// Environment configuration
const envConfig = {
    required: [
        'SUPABASE_URL',
        'SUPABASE_ANON_KEY',
        'NODE_ENV'
    ],
    optional: [
        'APP_NAME',
        'APP_VERSION',
        'APP_URL',
        'PORT',
        'JWT_SECRET',
        'ENCRYPTION_KEY',
        'CORS_ORIGINS',
        'DEBUG',
        'LOG_LEVEL'
    ],
    development: {
        NODE_ENV: 'development',
        DEBUG: 'true',
        LOG_LEVEL: 'debug',
        PORT: '3000'
    },
    production: {
        NODE_ENV: 'production',
        DEBUG: 'false',
        LOG_LEVEL: 'info',
        PORT: '3000'
    }
};

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Function to ask question
function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            resolve(answer);
        });
    });
}

// Function to generate random string
function generateRandomString(length = 32) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Function to validate URL
function isValidUrl(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Function to validate Supabase URL
function isValidSupabaseUrl(url) {
    return url.includes('supabase.co') && url.startsWith('https://');
}

// Function to validate Supabase key
function isValidSupabaseKey(key) {
    return key.startsWith('eyJ') && key.length > 100;
}

// Function to create .env file
async function createEnvFile(environment = 'development') {
    logInfo('Setting up environment variables...');
    
    const envVars = {};
    
    // Set environment-specific defaults
    Object.assign(envVars, envConfig[environment]);
    
    // Ask for required variables
    for (const varName of envConfig.required) {
        let value = '';
        let isValid = false;
        
        while (!isValid) {
            if (varName === 'SUPABASE_URL') {
                value = await askQuestion(`Enter your Supabase URL (https://your-project-ref.supabase.co): `);
                isValid = isValidSupabaseUrl(value);
                if (!isValid) {
                    logError('Invalid Supabase URL. Please enter a valid Supabase URL.');
                }
            } else if (varName === 'SUPABASE_ANON_KEY') {
                value = await askQuestion(`Enter your Supabase Anonymous Key: `);
                isValid = isValidSupabaseKey(value);
                if (!isValid) {
                    logError('Invalid Supabase key. Please enter a valid Supabase Anonymous Key.');
                }
            } else if (varName === 'NODE_ENV') {
                value = environment;
                isValid = true;
            } else {
                value = await askQuestion(`Enter ${varName}: `);
                isValid = value.trim() !== '';
                if (!isValid) {
                    logError(`${varName} is required.`);
                }
            }
        }
        
        envVars[varName] = value;
    }
    
    // Ask for optional variables
    logInfo('Setting up optional variables (press Enter to skip)...');
    
    for (const varName of envConfig.optional) {
        if (envVars[varName]) continue; // Skip if already set
        
        let defaultValue = '';
        let question = `Enter ${varName}`;
        
        // Set default values and questions
        switch (varName) {
            case 'APP_NAME':
                defaultValue = 'Pelayanan Keswan';
                question += ` (default: ${defaultValue})`;
                break;
            case 'APP_VERSION':
                defaultValue = '1.0.0';
                question += ` (default: ${defaultValue})`;
                break;
            case 'APP_URL':
                defaultValue = 'https://pelayanan-keswan.vercel.app';
                question += ` (default: ${defaultValue})`;
                break;
            case 'JWT_SECRET':
                defaultValue = generateRandomString(32);
                question += ` (default: generated)`;
                break;
            case 'ENCRYPTION_KEY':
                defaultValue = generateRandomString(32);
                question += ` (default: generated)`;
                break;
            case 'CORS_ORIGINS':
                defaultValue = environment === 'development' 
                    ? 'http://localhost:3000,http://127.0.0.1:3000'
                    : 'https://pelayanan-keswan.vercel.app';
                question += ` (default: ${defaultValue})`;
                break;
        }
        
        const value = await askQuestion(`${question}: `);
        envVars[varName] = value.trim() || defaultValue;
    }
    
    // Generate .env content
    const envContent = generateEnvContent(envVars);
    
    // Write .env file
    try {
        fs.writeFileSync('.env', envContent);
        logSuccess('.env file created successfully!');
    } catch (error) {
        logError(`Failed to create .env file: ${error.message}`);
        return false;
    }
    
    return true;
}

// Function to generate .env content
function generateEnvContent(envVars) {
    let content = '# Environment Variables\n';
    content += '# Generated by setup-env.js\n';
    content += `# Created: ${new Date().toISOString()}\n\n`;
    
    // Group variables by category
    const categories = {
        'SUPABASE CONFIGURATION': ['SUPABASE_URL', 'SUPABASE_ANON_KEY'],
        'APPLICATION CONFIGURATION': ['NODE_ENV', 'APP_NAME', 'APP_VERSION', 'APP_URL', 'PORT'],
        'SECURITY CONFIGURATION': ['JWT_SECRET', 'ENCRYPTION_KEY'],
        'CORS CONFIGURATION': ['CORS_ORIGINS'],
        'DEVELOPMENT CONFIGURATION': ['DEBUG', 'LOG_LEVEL']
    };
    
    for (const [category, vars] of Object.entries(categories)) {
        content += `# ===========================================\n`;
        content += `# ${category}\n`;
        content += `# ===========================================\n`;
        
        for (const varName of vars) {
            if (envVars[varName]) {
                content += `${varName}=${envVars[varName]}\n`;
            }
        }
        
        content += '\n';
    }
    
    return content;
}

// Function to validate existing .env file
function validateEnvFile() {
    if (!fs.existsSync('.env')) {
        logWarning('.env file not found.');
        return false;
    }
    
    const envContent = fs.readFileSync('.env', 'utf8');
    const envVars = {};
    
    // Parse .env file
    envContent.split('\n').forEach(line => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith('#')) {
            const [key, ...valueParts] = trimmedLine.split('=');
            if (key && valueParts.length > 0) {
                envVars[key] = valueParts.join('=');
            }
        }
    });
    
    // Check required variables
    const missingVars = [];
    for (const varName of envConfig.required) {
        if (!envVars[varName]) {
            missingVars.push(varName);
        }
    }
    
    if (missingVars.length > 0) {
        logError(`Missing required environment variables: ${missingVars.join(', ')}`);
        return false;
    }
    
    // Validate Supabase configuration
    if (!isValidSupabaseUrl(envVars.SUPABASE_URL)) {
        logError('Invalid Supabase URL in .env file.');
        return false;
    }
    
    if (!isValidSupabaseKey(envVars.SUPABASE_ANON_KEY)) {
        logError('Invalid Supabase key in .env file.');
        return false;
    }
    
    logSuccess('.env file is valid!');
    return true;
}

// Function to show environment status
function showEnvStatus() {
    logInfo('Environment Status:');
    
    if (fs.existsSync('.env')) {
        logSuccess('.env file exists');
        validateEnvFile();
    } else {
        logWarning('.env file not found');
    }
    
    if (fs.existsSync('env.example')) {
        logSuccess('env.example file exists');
    } else {
        logWarning('env.example file not found');
    }
}

// Main function
async function main() {
    log('🔧 Environment Setup for Pelayanan Keswan', 'cyan');
    log('==========================================', 'cyan');
    
    const args = process.argv.slice(2);
    const command = args[0] || 'setup';
    
    switch (command) {
        case 'setup':
            const environment = args[1] || 'development';
            logInfo(`Setting up ${environment} environment...`);
            await createEnvFile(environment);
            break;
            
        case 'validate':
            validateEnvFile();
            break;
            
        case 'status':
            showEnvStatus();
            break;
            
        case 'help':
            log('Available commands:', 'yellow');
            log('  setup [development|production] - Setup environment variables');
            log('  validate                     - Validate existing .env file');
            log('  status                       - Show environment status');
            log('  help                         - Show this help message');
            break;
            
        default:
            logError(`Unknown command: ${command}`);
            log('Use "node setup-env.js help" for available commands.');
            break;
    }
    
    rl.close();
}

// Handle process exit
process.on('SIGINT', () => {
    log('\n\nSetup cancelled by user.', 'yellow');
    rl.close();
    process.exit(0);
});

// Run main function
main().catch(error => {
    logError(`Setup failed: ${error.message}`);
    rl.close();
    process.exit(1);
});
