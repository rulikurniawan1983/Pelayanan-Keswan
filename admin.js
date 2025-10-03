// Admin Panel JavaScript - Service Requests Data

let serviceRequests = [];
let currentPage = 1;
const itemsPerPage = 10;

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadServiceRequests();
    setupEventListeners();
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
    const statusFilter = document.getElementById('statusFilter');
    const serviceTypeFilter = document.getElementById('serviceTypeFilter');
    const startDateFilter = document.getElementById('startDateFilter');
    const endDateFilter = document.getElementById('endDateFilter');
    
    [statusFilter, serviceTypeFilter, startDateFilter, endDateFilter].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', () => {
                currentPage = 1;
                updateServiceRequestsTable();
            });
        }
    });
}

// Load Service Requests Data
function loadServiceRequests() {
    // Load from localStorage
    const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    const vetPracticeRecommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
    
    // Combine all service requests with enhanced data
    serviceRequests = [
        ...userServices.map(service => ({
            id: service.id,
            ticketNumber: service.ticketNumber || generateTicketNumber(),
            date: service.createdAt,
            requester: service.ownerName || 'N/A',
            requesterNIK: service.ownerNIK || 'N/A',
            serviceType: service.serviceType,
            animal: service.animalName || 'N/A',
            animalType: service.animalType || 'N/A',
            symptoms: service.symptoms || 'N/A',
            priority: service.priority || 'normal',
            status: service.status || 'pending',
            notes: service.notes || '',
            type: 'service',
            veterinarian: service.veterinarian || 'Belum ditentukan'
        })),
        ...vetPracticeRecommendations.map(rec => ({
            id: rec.id,
            ticketNumber: rec.ticketNumber || generateTicketNumber(),
            date: rec.createdAt,
            requester: rec.ownerName || 'N/A',
            requesterNIK: rec.ownerNIK || 'N/A',
            serviceType: 'rekomendasi_praktek',
            animal: 'N/A',
            animalType: 'N/A',
            symptoms: 'Rekomendasi Praktek Dokter Hewan',
            priority: 'normal',
            status: rec.status || 'submitted',
            notes: rec.notes || '',
            type: 'recommendation',
            veterinarian: 'N/A'
        }))
    ];
    
    // Sort by date (newest first)
    serviceRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    updateServiceRequestsTable();
    loadRequirementsData();
}

// Generate ticket number
function generateTicketNumber() {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TK${year}${month}${day}${random}`;
}

// Requirements/Documents Data
let requirementsData = [];
let currentRequirementsPage = 1;
const requirementsPerPage = 10;

// Load Requirements Data
function loadRequirementsData() {
    // Load from localStorage - simulate uploaded documents
    const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
    const vetPracticeRecommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
    
    // Generate sample requirements data based on submissions
    requirementsData = [];
    
    // Add requirements for each service submission
    userServices.forEach(service => {
        if (service.ownerName) {
            // Add KTP requirement
            requirementsData.push({
                id: `req_${service.id}_ktp`,
                requesterName: service.ownerName,
                requesterNIK: service.ownerNIK || 'N/A',
                documentType: 'ktp',
                documentTypeLabel: 'KTP',
                fileName: `ktp_${service.ownerName.replace(/\s+/g, '_')}.jpg`,
                uploadDate: service.createdAt,
                verificationStatus: 'pending',
                filePath: `uploads/ktp_${service.id}.jpg`,
                notes: ''
            });
            
            // Add KK requirement
            requirementsData.push({
                id: `req_${service.id}_kk`,
                requesterName: service.ownerName,
                requesterNIK: service.ownerNIK || 'N/A',
                documentType: 'kk',
                documentTypeLabel: 'Kartu Keluarga',
                fileName: `kk_${service.ownerName.replace(/\s+/g, '_')}.jpg`,
                uploadDate: service.createdAt,
                verificationStatus: 'pending',
                filePath: `uploads/kk_${service.id}.jpg`,
                notes: ''
            });
            
            // Add animal certificate if available
            if (service.animalName) {
                requirementsData.push({
                    id: `req_${service.id}_cert`,
                    requesterName: service.ownerName,
                    requesterNIK: service.ownerNIK || 'N/A',
                    documentType: 'sertifikat',
                    documentTypeLabel: 'Sertifikat Hewan',
                    fileName: `sertifikat_${service.animalName.replace(/\s+/g, '_')}.pdf`,
                    uploadDate: service.createdAt,
                    verificationStatus: 'pending',
                    filePath: `uploads/sertifikat_${service.id}.pdf`,
                    notes: ''
                });
            }
        }
    });
    
    // Add requirements for practice recommendations
    vetPracticeRecommendations.forEach(rec => {
        if (rec.ownerName) {
            requirementsData.push({
                id: `req_${rec.id}_ktp`,
                requesterName: rec.ownerName,
                requesterNIK: rec.ownerNIK || 'N/A',
                documentType: 'ktp',
                documentTypeLabel: 'KTP',
                fileName: `ktp_${rec.ownerName.replace(/\s+/g, '_')}.jpg`,
                uploadDate: rec.createdAt,
                verificationStatus: 'pending',
                filePath: `uploads/ktp_${rec.id}.jpg`,
                notes: ''
            });
        }
    });
    
    // Sort by upload date (newest first)
    requirementsData.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    
    updateRequirementsTable();
}

// Update Requirements Table
function updateRequirementsTable() {
    const tbody = document.getElementById('requirementsTable');
    const pagination = document.getElementById('requirementsPagination');
    
    if (!tbody) return;
    
    // Apply filters
    const statusFilter = document.getElementById('verificationStatusFilter')?.value || '';
    const typeFilter = document.getElementById('documentTypeFilter')?.value || '';
    const dateFilter = document.getElementById('uploadDateFilter')?.value || '';
    
    let filteredRequirements = requirementsData.filter(req => {
        const statusMatch = !statusFilter || req.verificationStatus === statusFilter;
        const typeMatch = !typeFilter || req.documentType === typeFilter;
        const dateMatch = !dateFilter || req.uploadDate.startsWith(dateFilter);
        
        return statusMatch && typeMatch && dateMatch;
    });
    
    // Pagination
    const totalPages = Math.ceil(filteredRequirements.length / requirementsPerPage);
    const startIndex = (currentRequirementsPage - 1) * requirementsPerPage;
    const endIndex = startIndex + requirementsPerPage;
    const paginatedRequirements = filteredRequirements.slice(startIndex, endIndex);
    
    // Update table
    if (paginatedRequirements.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="text-center text-muted">
                    <i class="fas fa-inbox me-2"></i>Tidak ada dokumen persyaratan
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = paginatedRequirements.map(req => `
            <tr>
                <td><code>${req.id.substring(0, 8)}</code></td>
                <td>
                    <div>
                        <strong>${req.requesterName}</strong>
                        <br><small class="text-muted">NIK: ${req.requesterNIK}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-info">${req.documentTypeLabel}</span>
                </td>
                <td>
                    <div>
                        <strong>${req.fileName}</strong>
                        <br><small class="text-muted">${req.filePath}</small>
                    </div>
                </td>
                <td>${formatDate(req.uploadDate)}</td>
                <td>
                    <span class="badge bg-${getVerificationStatusColor(req.verificationStatus)}">${getVerificationStatusLabel(req.verificationStatus)}</span>
                </td>
                <td>
                    <button class="btn btn-sm btn-outline-primary" onclick="viewDocument('${req.id}')" title="Lihat Dokumen">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-success" onclick="approveDocument('${req.id}')" title="Setujui">
                            <i class="fas fa-check"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="rejectDocument('${req.id}')" title="Tolak">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Update pagination
    if (pagination) {
        updateRequirementsPagination(totalPages);
    }
}

// Update Requirements Pagination
function updateRequirementsPagination(totalPages) {
    const pagination = document.getElementById('requirementsPagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentRequirementsPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeRequirementsPage(${currentRequirementsPage - 1})">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentRequirementsPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changeRequirementsPage(${i})">${i}</a>
            </li>
        `;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentRequirementsPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changeRequirementsPage(${currentRequirementsPage + 1})">Next</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change Requirements Page
function changeRequirementsPage(page) {
    const totalPages = Math.ceil(requirementsData.length / requirementsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentRequirementsPage = page;
    updateRequirementsTable();
}

// Update Service Requests Table
function updateServiceRequestsTable() {
    const tbody = document.getElementById('serviceRequestsTable');
    const pagination = document.getElementById('serviceRequestsPagination');
    
    if (!tbody) return;
    
    // Apply filters
    let filteredRequests = serviceRequests;
    
    const statusFilter = document.getElementById('statusFilter')?.value;
    const serviceTypeFilter = document.getElementById('serviceTypeFilter')?.value;
    const startDateFilter = document.getElementById('startDateFilter')?.value;
    const endDateFilter = document.getElementById('endDateFilter')?.value;
    
    if (statusFilter) {
        filteredRequests = filteredRequests.filter(req => req.status === statusFilter);
    }
    
    if (serviceTypeFilter) {
        filteredRequests = filteredRequests.filter(req => req.serviceType === serviceTypeFilter);
    }
    
    if (startDateFilter) {
        filteredRequests = filteredRequests.filter(req => new Date(req.date) >= new Date(startDateFilter));
    }
    
    if (endDateFilter) {
        filteredRequests = filteredRequests.filter(req => new Date(req.date) <= new Date(endDateFilter + 'T23:59:59'));
    }
    
    // Pagination
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedRequests = filteredRequests.slice(startIndex, endIndex);
    
    // Update table
    if (paginatedRequests.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center text-muted">
                    <i class="fas fa-inbox me-2"></i>Tidak ada data permohonan
                </td>
            </tr>
        `;
    } else {
        tbody.innerHTML = paginatedRequests.map(request => `
            <tr>
                <td><code>${request.id.substring(0, 8)}</code></td>
                <td><strong>${request.ticketNumber}</strong></td>
                <td>${formatDate(request.date)}</td>
                <td>
                    <div>
                        <strong>${request.requester}</strong>
                        <br><small class="text-muted">NIK: ${request.requesterNIK}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-navy">${getServiceTypeLabel(request.serviceType)}</span>
                </td>
                <td>
                    <div>
                        <strong>${request.animal}</strong>
                        <br><small class="text-muted">${request.animalType}</small>
                    </div>
                </td>
                <td>
                    <span class="badge bg-${getPriorityColor(request.priority)}">${getPriorityLabel(request.priority)}</span>
                </td>
                <td>
                    <span class="badge bg-${getStatusColor(request.status)}">${getStatusLabel(request.status)}</span>
                </td>
                <td>
                    <small class="text-muted">${request.veterinarian}</small>
                </td>
                <td>
                    <div class="btn-group" role="group">
                        <button class="btn btn-sm btn-outline-primary" onclick="viewServiceRequest('${request.id}')" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-success" onclick="updateServiceStatus('${request.id}', 'in_progress')" title="Proses">
                            <i class="fas fa-play"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-warning" onclick="updateServiceStatus('${request.id}', 'completed')" title="Selesai">
                            <i class="fas fa-check"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `).join('');
    }
    
    // Update pagination
    if (pagination) {
        updatePagination(totalPages);
    }
}

// Update Pagination
function updatePagination(totalPages) {
    const pagination = document.getElementById('serviceRequestsPagination');
    if (!pagination) return;
    
    if (totalPages <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">Previous</a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">Next</a>
        </li>
    `;
    
    pagination.innerHTML = paginationHTML;
}

// Change Page
function changePage(page) {
    const totalPages = Math.ceil(serviceRequests.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        updateServiceRequestsTable();
    }
}

// View Service Request Details
function viewServiceRequest(requestId) {
    const request = serviceRequests.find(req => req.id === requestId);
    if (request) {
        const detailModal = document.getElementById('serviceDetailModal');
        if (detailModal) {
            // Populate modal with detailed information
            document.getElementById('detailTicketNumber').textContent = request.ticketNumber;
            document.getElementById('detailDate').textContent = formatDate(request.date);
            document.getElementById('detailRequester').textContent = request.requester;
            document.getElementById('detailRequesterNIK').textContent = request.requesterNIK;
            document.getElementById('detailServiceType').textContent = getServiceTypeLabel(request.serviceType);
            document.getElementById('detailAnimal').textContent = request.animal;
            document.getElementById('detailAnimalType').textContent = request.animalType;
            document.getElementById('detailSymptoms').textContent = request.symptoms;
            document.getElementById('detailPriority').textContent = getPriorityLabel(request.priority);
            document.getElementById('detailStatus').textContent = getStatusLabel(request.status);
            document.getElementById('detailVeterinarian').textContent = request.veterinarian;
            document.getElementById('detailNotes').textContent = request.notes || 'Tidak ada catatan';
            
            // Show modal
            const modal = new bootstrap.Modal(detailModal);
            modal.show();
        } else {
            // Fallback to alert if modal doesn't exist
            alert(`Detail Permohonan:\n\nID: ${request.id}\nNomor Tiket: ${request.ticketNumber}\nTanggal: ${formatDate(request.date)}\nPemohon: ${request.requester}\nNIK: ${request.requesterNIK}\nJenis: ${getServiceTypeLabel(request.serviceType)}\nHewan: ${request.animal} (${request.animalType})\nGejala: ${request.symptoms}\nPrioritas: ${getPriorityLabel(request.priority)}\nStatus: ${getStatusLabel(request.status)}\nDokter Hewan: ${request.veterinarian}\nCatatan: ${request.notes || 'Tidak ada'}`);
        }
    }
}

// Update Service Status
function updateServiceStatus(requestId, newStatus) {
    const request = serviceRequests.find(req => req.id === requestId);
    if (request) {
        request.status = newStatus;
        
        // Update in localStorage
        if (request.type === 'service') {
            const userServices = JSON.parse(localStorage.getItem('userServices') || '[]');
            const serviceIndex = userServices.findIndex(s => s.id === requestId);
            if (serviceIndex !== -1) {
                userServices[serviceIndex].status = newStatus;
                localStorage.setItem('userServices', JSON.stringify(userServices));
            }
        } else if (request.type === 'recommendation') {
            const vetPracticeRecommendations = JSON.parse(localStorage.getItem('vetPracticeRecommendations') || '[]');
            const recIndex = vetPracticeRecommendations.findIndex(r => r.id === requestId);
            if (recIndex !== -1) {
                vetPracticeRecommendations[recIndex].status = newStatus;
                localStorage.setItem('vetPracticeRecommendations', JSON.stringify(vetPracticeRecommendations));
            }
        }
        
        showAlert(`Status permohonan berhasil diubah menjadi ${getStatusLabel(newStatus)}!`, 'success');
        updateServiceRequestsTable();
    }
}

// Utility Functions
function getServiceTypeLabel(type) {
    const labels = {
        'pengobatan': 'Pengobatan',
        'vaksinasi': 'Vaksinasi',
        'konsultasi': 'Konsultasi',
        'telemedicine': 'Telemedicine',
        'rekomendasi_praktek': 'Rekomendasi Praktek',
        'rekomendasi_kontrol': 'Rekomendasi Kontrol'
    };
    return labels[type] || type;
}

function getPriorityLabel(priority) {
    const labels = {
        'normal': 'Normal',
        'urgent': 'Mendesak',
        'emergency': 'Darurat'
    };
    return labels[priority] || priority;
}

function getPriorityColor(priority) {
    const colors = {
        'normal': 'secondary',
        'urgent': 'warning',
        'emergency': 'danger'
    };
    return colors[priority] || 'secondary';
}

function getStatusLabel(status) {
    const labels = {
        'pending': 'Menunggu',
        'in_progress': 'Diproses',
        'completed': 'Selesai',
        'cancelled': 'Dibatalkan',
        'submitted': 'Diajukan'
    };
    return labels[status] || status;
}

function getStatusColor(status) {
    const colors = {
        'pending': 'warning',
        'in_progress': 'info',
        'completed': 'success',
        'cancelled': 'danger',
        'submitted': 'primary'
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

// Document Viewer Functions
let currentDocumentId = null;

// View Document
function viewDocument(documentId) {
    const document = requirementsData.find(doc => doc.id === documentId);
    if (document) {
        currentDocumentId = documentId;
        
        // Populate modal with document information
        document.getElementById('docRequesterName').textContent = document.requesterName;
        document.getElementById('docType').textContent = document.documentTypeLabel;
        document.getElementById('docFileName').textContent = document.fileName;
        document.getElementById('docUploadDate').textContent = formatDate(document.uploadDate);
        
        // Show document preview (simulate)
        const previewArea = document.getElementById('documentPreview');
        previewArea.innerHTML = `
            <div class="text-center">
                <i class="fas fa-file-${getFileIcon(document.fileName)} fa-4x text-primary mb-3"></i>
                <h5>${document.fileName}</h5>
                <p class="text-muted">Jenis: ${document.documentTypeLabel}</p>
                <p class="text-muted">Ukuran: ${getFileSize()}</p>
                <button class="btn btn-primary" onclick="downloadDocument('${documentId}')">
                    <i class="fas fa-download me-2"></i>Download Dokumen
                </button>
            </div>
        `;
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('documentViewerModal'));
        modal.show();
    }
}

// Approve Document
function approveDocument(documentId) {
    const document = requirementsData.find(doc => doc.id === documentId);
    if (document) {
        document.verificationStatus = 'verified';
        document.notes = document.getElementById('verificationNotes')?.value || 'Dokumen disetujui';
        updateRequirementsTable();
        
        // Show success message
        alert('Dokumen berhasil disetujui!');
    }
}

// Reject Document
function rejectDocument(documentId) {
    const document = requirementsData.find(doc => doc.id === documentId);
    if (document) {
        document.verificationStatus = 'rejected';
        document.notes = document.getElementById('verificationNotes')?.value || 'Dokumen ditolak';
        updateRequirementsTable();
        
        // Show rejection message
        alert('Dokumen ditolak!');
    }
}

// Download Document (simulate)
function downloadDocument(documentId) {
    const document = requirementsData.find(doc => doc.id === documentId);
    if (document) {
        // Simulate download
        alert(`Downloading: ${document.fileName}`);
    }
}

// Helper Functions for Documents
function getVerificationStatusColor(status) {
    switch (status) {
        case 'verified': return 'success';
        case 'rejected': return 'danger';
        case 'pending': return 'warning';
        default: return 'secondary';
    }
}

function getVerificationStatusLabel(status) {
    switch (status) {
        case 'verified': return 'Disetujui';
        case 'rejected': return 'Ditolak';
        case 'pending': return 'Menunggu';
        default: return 'Tidak Diketahui';
    }
}

function getFileIcon(fileName) {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
        case 'pdf': return 'file-pdf';
        case 'jpg':
        case 'jpeg':
        case 'png': return 'file-image';
        case 'doc':
        case 'docx': return 'file-word';
        default: return 'file';
    }
}

function getFileSize() {
    // Simulate file size
    const sizes = ['2.5 MB', '1.8 MB', '3.2 MB', '4.1 MB', '1.5 MB'];
    return sizes[Math.floor(Math.random() * sizes.length)];
}

// Export functions
window.viewServiceRequest = viewServiceRequest;
window.updateServiceStatus = updateServiceStatus;
window.changePage = changePage;
window.logout = logout;
window.confirmLogout = confirmLogout;
window.goToHomepage = goToHomepage;
window.viewDocument = viewDocument;
window.approveDocument = approveDocument;
window.rejectDocument = rejectDocument;
window.downloadDocument = downloadDocument;
window.changeRequirementsPage = changeRequirementsPage;

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
    
    // Requirements filter event listeners
    const verificationStatusFilter = document.getElementById('verificationStatusFilter');
    const documentTypeFilter = document.getElementById('documentTypeFilter');
    const uploadDateFilter = document.getElementById('uploadDateFilter');
    
    if (verificationStatusFilter) {
        verificationStatusFilter.addEventListener('change', updateRequirementsTable);
    }
    if (documentTypeFilter) {
        documentTypeFilter.addEventListener('change', updateRequirementsTable);
    }
    if (uploadDateFilter) {
        uploadDateFilter.addEventListener('change', updateRequirementsTable);
    }
});
