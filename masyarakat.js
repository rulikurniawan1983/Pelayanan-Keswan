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
    
    // Load profile info
    loadProfileInfo();
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

    // Edit Profile Form
    const editProfileForm = document.getElementById('editProfileForm');
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', handleEditProfile);
    }

    // Vet Practice Recommendation Form (Permentan 3/2019)
    const vetPracticeRecommendationForm = document.getElementById('vetPracticeRecommendationForm');
    if (vetPracticeRecommendationForm) {
        vetPracticeRecommendationForm.addEventListener('submit', handleVetPracticeRecommendation);
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
    updateSelectedServices();
    updateAvailableServices();
    updateHistoryServices();
    updateSubmissionStatusTable();
}

// Update User Info
function updateUserInfo() {
    document.getElementById('userName').textContent = currentUser.fullName || 'Pengguna';
}

// Update Stats (removed - statistics section deleted)
function updateStats() {
    // Statistics section has been removed from the UI
    // This function is kept for compatibility but does nothing
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
    
    const ticketNumber = generateTicketNumber();
    const serviceData = {
        id: generateId(),
        ticketNumber: ticketNumber,
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
    
    showAlert(`Layanan berhasil diajukan!<br><strong>Nomor Tiket: ${ticketNumber}</strong><br>Gunakan nomor ini untuk tracking status layanan.`, 'success');
    
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
    
    const ticketNumber = generateTicketNumber();
    const vaccinationData = {
        id: generateId(),
        ticketNumber: ticketNumber,
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
    
    showAlert(`Vaksinasi berhasil didaftarkan!<br><strong>Nomor Tiket: ${ticketNumber}</strong><br>Gunakan nomor ini untuk tracking status layanan.`, 'success');
    
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
    
    const ticketNumber = generateTicketNumber();
    const telemedicineData = {
        id: generateId(),
        ticketNumber: ticketNumber,
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
    
    showAlert(`Konsultasi telemedicine berhasil diajukan!<br><strong>Nomor Tiket: ${ticketNumber}</strong><br>Gunakan nomor ini untuk tracking status layanan.`, 'success');
    
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

function showVetPracticeRecommendationModal() {
    const modal = new bootstrap.Modal(document.getElementById('vetPracticeRecommendationModal'));
    modal.show();
}

function showVetControlNumberRecommendationModal() {
    const modal = new bootstrap.Modal(document.getElementById('vetControlNumberRecommendationModal'));
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

function showProfileServiceModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileServiceModal'));
    modal.show();
}

function showEditProfileModal() {
    // Load current user data into the form
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    document.getElementById('editFullName').value = user.fullName || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editAddress').value = user.address || '';
    document.getElementById('editNIK').value = user.nik || '';
    
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

// Handle Edit Profile
function handleEditProfile(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const updatedUser = {
        ...currentUser,
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        address: formData.get('address'),
        nik: formData.get('nik')
    };
    
    // Update localStorage
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    currentUser = updatedUser;
    
    // Update dashboard
    updateDashboard();
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
    modal.hide();
    
    showAlert('Profil berhasil diperbarui!', 'success');
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

// Generate Ticket Number
function generateTicketNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK${year}${month}${day}${random}`;
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

// Handle Recommendation Actions
function getDirections() {
    showAlert('Fitur petunjuk arah akan segera tersedia!', 'info');
}

function applyControlNumber() {
    showAlert('Pengajuan nomor kontrol berhasil! Tim kami akan menghubungi Anda dalam 1-2 hari kerja.', 'success');
}

// Handle Vet Practice Recommendation Submission (Permentan No. 3 Tahun 2019)
function handleVetPracticeRecommendation(e) {
    e.preventDefault();

    const form = e.target;
    const ticketNumber = generateTicketNumber();
    const data = {
        id: generateId(),
        ticketNumber: ticketNumber,
        type: 'rekomendasi_praktek_dokter_hewan',
        drhName: document.getElementById('drhName').value.trim(),
        drhNIK: document.getElementById('drhNIK').value.trim(),
        strvNumber: document.getElementById('strvNumber').value.trim(),
        strvIssuedAt: document.getElementById('strvIssuedAt').value,
        strvValidUntil: document.getElementById('strvValidUntil').value,
        domicileAddress: document.getElementById('domicileAddress').value.trim(),
        practiceAddress: document.getElementById('practiceAddress').value.trim(),
        practiceType: document.getElementById('practiceType').value,
        qualification: document.getElementById('qualification').value.trim(),
        facilities: document.getElementById('facilities').value.trim(),
        reqHealthCert: document.getElementById('reqHealthCert').checked,
        reqSKCK: document.getElementById('reqSKCK').checked,
        reqDiploma: document.getElementById('reqDiploma').checked,
        reqStatement: document.getElementById('reqStatement').checked,
        ownerNIK: currentUser?.nik,
        ownerName: currentUser?.fullName,
        createdAt: new Date().toISOString(),
        status: 'submitted'
    };

    // Basic validation & business rules per regulation intent
    const errors = [];
    if (!data.drhName) errors.push('Nama Dokter Hewan wajib diisi');
    if (!data.drhNIK) errors.push('NIK wajib diisi');
    if (!data.strvNumber) errors.push('Nomor STRV wajib diisi');
    if (!data.strvIssuedAt) errors.push('Tanggal terbit STRV wajib diisi');
    if (!data.strvValidUntil) errors.push('Tanggal berlaku STRV wajib diisi');
    if (!data.domicileAddress) errors.push('Alamat domisili wajib diisi');
    if (!data.practiceAddress) errors.push('Alamat tempat praktek wajib diisi');
    if (!data.practiceType) errors.push('Jenis praktek wajib dipilih');
    if (!(data.reqHealthCert && data.reqSKCK && data.reqDiploma && data.reqStatement)) {
        errors.push('Semua pernyataan pemenuhan persyaratan harus dicentang');
    }

    // Date consistency: validUntil must be after issuedAt
    if (data.strvIssuedAt && data.strvValidUntil) {
        const issued = new Date(data.strvIssuedAt);
        const validUntil = new Date(data.strvValidUntil);
        if (validUntil <= issued) {
            errors.push('Masa berlaku STRV harus setelah tanggal terbit');
        }
    }

    if (errors.length > 0) {
        showAlert('<strong>Validasi Gagal:</strong><br>' + errors.map(e => `- ${e}`).join('<br>'), 'danger');
        return;
    }

    (async () => {
        try {
            // Optional uploads
            const uploads = {};
            const files = [
                { id: 'healthCertFile', key: 'doc_health_cert' },
                { id: 'skckFile', key: 'doc_skck' },
                { id: 'diplomaFile', key: 'doc_diploma' },
                { id: 'statementFile', key: 'doc_statement' }
            ];

            if (typeof uploadToBucket !== 'undefined' && typeof BUCKETS !== 'undefined') {
                for (const f of files) {
                    const input = document.getElementById(f.id);
                    if (input && input.files && input.files[0]) {
                        const file = input.files[0];
                        if (file.size > 10 * 1024 * 1024) {
                            showAlert('Ukuran file melebihi 10 MB: ' + file.name, 'danger');
                            return;
                        }
                        const ext = file.name.split('.').pop();
                        const path = `${currentUser?.nik || 'guest'}/${data.id}/${f.key}.${ext}`;
                        try {
                            const publicUrl = await uploadToBucket(BUCKETS.VET_PRACTICE_DOCS, path, file);
                            uploads[f.key] = publicUrl;
                        } catch (err) {
                            console.warn('Upload gagal untuk', f.key, err);
                        }
                    }
                }
            }

            const payload = {
                drh_name: data.drhName,
                drh_nik: data.drhNIK,
                strv_number: data.strvNumber,
                strv_issued_at: data.strvIssuedAt,
                strv_valid_until: data.strvValidUntil,
                domicile_address: data.domicileAddress,
                practice_address: data.practiceAddress,
                practice_type: data.practiceType,
                qualification: data.qualification || null,
                facilities: data.facilities || null,
                req_health_cert: data.reqHealthCert,
                req_skck: data.reqSKCK,
                req_diploma: data.reqDiploma,
                req_statement: data.reqStatement,
                doc_health_cert: uploads.doc_health_cert || null,
                doc_skck: uploads.doc_skck || null,
                doc_diploma: uploads.doc_diploma || null,
                doc_statement: uploads.doc_statement || null,
                owner_nik: data.ownerNIK || null,
                owner_name: data.ownerName || null,
                status: 'submitted'
            };

            if (typeof VetPracticeRecommendationService !== 'undefined') {
                await VetPracticeRecommendationService.submit(payload);
            } else {
                const submissions = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
                submissions.push({ ...payload, id: data.id });
                localStorage.setItem('vetPracticeRecommendations', JSON.stringify(submissions));
            }

            showAlert(`Pengajuan rekomendasi praktek dokter hewan berhasil dikirim!<br><strong>Nomor Tiket: ${ticketNumber}</strong><br>Gunakan nomor ini untuk tracking status pengajuan.`, 'success');
            const modal = bootstrap.Modal.getInstance(document.getElementById('vetPracticeRecommendationModal'));
            if (modal) modal.hide();
            form.reset();
        } catch (error) {
            console.error('Submit vet practice recommendation error:', error);
            showAlert('Gagal mengirim pengajuan: ' + (error.message || 'Unknown error'), 'danger');
        }
    })();
}

// Export functions
window.showNewServiceModal = showNewServiceModal;
window.showVaccinationModal = showVaccinationModal;
window.showTelemedicineModal = showTelemedicineModal;
window.showAnimalModal = showAnimalModal;
window.showProfileServiceModal = showProfileServiceModal;
window.showEditProfileModal = showEditProfileModal;
window.showVetPracticeRecommendationModal = showVetPracticeRecommendationModal;
window.showVetControlNumberRecommendationModal = showVetControlNumberRecommendationModal;
window.handleEditProfile = handleEditProfile;
window.editAnimal = editAnimal;
window.deleteAnimal = deleteAnimal;
window.viewService = viewService;
window.getDirections = getDirections;
window.applyControlNumber = applyControlNumber;
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

// =====================================================
// EDIT PROFILE FUNCTIONS
// =====================================================

// Show Edit Profile Modal
function showEditProfileModal() {
    // Load current user data
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Populate form fields
    document.getElementById('editFullName').value = user.fullName || '';
    document.getElementById('editNIK').value = user.nik || '';
    document.getElementById('editEmail').value = user.email || '';
    document.getElementById('editPhone').value = user.phone || '';
    document.getElementById('editAddress').value = user.address || '';
    document.getElementById('editPassword').value = '';
    document.getElementById('editConfirmPassword').value = '';
    
    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('editProfileModal'));
    modal.show();
}

// Save Profile Changes
async function saveProfile() {
    try {
        // Get form data
        const fullName = document.getElementById('editFullName').value.trim();
        const email = document.getElementById('editEmail').value.trim();
        const phone = document.getElementById('editPhone').value.trim();
        const address = document.getElementById('editAddress').value.trim();
        const password = document.getElementById('editPassword').value;
        const confirmPassword = document.getElementById('editConfirmPassword').value;
        
        // Validation
        if (!fullName) {
            showAlert('Nama lengkap harus diisi!', 'error');
            return;
        }
        
        if (password && password !== confirmPassword) {
            showAlert('Konfirmasi password tidak sesuai!', 'error');
            return;
        }
        
        if (password && password.length < 6) {
            showAlert('Password minimal 6 karakter!', 'error');
            return;
        }
        
        // Show loading
        const saveBtn = document.querySelector('#editProfileModal .btn-navy');
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Menyimpan...';
        saveBtn.disabled = true;
        
        // Prepare update data
        const updateData = {
            full_name: fullName,
            email: email || null,
            phone: phone || null,
            address: address || null
        };
        
        // Add password if provided
        if (password) {
            updateData.password = password;
        }
        
        // Try Supabase first
        if (typeof UserService !== 'undefined' && UserService.updateUser) {
            try {
                const result = await UserService.updateUser(currentUser.nik, updateData);
                
                if (result.success) {
                    // Update local storage
                    const updatedUser = {
                        ...currentUser,
                        fullName: fullName,
                        email: email,
                        phone: phone,
                        address: address
                    };
                    
                    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
                    currentUser = updatedUser;
                    
                    // Update display
                    updateUserDisplay();
                    loadProfileInfo();
                    
                    // Close modal
                    const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
                    modal.hide();
                    
                    showAlert('Profil berhasil diperbarui!', 'success');
                    return;
                } else {
                    throw new Error(result.error || 'Gagal memperbarui profil');
                }
            } catch (error) {
                console.warn('Supabase update failed, using localStorage:', error);
            }
        }
        
        // Fallback to localStorage
        const updatedUser = {
            ...currentUser,
            fullName: fullName,
            email: email,
            phone: phone,
            address: address
        };
        
        // Update password if provided
        if (password) {
            updatedUser.password = password;
        }
        
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        currentUser = updatedUser;
        
        // Update display
        updateUserDisplay();
        loadProfileInfo();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editProfileModal'));
        modal.hide();
        
        showAlert('Profil berhasil diperbarui!', 'success');
        
    } catch (error) {
        console.error('Error saving profile:', error);
        showAlert('Gagal memperbarui profil: ' + error.message, 'error');
    } finally {
        // Reset button
        const saveBtn = document.querySelector('#editProfileModal .btn-navy');
        saveBtn.innerHTML = '<i class="fas fa-save me-2"></i>Simpan Perubahan';
        saveBtn.disabled = false;
    }
}

// Update User Display
function updateUserDisplay() {
    const userDisplayName = document.getElementById('userDisplayName');
    if (userDisplayName && currentUser) {
        userDisplayName.textContent = currentUser.fullName || 'Masyarakat';
    }
}

// Load Profile Info
function loadProfileInfo() {
    const profileInfo = document.getElementById('profileInfo');
    if (!profileInfo || !currentUser) return;

    profileInfo.innerHTML = `
        <div class="row g-3">
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">Nama Lengkap</label>
                    <p class="form-control-plaintext">${currentUser.fullName || '-'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">NIK</label>
                    <p class="form-control-plaintext">${currentUser.nik || '-'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">Email</label>
                    <p class="form-control-plaintext">${currentUser.email || '-'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">Nomor Telepon</label>
                    <p class="form-control-plaintext">${currentUser.phone || '-'}</p>
                </div>
            </div>
            <div class="col-12">
                <div class="mb-3">
                    <label class="form-label fw-bold">Alamat</label>
                    <p class="form-control-plaintext">${currentUser.address || '-'}</p>
                </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">Role</label>
                    <p class="form-control-plaintext">
                        <span class="badge bg-primary">${currentUser.role || 'masyarakat'}</span>
                    </p>
            </div>
            </div>
            <div class="col-md-6">
                <div class="mb-3">
                    <label class="form-label fw-bold">Status</label>
                    <p class="form-control-plaintext">
                        <span class="badge bg-success">${currentUser.status || 'active'}</span>
                    </p>
                </div>
            </div>
        </div>
    `;
}

// Update Selected Services
function updateSelectedServices() {
    const selectedServicesContainer = document.getElementById('selectedServices');
    if (!selectedServicesContainer) return;

    // Get selected services (services with status 'selected' or 'active')
    const selectedServices = userServices.filter(service => 
        service.status === 'selected' || service.status === 'active'
    );

    if (selectedServices.length === 0) {
        selectedServicesContainer.innerHTML = `
            <div class="col-12 text-center">
                <div class="alert alert-info">
                    <i class="fas fa-info-circle me-2"></i>
                    Belum ada layanan yang dipilih
                </div>
            </div>
        `;
        return;
    }

    selectedServicesContainer.innerHTML = selectedServices.map(service => `
        <div class="col-lg-4 col-md-6">
            <div class="card service-card">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="service-icon me-3">
                            <i class="fas ${getServiceIcon(service.type)}"></i>
                        </div>
                        <div>
                            <h6 class="mb-1">${service.type}</h6>
                            <small class="text-muted">${service.animalName}</small>
                        </div>
                    </div>
                    <p class="text-muted small mb-3">${service.description || 'Tidak ada deskripsi'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-success">${service.status}</span>
                        <button class="btn btn-sm btn-outline-primary" onclick="viewService('${service.id}')">
                            <i class="fas fa-eye me-1"></i>Detail
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update Available Services
function updateAvailableServices() {
    const availableServicesContainer = document.getElementById('availableServices');
    if (!availableServicesContainer) return;

    // Define available services
    const availableServices = [
        {
            id: 'treatment',
            name: 'Pengobatan Hewan',
            description: 'Layanan pengobatan hewan dengan dokter hewan berpengalaman',
            icon: 'fas fa-stethoscope',
            color: 'primary'
        },
        {
            id: 'vaccination',
            name: 'Vaksinasi Rabies',
            description: 'Program vaksinasi rabies untuk mencegah penularan penyakit',
            icon: 'fas fa-syringe',
            color: 'success'
        },
        {
            id: 'telemedicine',
            name: 'Telemedicine',
            description: 'Konsultasi kesehatan hewan secara online',
            icon: 'fas fa-video',
            color: 'info'
        }
    ];

    availableServicesContainer.innerHTML = availableServices.map(service => `
        <div class="col-lg-4 col-md-6">
            <div class="card service-card">
                <div class="card-body">
                    <div class="d-flex align-items-center mb-3">
                        <div class="service-icon me-3">
                            <i class="${service.icon}"></i>
                        </div>
                        <div>
                            <h6 class="mb-1">${service.name}</h6>
                            <small class="text-muted">Layanan Tersedia</small>
                        </div>
                    </div>
                    <p class="text-muted small mb-3">${service.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="badge bg-${service.color}">Tersedia</span>
                        <button class="btn btn-sm btn-${service.color}" onclick="selectService('${service.id}')">
                            <i class="fas fa-plus me-1"></i>Pilih
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update History Services
function updateHistoryServices() {
    const historyTable = document.getElementById('historyServicesTable');
    if (!historyTable) return;

    // Get completed services
    const historyServices = userServices.filter(service => 
        service.status === 'completed' || service.status === 'cancelled'
    );

    if (historyServices.length === 0) {
        historyTable.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-history me-2"></i>
                    Belum ada riwayat layanan
                </td>
            </tr>
        `;
        return;
    }

    historyTable.innerHTML = historyServices.map(service => `
        <tr>
            <td>${formatDate(service.date)}</td>
            <td>${service.animalName}</td>
            <td>${service.type}</td>
            <td>
                <span class="badge bg-${service.status === 'completed' ? 'success' : 'danger'}">
                    ${service.status === 'completed' ? 'Selesai' : 'Dibatalkan'}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewService('${service.id}')">
                    <i class="fas fa-eye me-1"></i>Detail
                </button>
            </td>
        </tr>
    `).join('');
}

// Select Service
function selectService(serviceType) {
    // Show appropriate modal based on service type
    switch(serviceType) {
        case 'treatment':
            showNewServiceModal();
            break;
        case 'vaccination':
            showVaccinationModal();
            break;
        case 'telemedicine':
            showTelemedicineModal();
            break;
        default:
            showAlert('Layanan tidak tersedia', 'error');
    }
}

// Get Service Icon
function getServiceIcon(serviceType) {
    switch(serviceType) {
        case 'Pengobatan':
        case 'treatment':
            return 'fas fa-stethoscope';
        case 'Vaksinasi':
        case 'vaccination':
            return 'fas fa-syringe';
        case 'Telemedicine':
        case 'telemedicine':
            return 'fas fa-video';
        default:
            return 'fas fa-paw';
    }
}

// Submission Menu Functions
function showSubmissionModal(serviceType) {
    const modal = new bootstrap.Modal(document.getElementById('submissionModal'));
    
    // Pre-fill service type if provided
    if (serviceType) {
        document.getElementById('serviceType').value = serviceType;
    }
    
    // Clear form
    document.getElementById('submissionForm').reset();
    
    // Set default date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    document.getElementById('preferredDate').value = tomorrow.toISOString().split('T')[0];
    
    modal.show();
}

function submitServiceRequest() {
    // Get form data
    const serviceType = document.getElementById('serviceType').value;
    const veterinarian = document.getElementById('veterinarian').value;
    const animalName = document.getElementById('animalName').value;
    const animalType = document.getElementById('animalType').value;
    const symptoms = document.getElementById('symptoms').value;
    const priority = document.getElementById('priority').value;
    const preferredDate = document.getElementById('preferredDate').value;
    const notes = document.getElementById('notes').value;
    
    // Get file inputs
    const ktpFile = document.getElementById('ktpFile').files[0];
    const kkFile = document.getElementById('kkFile').files[0];
    const animalCertFile = document.getElementById('animalCertFile').files[0];
    const animalPhotoFile = document.getElementById('animalPhotoFile').files[0];
    
    // Validate required fields
    if (!serviceType || !veterinarian || !animalName || !animalType || !symptoms) {
        showAlert('Mohon lengkapi semua field yang wajib diisi!', 'warning');
        return;
    }
    
    if (!ktpFile || !kkFile) {
        showAlert('Mohon upload KTP dan Kartu Keluarga!', 'warning');
        return;
    }
    
    // Create service request
    const serviceRequest = {
        id: generateId(),
        serviceType: serviceType,
        veterinarian: veterinarian,
        animalName: animalName,
        animalType: animalType,
        symptoms: symptoms,
        priority: priority,
        preferredDate: preferredDate,
        notes: notes,
        status: 'pending',
        ownerName: currentUser.name,
        ownerNIK: currentUser.nik,
        createdAt: new Date().toISOString(),
        ticketNumber: generateTicketNumber(),
        // File information (simulated)
        documents: {
            ktp: ktpFile ? ktpFile.name : null,
            kk: kkFile ? kkFile.name : null,
            animalCert: animalCertFile ? animalCertFile.name : null,
            animalPhoto: animalPhotoFile ? animalPhotoFile.name : null
        }
    };
    
    // Add to user services
    userServices.push(serviceRequest);
    localStorage.setItem('userServices', JSON.stringify(userServices));
    
    // Show success message
    showAlert('Permohonan layanan berhasil diajukan! Nomor tiket: ' + serviceRequest.ticketNumber, 'success');
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('submissionModal'));
    modal.hide();
    
    // Update dashboard
    updateDashboard();
    updateSubmissionStatusTable();
}

function updateSubmissionStatusTable() {
    const tbody = document.getElementById('submissionStatusTable');
    if (!tbody) return;
    
    // Get recent submissions (last 5)
    const recentServices = userServices
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5);
    
    if (recentServices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-inbox me-2"></i>Belum ada submission
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = recentServices.map(service => `
            <tr>
                <td>${formatDate(service.createdAt)}</td>
                <td>
                    <span class="badge bg-${getServiceTypeColor(service.serviceType)}">
                        ${getServiceTypeLabel(service.serviceType)}
                    </span>
                </td>
                <td>${service.animalName}</td>
                <td>
                    <span class="badge bg-${getStatusColor(service.status)}">
                        ${getStatusLabel(service.status)}
                    </span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewSubmissionDetail('${service.id}')" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
}

function viewSubmissionDetail(serviceId) {
    const service = userServices.find(s => s.id === serviceId);
    if (service) {
        alert(`Detail Submission:\n\nNomor Tiket: ${service.ticketNumber}\nJenis Layanan: ${getServiceTypeLabel(service.serviceType)}\nHewan: ${service.animalName}\nDokter Hewan: ${service.veterinarian}\nStatus: ${getStatusLabel(service.status)}\nTanggal: ${formatDate(service.createdAt)}`);
    }
}

// Helper functions for submission
function generateTicketNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK${year}${month}${day}${random}`;
}

function getServiceTypeLabel(type) {
    const labels = {
        'pengobatan': 'Pengobatan Hewan',
        'vaksinasi': 'Vaksinasi Rabies',
        'telemedicine': 'Telemedicine'
    };
    return labels[type] || type;
}

function getServiceTypeColor(type) {
    const colors = {
        'pengobatan': 'primary',
        'vaksinasi': 'warning',
        'telemedicine': 'info'
    };
    return colors[type] || 'secondary';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'in_progress': 'Diproses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan'
    };
    return labels[status] || status;
}

function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'in_progress': 'info',
        'completed': 'success',
        'cancelled': 'danger'
    };
    return colors[status] || 'secondary';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Export functions
window.showSubmissionModal = showSubmissionModal;
window.submitServiceRequest = submitServiceRequest;
window.viewSubmissionDetail = viewSubmissionDetail;