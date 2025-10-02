// Database Connection Checker
// This script checks if the application is connected to Supabase database

// Check if Supabase is available
function checkSupabaseAvailability() {
    console.log('🔍 Checking Supabase availability...');
    
    if (typeof supabaseClient === 'undefined') {
        console.error('❌ Supabase client not found');
        return false;
    }
    
    console.log('✅ Supabase client found');
    return true;
}

// Check Supabase configuration
function checkSupabaseConfig() {
    console.log('🔍 Checking Supabase configuration...');
    
    try {
        // Check if config file is loaded
        if (typeof SUPABASE_URL === 'undefined' || typeof SUPABASE_ANON_KEY === 'undefined') {
            console.error('❌ Supabase configuration not found');
            return false;
        }
        
        // Check if URL is valid
        if (!SUPABASE_URL.includes('supabase.co')) {
            console.error('❌ Invalid Supabase URL');
            return false;
        }
        
        // Check if API key is valid
        if (SUPABASE_ANON_KEY.length < 20) {
            console.error('❌ Invalid Supabase API key');
            return false;
        }
        
        console.log('✅ Supabase configuration valid');
        console.log(`📍 URL: ${SUPABASE_URL}`);
        console.log(`🔑 API Key: ${SUPABASE_ANON_KEY.substring(0, 10)}...`);
        
        return true;
    } catch (error) {
        console.error('❌ Supabase configuration check failed:', error);
        return false;
    }
}

// Test basic Supabase connection
async function testBasicConnection() {
    console.log('🔍 Testing basic Supabase connection...');
    
    try {
        if (!checkSupabaseAvailability()) {
            return false;
        }
        
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
        console.error('❌ Supabase connection test failed:', error);
        return false;
    }
}

// Test database tables
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
    
    const allAccessible = Object.values(results).every(result => result === true);
    console.log(`📊 Tables test: ${allAccessible ? 'All accessible' : 'Some tables failed'}`);
    
    return { success: allAccessible, results };
}

// Test user services
async function testUserServices() {
    console.log('🔍 Testing user services...');
    
    try {
        // Test user registration
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
        
        const registerResult = await UserService.register(testUser);
        console.log(`📝 User registration: ${registerResult.success ? 'Success' : 'Failed'}`);
        
        // Test user login
        const loginResult = await UserService.login('9999999999999999', 'test123');
        console.log(`🔐 User login: ${loginResult.success ? 'Success' : 'Failed'}`);
        
        return { register: registerResult.success, login: loginResult.success };
    } catch (error) {
        console.error('❌ User services test failed:', error);
        return { register: false, login: false };
    }
}

// Test animal services
async function testAnimalServices() {
    console.log('🔍 Testing animal services...');
    
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
        console.log(`🐾 Animal management: ${result.success ? 'Success' : 'Failed'}`);
        
        return result.success;
    } catch (error) {
        console.error('❌ Animal services test failed:', error);
        return false;
    }
}

// Test service services
async function testServiceServices() {
    console.log('🔍 Testing service services...');
    
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
        console.log(`🏥 Service management: ${result.success ? 'Success' : 'Failed'}`);
        
        return result.success;
    } catch (error) {
        console.error('❌ Service services test failed:', error);
        return false;
    }
}

// Test medicine services
async function testMedicineServices() {
    console.log('🔍 Testing medicine services...');
    
    try {
        const result = await MedicineService.getAllMedicines();
        console.log(`💊 Medicine management: ${result.success ? 'Success' : 'Failed'}`);
        
        return result.success;
    } catch (error) {
        console.error('❌ Medicine services test failed:', error);
        return false;
    }
}

// Test statistics services
async function testStatisticsServices() {
    console.log('🔍 Testing statistics services...');
    
    try {
        const result = await StatsService.getDashboardStats();
        console.log(`📊 Statistics: ${result.success ? 'Success' : 'Failed'}`);
        
        if (result.success) {
            console.log(`📈 Stats data:`, result.data);
        }
        
        return result.success;
    } catch (error) {
        console.error('❌ Statistics services test failed:', error);
        return false;
    }
}

// Check localStorage fallback
function checkLocalStorageFallback() {
    console.log('🔍 Checking localStorage fallback...');
    
    const hasLocalData = 
        localStorage.getItem('users') ||
        localStorage.getItem('userAnimals') ||
        localStorage.getItem('userServices') ||
        localStorage.getItem('medicines');
    
    if (hasLocalData) {
        console.log('✅ LocalStorage data found - fallback available');
        return true;
    } else {
        console.log('ℹ️ No localStorage data - no fallback available');
        return false;
    }
}

// Check migration status
function checkMigrationStatus() {
    console.log('🔍 Checking migration status...');
    
    if (typeof migrationStatus !== 'undefined') {
        console.log('📊 Migration status:', migrationStatus);
        return migrationStatus;
    } else {
        console.log('ℹ️ Migration status not available');
        return null;
    }
}

// Comprehensive database connection check
async function checkDatabaseConnection() {
    console.log('🚀 Starting comprehensive database connection check...');
    console.log('=====================================');
    
    const results = {
        supabaseAvailable: checkSupabaseAvailability(),
        supabaseConfig: checkSupabaseConfig(),
        basicConnection: false,
        databaseTables: false,
        userServices: false,
        animalServices: false,
        serviceServices: false,
        medicineServices: false,
        statisticsServices: false,
        localStorageFallback: checkLocalStorageFallback(),
        migrationStatus: checkMigrationStatus()
    };
    
    // Test basic connection
    if (results.supabaseAvailable && results.supabaseConfig) {
        results.basicConnection = await testBasicConnection();
        
        if (results.basicConnection) {
            // Test database tables
            const tablesResult = await testDatabaseTables();
            results.databaseTables = tablesResult.success;
            
            // Test user services
            const userResult = await testUserServices();
            results.userServices = userResult.register && userResult.login;
            
            // Test animal services
            results.animalServices = await testAnimalServices();
            
            // Test service services
            results.serviceServices = await testServiceServices();
            
            // Test medicine services
            results.medicineServices = await testMedicineServices();
            
            // Test statistics services
            results.statisticsServices = await testStatisticsServices();
        }
    }
    
    // Summary
    console.log('=====================================');
    console.log('📊 Database Connection Summary:');
    console.log(`🔗 Supabase Available: ${results.supabaseAvailable ? '✅' : '❌'}`);
    console.log(`⚙️ Supabase Config: ${results.supabaseConfig ? '✅' : '❌'}`);
    console.log(`🔌 Basic Connection: ${results.basicConnection ? '✅' : '❌'}`);
    console.log(`📋 Database Tables: ${results.databaseTables ? '✅' : '❌'}`);
    console.log(`👥 User Services: ${results.userServices ? '✅' : '❌'}`);
    console.log(`🐾 Animal Services: ${results.animalServices ? '✅' : '❌'}`);
    console.log(`🏥 Service Services: ${results.serviceServices ? '✅' : '❌'}`);
    console.log(`💊 Medicine Services: ${results.medicineServices ? '✅' : '❌'}`);
    console.log(`📊 Statistics Services: ${results.statisticsServices ? '✅' : '❌'}`);
    console.log(`💾 LocalStorage Fallback: ${results.localStorageFallback ? '✅' : '❌'}`);
    
    const totalTests = 9;
    const passedTests = Object.values(results).filter(result => result === true).length;
    
    console.log(`🎯 Overall Status: ${passedTests}/${totalTests} tests passed`);
    
    if (results.basicConnection) {
        console.log('🎉 Database connection is working!');
    } else if (results.localStorageFallback) {
        console.log('⚠️ Database connection failed, but localStorage fallback is available');
    } else {
        console.log('❌ Database connection failed and no fallback available');
    }
    
    return results;
}

// Quick connection check
async function quickConnectionCheck() {
    console.log('⚡ Quick connection check...');
    
    if (!checkSupabaseAvailability()) {
        console.log('❌ Supabase not available');
        return false;
    }
    
    if (!checkSupabaseConfig()) {
        console.log('❌ Supabase configuration invalid');
        return false;
    }
    
    const connection = await testBasicConnection();
    console.log(`🔌 Connection: ${connection ? '✅ Connected' : '❌ Failed'}`);
    
    return connection;
}

// Export functions
window.checkDatabaseConnection = checkDatabaseConnection;
window.quickConnectionCheck = quickConnectionCheck;
window.checkSupabaseAvailability = checkSupabaseAvailability;
window.checkSupabaseConfig = checkSupabaseConfig;
window.testBasicConnection = testBasicConnection;
window.testDatabaseTables = testDatabaseTables;
window.testUserServices = testUserServices;
window.testAnimalServices = testAnimalServices;
window.testServiceServices = testServiceServices;
window.testMedicineServices = testMedicineServices;
window.testStatisticsServices = testStatisticsServices;
window.checkLocalStorageFallback = checkLocalStorageFallback;
window.checkMigrationStatus = checkMigrationStatus;

// Auto-run quick check on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 Database connection checker loaded');
    console.log('Run checkDatabaseConnection() for full check');
    console.log('Run quickConnectionCheck() for quick check');
    
    // Auto-run quick check
    setTimeout(() => {
        quickConnectionCheck();
    }, 1000);
});
