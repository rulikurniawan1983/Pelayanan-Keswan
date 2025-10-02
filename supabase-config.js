// Supabase Configuration
const SUPABASE_URL = 'https://zboaitjekevseafkpwwu.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpib2FpdGpla2V2c2VhZmtwd3d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzODA0MTgsImV4cCI6MjA3NDk1NjQxOH0.PtlvXdNsKwZa3E8_bwzbvstrhrLc1uQaW8au5c8jKYw';

// Initialize Supabase client
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Database Tables
const TABLES = {
    USERS: 'users',
    ANIMALS: 'animals',
    SERVICES: 'services',
    MEDICINES: 'medicines',
    VACCINATIONS: 'vaccinations',
    TELEMEDICINE: 'telemedicine_sessions'
};

// User Management Functions
const UserService = {
    // Register new user
    async register(userData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.USERS)
                .insert([{
                    nik: userData.nik,
                    full_name: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    address: userData.address,
                    password: userData.password,
                    role: 'masyarakat',
                    status: 'active',
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: error.message };
        }
    },

    // Login user
    async login(nik, password) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.USERS)
                .select('*')
                .eq('nik', nik)
                .eq('password', password)
                .eq('status', 'active')
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Login error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get user by NIK
    async getUserByNIK(nik) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.USERS)
                .select('*')
                .eq('nik', nik)
                .single();
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get user error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update user
    async updateUser(nik, updateData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.USERS)
                .update(updateData)
                .eq('nik', nik)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Update user error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Animal Management Functions
const AnimalService = {
    // Add new animal
    async addAnimal(animalData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.ANIMALS)
                .insert([{
                    name: animalData.name,
                    type: animalData.type,
                    age: animalData.age,
                    gender: animalData.gender,
                    description: animalData.description,
                    owner_nik: animalData.ownerNIK,
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Add animal error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get animals by owner NIK
    async getAnimalsByOwner(ownerNIK) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.ANIMALS)
                .select('*')
                .eq('owner_nik', ownerNIK)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get animals error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update animal
    async updateAnimal(animalId, updateData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.ANIMALS)
                .update(updateData)
                .eq('id', animalId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Update animal error:', error);
            return { success: false, error: error.message };
        }
    },

    // Delete animal
    async deleteAnimal(animalId) {
        try {
            const { error } = await supabaseClient
                .from(TABLES.ANIMALS)
                .delete()
                .eq('id', animalId);
            
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Delete animal error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Service Management Functions
const ServiceService = {
    // Add new service
    async addService(serviceData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.SERVICES)
                .insert([{
                    animal_id: serviceData.animalId,
                    animal_name: serviceData.animalName,
                    animal_type: serviceData.animalType,
                    service_type: serviceData.serviceType,
                    symptoms: serviceData.symptoms,
                    service_date: serviceData.serviceDate,
                    priority: serviceData.priority,
                    status: serviceData.status || 'pending',
                    owner_nik: serviceData.ownerNIK,
                    owner_name: serviceData.ownerName,
                    notes: serviceData.notes,
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Add service error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get services by owner NIK
    async getServicesByOwner(ownerNIK) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.SERVICES)
                .select('*')
                .eq('owner_nik', ownerNIK)
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get services error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all services (for staff/admin)
    async getAllServices() {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.SERVICES)
                .select('*')
                .order('created_at', { ascending: false });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get all services error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update service status
    async updateServiceStatus(serviceId, status, notes = null) {
        try {
            const updateData = { status, updated_at: new Date().toISOString() };
            if (notes) updateData.notes = notes;
            
            const { data, error } = await supabaseClient
                .from(TABLES.SERVICES)
                .update(updateData)
                .eq('id', serviceId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Update service status error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Medicine Management Functions
const MedicineService = {
    // Add new medicine
    async addMedicine(medicineData) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.MEDICINES)
                .insert([{
                    name: medicineData.name,
                    type: medicineData.type,
                    stock: medicineData.stock,
                    unit: medicineData.unit,
                    price: medicineData.price,
                    description: medicineData.description,
                    created_at: new Date().toISOString()
                }])
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Add medicine error:', error);
            return { success: false, error: error.message };
        }
    },

    // Get all medicines
    async getAllMedicines() {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.MEDICINES)
                .select('*')
                .order('name', { ascending: true });
            
            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Get medicines error:', error);
            return { success: false, error: error.message };
        }
    },

    // Update medicine stock
    async updateMedicineStock(medicineId, newStock) {
        try {
            const { data, error } = await supabaseClient
                .from(TABLES.MEDICINES)
                .update({ 
                    stock: newStock,
                    updated_at: new Date().toISOString()
                })
                .eq('id', medicineId)
                .select();
            
            if (error) throw error;
            return { success: true, data: data[0] };
        } catch (error) {
            console.error('Update medicine stock error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Statistics Functions
const StatsService = {
    // Get dashboard statistics
    async getDashboardStats() {
        try {
            const [usersResult, servicesResult, medicinesResult] = await Promise.all([
                supabaseClient.from(TABLES.USERS).select('id', { count: 'exact' }),
                supabaseClient.from(TABLES.SERVICES).select('id', { count: 'exact' }),
                supabaseClient.from(TABLES.MEDICINES).select('id', { count: 'exact' })
            ]);

            return {
                success: true,
                data: {
                    totalUsers: usersResult.count || 0,
                    totalServices: servicesResult.count || 0,
                    totalMedicines: medicinesResult.count || 0
                }
            };
        } catch (error) {
            console.error('Get dashboard stats error:', error);
            return { success: false, error: error.message };
        }
    }
};

// Export services
window.UserService = UserService;
window.AnimalService = AnimalService;
window.ServiceService = ServiceService;
window.MedicineService = MedicineService;
window.StatsService = StatsService;
window.supabaseClient = supabaseClient;
