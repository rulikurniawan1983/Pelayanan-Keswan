// Update Database Data to Supabase - Pelayanan Keswan
// This script migrates localStorage data to Supabase database

// Check Supabase connection
async function checkSupabaseConnection() {
    try {
        if (typeof supabaseClient === 'undefined') {
            console.error('Supabase client not available');
            return false;
        }
        
        // Test connection with a simple query
        const { data, error } = await supabaseClient.from('users').select('count').limit(1);
        if (error) {
            console.error('Supabase connection failed:', error);
            
            // Check if it's a permissions error
            if (error.message.includes('must be owner') || error.message.includes('42501')) {
                console.error('❌ Permissions error detected. Please run the SQL fix in Supabase dashboard.');
                console.error('📋 Copy and run the contents of quick-fix-permissions.sql in your Supabase SQL Editor');
                return false;
            }
            
            return false;
        }
        
        console.log('✅ Supabase connection successful');
        return true;
    } catch (error) {
        console.error('Supabase connection error:', error);
        return false;
    }
}

// Migrate Users Data
async function migrateUsersData() {
    try {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        console.log(`📊 Found ${users.length} users in localStorage`);
        
        if (users.length === 0) {
            console.log('No users to migrate');
            return { success: true, count: 0 };
        }
        
        // Prepare data for Supabase
        const usersData = users.map(user => ({
            nik: user.nik,
            full_name: user.fullName,
            email: user.email,
            phone: user.phone,
            address: user.address,
            password: user.password,
            role: 'masyarakat',
            status: 'active',
            created_at: user.registeredAt || new Date().toISOString()
        }));
        
        // Insert users to Supabase
        const { data, error } = await supabaseClient
            .from('users')
            .upsert(usersData, { onConflict: 'nik' })
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Successfully migrated ${data.length} users to Supabase`);
        return { success: true, count: data.length };
    } catch (error) {
        console.error('❌ Error migrating users:', error);
        return { success: false, error: error.message };
    }
}

// Migrate Animals Data
async function migrateAnimalsData() {
    try {
        const animals = JSON.parse(localStorage.getItem('userAnimals') || '[]');
        console.log(`🐾 Found ${animals.length} animals in localStorage`);
        
        if (animals.length === 0) {
            console.log('No animals to migrate');
            return { success: true, count: 0 };
        }
        
        // Prepare data for Supabase
        const animalsData = animals.map(animal => ({
            name: animal.name,
            type: animal.type,
            age: animal.age,
            gender: animal.gender,
            description: animal.description,
            owner_nik: animal.ownerNIK,
            created_at: animal.createdAt || new Date().toISOString()
        }));
        
        // Insert animals to Supabase
        const { data, error } = await supabaseClient
            .from('animals')
            .upsert(animalsData, { onConflict: 'id' })
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Successfully migrated ${data.length} animals to Supabase`);
        return { success: true, count: data.length };
    } catch (error) {
        console.error('❌ Error migrating animals:', error);
        return { success: false, error: error.message };
    }
}

// Migrate Services Data
async function migrateServicesData() {
    try {
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        console.log(`🏥 Found ${services.length} services in localStorage`);
        
        if (services.length === 0) {
            console.log('No services to migrate');
            return { success: true, count: 0 };
        }
        
        // Prepare data for Supabase
        const servicesData = services.map(service => ({
            animal_id: service.animalId,
            animal_name: service.animalName,
            animal_type: service.animalType,
            service_type: service.serviceType,
            symptoms: service.symptoms,
            service_date: service.serviceDate,
            priority: service.priority || 'normal',
            status: service.status || 'pending',
            owner_nik: service.ownerNIK,
            owner_name: service.ownerName,
            notes: service.notes,
            created_at: service.createdAt || new Date().toISOString()
        }));
        
        // Insert services to Supabase
        const { data, error } = await supabaseClient
            .from('services')
            .upsert(servicesData, { onConflict: 'id' })
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Successfully migrated ${data.length} services to Supabase`);
        return { success: true, count: data.length };
    } catch (error) {
        console.error('❌ Error migrating services:', error);
        return { success: false, error: error.message };
    }
}

// Migrate Vet Practice Recommendations Data
async function migrateVetPracticeRecommendationsData() {
    try {
        const recommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
        console.log(`🏥 Found ${recommendations.length} vet practice recommendations in localStorage`);
        
        if (recommendations.length === 0) {
            console.log('No vet practice recommendations to migrate');
            return { success: true, count: 0 };
        }
        
        // Prepare data for Supabase
        const recommendationsData = recommendations.map(rec => ({
            animal_id: rec.animalId,
            animal_name: rec.animalName,
            animal_type: rec.animalType,
            owner_nik: rec.ownerNIK,
            owner_name: rec.ownerName,
            location: rec.location,
            urgency: rec.urgency || 'normal',
            status: rec.status || 'submitted',
            notes: rec.notes,
            created_at: rec.createdAt || new Date().toISOString()
        }));
        
        // Insert recommendations to Supabase
        const { data, error } = await supabaseClient
            .from('vet_practice_recommendations')
            .upsert(recommendationsData, { onConflict: 'id' })
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Successfully migrated ${data.length} vet practice recommendations to Supabase`);
        return { success: true, count: data.length };
    } catch (error) {
        console.error('❌ Error migrating vet practice recommendations:', error);
        return { success: false, error: error.message };
    }
}

// Get Statistics from Supabase
async function getSupabaseStatistics() {
    try {
        console.log('📊 Fetching statistics from Supabase...');
        
        // Get counts from all tables
        const [usersResult, animalsResult, servicesResult, recommendationsResult] = await Promise.all([
            supabaseClient.from('users').select('id', { count: 'exact' }),
            supabaseClient.from('animals').select('id', { count: 'exact' }),
            supabaseClient.from('services').select('id', { count: 'exact' }),
            supabaseClient.from('vet_practice_recommendations').select('id', { count: 'exact' })
        ]);
        
        const stats = {
            totalUsers: usersResult.count || 0,
            totalAnimals: animalsResult.count || 0,
            totalServices: servicesResult.count || 0,
            totalRecommendations: recommendationsResult.count || 0
        };
        
        console.log('📊 Supabase Statistics:', stats);
        return { success: true, data: stats };
    } catch (error) {
        console.error('❌ Error fetching Supabase statistics:', error);
        return { success: false, error: error.message };
    }
}

// Main Migration Function
async function migrateAllDataToSupabase() {
    console.log('🚀 Starting data migration to Supabase...');
    
    // Check connection
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
        console.error('❌ Cannot connect to Supabase. Migration aborted.');
        return { success: false, error: 'Supabase connection failed' };
    }
    
    const results = {
        users: { success: false, count: 0 },
        animals: { success: false, count: 0 },
        services: { success: false, count: 0 },
        recommendations: { success: false, count: 0 }
    };
    
    try {
        // Migrate all data
        console.log('\n📝 Migrating users...');
        results.users = await migrateUsersData();
        
        console.log('\n🐾 Migrating animals...');
        results.animals = await migrateAnimalsData();
        
        console.log('\n🏥 Migrating services...');
        results.services = await migrateServicesData();
        
        console.log('\n🏥 Migrating vet practice recommendations...');
        results.recommendations = await migrateVetPracticeRecommendationsData();
        
        // Get final statistics
        console.log('\n📊 Getting final statistics...');
        const stats = await getSupabaseStatistics();
        
        // Summary
        console.log('\n✅ Migration Summary:');
        console.log(`👥 Users: ${results.users.count} migrated`);
        console.log(`🐾 Animals: ${results.animals.count} migrated`);
        console.log(`🏥 Services: ${results.services.count} migrated`);
        console.log(`🏥 Recommendations: ${results.recommendations.count} migrated`);
        
        if (stats.success) {
            console.log('\n📊 Final Database Statistics:');
            console.log(`👥 Total Users: ${stats.data.totalUsers}`);
            console.log(`🐾 Total Animals: ${stats.data.totalAnimals}`);
            console.log(`🏥 Total Services: ${stats.data.totalServices}`);
            console.log(`🏥 Total Recommendations: ${stats.data.totalRecommendations}`);
        }
        
        return { success: true, results, stats };
    } catch (error) {
        console.error('❌ Migration failed:', error);
        return { success: false, error: error.message };
    }
}

// Export functions
window.migrateAllDataToSupabase = migrateAllDataToSupabase;
window.checkSupabaseConnection = checkSupabaseConnection;
window.getSupabaseStatistics = getSupabaseStatistics;

// Auto-run migration if called directly
if (typeof window !== 'undefined') {
    console.log('🔄 Supabase data migration script loaded');
    console.log('💡 Run migrateAllDataToSupabase() to start migration');
}
