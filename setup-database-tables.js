// Setup Database Tables for Pelayanan Keswan
// This script will create all necessary tables in Supabase

// Import Supabase client
import { supabaseClient } from './supabase-config.js';

// Database setup configuration
const databaseSetup = {
    tables: [
        {
            name: 'users',
            description: 'Tabel pengguna sistem',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'nik VARCHAR(16) UNIQUE NOT NULL',
                'full_name VARCHAR(255) NOT NULL',
                'email VARCHAR(255) UNIQUE NOT NULL',
                'phone VARCHAR(20)',
                'address TEXT',
                'password VARCHAR(255) NOT NULL',
                'role VARCHAR(20) DEFAULT \'masyarakat\' CHECK (role IN (\'masyarakat\', \'petugas\', \'admin\'))',
                'status VARCHAR(20) DEFAULT \'active\' CHECK (status IN (\'active\', \'inactive\', \'suspended\'))',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
                'updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'animals',
            description: 'Tabel hewan peliharaan',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'name VARCHAR(255) NOT NULL',
                'type VARCHAR(50) NOT NULL',
                'age VARCHAR(50)',
                'gender VARCHAR(20) CHECK (gender IN (\'jantan\', \'betina\'))',
                'description TEXT',
                'owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
                'updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'services',
            description: 'Tabel layanan kesehatan hewan',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'animal_id UUID REFERENCES animals(id) ON DELETE CASCADE',
                'animal_name VARCHAR(255) NOT NULL',
                'animal_type VARCHAR(50) NOT NULL',
                'service_type VARCHAR(50) NOT NULL CHECK (service_type IN (\'pengobatan\', \'vaksinasi\', \'telemedicine\', \'konsultasi\', \'pemeriksaan\', \'operasi\'))',
                'symptoms TEXT',
                'service_date TIMESTAMP WITH TIME ZONE NOT NULL',
                'priority VARCHAR(20) DEFAULT \'normal\' CHECK (priority IN (\'normal\', \'urgent\', \'emergency\'))',
                'status VARCHAR(20) DEFAULT \'pending\' CHECK (status IN (\'pending\', \'in_progress\', \'completed\', \'cancelled\'))',
                'owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE',
                'owner_name VARCHAR(255) NOT NULL',
                'notes TEXT',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
                'updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'medicines',
            description: 'Tabel obat-obatan',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'name VARCHAR(255) NOT NULL',
                'type VARCHAR(100) NOT NULL',
                'stock INTEGER DEFAULT 0',
                'unit VARCHAR(20) DEFAULT \'pcs\'',
                'price DECIMAL(10,2) DEFAULT 0',
                'description TEXT',
                'status VARCHAR(20) DEFAULT \'available\' CHECK (status IN (\'available\', \'out_of_stock\', \'discontinued\'))',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()',
                'updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'vaccinations',
            description: 'Tabel vaksinasi',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'animal_id UUID REFERENCES animals(id) ON DELETE CASCADE',
                'vaccine_type VARCHAR(100) NOT NULL',
                'vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL',
                'next_vaccination_date TIMESTAMP WITH TIME ZONE',
                'notes TEXT',
                'owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'telemedicine_sessions',
            description: 'Tabel sesi telemedicine',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'animal_id UUID REFERENCES animals(id) ON DELETE CASCADE',
                'session_date TIMESTAMP WITH TIME ZONE NOT NULL',
                'symptoms TEXT',
                'diagnosis TEXT',
                'treatment TEXT',
                'status VARCHAR(20) DEFAULT \'active\' CHECK (status IN (\'active\', \'completed\', \'cancelled\'))',
                'owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'service_medicines',
            description: 'Tabel relasi layanan dan obat',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'service_id UUID REFERENCES services(id) ON DELETE CASCADE',
                'medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE',
                'quantity INTEGER NOT NULL DEFAULT 1',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'notifications',
            description: 'Tabel notifikasi',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'user_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE',
                'title VARCHAR(255) NOT NULL',
                'message TEXT NOT NULL',
                'type VARCHAR(50) DEFAULT \'info\' CHECK (type IN (\'info\', \'success\', \'warning\', \'error\'))',
                'is_read BOOLEAN DEFAULT FALSE',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        },
        {
            name: 'audit_logs',
            description: 'Tabel log audit',
            columns: [
                'id UUID DEFAULT gen_random_uuid() PRIMARY KEY',
                'user_nik VARCHAR(16) REFERENCES users(nik) ON DELETE SET NULL',
                'action VARCHAR(100) NOT NULL',
                'table_name VARCHAR(100) NOT NULL',
                'record_id UUID',
                'old_values JSONB',
                'new_values JSONB',
                'created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()'
            ]
        }
    ],
    
    indexes: [
        'CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik)',
        'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
        'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
        'CREATE INDEX IF NOT EXISTS idx_users_status ON users(status)',
        'CREATE INDEX IF NOT EXISTS idx_animals_owner_nik ON animals(owner_nik)',
        'CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type)',
        'CREATE INDEX IF NOT EXISTS idx_services_owner_nik ON services(owner_nik)',
        'CREATE INDEX IF NOT EXISTS idx_services_status ON services(status)',
        'CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type)',
        'CREATE INDEX IF NOT EXISTS idx_services_service_date ON services(service_date)',
        'CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status)',
        'CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type)',
        'CREATE INDEX IF NOT EXISTS idx_vaccinations_owner_nik ON vaccinations(owner_nik)',
        'CREATE INDEX IF NOT EXISTS idx_vaccinations_vaccination_date ON vaccinations(vaccination_date)',
        'CREATE INDEX IF NOT EXISTS idx_telemedicine_owner_nik ON telemedicine_sessions(owner_nik)',
        'CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status)',
        'CREATE INDEX IF NOT EXISTS idx_service_medicines_service_id ON service_medicines(service_id)',
        'CREATE INDEX IF NOT EXISTS idx_service_medicines_medicine_id ON service_medicines(medicine_id)',
        'CREATE INDEX IF NOT EXISTS idx_notifications_user_nik ON notifications(user_nik)',
        'CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read)',
        'CREATE INDEX IF NOT EXISTS idx_audit_logs_user_nik ON audit_logs(user_nik)',
        'CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name)',
        'CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at)'
    ],
    
    sampleData: {
        users: [
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
        ],
        
        medicines: [
            { name: 'Antibiotik Amoxicillin', type: 'Antibiotik', stock: 100, unit: 'tablet', price: 5000, description: 'Antibiotik untuk infeksi bakteri' },
            { name: 'Vitamin B Kompleks', type: 'Vitamin', stock: 50, unit: 'botol', price: 25000, description: 'Vitamin untuk meningkatkan nafsu makan' },
            { name: 'Obat Cacing', type: 'Anthelmintik', stock: 75, unit: 'tablet', price: 3000, description: 'Obat untuk mengatasi cacingan' },
            { name: 'Salep Antibiotik', type: 'Salep', stock: 30, unit: 'tube', price: 15000, description: 'Salep untuk luka infeksi' },
            { name: 'Vaksin Rabies', type: 'Vaksin', stock: 20, unit: 'vial', price: 50000, description: 'Vaksin untuk mencegah rabies' },
            { name: 'Penisilin', type: 'Antibiotik', stock: 80, unit: 'vial', price: 35000, description: 'Antibiotik untuk infeksi berat' },
            { name: 'Dexamethasone', type: 'Steroid', stock: 60, unit: 'vial', price: 25000, description: 'Anti-inflamasi dan anti-alergi' },
            { name: 'Ketamine', type: 'Anestesi', stock: 25, unit: 'vial', price: 75000, description: 'Anestesi untuk operasi' },
            { name: 'Lidocaine', type: 'Anestesi Lokal', stock: 40, unit: 'vial', price: 20000, description: 'Anestesi lokal' },
            { name: 'Metronidazole', type: 'Antibiotik', stock: 90, unit: 'tablet', price: 4000, description: 'Antibiotik untuk infeksi anaerob' }
        ]
    }
};

// Function to create tables
async function createTables() {
    console.log('🚀 Starting database table creation...');
    
    try {
        // Check Supabase connection
        if (!supabaseClient) {
            throw new Error('Supabase client not available');
        }
        
        console.log('✅ Supabase client connected');
        
        // Create tables
        for (const table of databaseSetup.tables) {
            console.log(`📋 Creating table: ${table.name}`);
            
            const columns = table.columns.join(',\n    ');
            const createTableSQL = `
                CREATE TABLE IF NOT EXISTS ${table.name} (
                    ${columns}
                );
            `;
            
            const { error } = await supabaseClient.rpc('exec_sql', { sql: createTableSQL });
            
            if (error) {
                console.error(`❌ Error creating table ${table.name}:`, error);
                throw error;
            }
            
            console.log(`✅ Table ${table.name} created successfully`);
        }
        
        // Create indexes
        console.log('📊 Creating indexes...');
        for (const indexSQL of databaseSetup.indexes) {
            const { error } = await supabaseClient.rpc('exec_sql', { sql: indexSQL });
            
            if (error) {
                console.error(`❌ Error creating index:`, error);
                // Continue with other indexes
            }
        }
        
        console.log('✅ Indexes created successfully');
        
        // Insert sample data
        console.log('📝 Inserting sample data...');
        
        // Insert users
        for (const user of databaseSetup.sampleData.users) {
            const { error } = await supabaseClient
                .from('users')
                .upsert(user, { onConflict: 'nik' });
            
            if (error) {
                console.error(`❌ Error inserting user ${user.nik}:`, error);
            } else {
                console.log(`✅ User ${user.nik} inserted successfully`);
            }
        }
        
        // Insert medicines
        for (const medicine of databaseSetup.sampleData.medicines) {
            const { error } = await supabaseClient
                .from('medicines')
                .upsert(medicine, { onConflict: 'name' });
            
            if (error) {
                console.error(`❌ Error inserting medicine ${medicine.name}:`, error);
            } else {
                console.log(`✅ Medicine ${medicine.name} inserted successfully`);
            }
        }
        
        console.log('✅ Sample data inserted successfully');
        
        // Enable RLS
        console.log('🔒 Enabling Row Level Security...');
        const rlsTables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions', 'service_medicines', 'notifications', 'audit_logs'];
        
        for (const tableName of rlsTables) {
            const { error } = await supabaseClient.rpc('exec_sql', { 
                sql: `ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;` 
            });
            
            if (error) {
                console.error(`❌ Error enabling RLS for ${tableName}:`, error);
            } else {
                console.log(`✅ RLS enabled for ${tableName}`);
            }
        }
        
        console.log('🎉 Database setup completed successfully!');
        return { success: true, message: 'Database tables created successfully!' };
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        return { success: false, message: error.message };
    }
}

// Function to check if tables exist
async function checkTablesExist() {
    console.log('🔍 Checking if tables exist...');
    
    try {
        const tables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions', 'service_medicines', 'notifications', 'audit_logs'];
        const existingTables = [];
        
        for (const table of tables) {
            const { data, error } = await supabaseClient
                .from(table)
                .select('count')
                .limit(1);
            
            if (!error) {
                existingTables.push(table);
                console.log(`✅ Table ${table} exists`);
            } else {
                console.log(`❌ Table ${table} does not exist`);
            }
        }
        
        return {
            success: existingTables.length === tables.length,
            existingTables,
            totalTables: tables.length
        };
        
    } catch (error) {
        console.error('❌ Error checking tables:', error);
        return { success: false, message: error.message };
    }
}

// Function to get table structure
async function getTableStructure(tableName) {
    try {
        const { data, error } = await supabaseClient
            .from(tableName)
            .select('*')
            .limit(1);
        
        if (error) {
            throw error;
        }
        
        return { success: true, data };
    } catch (error) {
        return { success: false, message: error.message };
    }
}

// Function to get database statistics
async function getDatabaseStats() {
    console.log('📊 Getting database statistics...');
    
    try {
        const stats = {};
        
        // Get user count
        const { count: userCount } = await supabaseClient
            .from('users')
            .select('*', { count: 'exact', head: true });
        stats.users = userCount;
        
        // Get animal count
        const { count: animalCount } = await supabaseClient
            .from('animals')
            .select('*', { count: 'exact', head: true });
        stats.animals = animalCount;
        
        // Get service count
        const { count: serviceCount } = await supabaseClient
            .from('services')
            .select('*', { count: 'exact', head: true });
        stats.services = serviceCount;
        
        // Get medicine count
        const { count: medicineCount } = await supabaseClient
            .from('medicines')
            .select('*', { count: 'exact', head: true });
        stats.medicines = medicineCount;
        
        console.log('📊 Database statistics:', stats);
        return { success: true, data: stats };
        
    } catch (error) {
        console.error('❌ Error getting database stats:', error);
        return { success: false, message: error.message };
    }
}

// Function to run full database setup
async function runFullDatabaseSetup() {
    console.log('🚀 Running full database setup...');
    console.log('=====================================');
    
    try {
        // Check if tables exist
        const tableCheck = await checkTablesExist();
        
        if (tableCheck.success) {
            console.log('✅ All tables already exist');
            console.log('📊 Getting database statistics...');
            const stats = await getDatabaseStats();
            console.log('📊 Database statistics:', stats.data);
            return { success: true, message: 'Database already set up', stats: stats.data };
        } else {
            console.log('📋 Creating missing tables...');
            const result = await createTables();
            
            if (result.success) {
                console.log('📊 Getting database statistics...');
                const stats = await getDatabaseStats();
                console.log('📊 Database statistics:', stats.data);
                return { success: true, message: 'Database setup completed', stats: stats.data };
            } else {
                throw new Error(result.message);
            }
        }
        
    } catch (error) {
        console.error('❌ Full database setup failed:', error);
        return { success: false, message: error.message };
    }
}

// Export functions
export {
    createTables,
    checkTablesExist,
    getTableStructure,
    getDatabaseStats,
    runFullDatabaseSetup
};

// Auto-run setup if called directly
if (typeof window !== 'undefined') {
    window.createTables = createTables;
    window.checkTablesExist = checkTablesExist;
    window.getTableStructure = getTableStructure;
    window.getDatabaseStats = getDatabaseStats;
    window.runFullDatabaseSetup = runFullDatabaseSetup;
    
    // Auto-run setup on page load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🔧 Database setup script loaded');
        console.log('Run runFullDatabaseSetup() to setup database');
    });
}
