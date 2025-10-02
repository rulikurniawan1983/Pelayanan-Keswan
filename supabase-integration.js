// Supabase Integration for Pelayanan Keswan
// This file provides integration between the app and Supabase

// Check if Supabase is available
function checkSupabaseConnection() {
    if (typeof supabaseClient === 'undefined') {
        console.warn('Supabase client not found. Using localStorage fallback.');
        return false;
    }
    return true;
}

// Enhanced User Management with Supabase
const EnhancedUserService = {
    // Register with Supabase fallback
    async register(userData) {
        if (checkSupabaseConnection()) {
            try {
                const result = await UserService.register(userData);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase registration failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.registerLocal(userData);
    },

    // Login with Supabase fallback
    async login(nik, password) {
        if (checkSupabaseConnection()) {
            try {
                const result = await UserService.login(nik, password);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase login failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.loginLocal(nik, password);
    },

    // Local storage fallback methods
    registerLocal(userData) {
        const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = existingUsers.find(user => user.nik === userData.nik);
        
        if (existingUser) {
            return { success: false, error: 'NIK sudah terdaftar' };
        }

        existingUsers.push(userData);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        return { success: true, data: userData };
    },

    loginLocal(nik, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.nik === nik && u.password === password);
        
        if (!user) {
            return { success: false, error: 'NIK atau password salah' };
        }
        
        return { success: true, data: user };
    }
};

// Enhanced Animal Management with Supabase
const EnhancedAnimalService = {
    // Add animal with Supabase fallback
    async addAnimal(animalData) {
        if (checkSupabaseConnection()) {
            try {
                const result = await AnimalService.addAnimal(animalData);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase add animal failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.addAnimalLocal(animalData);
    },

    // Get animals with Supabase fallback
    async getAnimalsByOwner(ownerNIK) {
        if (checkSupabaseConnection()) {
            try {
                const result = await AnimalService.getAnimalsByOwner(ownerNIK);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase get animals failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.getAnimalsLocal(ownerNIK);
    },

    // Local storage fallback methods
    addAnimalLocal(animalData) {
        const animals = JSON.parse(localStorage.getItem('userAnimals') || '[]');
        const newAnimal = {
            id: Date.now().toString(),
            ...animalData,
            createdAt: new Date().toISOString()
        };
        animals.push(newAnimal);
        localStorage.setItem('userAnimals', JSON.stringify(animals));
        return { success: true, data: newAnimal };
    },

    getAnimalsLocal(ownerNIK) {
        const animals = JSON.parse(localStorage.getItem('userAnimals') || '[]');
        const userAnimals = animals.filter(animal => animal.ownerNIK === ownerNIK);
        return { success: true, data: userAnimals };
    }
};

// Enhanced Service Management with Supabase
const EnhancedServiceService = {
    // Add service with Supabase fallback
    async addService(serviceData) {
        if (checkSupabaseConnection()) {
            try {
                const result = await ServiceService.addService(serviceData);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase add service failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.addServiceLocal(serviceData);
    },

    // Get services with Supabase fallback
    async getServicesByOwner(ownerNIK) {
        if (checkSupabaseConnection()) {
            try {
                const result = await ServiceService.getServicesByOwner(ownerNIK);
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase get services failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.getServicesLocal(ownerNIK);
    },

    // Local storage fallback methods
    addServiceLocal(serviceData) {
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        const newService = {
            id: Date.now().toString(),
            ...serviceData,
            createdAt: new Date().toISOString()
        };
        services.push(newService);
        localStorage.setItem('userServices', JSON.stringify(services));
        return { success: true, data: newService };
    },

    getServicesLocal(ownerNIK) {
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        const userServices = services.filter(service => service.ownerNIK === ownerNIK);
        return { success: true, data: userServices };
    }
};

// Enhanced Medicine Management with Supabase
const EnhancedMedicineService = {
    // Get medicines with Supabase fallback
    async getAllMedicines() {
        if (checkSupabaseConnection()) {
            try {
                const result = await MedicineService.getAllMedicines();
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase get medicines failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.getMedicinesLocal();
    },

    // Local storage fallback methods
    getMedicinesLocal() {
        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        return { success: true, data: medicines };
    }
};

// Enhanced Statistics with Supabase
const EnhancedStatsService = {
    // Get dashboard stats with Supabase fallback
    async getDashboardStats() {
        if (checkSupabaseConnection()) {
            try {
                const result = await StatsService.getDashboardStats();
                if (result.success) {
                    return result;
                }
            } catch (error) {
                console.error('Supabase get stats failed:', error);
            }
        }
        
        // Fallback to localStorage
        return this.getStatsLocal();
    },

    // Local storage fallback methods
    getStatsLocal() {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const services = JSON.parse(localStorage.getItem('userServices') || '[]');
        const medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
        
        return {
            success: true,
            data: {
                totalUsers: users.length,
                totalServices: services.length,
                totalMedicines: medicines.length
            }
        };
    }
};

// Export enhanced services
window.EnhancedUserService = EnhancedUserService;
window.EnhancedAnimalService = EnhancedAnimalService;
window.EnhancedServiceService = EnhancedServiceService;
window.EnhancedMedicineService = EnhancedMedicineService;
window.EnhancedStatsService = EnhancedStatsService;
window.checkSupabaseConnection = checkSupabaseConnection;
