// Masyarakat Dashboard JavaScript
let currentUser = null;
let userAnimals = [];
let userServices = [];

// Initialize Masyarakat Dashboard
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadUserData();
    setupEventListeners();
    updateDashboard();
});

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.nik || currentUser.role !== 'masyarakat') {
        window.location.href = 'index.html';
    }
}

// Load User Data
function loadUserData() {
    currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    userAnimals = JSON.parse(localStorage.getItem('userAnimals') || '[]');
    userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    
    // Initialize with sample data if empty
    if (userAnimals.length === 0) {
        initializeSampleAnimals();
    }
}

// Initialize Sample Animals
function initializeSampleAnimals() {
    const sampleAnimals = [
        {
            id: generateId(),
            name: 'Rex',
            type: 'anjing',
            age: '3 tahun',
            gender: 'jantan',
            description: 'Anjing golden retriever yang sehat',
            ownerNIK: currentUser.nik,
            createdAt: new Date().toISOString()
        },
        {
            id: generateId(),
            name: 'Mimi',
            type: 'kucing',
            age: '2 tahun',
            gender: 'betina',
            description: 'Kucing persia yang lucu',
            ownerNIK: currentUser.nik,
            createdAt: new Date().toISOString()
        }
    ];
    
    userAnimals = sampleAnimals;
    localStorage.setItem('userAnimals', JSON.stringify(userAnimals));
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

    // Telemedicine Form
    const telemedicineForm = document.getElementById('telemedicineForm');
    if (telemedicineForm) {
        telemedicineForm.addEventListener('submit', handleTelemedicine);
    }

    // Animal Form
    const animalForm = document.getElementById('animalForm');
    if (animalForm) {
        animalForm.addEventListener('submit', handleAnimal);
    }
}

// Update Dashboard
function updateDashboard() {
    updateUserInfo();
    updateStats();
    updateRecentServices();
    updateHistory();
    updateProfile();
    updateAnimalsList();
    updateAnimalSelects();
}

// Update User Info
function updateUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullName || 'Pengguna';
}

// Update Stats
function updateStats() {
    document.getElementById('totalHewan').textContent = userAnimals.length;
    document.getElementById('totalLayanan').textContent = userServices.length;
    document.getElementById('totalVaksinasi').textContent = 
        userServices.filter(s => s.serviceType === 'vaksinasi').length;
    document.getElementById('totalTelemedicine').textContent = 
        userServices.filter(s => s.serviceType === 'telemedicine').length;
}

// Update Recent Services
function updateRecentServices() {
    const tbody = document.getElementById('recentServicesTable');
    if (!tbody) return;

    const recentServices = userServices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);

    if (recentServices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-calendar-times me-2"></i>Belum ada layanan
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recentServices.map(service => `
        <tr>
            <td>${formatDate(service.createdAt)}</td>
            <td>${service.animalName}</td>
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
            </td>
        </tr>
    `).join('');
}

// Update History
function updateHistory() {
    const tbody = document.getElementById('historyTable');
    if (!tbody) return;

    if (userServices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-history me-2"></i>Belum ada riwayat layanan
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = userServices.map(service => `
        <tr>
            <td>${formatDate(service.createdAt)}</td>
            <td>${service.animalName}</td>
            <td>
                <span class="badge bg-navy">${service.serviceType}</span>
            </td>
            <td>
                <span class="badge bg-${getStatusColor(service.status)}">${service.status}</span>
            </td>
            <td>${service.notes || '-'}</td>
        </tr>
    `).join('');
}

// Update Profile
function updateProfile() {
    const container = document.getElementById('profileInfo');
    if (!container) return;

    container.innerHTML = `
        <div class="row g-3">
            <div class="col-6">
                <strong>NIK:</strong><br>
                <span class="text-muted">${currentUser.nik}</span>
            </div>
            <div class="col-6">
                <strong>Nama:</strong><br>
                <span class="text-muted">${currentUser.fullName}</span>
            </div>
            <div class="col-6">
                <strong>Email:</strong><br>
                <span class="text-muted">${currentUser.email}</span>
            </div>
            <div class="col-6">
                <strong>Telepon:</strong><br>
                <span class="text-muted">${currentUser.phone}</span>
            </div>
            <div class="col-12">
                <strong>Alamat:</strong><br>
                <span class="text-muted">${currentUser.address}</span>
            </div>
        </div>
    `;
}

// Update Animals List
function updateAnimalsList() {
    const container = document.getElementById('animalsList');
    if (!container) return;

    if (userAnimals.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-paw fa-2x mb-2"></i>
                <p>Belum ada hewan terdaftar</p>
            </div>
        `;
        return;
    }

    container.innerHTML = userAnimals.map(animal => `
        <div class="card mb-2">
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <div>
                        <h6 class="mb-1">${animal.name}</h6>
                        <small class="text-muted">${animal.type} • ${animal.age} • ${animal.gender}</small>
                    </div>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" onclick="editAnimal('${animal.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteAnimal('${animal.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Animal Selects
function updateAnimalSelects() {
    const selects = ['animalSelect', 'vaccAnimalSelect', 'teleAnimalSelect'];
    
    selects.forEach(selectId => {
        const select = document.getElementById(selectId);
        if (select) {
            select.innerHTML = '<option value="">Pilih Hewan</option>' +
                userAnimals.map(animal => 
                    `<option value="${animal.id}">${animal.name} (${animal.type})</option>`
                ).join('');
        }
    });
}

// Handle New Service
function handleNewService(e) {
    e.preventDefault();
    
    const animalId = document.getElementById('animalSelect').value;
    const animal = userAnimals.find(a => a.id === animalId);
    
    if (!animal) {
        showAlert('Pilih hewan terlebih dahulu!', 'danger');
        return;
    }
    
    const serviceData = {
        id: generateId(),
        animalId: animalId,
        animalName: animal.name,
        animalType: animal.type,
        serviceType: document.getElementById('serviceType').value,
        symptoms: document.getElementById('symptoms').value,
        serviceDate: document.getElementById('serviceDate').value,
        priority: document.getElementById('priority').value,
        status: 'pending',
        ownerNIK: currentUser.nik,
        ownerName: currentUser.fullName,
        createdAt: new Date().toISOString()
    };

    userServices.push(serviceData);
    localStorage.setItem('userServices', JSON.stringify(userServices));
    
    showAlert('Layanan berhasil diajukan!', 'success');
    
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
    
    const animalId = document.getElementById('vaccAnimalSelect').value;
    const animal = userAnimals.find(a => a.id === animalId);
    
    if (!animal) {
        showAlert('Pilih hewan terlebih dahulu!', 'danger');
        return;
    }
    
    const vaccinationData = {
        id: generateId(),
        animalId: animalId,
        animalName: animal.name,
        animalType: animal.type,
        serviceType: 'vaksinasi',
        vaccineType: document.getElementById('vaccineType').value,
        vaccinationDate: document.getElementById('vaccinationDate').value,
        priority: document.getElementById('vaccPriority').value,
        notes: document.getElementById('vaccinationNotes').value,
        status: 'pending',
        ownerNIK: currentUser.nik,
        ownerName: currentUser.fullName,
        createdAt: new Date().toISOString()
    };

    userServices.push(vaccinationData);
    localStorage.setItem('userServices', JSON.stringify(userServices));
    
    showAlert('Vaksinasi berhasil didaftarkan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('vaccinationModal'));
    modal.hide();
    e.target.reset();
    
    // Update dashboard
    updateDashboard();
}

// Handle Telemedicine
function handleTelemedicine(e) {
    e.preventDefault();
    
    const animalId = document.getElementById('teleAnimalSelect').value;
    const animal = userAnimals.find(a => a.id === animalId);
    
    if (!animal) {
        showAlert('Pilih hewan terlebih dahulu!', 'danger');
        return;
    }
    
    const telemedicineData = {
        id: generateId(),
        animalId: animalId,
        animalName: animal.name,
        animalType: animal.type,
        serviceType: 'telemedicine',
        symptoms: document.getElementById('teleSymptoms').value,
        serviceDate: document.getElementById('teleDate').value,
        priority: document.getElementById('telePriority').value,
        status: 'pending',
        ownerNIK: currentUser.nik,
        ownerName: currentUser.fullName,
        createdAt: new Date().toISOString()
    };

    userServices.push(telemedicineData);
    localStorage.setItem('userServices', JSON.stringify(userServices));
    
    showAlert('Konsultasi telemedicine berhasil diajukan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('telemedicineModal'));
    modal.hide();
    e.target.reset();
    
    // Update dashboard
    updateDashboard();
}

// Handle Animal
function handleAnimal(e) {
    e.preventDefault();
    
    const animalData = {
        id: generateId(),
        name: document.getElementById('animalName').value,
        type: document.getElementById('animalType').value,
        age: document.getElementById('animalAge').value,
        gender: document.getElementById('animalGender').value,
        description: document.getElementById('animalDescription').value,
        ownerNIK: currentUser.nik,
        createdAt: new Date().toISOString()
    };

    userAnimals.push(animalData);
    localStorage.setItem('userAnimals', JSON.stringify(userAnimals));
    
    showAlert('Hewan berhasil ditambahkan!', 'success');
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('animalModal'));
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

function showAnimalModal() {
    const modal = new bootstrap.Modal(document.getElementById('animalModal'));
    modal.show();
}

function showEditProfileModal() {
    showAlert('Fitur edit profil akan segera tersedia!', 'info');
}

// Animal Management
function editAnimal(animalId) {
    const animal = userAnimals.find(a => a.id === animalId);
    if (animal) {
        // Pre-fill form with animal data
        document.getElementById('animalName').value = animal.name;
        document.getElementById('animalType').value = animal.type;
        document.getElementById('animalAge').value = animal.age;
        document.getElementById('animalGender').value = animal.gender;
        document.getElementById('animalDescription').value = animal.description;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('animalModal'));
        modal.show();
        
        // Update form to edit mode
        const form = document.getElementById('animalForm');
        form.dataset.editId = animalId;
    }
}

function deleteAnimal(animalId) {
    if (confirm('Apakah Anda yakin ingin menghapus hewan ini?')) {
        userAnimals = userAnimals.filter(a => a.id !== animalId);
        localStorage.setItem('userAnimals', JSON.stringify(userAnimals));
        showAlert('Hewan berhasil dihapus!', 'success');
        updateDashboard();
    }
}

// Service Management
function viewService(serviceId) {
    const service = userServices.find(s => s.id === serviceId);
    if (service) {
        alert(`Detail Layanan:\n\nHewan: ${service.animalName}\nJenis: ${service.serviceType}\nKeluhan: ${service.symptoms || service.notes}\nTanggal: ${formatDate(service.createdAt)}\nStatus: ${service.status}`);
    }
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

// Export functions
window.showNewServiceModal = showNewServiceModal;
window.showVaccinationModal = showVaccinationModal;
window.showTelemedicineModal = showTelemedicineModal;
window.showAnimalModal = showAnimalModal;
window.showEditProfileModal = showEditProfileModal;
window.editAnimal = editAnimal;
window.deleteAnimal = deleteAnimal;
window.viewService = viewService;
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
