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
    
    // Combine all service requests
    serviceRequests = [
        ...userServices.map(service => ({
            id: service.id,
            ticketNumber: service.ticketNumber || 'N/A',
            date: service.createdAt,
            requester: service.ownerName || 'N/A',
            serviceType: service.serviceType,
            animal: service.animalName || 'N/A',
            priority: service.priority || 'normal',
            status: service.status || 'pending',
            type: 'service'
        })),
        ...vetPracticeRecommendations.map(rec => ({
            id: rec.id,
            ticketNumber: rec.ticketNumber || 'N/A',
            date: rec.createdAt,
            requester: rec.ownerName || 'N/A',
            serviceType: 'rekomendasi_praktek',
            animal: 'N/A',
            priority: 'normal',
            status: rec.status || 'submitted',
            type: 'recommendation'
        }))
    ];
    
    // Sort by date (newest first)
    serviceRequests.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    updateServiceRequestsTable();
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
                <td colspan="9" class="text-center text-muted">
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
                <td>${request.requester}</td>
                <td>
                    <span class="badge bg-navy">${getServiceTypeLabel(request.serviceType)}</span>
                </td>
                <td>${request.animal}</td>
                <td>
                    <span class="badge bg-${getPriorityColor(request.priority)}">${getPriorityLabel(request.priority)}</span>
                </td>
                <td>
                    <span class="badge bg-${getStatusColor(request.status)}">${getStatusLabel(request.status)}</span>
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
        alert(`Detail Permohonan:\n\nID: ${request.id}\nTanggal: ${formatDate(request.date)}\nPemohon: ${request.requester}\nJenis: ${getServiceTypeLabel(request.serviceType)}\nHewan: ${request.animal}\nPrioritas: ${getPriorityLabel(request.priority)}\nStatus: ${getStatusLabel(request.status)}`);
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

// Export functions
window.viewServiceRequest = viewServiceRequest;
window.updateServiceStatus = updateServiceStatus;
window.changePage = changePage;
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
