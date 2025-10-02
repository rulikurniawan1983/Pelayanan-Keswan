// Demo Data for Pelayanan Keswan Application
// This file contains sample data for testing and demonstration purposes

// Sample Users (Masyarakat)
const sampleUsers = [
    {
        nik: "1234567890123456",
        fullName: "Ahmad Wijaya",
        email: "ahmad.wijaya@email.com",
        phone: "081234567890",
        address: "Jl. Merdeka No. 123, Jakarta Selatan",
        password: "password123",
        status: "active",
        registeredAt: "2024-01-15T08:30:00.000Z"
    },
    {
        nik: "2345678901234567",
        fullName: "Siti Nurhaliza",
        email: "siti.nurhaliza@email.com",
        phone: "081234567891",
        address: "Jl. Sudirman No. 456, Jakarta Pusat",
        password: "password123",
        status: "active",
        registeredAt: "2024-01-20T10:15:00.000Z"
    },
    {
        nik: "3456789012345678",
        fullName: "Budi Santoso",
        email: "budi.santoso@email.com",
        phone: "081234567892",
        address: "Jl. Thamrin No. 789, Jakarta Pusat",
        password: "password123",
        status: "active",
        registeredAt: "2024-02-01T14:20:00.000Z"
    }
];

// Sample Services (Layanan)
const sampleServices = [
    {
        id: "svc_001",
        ownerNIK: "1234567890123456",
        ownerName: "Ahmad Wijaya",
        animalName: "Rex",
        animalType: "anjing",
        animalAge: "3 tahun",
        symptoms: "Demam tinggi, tidak mau makan, lesu",
        serviceType: "pengobatan",
        serviceDate: "2024-01-20T09:00:00.000Z",
        status: "completed",
        createdAt: "2024-01-20T08:30:00.000Z",
        notes: "Diberikan antibiotik dan vitamin. Kondisi membaik."
    },
    {
        id: "svc_002",
        ownerNIK: "2345678901234567",
        ownerName: "Siti Nurhaliza",
        animalName: "Mimi",
        animalType: "kucing",
        animalAge: "2 tahun",
        symptoms: "Vaksinasi rabies rutin",
        serviceType: "vaksinasi",
        serviceDate: "2024-01-25T10:00:00.000Z",
        status: "completed",
        createdAt: "2024-01-25T09:45:00.000Z",
        notes: "Vaksin rabies diberikan. Hewan dalam kondisi sehat."
    },
    {
        id: "svc_003",
        ownerNIK: "3456789012345678",
        ownerName: "Budi Santoso",
        animalName: "Kiki",
        animalType: "burung",
        animalAge: "1 tahun",
        symptoms: "Sesak napas, bulu rontok",
        serviceType: "konsultasi",
        serviceDate: "2024-02-05T14:00:00.000Z",
        status: "in_progress",
        createdAt: "2024-02-05T13:30:00.000Z",
        notes: "Konsultasi sedang berlangsung."
    },
    {
        id: "svc_004",
        ownerNIK: "1234567890123456",
        ownerName: "Ahmad Wijaya",
        animalName: "Rex",
        animalType: "anjing",
        animalAge: "3 tahun",
        symptoms: "Kontrol rutin pasca pengobatan",
        serviceType: "pemeriksaan",
        serviceDate: "2024-02-10T11:00:00.000Z",
        status: "pending",
        createdAt: "2024-02-10T10:30:00.000Z",
        notes: "Jadwal kontrol rutin."
    }
];

// Sample Medicines (Obat-obatan)
const sampleMedicines = [
    {
        id: "med_001",
        name: "Amoxicillin 250mg",
        category: "antibiotik",
        stock: 50,
        price: 15000,
        description: "Antibiotik untuk infeksi bakteri pada hewan",
        status: "available",
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "med_002",
        name: "Vitamin B Complex",
        category: "vitamin",
        stock: 30,
        price: 25000,
        description: "Vitamin untuk meningkatkan nafsu makan dan kesehatan hewan",
        status: "available",
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "med_003",
        name: "Vaksin Rabies",
        category: "vaksin",
        stock: 5,
        price: 75000,
        description: "Vaksin untuk mencegah penyakit rabies",
        status: "low_stock",
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "med_004",
        name: "Paracetamol 500mg",
        category: "obat_luar",
        stock: 25,
        price: 12000,
        description: "Obat penurun demam untuk hewan",
        status: "available",
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        id: "med_005",
        name: "Salep Antibiotik",
        category: "obat_luar",
        stock: 3,
        price: 18000,
        description: "Salep untuk luka luar pada hewan",
        status: "low_stock",
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];

// Sample Telemedicine Sessions
const sampleTelemedicineSessions = [
    {
        id: "tel_001",
        ownerNIK: "2345678901234567",
        ownerName: "Siti Nurhaliza",
        animalName: "Mimi",
        symptoms: "Konsultasi rutin kesehatan kucing",
        status: "active",
        startTime: "2024-02-15T09:00:00.000Z",
        endTime: null
    },
    {
        id: "tel_002",
        ownerNIK: "3456789012345678",
        ownerName: "Budi Santoso",
        animalName: "Kiki",
        symptoms: "Konsultasi masalah pernapasan burung",
        status: "ended",
        startTime: "2024-02-14T14:00:00.000Z",
        endTime: "2024-02-14T14:30:00.000Z"
    }
];

// Function to load demo data
function loadDemoData() {
    // Load users
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.length === 0) {
        localStorage.setItem('users', JSON.stringify(sampleUsers));
        console.log('Demo users loaded');
    }

    // Load services
    const existingServices = JSON.parse(localStorage.getItem('services') || '[]');
    if (existingServices.length === 0) {
        localStorage.setItem('services', JSON.stringify(sampleServices));
        console.log('Demo services loaded');
    }

    // Load medicines
    const existingMedicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    if (existingMedicines.length === 0) {
        localStorage.setItem('medicines', JSON.stringify(sampleMedicines));
        console.log('Demo medicines loaded');
    }

    // Load telemedicine sessions
    const existingTelemedicine = JSON.parse(localStorage.getItem('telemedicineSessions') || '[]');
    if (existingTelemedicine.length === 0) {
        localStorage.setItem('telemedicineSessions', JSON.stringify(sampleTelemedicineSessions));
        console.log('Demo telemedicine sessions loaded');
    }
}

// Function to clear all data
function clearAllData() {
    localStorage.removeItem('users');
    localStorage.removeItem('services');
    localStorage.removeItem('medicines');
    localStorage.removeItem('telemedicineSessions');
    localStorage.removeItem('currentUser');
    console.log('All data cleared');
}

// Function to reset to demo data
function resetToDemoData() {
    clearAllData();
    loadDemoData();
    console.log('Reset to demo data completed');
}

// Auto-load demo data when script is loaded
if (typeof window !== 'undefined') {
    // Load demo data automatically
    loadDemoData();
    
    // Add global functions for manual control
    window.loadDemoData = loadDemoData;
    window.clearAllData = clearAllData;
    window.resetToDemoData = resetToDemoData;
}

// Export for Node.js environments
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        sampleUsers,
        sampleServices,
        sampleMedicines,
        sampleTelemedicineSessions,
        loadDemoData,
        clearAllData,
        resetToDemoData
    };
}
