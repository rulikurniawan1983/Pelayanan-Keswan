// Petugas Panel JavaScript
let services = [];
let medicines = [];
let telemedicineSessions = [];

// Initialize Petugas Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadData();
    setupEventListeners();
    updateDashboard();
});

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username || currentUser.role !== 'petugas') {
        window.location.href = 'index.html';
    }
}

// Load Data from LocalStorage
function loadData() {
    services = JSON.parse(localStorage.getItem('services') || '[]');
    medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    telemedicineSessions = JSON.parse(localStorage.getItem('telemedicineSessions') || '[]');
    
    // Initialize with sample data if empty
    if (medicines.length === 0) {
        initializeSampleMedicines();
    }
}

// Initialize Sample Medicines
function initializeSampleMedicines() {
    const sampleMedicines = [
        {
            id: generateId(),
            name: 'Amoxicillin 250mg',
            category: 'antibiotik',
            stock: 50,
            price: 15000,
            description: 'Antibiotik untuk infeksi bakteri',
            status: 'available'
        },
        {
            id: generateId(),
            name: 'Vitamin B Complex',
            category: 'vitamin',
            stock: 30,
            price: 25000,
            description: 'Vitamin untuk kesehatan hewan',
            status: 'available'
        },
        {
            id: generateId(),
            name: 'Vaksin Rabies',
            category: 'vaksin',
            stock: 5,
            price: 75000,
            description: 'Vaksin untuk mencegah rabies',
            status: 'low_stock'
        }
    ];
    
    medicines = sampleMedicines;
    localStorage.setItem('medicines', JSON.stringify(medicines));
}

// Setup Event Listeners
function setupEventListeners() {
    // New Service Form
    const newServiceForm = document.getElementById('newServiceForm');
    if (newServiceForm) {
        newServiceForm.addEventListener('submit', handleNewService);
    }

    // Vaccination Form
    const vaccinationForm = document.getElementById('vaccinationForm');
    if (vaccinationForm) {
        vaccinationForm.addEventListener('submit', handleVaccination);
    }

    // Add Medicine Form
    const addMedicineForm = document.getElementById('addMedicineForm');
    if (addMedicineForm) {
        addMedicineForm.addEventListener('submit', handleAddMedicine);
    }
}

// Update Dashboard
function updateDashboard() {
    const today = new Date().toDateString();
    
    // Update stats
    const todayServices = services.filter(service => 
        new Date(service.serviceDate).toDateString() === today
    );
    
    document.getElementById('todayAppointments').textContent = todayServices.length;
    document.getElementById('vaccinationsToday').textContent = 
        todayServices.filter(s => s.serviceType === 'vaksinasi').length;
    document.getElementById('telemedicineToday').textContent = 
        telemedicineSessions.filter(s => s.status === 'active').length;
    document.getElementById('lowStockItems').textContent = 
        medicines.filter(m => m.stock < 10).length;

    // Update today services table
    updateTodayServicesTable(todayServices);
    
    // Update medicine table
    updateMedicineTable();
    
    // Update telemedicine sessions
    updateTelemedicineSessions();
}

// Update Today Services Table
function updateTodayServicesTable(services) {
    const tbody = document.getElementById('todayServicesTable');
    if (!tbody) return;

    if (services.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="fas fa-calendar-times me-2"></i>Tidak ada layanan hari ini
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = services.map(service => `
        <tr>
            <td>${formatDate(service.serviceDate)}</td>
            <td>${service.animalName}</td>
            <td>${service.ownerName || 'N/A'}</td>
            <td>
                <span class="badge bg-navy">${service.serviceType}</span>
            </td>
            <td>
                <span class="badge bg-${getStatusColor(service.status)}">${service.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewService('${service.id}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="updateServiceStatus('${service.id}', 'completed')">
                    <i class="fas fa-check"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Medicine Table
function updateMedicineTable() {
    const tbody = document.getElementById('medicineTable');
    if (!tbody) return;

    if (medicines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    <i class="fas fa-pills me-2"></i>Tidak ada data obat
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = medicines.map(medicine => `
        <tr>
            <td>${medicine.name}</td>
            <td>
                <span class="badge bg-secondary">${medicine.category}</span>
            </td>
            <td>
                <span class="badge bg-${medicine.stock < 10 ? 'danger' : medicine.stock < 20 ? 'warning' : 'success'}">
                    ${medicine.stock}
                </span>
            </td>
            <td>Rp ${medicine.price.toLocaleString()}</td>
            <td>
                <span class="badge bg-${getMedicineStatusColor(medicine.status)}">${medicine.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editMedicine('${medicine.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteMedicine('${medicine.id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Telemedicine Sessions
function updateTelemedicineSessions() {
    const container = document.getElementById('telemedicineSessions');
    if (!container) return;

    const activeSessions = telemedicineSessions.filter(session => session.status === 'active');
    
    if (activeSessions.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center text-muted">
                <i class="fas fa-video-slash fa-3x mb-3"></i>
                <p>Tidak ada sesi telemedicine aktif</p>
            </div>
        `;
        return;
    }

    container.innerHTML = activeSessions.map(session => `
        <div class="col-md-6">
            <div class="card">
                <div class="card-body">
                    <h6 class="card-title">
                        <i class="fas fa-video me-2"></i>${session.animalName}
                    </h6>
                    <p class="card-text">
                        <strong>Pemilik:</strong> ${session.ownerName}<br>
                        <strong>Keluhan:</strong> ${session.symptoms}
                    </p>
                    <div class="d-flex gap-2">
                        <button class="btn btn-sm btn-navy" onclick="joinTelemedicineSession('${session.id}')">
                            <i class="fas fa-video me-1"></i>Join
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="endTelemedicineSession('${session.id}')">
                            <i class="fas fa-stop me-1"></i>End
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Handle New Service
function handleNewService(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const serviceData = {
        id: generateId(),
        ownerNIK: document.getElementById('ownerNIK').value,
        animalName: document.getElementById('animalName').value,
        animalType: document.getElementById('animalType').value,
        animalAge: document.getElementById('animalAge').value,
        symptoms: document.getElementById('symptoms').value,
        serviceType: document.getElementById('serviceType').value,
        serviceDate: document.getElementById('serviceDate').value,
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Get owner name from users data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const owner = users.find(user => user.nik === serviceData.ownerNIK);
    if (owner) {
        serviceData.ownerName = owner.fullName;
    }

    services.push(serviceData);
    localStorage.setItem('services', JSON.stringify(services));
    
    showAlert('Layanan berhasil ditambahkan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('newServiceModal'));
    modal.hide();
    e.target.reset();
    
    // Update dashboard
    updateDashboard();
}

// Handle Vaccination
function handleVaccination(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const vaccinationData = {
        id: generateId(),
        ownerNIK: document.getElementById('vaccOwnerNIK').value,
        animalName: document.getElementById('vaccAnimalName').value,
        animalType: document.getElementById('vaccAnimalType').value,
        animalAge: document.getElementById('vaccAnimalAge').value,
        vaccineType: document.getElementById('vaccineType').value,
        vaccinationDate: document.getElementById('vaccinationDate').value,
        notes: document.getElementById('vaccinationNotes').value,
        serviceType: 'vaksinasi',
        status: 'pending',
        createdAt: new Date().toISOString()
    };

    // Get owner name from users data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const owner = users.find(user => user.nik === vaccinationData.ownerNIK);
    if (owner) {
        vaccinationData.ownerName = owner.fullName;
    }

    services.push(vaccinationData);
    localStorage.setItem('services', JSON.stringify(services));
    
    showAlert('Vaksinasi berhasil didaftarkan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('vaccinationModal'));
    modal.hide();
    e.target.reset();
    
    // Update dashboard
    updateDashboard();
}

// Handle Add Medicine
function handleAddMedicine(e) {
    e.preventDefault();
    
    const medicineData = {
        id: generateId(),
        name: document.getElementById('medicineName').value,
        category: document.getElementById('medicineCategory').value,
        stock: parseInt(document.getElementById('medicineStock').value),
        price: parseInt(document.getElementById('medicinePrice').value),
        description: document.getElementById('medicineDescription').value,
        status: 'available',
        createdAt: new Date().toISOString()
    };

    medicines.push(medicineData);
    localStorage.setItem('medicines', JSON.stringify(medicines));
    
    showAlert('Obat berhasil ditambahkan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addMedicineModal'));
    modal.hide();
    e.target.reset();
    
    // Update dashboard
    updateDashboard();
}

// Show Modals
function showNewServiceModal() {
    const modal = new bootstrap.Modal(document.getElementById('newServiceModal'));
    modal.show();
}

function showVaccinationModal() {
    const modal = new bootstrap.Modal(document.getElementById('vaccinationModal'));
    modal.show();
}

function showTelemedicineModal() {
    const modal = new bootstrap.Modal(document.getElementById('telemedicineModal'));
    modal.show();
}

function showStockModal() {
    document.getElementById('stock').scrollIntoView({ behavior: 'smooth' });
}

function showAddMedicineModal() {
    const modal = new bootstrap.Modal(document.getElementById('addMedicineModal'));
    modal.show();
}

// Telemedicine Functions
function startTelemedicine() {
    const sessionData = {
        id: generateId(),
        ownerNIK: document.getElementById('teleOwnerNIK').value,
        animalName: document.getElementById('teleAnimalName').value,
        symptoms: document.getElementById('teleSymptoms').value,
        status: 'active',
        startTime: new Date().toISOString()
    };

    // Get owner name from users data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const owner = users.find(user => user.nik === sessionData.ownerNIK);
    if (owner) {
        sessionData.ownerName = owner.fullName;
    }

    telemedicineSessions.push(sessionData);
    localStorage.setItem('telemedicineSessions', JSON.stringify(telemedicineSessions));
    
    showAlert('Sesi telemedicine dimulai!', 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('telemedicineModal'));
    modal.hide();
    
    // Update dashboard
    updateDashboard();
}

function endTelemedicine() {
    showAlert('Sesi telemedicine diakhiri!', 'info');
}

function joinTelemedicineSession(sessionId) {
    const session = telemedicineSessions.find(s => s.id === sessionId);
    if (session) {
        showAlert(`Bergabung dengan sesi ${session.animalName}`, 'success');
    }
}

function endTelemedicineSession(sessionId) {
    const sessionIndex = telemedicineSessions.findIndex(s => s.id === sessionId);
    if (sessionIndex !== -1) {
        telemedicineSessions[sessionIndex].status = 'ended';
        telemedicineSessions[sessionIndex].endTime = new Date().toISOString();
        localStorage.setItem('telemedicineSessions', JSON.stringify(telemedicineSessions));
        showAlert('Sesi telemedicine diakhiri!', 'success');
        updateDashboard();
    }
}

// Medicine Management
function editMedicine(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
        // Pre-fill form with medicine data
        document.getElementById('medicineName').value = medicine.name;
        document.getElementById('medicineCategory').value = medicine.category;
        document.getElementById('medicineStock').value = medicine.stock;
        document.getElementById('medicinePrice').value = medicine.price;
        document.getElementById('medicineDescription').value = medicine.description;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('addMedicineModal'));
        modal.show();
        
        // Update form to edit mode
        const form = document.getElementById('addMedicineForm');
        form.dataset.editId = medicineId;
    }
}

function deleteMedicine(medicineId) {
    if (confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
        medicines = medicines.filter(m => m.id !== medicineId);
        localStorage.setItem('medicines', JSON.stringify(medicines));
        showAlert('Obat berhasil dihapus!', 'success');
        updateDashboard();
    }
}

// Service Management
function viewService(serviceId) {
    const service = services.find(s => s.id === serviceId);
    if (service) {
        alert(`Detail Layanan:\n\nHewan: ${service.animalName}\nJenis: ${service.animalType}\nKeluhan: ${service.symptoms}\nLayanan: ${service.serviceType}\nTanggal: ${formatDate(service.serviceDate)}`);
    }
}

function updateServiceStatus(serviceId, status) {
    const serviceIndex = services.findIndex(s => s.id === serviceId);
    if (serviceIndex !== -1) {
        services[serviceIndex].status = status;
        localStorage.setItem('services', JSON.stringify(services));
        showAlert(`Status layanan diubah menjadi ${status}!`, 'success');
        updateDashboard();
    }
}

// Utility Functions
function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'in_progress': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function getMedicineStatusColor(status) {
    const colors = {
        'available': 'success',
        'low_stock': 'warning',
        'out_of_stock': 'danger'
    };
    return colors[status] || 'secondary';
}

// Logout Function
function logout() {
    // Show loading notification
    showAlert('Sedang logout...', 'info');
    
    // Clear user data
    localStorage.removeItem('currentUser');
    localStorage.removeItem('userAnimals');
    localStorage.removeItem('userServices');
    currentUser = null;
    isLoggedIn = false;
    
    // Close any open modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        const modalInstance = bootstrap.Modal.getInstance(modal);
        if (modalInstance) {
            modalInstance.hide();
        }
    });
    
    // Redirect after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1000);
}

// Confirm Logout Function
function confirmLogout() {
    const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
    modal.show();
}

// Go to Homepage Function
function goToHomepage() {
    window.location.href = 'index.html';
}

// Show Alert Function
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());

    // Create new alert
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;

    // Insert alert
    const container = document.querySelector('.container');
    if (container) {
        container.insertBefore(alertDiv, container.firstChild);
    }

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.remove();
        }
    }, 5000);
}

// Export functions
window.showNewServiceModal = showNewServiceModal;
window.showVaccinationModal = showVaccinationModal;
window.showTelemedicineModal = showTelemedicineModal;
window.showStockModal = showStockModal;
window.showAddMedicineModal = showAddMedicineModal;
window.startTelemedicine = startTelemedicine;
window.endTelemedicine = endTelemedicine;
window.joinTelemedicineSession = joinTelemedicineSession;
window.endTelemedicineSession = endTelemedicineSession;
window.editMedicine = editMedicine;
window.deleteMedicine = deleteMedicine;
window.viewService = viewService;
window.updateServiceStatus = updateServiceStatus;
window.logout = logout;
window.confirmLogout = confirmLogout;
window.goToHomepage = goToHomepage;

// Setup logout event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Logout Links
    const logoutLinks = document.querySelectorAll('[onclick="logout()"], [onclick="confirmLogout()"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            if (this.getAttribute('onclick') === 'confirmLogout()') {
                confirmLogout();
            } else {
                logout();
            }
        });
    });
});
