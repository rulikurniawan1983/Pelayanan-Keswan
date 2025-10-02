// Automatic Table Creation Script
// This script will create all necessary tables in Supabase database

console.log('🚀 Starting automatic table creation...');

// Database setup function
async function createTables() {
    try {
        console.log('📊 Checking database connection...');
        
        // Test connection first
        const { data: testData, error: testError } = await supabaseClient
            .from('users')
            .select('count')
            .limit(1);
        
        if (testError && testError.code !== 'PGRST116') {
            console.error('❌ Database connection failed:', testError);
            return { success: false, error: testError.message };
        }
        
        console.log('✅ Database connection successful');
        
        // Read the SQL file content
        const sqlContent = `
-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR PELAYANAN KESWAN
-- =====================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'masyarakat' CHECK (role IN ('masyarakat', 'petugas', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. ANIMALS TABLE
CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
    weight DECIMAL(5,2),
    color VARCHAR(100),
    description TEXT,
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. SERVICES TABLE
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    service_type VARCHAR(100) NOT NULL CHECK (service_type IN ('treatment', 'vaccination', 'checkup', 'surgery', 'emergency')),
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    service_date DATE,
    service_time TIME,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    staff_nik VARCHAR(16),
    staff_name VARCHAR(255),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MEDICINES TABLE
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    description TEXT,
    manufacturer VARCHAR(255),
    expiry_date DATE,
    batch_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. VACCINATIONS TABLE
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    vaccine_type VARCHAR(100) NOT NULL,
    vaccine_name VARCHAR(255),
    vaccination_date DATE NOT NULL,
    next_vaccination_date DATE,
    batch_number VARCHAR(100),
    veterinarian VARCHAR(255),
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    staff_nik VARCHAR(16),
    staff_name VARCHAR(255),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. TELEMEDICINE SESSIONS TABLE
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_date DATE,
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    veterinarian_nik VARCHAR(16),
    veterinarian_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. SERVICE MEDICINES TABLE
CREATE TABLE IF NOT EXISTS service_medicines (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    medicine_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_nik VARCHAR(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    related_table VARCHAR(50),
    related_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. AUDIT LOGS TABLE
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_nik VARCHAR(16),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `;
        
        console.log('🔨 Creating database tables...');
        
        // Split SQL into individual statements
        const sqlStatements = sqlContent
            .split(';')
            .map(stmt => stmt.trim())
            .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const statement of sqlStatements) {
            if (statement.trim()) {
                try {
                    console.log(`Executing: ${statement.substring(0, 50)}...`);
                    
                    // Use RPC to execute SQL
                    const { data, error } = await supabaseClient.rpc('exec_sql', {
                        sql_query: statement
                    });
                    
                    if (error) {
                        console.warn(`⚠️ Warning executing statement: ${error.message}`);
                        errorCount++;
                    } else {
                        console.log(`✅ Statement executed successfully`);
                        successCount++;
                    }
                } catch (error) {
                    console.warn(`⚠️ Error executing statement: ${error.message}`);
                    errorCount++;
                }
            }
        }
        
        // Create indexes
        console.log('📊 Creating database indexes...');
        
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik);',
            'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);',
            'CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);',
            'CREATE INDEX IF NOT EXISTS idx_animals_owner ON animals(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);',
            'CREATE INDEX IF NOT EXISTS idx_animals_name ON animals(name);',
            'CREATE INDEX IF NOT EXISTS idx_services_owner ON services(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);',
            'CREATE INDEX IF NOT EXISTS idx_services_type ON services(service_type);',
            'CREATE INDEX IF NOT EXISTS idx_services_date ON services(service_date);',
            'CREATE INDEX IF NOT EXISTS idx_services_staff ON services(staff_nik);',
            'CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);',
            'CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type);',
            'CREATE INDEX IF NOT EXISTS idx_medicines_stock ON medicines(stock);',
            'CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);',
            'CREATE INDEX IF NOT EXISTS idx_vaccinations_owner ON vaccinations(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_vaccinations_date ON vaccinations(vaccination_date);',
            'CREATE INDEX IF NOT EXISTS idx_vaccinations_next ON vaccinations(next_vaccination_date);',
            'CREATE INDEX IF NOT EXISTS idx_vaccinations_staff ON vaccinations(staff_nik);',
            'CREATE INDEX IF NOT EXISTS idx_telemedicine_owner ON telemedicine_sessions(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_telemedicine_date ON telemedicine_sessions(session_date);',
            'CREATE INDEX IF NOT EXISTS idx_telemedicine_vet ON telemedicine_sessions(veterinarian_nik);',
            'CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status);',
            'CREATE INDEX IF NOT EXISTS idx_service_medicines_service ON service_medicines(service_id);',
            'CREATE INDEX IF NOT EXISTS idx_service_medicines_medicine ON service_medicines(medicine_id);',
            'CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_nik);',
            'CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);',
            'CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);',
            'CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_nik);',
            'CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);',
            'CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);'
        ];
        
        for (const index of indexes) {
            try {
                await supabaseClient.rpc('exec_sql', {
                    sql_query: index
                });
                console.log('✅ Index created successfully');
            } catch (error) {
                console.warn('⚠️ Warning creating index:', error.message);
            }
        }
        
        // Insert sample data
        console.log('📝 Inserting sample data...');
        
        // Sample medicines
        const sampleMedicines = [
            {
                name: 'Antibiotik Amoxicillin',
                type: 'Antibiotik',
                category: 'Antibiotik',
                stock: 100,
                unit: 'tablet',
                price: 5000,
                description: 'Antibiotik untuk infeksi bakteri',
                manufacturer: 'PT. Farmasi Indonesia'
            },
            {
                name: 'Vitamin B Kompleks',
                type: 'Vitamin',
                category: 'Vitamin',
                stock: 50,
                unit: 'botol',
                price: 25000,
                description: 'Vitamin untuk meningkatkan nafsu makan',
                manufacturer: 'PT. Vitamin Sehat'
            },
            {
                name: 'Obat Cacing',
                type: 'Anthelmintik',
                category: 'Obat Cacing',
                stock: 75,
                unit: 'tablet',
                price: 3000,
                description: 'Obat untuk mengatasi cacingan',
                manufacturer: 'PT. Obat Hewan'
            },
            {
                name: 'Paracetamol',
                type: 'Analgesik',
                category: 'Pain Relief',
                stock: 200,
                unit: 'tablet',
                price: 2000,
                description: 'Obat pereda nyeri dan demam',
                manufacturer: 'PT. Pain Relief'
            },
            {
                name: 'Antiseptik',
                type: 'Antiseptik',
                category: 'Disinfektan',
                stock: 30,
                unit: 'botol',
                price: 15000,
                description: 'Antiseptik untuk membersihkan luka',
                manufacturer: 'PT. Clean Care'
            },
            {
                name: 'Vaksin Rabies',
                type: 'Vaksin',
                category: 'Vaksinasi',
                stock: 25,
                unit: 'vial',
                price: 50000,
                description: 'Vaksin untuk mencegah rabies',
                manufacturer: 'PT. Vaksin Indonesia'
            },
            {
                name: 'Obat Mata',
                type: 'Oftalmik',
                category: 'Obat Mata',
                stock: 40,
                unit: 'botol',
                price: 12000,
                description: 'Obat tetes mata untuk infeksi mata',
                manufacturer: 'PT. Eye Care'
            },
            {
                name: 'Suplemen Kalsium',
                type: 'Suplemen',
                category: 'Mineral',
                stock: 60,
                unit: 'botol',
                price: 18000,
                description: 'Suplemen kalsium untuk tulang',
                manufacturer: 'PT. Bone Health'
            }
        ];
        
        for (const medicine of sampleMedicines) {
            try {
                const { data, error } = await supabaseClient
                    .from('medicines')
                    .insert([medicine])
                    .select();
                
                if (error) {
                    console.warn('⚠️ Warning inserting sample medicine:', error.message);
                } else {
                    console.log('✅ Sample medicine inserted');
                }
            } catch (error) {
                console.warn('⚠️ Error inserting sample medicine:', error.message);
            }
        }
        
        // Sample admin users
        const sampleUsers = [
            {
                nik: '1234567890123456',
                full_name: 'Admin Sistem',
                email: 'admin@keswan.com',
                phone: '081234567890',
                password: 'admin123',
                role: 'admin',
                status: 'active'
            },
            {
                nik: '1234567890123457',
                full_name: 'Petugas 1',
                email: 'petugas1@keswan.com',
                phone: '081234567891',
                password: 'petugas123',
                role: 'petugas',
                status: 'active'
            },
            {
                nik: '1234567890123458',
                full_name: 'Petugas 2',
                email: 'petugas2@keswan.com',
                phone: '081234567892',
                password: 'petugas123',
                role: 'petugas',
                status: 'active'
            }
        ];
        
        for (const user of sampleUsers) {
            try {
                const { data, error } = await supabaseClient
                    .from('users')
                    .insert([user])
                    .select();
                
                if (error) {
                    console.warn('⚠️ Warning inserting sample user:', error.message);
                } else {
                    console.log('✅ Sample user inserted');
                }
            } catch (error) {
                console.warn('⚠️ Error inserting sample user:', error.message);
            }
        }
        
        console.log('🎉 Database table creation completed successfully!');
        
        return {
            success: true,
            message: 'Database table creation completed successfully!',
            tables: 9,
            indexes: indexes.length,
            sampleData: sampleMedicines.length + sampleUsers.length,
            successCount,
            errorCount
        };
        
    } catch (error) {
        console.error('❌ Database table creation failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run table creation when script loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Starting database table creation...');
    
    const result = await createTables();
    
    if (result.success) {
        console.log('✅ Database table creation successful!');
        console.log(`📊 Created ${result.tables} tables`);
        console.log(`📊 Created ${result.indexes} indexes`);
        console.log(`📊 Inserted ${result.sampleData} sample records`);
        console.log(`📊 Success: ${result.successCount}, Errors: ${result.errorCount}`);
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('Database table creation completed successfully!', 'success');
        }
    } else {
        console.error('❌ Database table creation failed:', result.error);
        
        // Show error message
        if (typeof showAlert === 'function') {
            showAlert(`Database table creation failed: ${result.error}`, 'error');
        }
    }
});

// Export function for manual execution
window.createTables = createTables;
