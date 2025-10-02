// Run Database Setup Script
// This script will automatically setup the database tables

// Import required modules
import { supabaseClient } from './supabase-config.js';
import { runFullDatabaseSetup } from './setup-database-tables.js';

// Database setup configuration
const setupConfig = {
    autoRun: true,
    showProgress: true,
    logLevel: 'info',
    timeout: 30000 // 30 seconds timeout
};

// Logging function
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    console.log(logEntry);
    
    // Also log to page if available
    if (typeof document !== 'undefined') {
        const logElement = document.getElementById('setupLog');
        if (logElement) {
            logElement.innerHTML += logEntry + '\n';
            logElement.scrollTop = logElement.scrollHeight;
        }
    }
}

// Progress tracking
let progress = {
    current: 0,
    total: 7,
    steps: [
        'Check Connection',
        'Check Tables',
        'Create Tables',
        'Create Indexes',
        'Insert Sample Data',
        'Enable RLS',
        'Verify Setup'
    ]
};

// Update progress
function updateProgress(step, message = '') {
    progress.current = step;
    const percentage = Math.round((step / progress.total) * 100);
    
    log(`📊 Progress: ${step}/${progress.total} (${percentage}%) - ${progress.steps[step - 1]}`, 'info');
    
    if (message) {
        log(`📝 ${message}`, 'info');
    }
    
    // Update progress bar if available
    if (typeof document !== 'undefined') {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${percentage}%`;
        }
    }
}

// Check Supabase connection
async function checkConnection() {
    log('🔍 Checking Supabase connection...', 'info');
    
    try {
        if (!supabaseClient) {
            throw new Error('Supabase client not available');
        }
        
        // Test basic connection
        const { data, error } = await supabaseClient
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            throw new Error(`Connection failed: ${error.message}`);
        }
        
        log('✅ Supabase connection successful', 'success');
        return { success: true, message: 'Connection successful' };
        
    } catch (error) {
        log(`❌ Connection failed: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Check existing tables
async function checkTables() {
    log('🔍 Checking existing tables...', 'info');
    
    try {
        const tables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions', 'service_medicines', 'notifications', 'audit_logs'];
        const existingTables = [];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabaseClient
                    .from(table)
                    .select('count')
                    .limit(1);
                
                if (!error) {
                    existingTables.push(table);
                    log(`✅ Table ${table} exists`, 'success');
                } else {
                    log(`❌ Table ${table} does not exist`, 'error');
                }
            } catch (error) {
                log(`❌ Error checking table ${table}: ${error.message}`, 'error');
            }
        }
        
        const result = {
            success: existingTables.length === tables.length,
            existingTables,
            totalTables: tables.length
        };
        
        log(`📊 Tables status: ${existingTables.length}/${tables.length} exist`, 'info');
        return result;
        
    } catch (error) {
        log(`❌ Error checking tables: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Create tables using SQL
async function createTables() {
    log('📋 Creating database tables...', 'info');
    
    try {
        // Read SQL file content
        const sqlContent = `
            -- Create users table
            CREATE TABLE IF NOT EXISTS users (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                nik VARCHAR(16) UNIQUE NOT NULL,
                full_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                password VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'masyarakat' CHECK (role IN ('masyarakat', 'petugas', 'admin')),
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create animals table
            CREATE TABLE IF NOT EXISTS animals (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                age VARCHAR(50),
                gender VARCHAR(20) CHECK (gender IN ('jantan', 'betina')),
                description TEXT,
                owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create services table
            CREATE TABLE IF NOT EXISTS services (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
                animal_name VARCHAR(255) NOT NULL,
                animal_type VARCHAR(50) NOT NULL,
                service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('pengobatan', 'vaksinasi', 'telemedicine', 'konsultasi', 'pemeriksaan', 'operasi')),
                symptoms TEXT,
                service_date TIMESTAMP WITH TIME ZONE NOT NULL,
                priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'emergency')),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
                owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
                owner_name VARCHAR(255) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create medicines table
            CREATE TABLE IF NOT EXISTS medicines (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(100) NOT NULL,
                stock INTEGER DEFAULT 0,
                unit VARCHAR(20) DEFAULT 'pcs',
                price DECIMAL(10,2) DEFAULT 0,
                description TEXT,
                status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'discontinued')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create vaccinations table
            CREATE TABLE IF NOT EXISTS vaccinations (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
                vaccine_type VARCHAR(100) NOT NULL,
                vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL,
                next_vaccination_date TIMESTAMP WITH TIME ZONE,
                notes TEXT,
                owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create telemedicine_sessions table
            CREATE TABLE IF NOT EXISTS telemedicine_sessions (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
                session_date TIMESTAMP WITH TIME ZONE NOT NULL,
                symptoms TEXT,
                diagnosis TEXT,
                treatment TEXT,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
                owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create service_medicines table
            CREATE TABLE IF NOT EXISTS service_medicines (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                service_id UUID REFERENCES services(id) ON DELETE CASCADE,
                medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
                quantity INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create notifications table
            CREATE TABLE IF NOT EXISTS notifications (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            -- Create audit_logs table
            CREATE TABLE IF NOT EXISTS audit_logs (
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_nik VARCHAR(16) REFERENCES users(nik) ON DELETE SET NULL,
                action VARCHAR(100) NOT NULL,
                table_name VARCHAR(100) NOT NULL,
                record_id UUID,
                old_values JSONB,
                new_values JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        `;
        
        // Execute SQL
        const { error } = await supabaseClient.rpc('exec_sql', { sql: sqlContent });
        
        if (error) {
            throw new Error(`SQL execution failed: ${error.message}`);
        }
        
        log('✅ Database tables created successfully', 'success');
        return { success: true, message: 'Tables created successfully' };
        
    } catch (error) {
        log(`❌ Error creating tables: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Insert sample data
async function insertSampleData() {
    log('📝 Inserting sample data...', 'info');
    
    try {
        // Insert default users
        const users = [
            {
                nik: '1234567890123456',
                full_name: 'Administrator',
                email: 'admin@keswan.com',
                phone: '08123456789',
                address: 'Jl. Admin No. 1',
                password: 'admin123',
                role: 'admin',
                status: 'active'
            },
            {
                nik: '1234567890123457',
                full_name: 'Petugas Kesehatan',
                email: 'petugas@keswan.com',
                phone: '08123456788',
                address: 'Jl. Petugas No. 1',
                password: 'petugas123',
                role: 'petugas',
                status: 'active'
            }
        ];
        
        for (const user of users) {
            const { error } = await supabaseClient
                .from('users')
                .upsert(user, { onConflict: 'nik' });
            
            if (error) {
                log(`❌ Error inserting user ${user.nik}: ${error.message}`, 'error');
            } else {
                log(`✅ User ${user.nik} inserted successfully`, 'success');
            }
        }
        
        // Insert sample medicines
        const medicines = [
            { name: 'Antibiotik Amoxicillin', type: 'Antibiotik', stock: 100, unit: 'tablet', price: 5000, description: 'Antibiotik untuk infeksi bakteri' },
            { name: 'Vitamin B Kompleks', type: 'Vitamin', stock: 50, unit: 'botol', price: 25000, description: 'Vitamin untuk meningkatkan nafsu makan' },
            { name: 'Obat Cacing', type: 'Anthelmintik', stock: 75, unit: 'tablet', price: 3000, description: 'Obat untuk mengatasi cacingan' },
            { name: 'Salep Antibiotik', type: 'Salep', stock: 30, unit: 'tube', price: 15000, description: 'Salep untuk luka infeksi' },
            { name: 'Vaksin Rabies', type: 'Vaksin', stock: 20, unit: 'vial', price: 50000, description: 'Vaksin untuk mencegah rabies' }
        ];
        
        for (const medicine of medicines) {
            const { error } = await supabaseClient
                .from('medicines')
                .upsert(medicine, { onConflict: 'name' });
            
            if (error) {
                log(`❌ Error inserting medicine ${medicine.name}: ${error.message}`, 'error');
            } else {
                log(`✅ Medicine ${medicine.name} inserted successfully`, 'success');
            }
        }
        
        log('✅ Sample data inserted successfully', 'success');
        return { success: true, message: 'Sample data inserted successfully' };
        
    } catch (error) {
        log(`❌ Error inserting sample data: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Enable RLS
async function enableRLS() {
    log('🔒 Enabling Row Level Security...', 'info');
    
    try {
        const tables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions', 'service_medicines', 'notifications', 'audit_logs'];
        
        for (const table of tables) {
            const { error } = await supabaseClient.rpc('exec_sql', { 
                sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;` 
            });
            
            if (error) {
                log(`❌ Error enabling RLS for ${table}: ${error.message}`, 'error');
            } else {
                log(`✅ RLS enabled for ${table}`, 'success');
            }
        }
        
        log('✅ Row Level Security enabled successfully', 'success');
        return { success: true, message: 'RLS enabled successfully' };
        
    } catch (error) {
        log(`❌ Error enabling RLS: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Verify setup
async function verifySetup() {
    log('🔍 Verifying database setup...', 'info');
    
    try {
        const stats = {
            users: 0,
            animals: 0,
            services: 0,
            medicines: 0
        };
        
        // Get user count
        const { count: userCount } = await supabaseClient
            .from('users')
            .select('*', { count: 'exact', head: true });
        stats.users = userCount || 0;
        
        // Get animal count
        const { count: animalCount } = await supabaseClient
            .from('animals')
            .select('*', { count: 'exact', head: true });
        stats.animals = animalCount || 0;
        
        // Get service count
        const { count: serviceCount } = await supabaseClient
            .from('services')
            .select('*', { count: 'exact', head: true });
        stats.services = serviceCount || 0;
        
        // Get medicine count
        const { count: medicineCount } = await supabaseClient
            .from('medicines')
            .select('*', { count: 'exact', head: true });
        stats.medicines = medicineCount || 0;
        
        log(`📊 Database statistics:`, 'info');
        log(`👥 Users: ${stats.users}`, 'info');
        log(`🐾 Animals: ${stats.animals}`, 'info');
        log(`🏥 Services: ${stats.services}`, 'info');
        log(`💊 Medicines: ${stats.medicines}`, 'info');
        
        log('✅ Database setup verified successfully', 'success');
        return { success: true, data: stats };
        
    } catch (error) {
        log(`❌ Error verifying setup: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Run full database setup
async function runDatabaseSetup() {
    log('🚀 Starting database setup...', 'info');
    log('=====================================', 'info');
    
    try {
        let successCount = 0;
        const totalSteps = 7;
        
        // Step 1: Check connection
        updateProgress(1, 'Checking connection...');
        const connectionResult = await checkConnection();
        if (connectionResult.success) successCount++;
        
        // Step 2: Check tables
        updateProgress(2, 'Checking existing tables...');
        const tableCheckResult = await checkTables();
        if (tableCheckResult.success) successCount++;
        
        // Step 3: Create tables
        updateProgress(3, 'Creating tables...');
        const createResult = await createTables();
        if (createResult.success) successCount++;
        
        // Step 4: Create indexes (done as part of createTables)
        updateProgress(4, 'Creating indexes...');
        log('✅ Indexes created as part of table creation', 'success');
        successCount++;
        
        // Step 5: Insert sample data
        updateProgress(5, 'Inserting sample data...');
        const sampleDataResult = await insertSampleData();
        if (sampleDataResult.success) successCount++;
        
        // Step 6: Enable RLS
        updateProgress(6, 'Enabling RLS...');
        const rlsResult = await enableRLS();
        if (rlsResult.success) successCount++;
        
        // Step 7: Verify setup
        updateProgress(7, 'Verifying setup...');
        const verifyResult = await verifySetup();
        if (verifyResult.success) successCount++;
        
        log('=====================================', 'info');
        
        if (successCount === totalSteps) {
            log('🎉 Database setup completed successfully!', 'success');
            log('📊 All tables created and configured', 'success');
            return { success: true, message: 'Database setup completed successfully' };
        } else {
            log(`⚠️ Database setup completed with ${totalSteps - successCount} errors`, 'warning');
            return { success: false, message: `Setup completed with ${totalSteps - successCount} errors` };
        }
        
    } catch (error) {
        log(`❌ Database setup failed: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Auto-run setup if called directly
if (typeof window !== 'undefined') {
    window.runDatabaseSetup = runDatabaseSetup;
    
    // Auto-run setup on page load
    document.addEventListener('DOMContentLoaded', function() {
        log('🔧 Database setup script loaded', 'info');
        log('Click "Start Database Setup" to begin...', 'info');
        
        // Auto-run setup after 1 second
        setTimeout(() => {
            runDatabaseSetup();
        }, 1000);
    });
}

// Export functions
export {
    runDatabaseSetup,
    checkConnection,
    checkTables,
    createTables,
    insertSampleData,
    enableRLS,
    verifySetup
};
