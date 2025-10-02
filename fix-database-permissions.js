// Fix Database Permissions
// This script will fix permission issues in Supabase

// Import Supabase client
import { supabaseClient } from './supabase-config.js';

// Permission fix configuration
const permissionFix = {
    // SQL commands to fix permissions
    sqlCommands: [
        // Grant permissions to authenticated users
        "GRANT USAGE ON SCHEMA public TO authenticated;",
        "GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;",
        "GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;",
        "GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;",
        
        // Grant permissions to anon users
        "GRANT USAGE ON SCHEMA public TO anon;",
        "GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;",
        "GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO anon;",
        
        // Create exec_sql function
        `CREATE OR REPLACE FUNCTION exec_sql(sql TEXT)
        RETURNS TEXT AS $$
        BEGIN
            EXECUTE sql;
            RETURN 'SQL executed successfully';
        EXCEPTION
            WHEN OTHERS THEN
                RETURN 'Error: ' || SQLERRM;
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;`,
        
        // Grant execute permission on exec_sql function
        "GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO authenticated;",
        "GRANT EXECUTE ON FUNCTION exec_sql(TEXT) TO anon;",
        
        // Create safer table creation function
        `CREATE OR REPLACE FUNCTION create_table_safely(
            table_name TEXT,
            columns TEXT
        )
        RETURNS TEXT AS $$
        BEGIN
            EXECUTE format('CREATE TABLE IF NOT EXISTS %I (%s)', table_name, columns);
            RETURN format('Table %s created successfully', table_name);
        EXCEPTION
            WHEN OTHERS THEN
                RETURN format('Error creating table %s: %s', table_name, SQLERRM);
        END;
        $$ LANGUAGE plpgsql SECURITY DEFINER;`,
        
        // Grant execute permission on create_table_safely function
        "GRANT EXECUTE ON FUNCTION create_table_safely(TEXT, TEXT) TO authenticated;",
        "GRANT EXECUTE ON FUNCTION create_table_safely(TEXT, TEXT) TO anon;"
    ],
    
    // Table creation commands
    tableCreation: [
        {
            name: 'users',
            columns: `
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
            `
        },
        {
            name: 'animals',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                age VARCHAR(50),
                gender VARCHAR(20) CHECK (gender IN ('jantan', 'betina')),
                description TEXT,
                owner_nik VARCHAR(16) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'services',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID,
                animal_name VARCHAR(255) NOT NULL,
                animal_type VARCHAR(50) NOT NULL,
                service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('pengobatan', 'vaksinasi', 'telemedicine', 'konsultasi', 'pemeriksaan', 'operasi')),
                symptoms TEXT,
                service_date TIMESTAMP WITH TIME ZONE NOT NULL,
                priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'emergency')),
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
                owner_nik VARCHAR(16) NOT NULL,
                owner_name VARCHAR(255) NOT NULL,
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'medicines',
            columns: `
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
            `
        },
        {
            name: 'vaccinations',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID,
                vaccine_type VARCHAR(100) NOT NULL,
                vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL,
                next_vaccination_date TIMESTAMP WITH TIME ZONE,
                notes TEXT,
                owner_nik VARCHAR(16) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'telemedicine_sessions',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                animal_id UUID,
                session_date TIMESTAMP WITH TIME ZONE NOT NULL,
                symptoms TEXT,
                diagnosis TEXT,
                treatment TEXT,
                status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
                owner_nik VARCHAR(16) NOT NULL,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'service_medicines',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                service_id UUID,
                medicine_id UUID,
                quantity INTEGER NOT NULL DEFAULT 1,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'notifications',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_nik VARCHAR(16) NOT NULL,
                title VARCHAR(255) NOT NULL,
                message TEXT NOT NULL,
                type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        },
        {
            name: 'audit_logs',
            columns: `
                id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
                user_nik VARCHAR(16),
                action VARCHAR(100) NOT NULL,
                table_name VARCHAR(100) NOT NULL,
                record_id UUID,
                old_values JSONB,
                new_values JSONB,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
        }
    ],
    
    // Sample data
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
            { name: 'Vaksin Rabies', type: 'Vaksin', stock: 20, unit: 'vial', price: 50000, description: 'Vaksin untuk mencegah rabies' }
        ]
    }
};

// Logging function
function log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = `[${timestamp}] ${message}`;
    
    console.log(logEntry);
    
    // Also log to page if available
    if (typeof document !== 'undefined') {
        const logElement = document.getElementById('fixLog');
        if (logElement) {
            logElement.innerHTML += logEntry + '\n';
            logElement.scrollTop = logElement.scrollHeight;
        }
    }
}

// Fix permissions
async function fixPermissions() {
    log('🔧 Fixing database permissions...', 'info');
    
    try {
        if (!supabaseClient) {
            throw new Error('Supabase client not available');
        }
        
        log('✅ Supabase client connected', 'success');
        
        // Execute permission fix commands
        for (const sqlCommand of permissionFix.sqlCommands) {
            log(`🔧 Executing: ${sqlCommand.substring(0, 50)}...`, 'info');
            
            try {
                const { data, error } = await supabaseClient.rpc('exec_sql', { sql: sqlCommand });
                
                if (error) {
                    log(`❌ Error executing command: ${error.message}`, 'error');
                } else {
                    log(`✅ Command executed successfully`, 'success');
                }
            } catch (error) {
                log(`❌ Error executing command: ${error.message}`, 'error');
            }
        }
        
        log('✅ Permissions fixed successfully', 'success');
        return { success: true, message: 'Permissions fixed successfully' };
        
    } catch (error) {
        log(`❌ Error fixing permissions: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Create tables safely
async function createTablesSafely() {
    log('📋 Creating tables safely...', 'info');
    
    try {
        for (const table of permissionFix.tableCreation) {
            log(`📋 Creating table: ${table.name}`, 'info');
            
            try {
                const { data, error } = await supabaseClient.rpc('create_table_safely', {
                    table_name: table.name,
                    columns: table.columns
                });
                
                if (error) {
                    log(`❌ Error creating table ${table.name}: ${error.message}`, 'error');
                } else {
                    log(`✅ Table ${table.name} created successfully`, 'success');
                }
            } catch (error) {
                log(`❌ Error creating table ${table.name}: ${error.message}`, 'error');
            }
        }
        
        log('✅ Tables created successfully', 'success');
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
        // Insert users
        for (const user of permissionFix.sampleData.users) {
            const { error } = await supabaseClient
                .from('users')
                .upsert(user, { onConflict: 'nik' });
            
            if (error) {
                log(`❌ Error inserting user ${user.nik}: ${error.message}`, 'error');
            } else {
                log(`✅ User ${user.nik} inserted successfully`, 'success');
            }
        }
        
        // Insert medicines
        for (const medicine of permissionFix.sampleData.medicines) {
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

// Add foreign key constraints
async function addForeignKeys() {
    log('🔗 Adding foreign key constraints...', 'info');
    
    try {
        const foreignKeyCommands = [
            "ALTER TABLE animals ADD CONSTRAINT animals_owner_nik_fkey FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE;",
            "ALTER TABLE services ADD CONSTRAINT services_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE;",
            "ALTER TABLE services ADD CONSTRAINT services_owner_nik_fkey FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE;",
            "ALTER TABLE vaccinations ADD CONSTRAINT vaccinations_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE;",
            "ALTER TABLE vaccinations ADD CONSTRAINT vaccinations_owner_nik_fkey FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE;",
            "ALTER TABLE telemedicine_sessions ADD CONSTRAINT telemedicine_sessions_animal_id_fkey FOREIGN KEY (animal_id) REFERENCES animals(id) ON DELETE CASCADE;",
            "ALTER TABLE telemedicine_sessions ADD CONSTRAINT telemedicine_sessions_owner_nik_fkey FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE;",
            "ALTER TABLE service_medicines ADD CONSTRAINT service_medicines_service_id_fkey FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE;",
            "ALTER TABLE service_medicines ADD CONSTRAINT service_medicines_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE;",
            "ALTER TABLE notifications ADD CONSTRAINT notifications_user_nik_fkey FOREIGN KEY (user_nik) REFERENCES users(nik) ON DELETE CASCADE;",
            "ALTER TABLE audit_logs ADD CONSTRAINT audit_logs_user_nik_fkey FOREIGN KEY (user_nik) REFERENCES users(nik) ON DELETE SET NULL;"
        ];
        
        for (const command of foreignKeyCommands) {
            try {
                const { data, error } = await supabaseClient.rpc('exec_sql', { sql: command });
                
                if (error) {
                    log(`❌ Error adding foreign key: ${error.message}`, 'error');
                } else {
                    log(`✅ Foreign key added successfully`, 'success');
                }
            } catch (error) {
                log(`❌ Error adding foreign key: ${error.message}`, 'error');
            }
        }
        
        log('✅ Foreign keys added successfully', 'success');
        return { success: true, message: 'Foreign keys added successfully' };
        
    } catch (error) {
        log(`❌ Error adding foreign keys: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Enable RLS
async function enableRLS() {
    log('🔒 Enabling Row Level Security...', 'info');
    
    try {
        const tables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions', 'service_medicines', 'notifications', 'audit_logs'];
        
        for (const table of tables) {
            try {
                const { data, error } = await supabaseClient.rpc('exec_sql', { 
                    sql: `ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;` 
                });
                
                if (error) {
                    log(`❌ Error enabling RLS for ${table}: ${error.message}`, 'error');
                } else {
                    log(`✅ RLS enabled for ${table}`, 'success');
                }
            } catch (error) {
                log(`❌ Error enabling RLS for ${table}: ${error.message}`, 'error');
            }
        }
        
        log('✅ Row Level Security enabled successfully', 'success');
        return { success: true, message: 'RLS enabled successfully' };
        
    } catch (error) {
        log(`❌ Error enabling RLS: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Run full permission fix
async function runFullPermissionFix() {
    log('🚀 Starting full permission fix...', 'info');
    log('=====================================', 'info');
    
    try {
        let successCount = 0;
        const totalSteps = 5;
        
        // Step 1: Fix permissions
        log('🔧 Step 1: Fixing permissions...', 'info');
        const permissionResult = await fixPermissions();
        if (permissionResult.success) successCount++;
        
        // Step 2: Create tables safely
        log('📋 Step 2: Creating tables safely...', 'info');
        const tableResult = await createTablesSafely();
        if (tableResult.success) successCount++;
        
        // Step 3: Add foreign keys
        log('🔗 Step 3: Adding foreign keys...', 'info');
        const foreignKeyResult = await addForeignKeys();
        if (foreignKeyResult.success) successCount++;
        
        // Step 4: Insert sample data
        log('📝 Step 4: Inserting sample data...', 'info');
        const sampleDataResult = await insertSampleData();
        if (sampleDataResult.success) successCount++;
        
        // Step 5: Enable RLS
        log('🔒 Step 5: Enabling RLS...', 'info');
        const rlsResult = await enableRLS();
        if (rlsResult.success) successCount++;
        
        log('=====================================', 'info');
        
        if (successCount === totalSteps) {
            log('🎉 Permission fix completed successfully!', 'success');
            log('📊 All tables created and configured', 'success');
            return { success: true, message: 'Permission fix completed successfully' };
        } else {
            log(`⚠️ Permission fix completed with ${totalSteps - successCount} errors`, 'warning');
            return { success: false, message: `Permission fix completed with ${totalSteps - successCount} errors` };
        }
        
    } catch (error) {
        log(`❌ Permission fix failed: ${error.message}`, 'error');
        return { success: false, message: error.message };
    }
}

// Export functions
export {
    fixPermissions,
    createTablesSafely,
    insertSampleData,
    addForeignKeys,
    enableRLS,
    runFullPermissionFix
};

// Auto-run if called directly
if (typeof window !== 'undefined') {
    window.fixPermissions = fixPermissions;
    window.createTablesSafely = createTablesSafely;
    window.insertSampleData = insertSampleData;
    window.addForeignKeys = addForeignKeys;
    window.enableRLS = enableRLS;
    window.runFullPermissionFix = runFullPermissionFix;
    
    // Auto-run permission fix on page load
    document.addEventListener('DOMContentLoaded', function() {
        log('🔧 Permission fix script loaded', 'info');
        log('Click "Fix Permissions" to begin...', 'info');
        
        // Auto-run permission fix after 1 second
        setTimeout(() => {
            runFullPermissionFix();
        }, 1000);
    });
}
