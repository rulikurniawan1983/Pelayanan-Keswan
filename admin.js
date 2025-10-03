// Admin Panel JavaScript - Service Requests Control Panel

// Global variables
let allServiceRequests = [];
let filteredServiceRequests = [];
let currentPage = 1;
const itemsPerPage = 10;
let currentServiceId = null;
let selectedServices = [];

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadAllServiceRequests();
    setupEventListeners();
    updateStatistics();
});

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
    }
}

// Setup Event Listeners
function setupEventListeners() {
    // Filter controls
    const statusFilter = document.getElementById('serviceStatusFilter');
    const serviceTypeFilter = document.getElementById('serviceTypeFilter');
    const startDateFilter = document.getElementById('startDateFilter');
    const endDateFilter = document.getElementById('endDateFilter');
    
    [statusFilter, serviceTypeFilter, startDateFilter, endDateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => {
                currentPage = 1;
                filterServiceRequests();
                updateServiceRequestsTable();
            });
        }
    });

    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchServiceRequests();
            }
        });
    }
}

// Load All Service Requests
function loadAllServiceRequests() {
    // Load from localStorage
    const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    const animalTreatmentRequests = JSON.parse(localStorage.getItem('animalTreatmentRequests') || '[]');
    const rabiesVaccinationRequests = JSON.parse(localStorage.getItem('rabiesVaccinationRequests') || '[]');
    const telemedicineRequests = JSON.parse(localStorage.getItem('telemedicineRequests') || '[]');
    const vetPracticeRecommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
    const vetControlRecommendations = JSON.parse(localStorage.getItem('vetControlRecommendations') || '[]');
    
    // Combine all service requests
    allServiceRequests = [
        ...userServices.map(service => ({
            id: service.id,
            ticketNumber: service.ticketNumber || generateTicketNumber(),
            date: service.createdAt,
            requester: service.ownerName || 'Unknown',
            requesterNIK: service.ownerNIK || '',
            serviceType: service.serviceType || 'unknown',
            animal: service.animalName || 'N/A',
            animalType: service.animalType || 'N/A',
            priority: service.priority || 'normal',
            status: service.status || 'pending',
            veterinarian: service.veterinarian || 'Belum Ditugaskan',
            symptoms: service.description || 'N/A',
            notes: service.notes || '',
            source: 'userServices'
        })),
        ...animalTreatmentRequests.map(request => ({
            id: request.id,
            ticketNumber: request.ticketNumber,
            date: request.createdAt,
            requester: request.owner.name,
            requesterNIK: request.owner.nik,
            serviceType: 'animal_treatment',
            animal: request.animal.name,
            animalType: request.animal.type,
            priority: request.priority || 'normal',
            status: request.status || 'pending',
            veterinarian: request.veterinarian || 'Belum Ditugaskan',
            symptoms: request.anamnesis.mainComplaint,
            notes: request.additionalNotes || '',
            source: 'animalTreatmentRequests'
        })),
        ...rabiesVaccinationRequests.map(request => ({
            id: request.id,
            ticketNumber: request.ticketNumber,
            date: request.createdAt,
            requester: request.owner.name,
            requesterNIK: request.owner.nik,
            serviceType: 'rabies_vaccination',
            animal: request.animal.name,
            animalType: request.animal.type,
            priority: 'normal',
            status: request.status || 'pending',
            veterinarian: request.veterinarian || 'Belum Ditugaskan',
            symptoms: request.health.condition,
            notes: request.additionalNotes || '',
            source: 'rabiesVaccinationRequests'
        })),
        ...telemedicineRequests.map(request => ({
            id: request.id,
            ticketNumber: request.ticketNumber,
            date: request.createdAt,
            requester: request.owner.name,
            requesterNIK: request.owner.nik,
            serviceType: 'telemedicine_consultation',
            animal: request.animal.name,
            animalType: request.animal.type,
            priority: 'normal',
            status: request.status || 'pending',
            veterinarian: request.veterinarian || 'Belum Ditugaskan',
            symptoms: request.consultation.mainComplaint,
            notes: request.additionalNotes || '',
            source: 'telemedicineRequests'
        })),
        ...vetPracticeRecommendations.map(request => ({
            id: request.id,
            ticketNumber: request.ticketNumber,
            date: request.createdAt,
            requester: request.owner.name,
            requesterNIK: request.owner.nik,
            serviceType: 'vet_practice_recommendation',
            animal: 'N/A',
            animalType: 'N/A',
            priority: 'normal',
            status: request.status || 'pending',
            veterinarian: request.veterinarian || 'Belum Ditugaskan',
            symptoms: request.purpose,
            notes: request.additionalNotes || '',
            source: 'vetPracticeRecommendations'
        })),
        ...vetControlRecommendations.map(request => ({
            id: request.id,
            ticketNumber: request.ticketNumber,
            date: request.createdAt,
            requester: request.owner.name,
            requesterNIK: request.owner.nik,
            serviceType: 'vet_control_recommendation',
            animal: request.animal.name,
            animalType: request.animal.type,
            priority: 'normal',
            status: request.status || 'pending',
            veterinarian: request.veterinarian || 'Belum Ditugaskan',
            symptoms: request.purpose,
            notes: request.additionalNotes || '',
            source: 'vetControlRecommendations'
        }))
    ];

    // Sort by date (newest first)
    allServiceRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filteredServiceRequests = [...allServiceRequests];
    updateServiceRequestsTable();
}

// Filter Service Requests
function filterServiceRequests() {
    const statusFilter = document.getElementById('serviceStatusFilter').value;
    const serviceTypeFilter = document.getElementById('serviceTypeFilter').value;
    const startDateFilter = document.getElementById('startDateFilter').value;
    const endDateFilter = document.getElementById('endDateFilter').value;
    
    filteredServiceRequests = allServiceRequests.filter(request => {
        // Status filter
        if (statusFilter && request.status !== statusFilter) {
            return false;
        }
        
        // Service type filter
        if (serviceTypeFilter && request.serviceType !== serviceTypeFilter) {
            return false;
        }
        
        // Date filters
        if (startDateFilter) {
            const requestDate = new Date(request.date);
            const startDate = new Date(startDateFilter);
            if (requestDate < startDate) {
                return false;
            }
        }
        
        if (endDateFilter) {
            const requestDate = new Date(request.date);
            const endDate = new Date(endDateFilter);
            if (requestDate > endDate) {
                return false;
            }
        }
        
        return true;
    });
}

// Search Service Requests
function searchServiceRequests() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    if (!searchTerm) {
        filterServiceRequests();
    } else {
        filteredServiceRequests = allServiceRequests.filter(request => {
            return request.ticketNumber.toLowerCase().includes(searchTerm) ||
                   request.requester.toLowerCase().includes(searchTerm) ||
                   request.animal.toLowerCase().includes(searchTerm) ||
                   request.serviceType.toLowerCase().includes(searchTerm);
        });
    }
    
    currentPage = 1;
    updateServiceRequestsTable();
}

// Update Service Requests Table
function updateServiceRequestsTable() {
    const tableBody = document.getElementById('serviceRequestsTable');
    if (!tableBody) return;
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageData = filteredServiceRequests.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    pageData.forEach(request => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>
                <input type="checkbox" class="service-checkbox" value="${request.id}" onchange="toggleServiceSelection('${request.id}')">
            </td>
            <td>${request.id}</td>
            <td>${request.ticketNumber}</td>
            <td>${new Date(request.date).toLocaleDateString('id-ID')}</td>
            <td>${request.requester}</td>
            <td>${getServiceTypeLabel(request.serviceType)}</td>
            <td>${request.animal}</td>
            <td>${getPriorityLabel(request.priority)}</td>
            <td>${getStatusBadge(request.status)}</td>
            <td>${request.veterinarian}</td>
            <td>
                <div class="btn-group" role="group">
                    <button class="btn btn-sm btn-outline-primary" onclick="viewServiceDetail('${request.id}')" title="Lihat Detail">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-outline-warning" onclick="updateServiceStatusModal('${request.id}')" title="Update Status">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    updatePagination();
}

// Update Statistics
function updateStatistics() {
    const totalRequests = allServiceRequests.length;
    const pendingRequests = allServiceRequests.filter(r => r.status === 'pending').length;
    const inProgressRequests = allServiceRequests.filter(r => r.status === 'in_progress').length;
    const completedRequests = allServiceRequests.filter(r => r.status === 'completed').length;
    
    document.getElementById('totalRequests').textContent = totalRequests;
    document.getElementById('pendingRequests').textContent = pendingRequests;
    document.getElementById('inProgressRequests').textContent = inProgressRequests;
    document.getElementById('completedRequests').textContent = completedRequests;
}

// Update Pagination
function updatePagination() {
    const pagination = document.getElementById('serviceRequestsPagination');
    if (!pagination) return;
    
    const totalPages = Math.ceil(filteredServiceRequests.length / itemsPerPage);
    pagination.innerHTML = '';
    
    // Previous button
    const prevLi = document.createElement('li');
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    prevLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>`;
    pagination.appendChild(prevLi);
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        li.innerHTML = `<a class="page-link" href="#" onclick="changePage(${i})">${i}</a>`;
        pagination.appendChild(li);
    }
    
    // Next button
    const nextLi = document.createElement('li');
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    nextLi.innerHTML = `<a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>`;
    pagination.appendChild(nextLi);
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(filteredServiceRequests.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateServiceRequestsTable();
    }
}

// Toggle Select All
function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.service-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        if (selectAll.checked) {
            selectedServices.push(checkbox.value);
        } else {
            selectedServices = selectedServices.filter(id => id !== checkbox.value);
        }
    });
}

// Toggle Service Selection
function toggleServiceSelection(serviceId) {
    if (selectedServices.includes(serviceId)) {
        selectedServices = selectedServices.filter(id => id !== serviceId);
    } else {
        selectedServices.push(serviceId);
    }
    
    // Update select all checkbox
    const selectAll = document.getElementById('selectAll');
    const checkboxes = document.querySelectorAll('.service-checkbox');
    const checkedCount = document.querySelectorAll('.service-checkbox:checked').length;
    
    selectAll.checked = checkedCount === checkboxes.length;
    selectAll.indeterminate = checkedCount > 0 && checkedCount < checkboxes.length;
}

// View Service Detail
function viewServiceDetail(serviceId) {
    const request = allServiceRequests.find(r => r.id === serviceId);
    if (!request) return;
    
    document.getElementById('detailTicketNumber').textContent = request.ticketNumber;
    document.getElementById('detailDate').textContent = new Date(request.date).toLocaleDateString('id-ID');
    document.getElementById('detailRequester').textContent = request.requester;
    document.getElementById('detailRequesterNIK').textContent = request.requesterNIK;
    document.getElementById('detailServiceType').textContent = getServiceTypeLabel(request.serviceType);
    document.getElementById('detailStatus').textContent = getStatusLabel(request.status);
    document.getElementById('detailAnimal').textContent = request.animal;
    document.getElementById('detailAnimalType').textContent = request.animalType;
    document.getElementById('detailPriority').textContent = getPriorityLabel(request.priority);
    document.getElementById('detailVeterinarian').textContent = request.veterinarian;
    document.getElementById('detailSymptoms').textContent = request.symptoms;
    document.getElementById('detailNotes').textContent = request.notes;
    
    const modal = new bootstrap.Modal(document.getElementById('serviceDetailModal'));
    modal.show();
}

// Update Service Status Modal
function updateServiceStatusModal(serviceId) {
    const request = allServiceRequests.find(r => r.id === serviceId);
    if (!request) return;
    
    currentServiceId = serviceId;
    document.getElementById('updateTicketNumber').textContent = request.ticketNumber;
    document.getElementById('currentStatus').textContent = getStatusLabel(request.status);
    document.getElementById('newStatus').value = request.status;
    document.getElementById('assignedVeterinarian').value = request.veterinarian || '';
    document.getElementById('statusUpdateNotes').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('statusUpdateModal'));
    modal.show();
}

// Update Service Status
function updateServiceStatus() {
    const newStatus = document.getElementById('newStatus').value;
    const veterinarian = document.getElementById('assignedVeterinarian').value;
    const notes = document.getElementById('statusUpdateNotes').value;
    
    if (!currentServiceId) return;
    
    // Find and update the request
    const request = allServiceRequests.find(r => r.id === currentServiceId);
    if (request) {
        request.status = newStatus;
        if (veterinarian) {
            request.veterinarian = veterinarian;
        }
        if (notes) {
            request.notes = notes;
        }
        
        // Update in localStorage based on source
        updateRequestInStorage(request);
        
        // Refresh the table
        filterServiceRequests();
        updateServiceRequestsTable();
        updateStatistics();
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('statusUpdateModal'));
        modal.hide();
        
        showAlert('Status berhasil diperbarui!', 'success');
    }
}

// Update Request in Storage
function updateRequestInStorage(request) {
    // Update based on source
    switch (request.source) {
        case 'userServices':
            const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
            const userServiceIndex = userServices.findIndex(s => s.id === request.id);
            if (userServiceIndex !== -1) {
                userServices[userServiceIndex].status = request.status;
                userServices[userServiceIndex].veterinarian = request.veterinarian;
                userServices[userServiceIndex].notes = request.notes;
                localStorage.setItem('userServices', JSON.stringify(userServices));
            }
            break;
        case 'animalTreatmentRequests':
            const animalTreatmentRequests = JSON.parse(localStorage.getItem('animalTreatmentRequests') || '[]');
            const animalIndex = animalTreatmentRequests.findIndex(r => r.id === request.id);
            if (animalIndex !== -1) {
                animalTreatmentRequests[animalIndex].status = request.status;
                animalTreatmentRequests[animalIndex].veterinarian = request.veterinarian;
                animalTreatmentRequests[animalIndex].additionalNotes = request.notes;
                localStorage.setItem('animalTreatmentRequests', JSON.stringify(animalTreatmentRequests));
            }
            break;
        case 'rabiesVaccinationRequests':
            const rabiesVaccinationRequests = JSON.parse(localStorage.getItem('rabiesVaccinationRequests') || '[]');
            const rabiesIndex = rabiesVaccinationRequests.findIndex(r => r.id === request.id);
            if (rabiesIndex !== -1) {
                rabiesVaccinationRequests[rabiesIndex].status = request.status;
                rabiesVaccinationRequests[rabiesIndex].veterinarian = request.veterinarian;
                rabiesVaccinationRequests[rabiesIndex].additionalNotes = request.notes;
                localStorage.setItem('rabiesVaccinationRequests', JSON.stringify(rabiesVaccinationRequests));
            }
            break;
        case 'telemedicineRequests':
            const telemedicineRequests = JSON.parse(localStorage.getItem('telemedicineRequests') || '[]');
            const telemedicineIndex = telemedicineRequests.findIndex(r => r.id === request.id);
            if (telemedicineIndex !== -1) {
                telemedicineRequests[telemedicineIndex].status = request.status;
                telemedicineRequests[telemedicineIndex].veterinarian = request.veterinarian;
                telemedicineRequests[telemedicineIndex].additionalNotes = request.notes;
                localStorage.setItem('telemedicineRequests', JSON.stringify(telemedicineRequests));
            }
            break;
        case 'vetPracticeRecommendations':
            const vetPracticeRecommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
            const practiceIndex = vetPracticeRecommendations.findIndex(r => r.id === request.id);
            if (practiceIndex !== -1) {
                vetPracticeRecommendations[practiceIndex].status = request.status;
                vetPracticeRecommendations[practiceIndex].veterinarian = request.veterinarian;
                vetPracticeRecommendations[practiceIndex].additionalNotes = request.notes;
                localStorage.setItem('vetPracticeRecommendations', JSON.stringify(vetPracticeRecommendations));
            }
            break;
        case 'vetControlRecommendations':
            const vetControlRecommendations = JSON.parse(localStorage.getItem('vetControlRecommendations') || '[]');
            const controlIndex = vetControlRecommendations.findIndex(r => r.id === request.id);
            if (controlIndex !== -1) {
                vetControlRecommendations[controlIndex].status = request.status;
                vetControlRecommendations[controlIndex].veterinarian = request.veterinarian;
                vetControlRecommendations[controlIndex].additionalNotes = request.notes;
                localStorage.setItem('vetControlRecommendations', JSON.stringify(vetControlRecommendations));
            }
            break;
    }
}

// Bulk Actions
function bulkApprove() {
    if (selectedServices.length === 0) {
        showAlert('Pilih layanan yang akan disetujui!', 'warning');
        return;
    }
    
    selectedServices.forEach(serviceId => {
        const request = allServiceRequests.find(r => r.id === serviceId);
        if (request) {
            request.status = 'completed';
            updateRequestInStorage(request);
        }
    });
    
    filterServiceRequests();
    updateServiceRequestsTable();
    updateStatistics();
    selectedServices = [];
    document.getElementById('selectAll').checked = false;
    
    showAlert(`${selectedServices.length} layanan berhasil disetujui!`, 'success');
}

function bulkInProgress() {
    if (selectedServices.length === 0) {
        showAlert('Pilih layanan yang akan diproses!', 'warning');
        return;
    }
    
    selectedServices.forEach(serviceId => {
        const request = allServiceRequests.find(r => r.id === serviceId);
        if (request) {
            request.status = 'in_progress';
            updateRequestInStorage(request);
        }
    });
    
    filterServiceRequests();
    updateServiceRequestsTable();
    updateStatistics();
    selectedServices = [];
    document.getElementById('selectAll').checked = false;
    
    showAlert(`${selectedServices.length} layanan berhasil diproses!`, 'success');
}

function bulkReject() {
    if (selectedServices.length === 0) {
        showAlert('Pilih layanan yang akan ditolak!', 'warning');
        return;
    }
    
    selectedServices.forEach(serviceId => {
        const request = allServiceRequests.find(r => r.id === serviceId);
        if (request) {
            request.status = 'rejected';
            updateRequestInStorage(request);
        }
    });
    
    filterServiceRequests();
    updateServiceRequestsTable();
    updateStatistics();
    selectedServices = [];
    document.getElementById('selectAll').checked = false;
    
    showAlert(`${selectedServices.length} layanan berhasil ditolak!`, 'success');
}

// Helper Functions
function getServiceTypeLabel(type) {
    const labels = {
        'animal_treatment': 'Pengobatan Hewan',
        'rabies_vaccination': 'Vaksinasi Rabies',
        'telemedicine_consultation': 'Konsultasi Telemedicine',
        'vet_practice_recommendation': 'Rekomendasi Praktek Dokter Hewan',
        'vet_control_recommendation': 'Rekomendasi Nomor Kontrol Veteriner',
        'pengobatan': 'Pengobatan',
        'vaksinasi': 'Vaksinasi',
        'konsultasi': 'Konsultasi',
        'telemedicine': 'Telemedicine'
    };
    return labels[type] || type;
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'in_progress': 'Sedang Diproses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan',
        'rejected': 'Ditolak'
    };
    return labels[status] || status;
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge bg-warning">Menunggu</span>',
        'in_progress': '<span class="badge bg-info">Sedang Diproses</span>',
        'completed': '<span class="badge bg-success">Selesai</span>',
        'cancelled': '<span class="badge bg-secondary">Dibatalkan</span>',
        'rejected': '<span class="badge bg-danger">Ditolak</span>'
    };
    return badges[status] || `<span class="badge bg-secondary">${status}</span>`;
}

function getPriorityLabel(priority) {
    const labels = {
        'darurat': 'Darurat',
        'tinggi': 'Tinggi',
        'sedang': 'Sedang',
        'rendah': 'Rendah',
        'normal': 'Normal'
    };
    return labels[priority] || priority;
}

function generateTicketNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK${year}${month}${day}${random}`;
}

function showAlert(message, type) {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
    alertDiv.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        if (alertDiv.parentNode) {
            alertDiv.parentNode.removeChild(alertDiv);
        }
    }, 5000);
}

// Navigation Functions
function goToHomepage() {
    window.location.href = 'index.html';
}

function confirmLogout() {
    const modal = new bootstrap.Modal(document.getElementById('logoutModal'));
    modal.show();
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Export functions for global access
window.changePage = changePage;
window.toggleSelectAll = toggleSelectAll;
window.toggleServiceSelection = toggleServiceSelection;
window.viewServiceDetail = viewServiceDetail;
window.updateServiceStatusModal = updateServiceStatusModal;
window.updateServiceStatus = updateServiceStatus;
window.searchServiceRequests = searchServiceRequests;
window.bulkApprove = bulkApprove;
window.bulkInProgress = bulkInProgress;
window.bulkReject = bulkReject;
window.goToHomepage = goToHomepage;
window.confirmLogout = confirmLogout;
window.logout = logout;