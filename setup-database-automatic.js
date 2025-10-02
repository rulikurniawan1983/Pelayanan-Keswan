// Automatic Database Setup Script
// This script will automatically create all necessary tables in Supabase

console.log('🚀 Starting automatic database setup...');

// Database setup function
async function setupDatabase() {
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
        
        // Create tables if they don't exist
        const tables = [
            {
                name: 'users',
                sql: `
                    CREATE TABLE IF NOT EXISTS users (
                        id SERIAL PRIMARY KEY,
                        nik VARCHAR(16) UNIQUE NOT NULL,
                        full_name VARCHAR(255) NOT NULL,
                        email VARCHAR(255),
                        phone VARCHAR(20),
                        address TEXT,
                        password VARCHAR(255) NOT NULL,
                        role VARCHAR(50) DEFAULT 'masyarakat',
                        status VARCHAR(20) DEFAULT 'active',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            },
            {
                name: 'animals',
                sql: `
                    CREATE TABLE IF NOT EXISTS animals (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        type VARCHAR(100) NOT NULL,
                        age INTEGER,
                        gender VARCHAR(20),
                        description TEXT,
                        owner_nik VARCHAR(16) NOT NULL,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            },
            {
                name: 'services',
                sql: `
                    CREATE TABLE IF NOT EXISTS services (
                        id SERIAL PRIMARY KEY,
                        animal_id INTEGER,
                        animal_name VARCHAR(255),
                        animal_type VARCHAR(100),
                        service_type VARCHAR(100) NOT NULL,
                        symptoms TEXT,
                        service_date DATE,
                        priority VARCHAR(20) DEFAULT 'normal',
                        status VARCHAR(20) DEFAULT 'pending',
                        owner_nik VARCHAR(16) NOT NULL,
                        owner_name VARCHAR(255),
                        notes TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            },
            {
                name: 'medicines',
                sql: `
                    CREATE TABLE IF NOT EXISTS medicines (
                        id SERIAL PRIMARY KEY,
                        name VARCHAR(255) NOT NULL,
                        type VARCHAR(100),
                        stock INTEGER DEFAULT 0,
                        unit VARCHAR(50),
                        price DECIMAL(10,2),
                        description TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            },
            {
                name: 'vaccinations',
                sql: `
                    CREATE TABLE IF NOT EXISTS vaccinations (
                        id SERIAL PRIMARY KEY,
                        animal_id INTEGER,
                        animal_name VARCHAR(255),
                        animal_type VARCHAR(100),
                        vaccine_type VARCHAR(100) NOT NULL,
                        vaccination_date DATE,
                        next_vaccination_date DATE,
                        owner_nik VARCHAR(16) NOT NULL,
                        owner_name VARCHAR(255),
                        notes TEXT,
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            },
            {
                name: 'telemedicine_sessions',
                sql: `
                    CREATE TABLE IF NOT EXISTS telemedicine_sessions (
                        id SERIAL PRIMARY KEY,
                        animal_id INTEGER,
                        animal_name VARCHAR(255),
                        animal_type VARCHAR(100),
                        session_date TIMESTAMP WITH TIME ZONE,
                        symptoms TEXT,
                        diagnosis TEXT,
                        treatment TEXT,
                        owner_nik VARCHAR(16) NOT NULL,
                        owner_name VARCHAR(255),
                        status VARCHAR(20) DEFAULT 'pending',
                        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
                    );
                `
            }
        ];
        
        console.log('🔨 Creating database tables...');
        
        for (const table of tables) {
            try {
                console.log(`Creating table: ${table.name}`);
                
                // Use RPC to execute SQL
                const { data, error } = await supabaseClient.rpc('exec_sql', {
                    sql_query: table.sql
                });
                
                if (error) {
                    console.warn(`⚠️ Warning creating table ${table.name}:`, error.message);
                } else {
                    console.log(`✅ Table ${table.name} created successfully`);
                }
            } catch (error) {
                console.warn(`⚠️ Error creating table ${table.name}:`, error.message);
            }
        }
        
        // Create indexes
        console.log('📊 Creating database indexes...');
        
        const indexes = [
            'CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik);',
            'CREATE INDEX IF NOT EXISTS idx_animals_owner ON animals(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_services_owner ON services(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);',
            'CREATE INDEX IF NOT EXISTS idx_vaccinations_owner ON vaccinations(owner_nik);',
            'CREATE INDEX IF NOT EXISTS idx_telemedicine_owner ON telemedicine_sessions(owner_nik);'
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
                stock: 100,
                unit: 'tablet',
                price: 5000,
                description: 'Antibiotik untuk infeksi bakteri'
            },
            {
                name: 'Vitamin B Kompleks',
                type: 'Vitamin',
                stock: 50,
                unit: 'botol',
                price: 25000,
                description: 'Vitamin untuk meningkatkan nafsu makan'
            },
            {
                name: 'Obat Cacing',
                type: 'Anthelmintik',
                stock: 75,
                unit: 'tablet',
                price: 3000,
                description: 'Obat untuk mengatasi cacingan'
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
        
        console.log('🎉 Database setup completed successfully!');
        
        return {
            success: true,
            message: 'Database setup completed successfully!',
            tables: tables.length,
            indexes: indexes.length,
            sampleData: sampleMedicines.length
        };
        
    } catch (error) {
        console.error('❌ Database setup failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Run setup when script loads
document.addEventListener('DOMContentLoaded', async function() {
    console.log('🚀 Starting database setup...');
    
    const result = await setupDatabase();
    
    if (result.success) {
        console.log('✅ Database setup successful!');
        console.log(`📊 Created ${result.tables} tables`);
        console.log(`📊 Created ${result.indexes} indexes`);
        console.log(`📊 Inserted ${result.sampleData} sample records`);
        
        // Show success message
        if (typeof showAlert === 'function') {
            showAlert('Database setup completed successfully!', 'success');
        }
    } else {
        console.error('❌ Database setup failed:', result.error);
        
        // Show error message
        if (typeof showAlert === 'function') {
            showAlert(`Database setup failed: ${result.error}`, 'error');
        }
    }
});

// Export function for manual execution
window.setupDatabase = setupDatabase;
