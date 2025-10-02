// Supabase Connection Test
// This file tests the Supabase connection and provides debugging information

// Test Supabase Connection
async function testSupabaseConnection() {
    console.log('🔍 Testing Supabase connection...');
    
    try {
        // Check if Supabase client is available
        if (typeof supabaseClient === 'undefined') {
            console.error('❌ Supabase client not found');
            return false;
        }
        
        console.log('✅ Supabase client found');
        
        // Test basic connection
        const { data, error } = await supabaseClient
            .from('users')
            .select('count')
            .limit(1);
        
        if (error) {
            console.error('❌ Supabase connection failed:', error);
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        return true;
        
    } catch (error) {
        console.error('❌ Supabase test failed:', error);
        return false;
    }
}

// Test Database Tables
async function testDatabaseTables() {
    console.log('🔍 Testing database tables...');
    
    const tables = ['users', 'animals', 'services', 'medicines', 'vaccinations', 'telemedicine_sessions'];
    const results = {};
    
    for (const table of tables) {
        try {
            const { data, error } = await supabaseClient
                .from(table)
                .select('count')
                .limit(1);
            
            if (error) {
                console.error(`❌ Table ${table} error:`, error);
                results[table] = false;
            } else {
                console.log(`✅ Table ${table} accessible`);
                results[table] = true;
            }
        } catch (error) {
            console.error(`❌ Table ${table} test failed:`, error);
            results[table] = false;
        }
    }
    
    return results;
}

// Test User Registration
async function testUserRegistration() {
    console.log('🔍 Testing user registration...');
    
    try {
        const testUser = {
            nik: '9999999999999999',
            full_name: 'Test User',
            email: 'test@example.com',
            phone: '08123456789',
            address: 'Test Address',
            password: 'test123',
            role: 'masyarakat',
            status: 'active'
        };
        
        const result = await UserService.register(testUser);
        
        if (result.success) {
            console.log('✅ User registration successful');
            return true;
        } else {
            console.error('❌ User registration failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ User registration test failed:', error);
        return false;
    }
}

// Test User Login
async function testUserLogin() {
    console.log('🔍 Testing user login...');
    
    try {
        const result = await UserService.login('9999999999999999', 'test123');
        
        if (result.success) {
            console.log('✅ User login successful');
            return true;
        } else {
            console.error('❌ User login failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ User login test failed:', error);
        return false;
    }
}

// Test Animal Management
async function testAnimalManagement() {
    console.log('🔍 Testing animal management...');
    
    try {
        const testAnimal = {
            name: 'Test Animal',
            type: 'anjing',
            age: '2 tahun',
            gender: 'jantan',
            description: 'Test animal description',
            owner_nik: '9999999999999999'
        };
        
        const result = await AnimalService.addAnimal(testAnimal);
        
        if (result.success) {
            console.log('✅ Animal management successful');
            return true;
        } else {
            console.error('❌ Animal management failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Animal management test failed:', error);
        return false;
    }
}

// Test Service Management
async function testServiceManagement() {
    console.log('🔍 Testing service management...');
    
    try {
        const testService = {
            animal_id: 'test-animal-id',
            animal_name: 'Test Animal',
            animal_type: 'anjing',
            service_type: 'pengobatan',
            symptoms: 'Test symptoms',
            service_date: new Date().toISOString(),
            priority: 'normal',
            status: 'pending',
            owner_nik: '9999999999999999',
            owner_name: 'Test User',
            notes: 'Test service notes'
        };
        
        const result = await ServiceService.addService(testService);
        
        if (result.success) {
            console.log('✅ Service management successful');
            return true;
        } else {
            console.error('❌ Service management failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Service management test failed:', error);
        return false;
    }
}

// Test Medicine Management
async function testMedicineManagement() {
    console.log('🔍 Testing medicine management...');
    
    try {
        const result = await MedicineService.getAllMedicines();
        
        if (result.success) {
            console.log('✅ Medicine management successful');
            return true;
        } else {
            console.error('❌ Medicine management failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Medicine management test failed:', error);
        return false;
    }
}

// Test Statistics
async function testStatistics() {
    console.log('🔍 Testing statistics...');
    
    try {
        const result = await StatsService.getDashboardStats();
        
        if (result.success) {
            console.log('✅ Statistics successful');
            console.log('📊 Stats:', result.data);
            return true;
        } else {
            console.error('❌ Statistics failed:', result.error);
            return false;
        }
    } catch (error) {
        console.error('❌ Statistics test failed:', error);
        return false;
    }
}

// Run All Tests
async function runAllTests() {
    console.log('🚀 Starting Supabase integration tests...');
    console.log('=====================================');
    
    const results = {
        connection: await testSupabaseConnection(),
        tables: await testDatabaseTables(),
        registration: await testUserRegistration(),
        login: await testUserLogin(),
        animals: await testAnimalManagement(),
        services: await testServiceManagement(),
        medicines: await testMedicineManagement(),
        statistics: await testStatistics()
    };
    
    console.log('=====================================');
    console.log('📊 Test Results:');
    console.log('Connection:', results.connection ? '✅' : '❌');
    console.log('Tables:', results.tables);
    console.log('Registration:', results.registration ? '✅' : '❌');
    console.log('Login:', results.login ? '✅' : '❌');
    console.log('Animals:', results.animals ? '✅' : '❌');
    console.log('Services:', results.services ? '✅' : '❌');
    console.log('Medicines:', results.medicines ? '✅' : '❌');
    console.log('Statistics:', results.statistics ? '✅' : '❌');
    
    const allPassed = Object.values(results).every(result => 
        typeof result === 'boolean' ? result : Object.values(result).every(Boolean)
    );
    
    if (allPassed) {
        console.log('🎉 All tests passed! Supabase integration is working correctly.');
    } else {
        console.log('⚠️ Some tests failed. Check the errors above.');
    }
    
    return results;
}

// Export test functions
window.testSupabaseConnection = testSupabaseConnection;
window.testDatabaseTables = testDatabaseTables;
window.testUserRegistration = testUserRegistration;
window.testUserLogin = testUserLogin;
window.testAnimalManagement = testAnimalManagement;
window.testServiceManagement = testServiceManagement;
window.testMedicineManagement = testMedicineManagement;
window.testStatistics = testStatistics;
window.runAllTests = runAllTests;

// Auto-run tests if in development mode
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('🔧 Development mode detected. Running Supabase tests...');
    setTimeout(() => {
        runAllTests();
    }, 2000);
}
