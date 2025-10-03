// Petugas Panel JavaScript - Submission Handling

// Global variables
let animalTreatmentRequests = [];
let rabiesVaccinationRequests = [];
let telemedicineRequests = [];
let currentSubmissionId = null;

// Initialize Petugas Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadSubmissionData();
    setupEventListeners();
});

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username || currentUser.role !== 'petugas') {
        window.location.href = 'index.html';
    }
}

// Load submission data from localStorage
function loadSubmissionData() {
    animalTreatmentRequests = JSON.parse(localStorage.getItem('animalTreatmentRequests') || '[]');
    rabiesVaccinationRequests = JSON.parse(localStorage.getItem('rabiesVaccinationRequests') || '[]');
    telemedicineRequests = JSON.parse(localStorage.getItem('telemedicineRequests') || '[]');
    
    // Load data into tables
    loadTreatmentTable();
    loadVaccinationTable();
    loadTelemedicineTable();
}

// Setup event listeners
function setupEventListeners() {
    // Treatment filters
    const treatmentStatusFilter = document.getElementById('treatmentStatusFilter');
    const treatmentPriorityFilter = document.getElementById('treatmentPriorityFilter');
    const treatmentSearch = document.getElementById('treatmentSearch');
    
    if (treatmentStatusFilter) {
        treatmentStatusFilter.addEventListener('change', filterTreatmentRequests);
    }
    if (treatmentPriorityFilter) {
        treatmentPriorityFilter.addEventListener('change', filterTreatmentRequests);
    }
    if (treatmentSearch) {
        treatmentSearch.addEventListener('input', filterTreatmentRequests);
    }
    
    // Vaccination filters
    const vaccinationStatusFilter = document.getElementById('vaccinationStatusFilter');
    const vaccinationDateFilter = document.getElementById('vaccinationDateFilter');
    const vaccinationSearch = document.getElementById('vaccinationSearch');
    
    if (vaccinationStatusFilter) {
        vaccinationStatusFilter.addEventListener('change', filterVaccinationRequests);
    }
    if (vaccinationDateFilter) {
        vaccinationDateFilter.addEventListener('change', filterVaccinationRequests);
    }
    if (vaccinationSearch) {
        vaccinationSearch.addEventListener('input', filterVaccinationRequests);
    }
    
    // Telemedicine filters
    const telemedicineStatusFilter = document.getElementById('telemedicineStatusFilter');
    const telemedicinePlatformFilter = document.getElementById('telemedicinePlatformFilter');
    const telemedicineSearch = document.getElementById('telemedicineSearch');
    
    if (telemedicineStatusFilter) {
        telemedicineStatusFilter.addEventListener('change', filterTelemedicineRequests);
    }
    if (telemedicinePlatformFilter) {
        telemedicinePlatformFilter.addEventListener('change', filterTelemedicineRequests);
    }
    if (telemedicineSearch) {
        telemedicineSearch.addEventListener('input', filterTelemedicineRequests);
    }
}

// Load treatment table
function loadTreatmentTable() {
    const tableBody = document.getElementById('treatmentTable');
    if (!tableBody) return;
    
    let html = '';
    animalTreatmentRequests.forEach(request => {
        const statusColor = getStatusColor(request.status);
        const priorityColor = getPriorityColor(request.priority);
        
        html += `
            <tr>
                <td>${request.ticketNumber || '-'}</td>
                <td>${formatDate(request.createdAt)}</td>
                <td>${request.owner?.name || '-'}</td>
                <td>${request.animal?.name || '-'} (${request.animal?.type || '-'})</td>
                <td><span class="badge bg-${priorityColor}">${getPriorityLabel(request.priority)}</span></td>
                <td><span class="badge bg-${statusColor}">${getStatusLabel(request.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="handleTreatment('${request.id}')">
                        <i class="fas fa-stethoscope"></i> Tangani
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Load vaccination table
function loadVaccinationTable() {
    const tableBody = document.getElementById('vaccinationTable');
    if (!tableBody) return;
    
    let html = '';
    rabiesVaccinationRequests.forEach(request => {
        const statusColor = getStatusColor(request.status);
        
        html += `
            <tr>
                <td>${request.ticketNumber || '-'}</td>
                <td>${formatDate(request.createdAt)}</td>
                <td>${request.owner?.name || '-'}</td>
                <td>${request.animal?.name || '-'} (${request.animal?.type || '-'})</td>
                <td>${request.schedule?.preferredSchedule ? formatDate(request.schedule.preferredSchedule) : '-'}</td>
                <td><span class="badge bg-${statusColor}">${getStatusLabel(request.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-warning" onclick="handleVaccination('${request.id}')">
                        <i class="fas fa-syringe"></i> Tangani
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}

// Load telemedicine table
function loadTelemedicineTable() {
    const tableBody = document.getElementById('telemedicineTable');
    if (!tableBody) return;
    
    let html = '';
    telemedicineRequests.forEach(request => {
        const statusColor = getStatusColor(request.status);
        
        html += `
            <tr>
                <td>${request.ticketNumber || '-'}</td>
                <td>${formatDate(request.createdAt)}</td>
                <td>${request.owner?.name || '-'}</td>
                <td>${request.animal?.name || '-'} (${request.animal?.type || '-'})</td>
                <td>${request.platform?.platform || '-'}</td>
                <td>${request.platform?.preferredSchedule ? formatDate(request.platform.preferredSchedule) : '-'}</td>
                <td><span class="badge bg-${statusColor}">${getStatusLabel(request.status)}</span></td>
                <td>
                    <button class="btn btn-sm btn-outline-info" onclick="handleTelemedicine('${request.id}')">
                        <i class="fas fa-video"></i> Tangani
                    </button>
                </td>
            </tr>
        `;
    });
    
    tableBody.innerHTML = html;
}