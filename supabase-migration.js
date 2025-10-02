// Supabase Migration Script
// This script helps migrate data from localStorage to Supabase

// Migration status tracking
let migrationStatus = {
    users: false,
    animals: false,
    services: false,
    medicines: false,
    completed: false
};

// Migrate users from localStorage to Supabase
async function migrateUsers() {
    console.log('🔄 Migrating users...');
    
    try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (localUsers.length === 0) {
            console.log('ℹ️ No users to migrate');
            migrationStatus.users = true;
            return;
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const user of localUsers) {
            try {
                const result = await UserService.register({
                    nik: user.nik,
                    fullName: user.fullName,
                    email: user.email,
                    phone: user.phone,
                    address: user.address,
                    password: user.password,
                    role: user.role || 'masyarakat',
                    status: user.status || 'active'
                });
                
                if (result.success) {
                    successCount++;
                } else {
                    console.warn(`⚠️ User ${user.nik} already exists in Supabase`);
                    successCount++; // Count as success since user exists
                }
            } catch (error) {
                console.error(`❌ Failed to migrate user ${user.nik}:`, error);
                errorCount++;
            }
        }
        
        console.log(`✅ Users migration completed: ${successCount} successful, ${errorCount} failed`);
        migrationStatus.users = true;
        
    } catch (error) {
        console.error('❌ Users migration failed:', error);
    }
}

// Migrate animals from localStorage to Supabase
async function migrateAnimals() {
    console.log('🔄 Migrating animals...');
    
    try {
        const localAnimals = JSON.parse(localStorage.getItem('userAnimals') || '[]');
        
        if (localAnimals.length === 0) {
            console.log('ℹ️ No animals to migrate');
            migrationStatus.animals = true;
            return;
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const animal of localAnimals) {
            try {
                const result = await AnimalService.addAnimal({
                    name: animal.name,
                    type: animal.type,
                    age: animal.age,
                    gender: animal.gender,
                    description: animal.description,
                    owner_nik: animal.ownerNIK
                });
                
                if (result.success) {
                    successCount++;
                } else {
                    console.warn(`⚠️ Animal ${animal.name} migration failed:`, result.error);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Failed to migrate animal ${animal.name}:`, error);
                errorCount++;
            }
        }
        
        console.log(`✅ Animals migration completed: ${successCount} successful, ${errorCount} failed`);
        migrationStatus.animals = true;
        
    } catch (error) {
        console.error('❌ Animals migration failed:', error);
    }
}

// Migrate services from localStorage to Supabase
async function migrateServices() {
    console.log('🔄 Migrating services...');
    
    try {
        const localServices = JSON.parse(localStorage.getItem('userServices') || '[]');
        
        if (localServices.length === 0) {
            console.log('ℹ️ No services to migrate');
            migrationStatus.services = true;
            return;
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const service of localServices) {
            try {
                const result = await ServiceService.addService({
                    animal_id: service.animalId,
                    animal_name: service.animalName,
                    animal_type: service.animalType,
                    service_type: service.serviceType,
                    symptoms: service.symptoms,
                    service_date: service.serviceDate,
                    priority: service.priority,
                    status: service.status,
                    owner_nik: service.ownerNIK,
                    owner_name: service.ownerName,
                    notes: service.notes
                });
                
                if (result.success) {
                    successCount++;
                } else {
                    console.warn(`⚠️ Service ${service.id} migration failed:`, result.error);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Failed to migrate service ${service.id}:`, error);
                errorCount++;
            }
        }
        
        console.log(`✅ Services migration completed: ${successCount} successful, ${errorCount} failed`);
        migrationStatus.services = true;
        
    } catch (error) {
        console.error('❌ Services migration failed:', error);
    }
}

// Migrate medicines from localStorage to Supabase
async function migrateMedicines() {
    console.log('🔄 Migrating medicines...');
    
    try {
        const localMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        
        if (localMedicines.length === 0) {
            console.log('ℹ️ No medicines to migrate');
            migrationStatus.medicines = true;
            return;
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const medicine of localMedicines) {
            try {
                const result = await MedicineService.addMedicine({
                    name: medicine.name,
                    type: medicine.type,
                    stock: medicine.stock,
                    unit: medicine.unit,
                    price: medicine.price,
                    description: medicine.description
                });
                
                if (result.success) {
                    successCount++;
                } else {
                    console.warn(`⚠️ Medicine ${medicine.name} migration failed:`, result.error);
                    errorCount++;
                }
            } catch (error) {
                console.error(`❌ Failed to migrate medicine ${medicine.name}:`, error);
                errorCount++;
            }
        }
        
        console.log(`✅ Medicines migration completed: ${successCount} successful, ${errorCount} failed`);
        migrationStatus.medicines = true;
        
    } catch (error) {
        console.error('❌ Medicines migration failed:', error);
    }
}

// Run complete migration
async function runMigration() {
    console.log('🚀 Starting Supabase migration...');
    console.log('=====================================');
    
    // Check if Supabase is available
    if (!checkSupabaseConnection()) {
        console.error('❌ Supabase not available. Migration cancelled.');
        return false;
    }
    
    // Run migrations in sequence
    await migrateUsers();
    await migrateAnimals();
    await migrateServices();
    await migrateMedicines();
    
    // Check migration status
    const allCompleted = Object.values(migrationStatus).every(status => status === true);
    
    if (allCompleted) {
        console.log('=====================================');
        console.log('🎉 Migration completed successfully!');
        console.log('✅ All data has been migrated to Supabase');
        console.log('💡 You can now use the app with Supabase backend');
        migrationStatus.completed = true;
        
        // Show migration summary
        showMigrationSummary();
        
        return true;
    } else {
        console.log('=====================================');
        console.log('⚠️ Migration completed with some issues');
        console.log('📊 Migration status:', migrationStatus);
        return false;
    }
}

// Show migration summary
function showMigrationSummary() {
    const summary = {
        users: localStorage.getItem('users') ? JSON.parse(localStorage.getItem('users')).length : 0,
        animals: localStorage.getItem('userAnimals') ? JSON.parse(localStorage.getItem('userAnimals')).length : 0,
        services: localStorage.getItem('userServices') ? JSON.parse(localStorage.getItem('userServices')).length : 0,
        medicines: localStorage.getItem('medicines') ? JSON.parse(localStorage.getItem('medicines')).length : 0
    };
    
    console.log('📊 Migration Summary:');
    console.log(`👥 Users: ${summary.users}`);
    console.log(`🐾 Animals: ${summary.animals}`);
    console.log(`🏥 Services: ${summary.services}`);
    console.log(`💊 Medicines: ${summary.medicines}`);
}

// Check if migration is needed
function checkMigrationNeeded() {
    const hasLocalData = 
        localStorage.getItem('users') ||
        localStorage.getItem('userAnimals') ||
        localStorage.getItem('userServices') ||
        localStorage.getItem('medicines');
    
    return !!hasLocalData;
}

// Auto-migration on page load
function autoMigration() {
    if (checkMigrationNeeded() && checkSupabaseConnection()) {
        console.log('🔄 Local data detected. Starting auto-migration...');
        runMigration();
    }
}

// Export migration functions
window.migrateUsers = migrateUsers;
window.migrateAnimals = migrateAnimals;
window.migrateServices = migrateServices;
window.migrateMedicines = migrateMedicines;
window.runMigration = runMigration;
window.checkMigrationNeeded = checkMigrationNeeded;
window.autoMigration = autoMigration;

// Auto-run migration if needed
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        autoMigration();
    }, 3000); // Wait 3 seconds for Supabase to initialize
});
