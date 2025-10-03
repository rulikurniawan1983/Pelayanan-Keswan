// Complete localStorage to Supabase Migration Script
// This script migrates ALL localStorage data to Supabase

// Enhanced migration function that handles all localStorage keys
async function migrateAllLocalStorageData() {
    console.log('🚀 Starting complete localStorage to Supabase migration...');
    
    // Check connection first
    const isConnected = await checkSupabaseConnection();
    if (!isConnected) {
        console.error('❌ Cannot connect to Supabase. Migration aborted.');
        return { success: false, error: 'Supabase connection failed' };
    }
    
    const results = {
        users: { success: false, count: 0 },
        animals: { success: false, count: 0 },
        services: { success: false, count: 0 },
        recommendations: { success: false, count: 0 },
        medicines: { success: false, count: 0 }
    };
    
    try {
        // 1. Migrate Users
        console.log('\n👥 Migrating users...');
        results.users = await migrateUsersData();
        
        // 2. Migrate Animals
        console.log('\n🐾 Migrating animals...');
        results.animals = await migrateAnimalsData();
        
        // 3. Migrate Services
        console.log('\n🏥 Migrating services...');
        results.services = await migrateServicesData();
        
        // 4. Migrate Vet Practice Recommendations
        console.log('\n🏥 Migrating vet practice recommendations...');
        results.recommendations = await migrateVetPracticeRecommendationsData();
        
        // 5. Migrate Medicines
        console.log('\n💊 Migrating medicines...');
        results.medicines = await migrateMedicinesData();
        
        // Get final statistics
        console.log('\n📊 Getting final statistics...');
        const stats = await getSupabaseStatistics();
        
        // Summary
        console.log('\n✅ Migration Summary:');
        console.log(`👥 Users: ${results.users.count} migrated`);
        console.log(`🐾 Animals: ${results.animals.count} migrated`);
        console.log(`🏥 Services: ${results.services.count} migrated`);
        console.log(`🏥 Recommendations: ${results.recommendations.count} migrated`);
        console.log(`💊 Medicines: ${results.medicines.count} migrated`);
        
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

// Migrate Medicines Data
async function migrateMedicinesData() {
    try {
        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        console.log(`💊 Found ${medicines.length} medicines in localStorage`);
        
        if (medicines.length === 0) {
            console.log('No medicines to migrate');
            return { success: true, count: 0 };
        }
        
        // Prepare data for Supabase
        const medicinesData = medicines.map(medicine => ({
            name: medicine.name,
            type: medicine.type,
            stock: medicine.stock || 0,
            unit: medicine.unit || 'pcs',
            price: medicine.price || 0,
            description: medicine.description,
            status: medicine.status || 'available',
            created_at: medicine.createdAt || new Date().toISOString()
        }));
        
        // Insert medicines to Supabase
        const { data, error } = await supabaseClient
            .from('medicines')
            .upsert(medicinesData, { onConflict: 'id' })
            .select();
        
        if (error) throw error;
        
        console.log(`✅ Successfully migrated ${data.length} medicines to Supabase`);
        return { success: true, count: data.length };
    } catch (error) {
        console.error('❌ Error migrating medicines:', error);
        return { success: false, error: error.message };
    }
}

// Get all localStorage data summary
function getLocalStorageSummary() {
    const data = {
        users: JSON.parse(localStorage.getItem('users') || '[]'),
        userAnimals: JSON.parse(localStorage.getItem('userAnimals') || '[]'),
        userServices: JSON.parse(localStorage.getItem('userServices') || '[]'),
        vetPracticeRecommendations: JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]'),
        medicines: JSON.parse(localStorage.getItem('medicines') || '[]'),
        currentUser: JSON.parse(localStorage.getItem('currentUser') || '{}')
    };
    
    return {
        totalItems: data.users.length + data.userAnimals.length + data.userServices.length + 
                   data.vetPracticeRecommendations.length + data.medicines.length,
        users: data.users.length,
        animals: data.userAnimals.length,
        services: data.userServices.length,
        recommendations: data.vetPracticeRecommendations.length,
        medicines: data.medicines.length,
        hasCurrentUser: Object.keys(data.currentUser).length > 0
    };
}

// Backup localStorage data before migration
function backupLocalStorageData() {
    const backup = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
            backup[key] = localStorage.getItem(key);
        }
    }
    
    // Save backup to a downloadable file
    const backupData = JSON.stringify(backup, null, 2);
    const blob = new Blob([backupData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `localStorage-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('📦 localStorage backup created and downloaded');
    return backup;
}

// Verify migration success
async function verifyMigration() {
    try {
        console.log('🔍 Verifying migration...');
        
        // Get localStorage counts
        const localData = getLocalStorageSummary();
        
        // Get Supabase counts
        const supabaseStats = await getSupabaseStatistics();
        
        if (!supabaseStats.success) {
            console.error('❌ Failed to get Supabase statistics');
            return { success: false, error: 'Cannot verify migration' };
        }
        
        const verification = {
            users: {
                local: localData.users,
                supabase: supabaseStats.data.totalUsers,
                match: localData.users === supabaseStats.data.totalUsers
            },
            animals: {
                local: localData.animals,
                supabase: supabaseStats.data.totalAnimals,
                match: localData.animals === supabaseStats.data.totalAnimals
            },
            services: {
                local: localData.services,
                supabase: supabaseStats.data.totalServices,
                match: localData.services === supabaseStats.data.totalServices
            },
            recommendations: {
                local: localData.recommendations,
                supabase: supabaseStats.data.totalRecommendations,
                match: localData.recommendations === supabaseStats.data.totalRecommendations
            }
        };
        
        console.log('📊 Migration Verification:');
        console.log(`👥 Users: ${verification.users.local} → ${verification.users.supabase} ${verification.users.match ? '✅' : '❌'}`);
        console.log(`🐾 Animals: ${verification.animals.local} → ${verification.animals.supabase} ${verification.animals.match ? '✅' : '❌'}`);
        console.log(`🏥 Services: ${verification.services.local} → ${verification.services.supabase} ${verification.services.match ? '✅' : '❌'}`);
        console.log(`🏥 Recommendations: ${verification.recommendations.local} → ${verification.recommendations.supabase} ${verification.recommendations.match ? '✅' : '❌'}`);
        
        const allMatch = Object.values(verification).every(v => v.match);
        
        return {
            success: allMatch,
            verification,
            message: allMatch ? 'Migration verified successfully!' : 'Migration verification failed - counts do not match'
        };
    } catch (error) {
        console.error('❌ Error verifying migration:', error);
        return { success: false, error: error.message };
    }
}

// Export functions
window.migrateAllLocalStorageData = migrateAllLocalStorageData;
window.getLocalStorageSummary = getLocalStorageSummary;
window.backupLocalStorageData = backupLocalStorageData;
window.verifyMigration = verifyMigration;

// Auto-run summary on load
if (typeof window !== 'undefined') {
    console.log('🔄 Complete localStorage migration script loaded');
    console.log('💡 Run migrateAllLocalStorageData() to start complete migration');
    
    // Show localStorage summary
    const summary = getLocalStorageSummary();
    console.log('📊 localStorage Summary:', summary);
}
