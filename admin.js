// Admin Panel JavaScript
let users = [];
let services = [];
let medicines = [];
let telemedicineSessions = [];

// Initialize Admin Panel
document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    loadData();
    setupEventListeners();
    updateDashboard();
    initializeCharts();
});

// Check Authentication
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.username || currentUser.role !== 'admin') {
        window.location.href = 'index.html';
    }
}

// Load Data from LocalStorage
function loadData() {
    users = JSON.parse(localStorage.getItem('users') || '[]');
    services = JSON.parse(localStorage.getItem('services') || '[]');
    medicines = JSON.parse(localStorage.getItem('medicines') || '[]');
    telemedicineSessions = JSON.parse(localStorage.getItem('telemedicineSessions') || '[]');
}

// Setup Event Listeners
function setupEventListeners() {
    // Add any specific event listeners for admin panel
}

// Update Dashboard
function updateDashboard() {
    updateKeyMetrics();
    updateRecentActivity();
    updateAlerts();
    updateUsersTable();
    updateStockTable();
}

// Update Key Metrics
function updateKeyMetrics() {
    document.getElementById('totalUsers').textContent = users.length;
    document.getElementById('totalServices').textContent = services.length;
    document.getElementById('totalVaccinations').textContent = 
        services.filter(s => s.serviceType === 'vaksinasi').length;
    document.getElementById('totalTelemedicine').textContent = telemedicineSessions.length;
}

// Update Recent Activity
function updateRecentActivity() {
    const tbody = document.getElementById('recentActivityTable');
    if (!tbody) return;

    // Get recent services (last 10)
    const recentServices = services
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10);

    if (recentServices.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-calendar-times me-2"></i>Tidak ada aktivitas
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = recentServices.map(service => `
        <tr>
            <td>${formatDate(service.createdAt)}</td>
            <td>
                <span class="badge bg-navy">${service.serviceType}</span>
            </td>
            <td>${service.animalName}</td>
            <td>${service.ownerName || 'N/A'}</td>
            <td>
                <span class="badge bg-${getStatusColor(service.status)}">${service.status}</span>
            </td>
        </tr>
    `).join('');
}

// Update Alerts
function updateAlerts() {
    const container = document.getElementById('alertsContainer');
    if (!container) return;

    const alerts = generateAlerts();
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="text-center text-muted">
                <i class="fas fa-check-circle fa-2x mb-2"></i>
                <p>Tidak ada alert</p>
            </div>
        `;
        return;
    }

    container.innerHTML = alerts.map(alert => `
        <div class="alert alert-${alert.type} alert-dismissible fade show">
            <i class="fas fa-${alert.icon} me-2"></i>
            ${alert.message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `).join('');
}

// Generate Alerts
function generateAlerts() {
    const alerts = [];
    
    // Low stock alert
    const lowStockMedicines = medicines.filter(m => m.stock < 10);
    if (lowStockMedicines.length > 0) {
        alerts.push({
            type: 'warning',
            icon: 'exclamation-triangle',
            message: `${lowStockMedicines.length} obat dengan stok rendah`
        });
    }
    
    // Pending services alert
    const pendingServices = services.filter(s => s.status === 'pending');
    if (pendingServices.length > 0) {
        alerts.push({
            type: 'info',
            icon: 'clock',
            message: `${pendingServices.length} layanan menunggu proses`
        });
    }
    
    // Active telemedicine sessions
    const activeTelemedicine = telemedicineSessions.filter(s => s.status === 'active');
    if (activeTelemedicine.length > 0) {
        alerts.push({
            type: 'success',
            icon: 'video',
            message: `${activeTelemedicine.length} sesi telemedicine aktif`
        });
    }
    
    return alerts;
}

// Update Users Table
function updateUsersTable() {
    const tbody = document.getElementById('usersTable');
    if (!tbody) return;

    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted">
                    <i class="fas fa-users me-2"></i>Tidak ada pengguna
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.nik}</td>
            <td>${user.fullName}</td>
            <td>${user.email}</td>
            <td>
                <span class="badge bg-${user.status === 'active' ? 'success' : 'secondary'}">${user.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="viewUser('${user.nik}')">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-${user.status === 'active' ? 'warning' : 'success'}" 
                        onclick="toggleUserStatus('${user.nik}')">
                    <i class="fas fa-${user.status === 'active' ? 'ban' : 'check'}"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Update Stock Table
function updateStockTable() {
    const tbody = document.getElementById('stockTable');
    if (!tbody) return;

    if (medicines.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="4" class="text-center text-muted">
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
                <span class="badge bg-${medicine.stock < 10 ? 'danger' : medicine.stock < 20 ? 'warning' : 'success'}">
                    ${medicine.stock}
                </span>
            </td>
            <td>
                <span class="badge bg-${getMedicineStatusColor(medicine.status)}">${medicine.status}</span>
            </td>
            <td>
                <button class="btn btn-sm btn-outline-primary" onclick="editMedicine('${medicine.id}')">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-outline-success" onclick="restockMedicine('${medicine.id}')">
                    <i class="fas fa-plus"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Initialize Charts
function initializeCharts() {
    initializeMonthlyTrendChart();
    initializeServiceDistributionChart();
    initializeMonthlyServicesChart();
    initializeVaccinationTrendChart();
    initializeAnimalTypeChart();
    initializeSatisfactionChart();
}

// Monthly Trend Chart
function initializeMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;

    const last6Months = getLast6Months();
    const monthlyData = last6Months.map(month => {
        return services.filter(service => {
            const serviceDate = new Date(service.createdAt);
            return serviceDate.getMonth() === month.getMonth() && 
                   serviceDate.getFullYear() === month.getFullYear();
        }).length;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last6Months.map(month => month.toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })),
            datasets: [{
                label: 'Total Layanan',
                data: monthlyData,
                borderColor: '#1e3a8a',
                backgroundColor: 'rgba(30, 58, 138, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Service Distribution Chart
function initializeServiceDistributionChart() {
    const ctx = document.getElementById('serviceDistributionChart');
    if (!ctx) return;

    const serviceTypes = ['pengobatan', 'vaksinasi', 'konsultasi', 'telemedicine'];
    const serviceCounts = serviceTypes.map(type => {
        if (type === 'telemedicine') {
            return telemedicineSessions.length;
        }
        return services.filter(s => s.serviceType === type).length;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: serviceTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
            datasets: [{
                data: serviceCounts,
                backgroundColor: [
                    '#1e3a8a',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Monthly Services Chart
function initializeMonthlyServicesChart() {
    const ctx = document.getElementById('monthlyServicesChart');
    if (!ctx) return;

    const last6Months = getLast6Months();
    const monthlyServices = last6Months.map(month => {
        return services.filter(service => {
            const serviceDate = new Date(service.createdAt);
            return serviceDate.getMonth() === month.getMonth() && 
                   serviceDate.getFullYear() === month.getFullYear();
        }).length;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: last6Months.map(month => month.toLocaleDateString('id-ID', { month: 'short' })),
            datasets: [{
                label: 'Layanan',
                data: monthlyServices,
                backgroundColor: '#1e3a8a',
                borderColor: '#1e40af',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Vaccination Trend Chart
function initializeVaccinationTrendChart() {
    const ctx = document.getElementById('vaccinationTrendChart');
    if (!ctx) return;

    const last6Months = getLast6Months();
    const vaccinationData = last6Months.map(month => {
        return services.filter(service => {
            const serviceDate = new Date(service.createdAt);
            return service.serviceType === 'vaksinasi' &&
                   serviceDate.getMonth() === month.getMonth() && 
                   serviceDate.getFullYear() === month.getFullYear();
        }).length;
    });

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: last6Months.map(month => month.toLocaleDateString('id-ID', { month: 'short' })),
            datasets: [{
                label: 'Vaksinasi',
                data: vaccinationData,
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Animal Type Chart
function initializeAnimalTypeChart() {
    const ctx = document.getElementById('animalTypeChart');
    if (!ctx) return;

    const animalTypes = ['anjing', 'kucing', 'burung', 'kelinci', 'lainnya'];
    const animalCounts = animalTypes.map(type => {
        return services.filter(s => s.animalType === type).length;
    });

    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: animalTypes.map(type => type.charAt(0).toUpperCase() + type.slice(1)),
            datasets: [{
                data: animalCounts,
                backgroundColor: [
                    '#1e3a8a',
                    '#3b82f6',
                    '#60a5fa',
                    '#93c5fd',
                    '#dbeafe'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// Satisfaction Chart
function initializeSatisfactionChart() {
    const ctx = document.getElementById('satisfactionChart');
    if (!ctx) return;

    // Simulate satisfaction data
    const satisfactionData = [4.2, 4.5, 4.3, 4.6, 4.4, 4.7];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun'];

    new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: 'Skor Kepuasan',
                data: satisfactionData,
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    min: 0,
                    max: 5
                }
            }
        }
    });
}

// Report Functions
function generateMonthlyReport() {
    showAlert('Laporan bulanan sedang diproses...', 'info');
    // Simulate report generation
    setTimeout(() => {
        showAlert('Laporan bulanan berhasil diunduh!', 'success');
    }, 2000);
}

function exportToExcel() {
    showAlert('Data sedang diekspor ke Excel...', 'info');
    // Simulate export
    setTimeout(() => {
        showAlert('Data berhasil diekspor ke Excel!', 'success');
    }, 2000);
}

function showDetailedStats() {
    const modal = new bootstrap.Modal(document.getElementById('detailedStatsModal'));
    
    // Update detailed stats
    document.getElementById('avgServiceTime').textContent = '45';
    document.getElementById('completionRate').textContent = '92%';
    document.getElementById('satisfactionScore').textContent = '4.5';
    document.getElementById('revenue').textContent = 'Rp 15.750.000';
    
    modal.show();
}

// User Management
function viewUser(nik) {
    const user = users.find(u => u.nik === nik);
    if (user) {
        alert(`Detail Pengguna:\n\nNIK: ${user.nik}\nNama: ${user.fullName}\nEmail: ${user.email}\nTelepon: ${user.phone}\nAlamat: ${user.address}\nStatus: ${user.status}`);
    }
}

function toggleUserStatus(nik) {
    const userIndex = users.findIndex(u => u.nik === nik);
    if (userIndex !== -1) {
        users[userIndex].status = users[userIndex].status === 'active' ? 'inactive' : 'active';
        localStorage.setItem('users', JSON.stringify(users));
        showAlert(`Status pengguna diubah menjadi ${users[userIndex].status}!`, 'success');
        updateUsersTable();
    }
}

// Medicine Management
function editMedicine(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
        const newStock = prompt(`Edit stock untuk ${medicine.name}:`, medicine.stock);
        if (newStock !== null && !isNaN(newStock) && newStock >= 0) {
            medicine.stock = parseInt(newStock);
            medicine.status = medicine.stock < 10 ? 'low_stock' : 'available';
            localStorage.setItem('medicines', JSON.stringify(medicines));
            showAlert('Stock obat berhasil diupdate!', 'success');
            updateStockTable();
        }
    }
}

function restockMedicine(medicineId) {
    const medicine = medicines.find(m => m.id === medicineId);
    if (medicine) {
        const restockAmount = prompt(`Jumlah restock untuk ${medicine.name}:`, 50);
        if (restockAmount !== null && !isNaN(restockAmount) && restockAmount > 0) {
            medicine.stock += parseInt(restockAmount);
            medicine.status = medicine.stock < 10 ? 'low_stock' : 'available';
            localStorage.setItem('medicines', JSON.stringify(medicines));
            showAlert(`Stock ${medicine.name} berhasil ditambah ${restockAmount} unit!`, 'success');
            updateStockTable();
        }
    }
}

// Utility Functions
function getLast6Months() {
    const months = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        months.push(date);
    }
    return months;
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
window.generateMonthlyReport = generateMonthlyReport;
window.exportToExcel = exportToExcel;
window.showDetailedStats = showDetailedStats;
window.viewUser = viewUser;
window.toggleUserStatus = toggleUserStatus;
window.editMedicine = editMedicine;
window.restockMedicine = restockMedicine;
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
