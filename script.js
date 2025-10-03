// Global Variables
let currentUser = null;
let isLoggedIn = false;

// Initialize App
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    checkAuthStatus();
});

// Initialize Application
function initializeApp() {
    // Add smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Initialize tooltips
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Add animation classes on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.service-card, .contact-card, .stat-item').forEach(el => {
        observer.observe(el);
    });
    
}

// Setup Event Listeners
function setupEventListeners() {
    // Register Form
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Login Form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleUnifiedLogin);
    }

    // NIK Validation
    const nikInput = document.getElementById('nik');
    if (nikInput) {
        nikInput.addEventListener('input', validateNIK);
    }

    // Masyarakat NIK Validation
    const masyarakatNIKInput = document.getElementById('masyarakatNIK');
    if (masyarakatNIKInput) {
        masyarakatNIKInput.addEventListener('input', validateMasyarakatNIK);
    }

    // Password Confirmation
    const confirmPassword = document.getElementById('confirmPassword');
    if (confirmPassword) {
        confirmPassword.addEventListener('input', validatePasswordMatch);
    }

    // User Menu Dropdown
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
        userDropdown.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
        });
    }

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
}

// Check Authentication Status
function checkAuthStatus() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        currentUser = JSON.parse(userData);
        isLoggedIn = true;
        updateUIForLoggedInUser();
        updateUserMenu(currentUser);
    } else {
        updateUserMenu(null);
    }
}

// Update User Menu
function updateUserMenu(user) {
    const loginButton = document.getElementById('loginButton');
    const userMenu = document.getElementById('userMenu');
    const userDisplayName = document.getElementById('userDisplayName');
    const dashboardLink = document.getElementById('dashboardLink');
    
    if (user) {
        // Show user menu, hide login button
        loginButton.style.display = 'none';
        userMenu.style.display = 'block';
        
        // Update user display name
        userDisplayName.textContent = user.fullName || user.username || 'User';
        
        // Update dashboard link based on role
        if (user.role === 'petugas') {
            dashboardLink.href = 'petugas.html';
            dashboardLink.innerHTML = '<i class="fas fa-user-md me-2"></i>Panel Petugas';
        } else if (user.role === 'admin') {
            dashboardLink.href = 'admin.html';
            dashboardLink.innerHTML = '<i class="fas fa-cog me-2"></i>Panel Admin';
        } else if (user.role === 'masyarakat') {
            dashboardLink.href = 'masyarakat.html';
            dashboardLink.innerHTML = '<i class="fas fa-user me-2"></i>Dashboard Masyarakat';
        }
    } else {
        // Show login button, hide user menu
        loginButton.style.display = 'block';
        userMenu.style.display = 'none';
    }
}

// Show Register Modal
function showRegisterModal() {
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

// Show Login Modal
function showLoginModal() {
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

// Toggle Login Fields
function toggleLoginFields() {
    const role = document.getElementById('role').value;
    const staffFields = document.getElementById('staffFields');
    const masyarakatFields = document.getElementById('masyarakatFields');
    const registerLink = document.getElementById('registerLink');
    
    // Hide all fields first
    staffFields.style.display = 'none';
    masyarakatFields.style.display = 'none';
    registerLink.style.display = 'none';
    
    // Show relevant fields based on role
    if (role === 'petugas' || role === 'admin') {
        staffFields.style.display = 'block';
    } else if (role === 'masyarakat') {
        masyarakatFields.style.display = 'block';
        registerLink.style.display = 'block';
    }
}

// Handle Registration
async function handleRegister(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const userData = {
        nik: document.getElementById('nik').value,
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        password: document.getElementById('password').value,
        registeredAt: new Date().toISOString(),
        status: 'active'
    };

    // Validate NIK
    if (!validateNIK()) {
        showAlert('NIK tidak valid. NIK harus 16 digit angka.', 'danger');
        return;
    }

    // Validate Password Match
    if (!validatePasswordMatch()) {
        showAlert('Password dan konfirmasi password tidak cocok.', 'danger');
        return;
    }

    try {
        // Try Supabase registration first
        const result = await UserService.register(userData);
        
        if (result.success) {
            showAlert('Registrasi berhasil! Silakan login untuk mengakses layanan.', 'success');
            
            // Close modal and show login
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            registerModal.hide();
            
            setTimeout(() => {
                showLoginModal();
            }, 1000);
        } else {
            // Fallback to localStorage
            const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
            const existingUser = existingUsers.find(user => user.nik === userData.nik);
            
            if (existingUser) {
                showAlert('NIK sudah terdaftar. Silakan gunakan NIK lain atau login.', 'danger');
                return;
            }

            // Save user data
            existingUsers.push(userData);
            localStorage.setItem('users', JSON.stringify(existingUsers));

            // Show success message
            showAlert('Registrasi berhasil! Silakan login untuk mengakses layanan.', 'success');
            
            // Close modal and show login
            const registerModal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
            registerModal.hide();
            
            setTimeout(() => {
                showLoginModal();
            }, 1000);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('Terjadi kesalahan saat registrasi. Silakan coba lagi.', 'danger');
    }
}

// Handle Unified Login
function handleUnifiedLogin(e) {
    e.preventDefault();
    
    const role = document.getElementById('role').value;
    
    if (role === 'petugas' || role === 'admin') {
        handleStaffLogin();
    } else if (role === 'masyarakat') {
        handleMasyarakatLogin();
    } else {
        showAlert('Pilih role terlebih dahulu.', 'danger');
    }
}

// Update User Menu after Login
function updateUserMenuAfterLogin(user) {
    updateUserMenu(user);
}

// Handle Staff Login (Petugas/Admin)
function handleStaffLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('loginPassword').value;
    const role = document.getElementById('role').value;

    // Default credentials for demo
    const defaultCredentials = {
        petugas: { username: 'petugas', password: 'petugas123' },
        admin: { username: 'admin', password: 'admin123' }
    };

    if (role === 'petugas' && username === defaultCredentials.petugas.username && password === defaultCredentials.petugas.password) {
        currentUser = { username, role, loginTime: new Date().toISOString() };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        isLoggedIn = true;
        
        // Update user menu
        updateUserMenu(currentUser);
        
        showAlert('Login berhasil! Mengarahkan ke panel petugas...', 'success');
        setTimeout(() => {
            window.location.href = 'petugas.html';
        }, 1500);
    } else if (role === 'admin' && username === defaultCredentials.admin.username && password === defaultCredentials.admin.password) {
        currentUser = { username, role, loginTime: new Date().toISOString() };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        isLoggedIn = true;
        
        // Update user menu
        updateUserMenu(currentUser);
        
        showAlert('Login berhasil! Mengarahkan ke panel administrator...', 'success');
        setTimeout(() => {
            window.location.href = 'admin.html';
        }, 1500);
    } else {
        showAlert('Username, password, atau role tidak valid.', 'danger');
    }
}

// Handle Masyarakat Login
async function handleMasyarakatLogin() {
    const nik = document.getElementById('masyarakatNIK').value;
    const password = document.getElementById('masyarakatPassword').value;

    // Validate NIK
    if (!validateMasyarakatNIK()) {
        showAlert('NIK tidak valid. NIK harus 16 digit angka.', 'danger');
        return;
    }

    try {
        // Try Supabase login first
        const result = await UserService.login(nik, password);
        
        if (result.success) {
            // Set current user
            currentUser = {
                id: result.data.id,
                nik: result.data.nik,
                fullName: result.data.full_name,
                email: result.data.email,
                phone: result.data.phone,
                address: result.data.address,
                role: result.data.role,
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            isLoggedIn = true;
            
            // Update user menu
            updateUserMenu(currentUser);
            
            showAlert('Login berhasil! Mengarahkan ke dashboard...', 'success');
            setTimeout(() => {
                window.location.href = 'masyarakat.html';
            }, 1500);
        } else {
            // Fallback to localStorage
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.nik === nik);

            if (!user) {
                showAlert('NIK tidak terdaftar. Silakan daftar terlebih dahulu.', 'danger');
                return;
            }

            if (user.password !== password) {
                showAlert('Password salah.', 'danger');
                return;
            }

            if (user.status !== 'active') {
                showAlert('Akun Anda tidak aktif. Silakan hubungi administrator.', 'danger');
                return;
            }

            // Set current user
            currentUser = {
                nik: user.nik,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: 'masyarakat',
                loginTime: new Date().toISOString()
            };
            
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            isLoggedIn = true;
            
            // Update user menu
            updateUserMenu(currentUser);
            
            showAlert('Login berhasil! Mengarahkan ke dashboard masyarakat...', 'success');
            setTimeout(() => {
                window.location.href = 'masyarakat.html';
            }, 1500);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Terjadi kesalahan saat login. Silakan coba lagi.', 'danger');
    }
}

// Validate NIK
function validateNIK() {
    const nik = document.getElementById('nik').value;
    const nikRegex = /^\d{16}$/;
    
    if (nik && !nikRegex.test(nik)) {
        document.getElementById('nik').classList.add('is-invalid');
        return false;
    } else {
        document.getElementById('nik').classList.remove('is-invalid');
        return true;
    }
}

// Validate Masyarakat NIK
function validateMasyarakatNIK() {
    const nik = document.getElementById('masyarakatNIK').value;
    const nikRegex = /^\d{16}$/;
    
    if (nik && !nikRegex.test(nik)) {
        document.getElementById('masyarakatNIK').classList.add('is-invalid');
        return false;
    } else {
        document.getElementById('masyarakatNIK').classList.remove('is-invalid');
        return true;
    }
}

// Validate Password Match
function validatePasswordMatch() {
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (confirmPassword && password !== confirmPassword) {
        document.getElementById('confirmPassword').classList.add('is-invalid');
        return false;
    } else {
        document.getElementById('confirmPassword').classList.remove('is-invalid');
        return true;
    }
}

// Show Services
function showServices() {
    document.getElementById('services').scrollIntoView({ behavior: 'smooth' });
}

// Update UI for Logged In User
function updateUIForLoggedInUser() {
    if (isLoggedIn && currentUser) {
        const loginButton = document.querySelector('.btn-outline-light');
        if (loginButton) {
            loginButton.innerHTML = `<i class="fas fa-user me-1"></i>${currentUser.username}`;
            loginButton.onclick = function() {
                if (currentUser.role === 'petugas') {
                    window.location.href = 'petugas.html';
                } else if (currentUser.role === 'admin') {
                    window.location.href = 'admin.html';
                }
            };
        }
    }
}

// Show Alert
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
    
    // Update UI
    updateUserMenu(null);
    
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
    if (confirm('Apakah Anda yakin ingin logout?')) {
        logout();
    }
}

// Go to Homepage Function
function goToHomepage() {
    window.location.href = 'index.html';
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show Registration Prompt
function showRegistrationPrompt() {
    // Check if user is already logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (currentUser && currentUser.nik) {
        // User is logged in, show alert
        showAlert('Anda sudah terdaftar! Silahkan login untuk mengakses layanan.', 'info');
        return;
    }
    
    // User is not logged in, show registration prompt
    showAlert('Silahkan daftar terlebih dahulu untuk mengakses layanan kami!', 'warning');
    
    // Show registration modal after a short delay
    setTimeout(() => {
        showRegisterModal();
    }, 1500);
}

// Show Recommendation Form
function showRecommendationForm(type) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    if (!currentUser || !currentUser.nik) {
        showAlert('Silahkan login terlebih dahulu untuk mengajukan surat rekomendasi.', 'warning');
        setTimeout(() => {
            showLoginModal();
        }, 1500);
        return;
    }
    
    // Show recommendation form modal
    const modal = new bootstrap.Modal(document.getElementById('recommendationModal'));
    
    // Pre-fill recommendation type
    document.getElementById('recommendationType').value = type;
    
    // Show/hide relevant fields based on type
    toggleRecommendationFields(type);
    
    // Clear form
    document.getElementById('recommendationForm').reset();
    
    // Pre-fill with user data if available
    if (currentUser.fullName) document.getElementById('applicantName').value = currentUser.fullName;
    if (currentUser.nik) document.getElementById('applicantNIK').value = currentUser.nik;
    if (currentUser.phone) document.getElementById('applicantPhone').value = currentUser.phone;
    if (currentUser.email) document.getElementById('applicantEmail').value = currentUser.email;
    if (currentUser.address) document.getElementById('applicantAddress').value = currentUser.address;
    
    modal.show();
}

// Toggle recommendation form fields based on type
function toggleRecommendationFields(type) {
    const vetDataSection = document.getElementById('vetDataSection');
    const vetNameField = document.getElementById('vetNameField');
    const vetNIKField = document.getElementById('vetNIKField');
    const strvNumberField = document.getElementById('strvNumberField');
    const strvValidField = document.getElementById('strvValidField');
    const practiceAddressField = document.getElementById('practiceAddressField');
    const strvFileField = document.getElementById('strvFileField');
    
    const animalDataSection = document.getElementById('animalDataSection');
    const animalNameField = document.getElementById('animalNameField');
    const animalTypeField = document.getElementById('animalTypeField');
    const animalAgeField = document.getElementById('animalAgeField');
    const animalGenderField = document.getElementById('animalGenderField');
    const animalPhotoField = document.getElementById('animalPhotoField');
    
    // Hide all fields first
    [vetDataSection, vetNameField, vetNIKField, strvNumberField, strvValidField, practiceAddressField, strvFileField].forEach(field => {
        if (field) field.style.display = 'none';
    });
    
    [animalDataSection, animalNameField, animalTypeField, animalAgeField, animalGenderField, animalPhotoField].forEach(field => {
        if (field) field.style.display = 'none';
    });
    
    // Show relevant fields based on type
    if (type === 'praktek') {
        [vetDataSection, vetNameField, vetNIKField, strvNumberField, strvValidField, practiceAddressField, strvFileField].forEach(field => {
            if (field) field.style.display = 'block';
        });
    } else if (type === 'kontrol') {
        [animalDataSection, animalNameField, animalTypeField, animalAgeField, animalGenderField, animalPhotoField].forEach(field => {
            if (field) field.style.display = 'block';
        });
    }
}

// Submit Recommendation Form
function submitRecommendationForm() {
    const form = document.getElementById('recommendationForm');
    const formData = new FormData(form);
    
    // Get form values
    const recommendationType = document.getElementById('recommendationType').value;
    const applicantName = document.getElementById('applicantName').value.trim();
    const applicantNIK = document.getElementById('applicantNIK').value.trim();
    const applicantPhone = document.getElementById('applicantPhone').value.trim();
    const applicantEmail = document.getElementById('applicantEmail').value.trim();
    const applicantAddress = document.getElementById('applicantAddress').value.trim();
    const purpose = document.getElementById('purpose').value.trim();
    const notes = document.getElementById('notes').value.trim();
    
    // Validation
    const errors = [];
    if (!recommendationType) errors.push('Jenis rekomendasi wajib dipilih');
    if (!applicantName) errors.push('Nama lengkap wajib diisi');
    if (!applicantNIK) errors.push('NIK wajib diisi');
    if (!applicantPhone) errors.push('No. telepon wajib diisi');
    if (!applicantAddress) errors.push('Alamat lengkap wajib diisi');
    if (!purpose) errors.push('Tujuan pengajuan wajib diisi');
    
    // Type-specific validation
    if (recommendationType === 'praktek') {
        const vetName = document.getElementById('vetName').value.trim();
        const vetNIK = document.getElementById('vetNIK').value.trim();
        const strvNumber = document.getElementById('strvNumber').value.trim();
        const strvValidUntil = document.getElementById('strvValidUntil').value;
        const practiceAddress = document.getElementById('practiceAddress').value.trim();
        
        if (!vetName) errors.push('Nama dokter hewan wajib diisi');
        if (!vetNIK) errors.push('NIK dokter hewan wajib diisi');
        if (!strvNumber) errors.push('Nomor STRV wajib diisi');
        if (!strvValidUntil) errors.push('Tanggal berlaku STRV wajib diisi');
        if (!practiceAddress) errors.push('Alamat tempat praktek wajib diisi');
    } else if (recommendationType === 'kontrol') {
        const animalName = document.getElementById('animalName').value.trim();
        const animalType = document.getElementById('animalType').value;
        const animalAge = document.getElementById('animalAge').value;
        const animalGender = document.getElementById('animalGender').value;
        
        if (!animalName) errors.push('Nama hewan wajib diisi');
        if (!animalType) errors.push('Jenis hewan wajib dipilih');
        if (!animalAge) errors.push('Usia hewan wajib diisi');
        if (!animalGender) errors.push('Jenis kelamin hewan wajib dipilih');
    }
    
    if (errors.length > 0) {
        showAlert('<strong>Validasi Gagal:</strong><br>' + errors.map(e => `- ${e}`).join('<br>'), 'danger');
        return;
    }
    
    // Generate ticket number
    const ticketNumber = generateTicketNumber();
    
    // Prepare submission data
    const submissionData = {
        id: generateId(),
        ticketNumber: ticketNumber,
        type: 'recommendation_letter',
        recommendationType: recommendationType,
        applicantName: applicantName,
        applicantNIK: applicantNIK,
        applicantPhone: applicantPhone,
        applicantEmail: applicantEmail,
        applicantAddress: applicantAddress,
        purpose: purpose,
        notes: notes,
        status: 'submitted',
        createdAt: new Date().toISOString()
    };
    
    // Add type-specific data
    if (recommendationType === 'praktek') {
        submissionData.vetName = document.getElementById('vetName').value.trim();
        submissionData.vetNIK = document.getElementById('vetNIK').value.trim();
        submissionData.strvNumber = document.getElementById('strvNumber').value.trim();
        submissionData.strvValidUntil = document.getElementById('strvValidUntil').value;
        submissionData.practiceAddress = document.getElementById('practiceAddress').value.trim();
    } else if (recommendationType === 'kontrol') {
        submissionData.animalName = document.getElementById('animalName').value.trim();
        submissionData.animalType = document.getElementById('animalType').value;
        submissionData.animalAge = document.getElementById('animalAge').value;
        submissionData.animalGender = document.getElementById('animalGender').value;
    }
    
    // Save to localStorage
    const recommendations = JSON.parse(localStorage.getItem('recommendationLetters') || '[]');
    recommendations.push(submissionData);
    localStorage.setItem('recommendationLetters', JSON.stringify(recommendations));
    
    // Show success message
    showAlert(`
        <div class="text-center">
            <i class="fas fa-check-circle text-success mb-3" style="font-size: 3rem;"></i>
            <h5 class="text-success mb-3">Pengajuan Berhasil!</h5>
            <p class="mb-3">Surat rekomendasi Anda telah berhasil diajukan ke Dinas Perikanan dan Peternakan Kabupaten Bogor.</p>
            <div class="alert alert-info">
                <strong>Nomor Tiket:</strong> ${ticketNumber}<br>
                <strong>Jenis:</strong> ${recommendationType === 'praktek' ? 'Surat Rekomendasi Praktek Dokter Hewan' : 'Surat Rekomendasi Nomor Kontrol Veteriner'}<br>
                <strong>Status:</strong> Menunggu Verifikasi
            </div>
            <p class="text-muted">Gunakan nomor tiket untuk melacak status pengajuan Anda.</p>
        </div>
    `, 'success', 15000);
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('recommendationModal'));
    modal.hide();
    
    // Reset form
    form.reset();
}

// Close Recommendation Modal
function closeRecommendationModal() {
    // Close any open alerts/modals
    const alertContainer = document.querySelector('.alert-container');
    if (alertContainer) {
        alertContainer.remove();
    }
}



// Initialize Statistics Chart (Legacy - keeping for compatibility)
async function initializeStatisticsChart() {
    const ctx = document.getElementById('statisticsChart');
    if (!ctx) return;

    // Get real data from database
    const statisticsData = await getRealStatisticsData();
    
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Total Hewan', 'Pengobatan Hewan', 'Vaksinasi Rabies'],
            datasets: [{
                data: [
                    statisticsData.totalAnimals,
                    statisticsData.treatmentCount,
                    statisticsData.vaccinationCount
                ],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderColor: [
                    'rgba(59, 130, 246, 1)',
                    'rgba(16, 185, 129, 1)',
                    'rgba(245, 158, 11, 1)'
                ],
                borderWidth: 2,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        padding: 20,
                        font: {
                            size: 12,
                            weight: 'bold'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(30, 58, 138, 0.9)',
                    titleColor: 'white',
                    bodyColor: 'white',
                    borderColor: 'rgba(59, 130, 246, 0.5)',
                    borderWidth: 1,
                    cornerRadius: 8,
                    displayColors: false,
                    callbacks: {
                        title: function(context) {
                            return context[0].label;
                        },
                        label: function(context) {
                            const value = context.parsed.y;
                            const label = context.label;
                            if (label === 'Total Hewan') {
                                return `${value.toLocaleString()} hewan terdaftar`;
                            } else if (label === 'Pengobatan Hewan') {
                                return `${value.toLocaleString()} pengobatan dilakukan`;
                            } else if (label === 'Vaksinasi Rabies') {
                                return `${value.toLocaleString()} vaksinasi rabies`;
                            }
                            return value;
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(30, 58, 138, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: '500'
                        },
                        callback: function(value) {
                            if (value >= 1000) {
                                return (value / 1000).toFixed(1) + 'K';
                            }
                            return value;
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        color: '#64748b',
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                }
            },
            animation: {
                duration: 2000,
                easing: 'easeInOutQuart'
            }
        }
    });

    // Add hover effect
    ctx.addEventListener('mousemove', function(event) {
        const points = chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);
        if (points.length > 0) {
            ctx.style.cursor = 'pointer';
        } else {
            ctx.style.cursor = 'default';
        }
    });

    // Store chart instance globally
    window.statisticsChart = chart;
}

// Get Real Statistics Data from Database
async function getRealStatisticsData() {
    try {
        // Check if Supabase is available
        if (typeof supabase === 'undefined') {
            console.log('Supabase not available, using fallback data');
            return getFallbackStatisticsData();
        }

        // Get data from Supabase
        const [animalsResult, treatmentsResult, vaccinationsResult] = await Promise.all([
            supabase.from('animals').select('id', { count: 'exact' }),
            supabase.from('services').select('id', { count: 'exact' }).eq('service_type', 'treatment'),
            supabase.from('services').select('id', { count: 'exact' }).eq('service_type', 'vaccination')
        ]);

        // Handle errors
        if (animalsResult.error) {
            console.error('Error fetching animals:', animalsResult.error);
            return getFallbackStatisticsData();
        }
        if (treatmentsResult.error) {
            console.error('Error fetching treatments:', treatmentsResult.error);
            return getFallbackStatisticsData();
        }
        if (vaccinationsResult.error) {
            console.error('Error fetching vaccinations:', vaccinationsResult.error);
            return getFallbackStatisticsData();
        }

        return {
            totalAnimals: animalsResult.count || 0,
            treatmentCount: treatmentsResult.count || 0,
            vaccinationCount: vaccinationsResult.count || 0
        };

    } catch (error) {
        console.error('Error getting statistics data:', error);
        return getFallbackStatisticsData();
    }
}

// Fallback Statistics Data
function getFallbackStatisticsData() {
    // Get data from localStorage as fallback
    const animals = JSON.parse(localStorage.getItem('animals') || '[]');
    const services = JSON.parse(localStorage.getItem('services') || '[]');
    
    const treatmentCount = services.filter(service => service.serviceType === 'treatment').length;
    const vaccinationCount = services.filter(service => service.serviceType === 'vaccination').length;
    
    return {
        totalAnimals: animals.length,
        treatmentCount: treatmentCount,
        vaccinationCount: vaccinationCount
    };
}

// Refresh Statistics Chart
async function refreshStatisticsChart() {
    try {
        const statisticsData = await getRealStatisticsData();
        
        // Update chart if it exists
        if (window.statisticsChart) {
            window.statisticsChart.data.datasets[0].data = [
                statisticsData.totalAnimals,
                statisticsData.treatmentCount,
                statisticsData.vaccinationCount
            ];
            window.statisticsChart.update();
        }
    } catch (error) {
        console.error('Error refreshing statistics chart:', error);
    }
}

// Store chart instance globally for updates
window.statisticsChart = null;


// Export functions for use in other pages
window.showRegisterModal = showRegisterModal;
window.showLoginModal = showLoginModal;
window.toggleLoginFields = toggleLoginFields;
window.showServices = showServices;
window.logout = logout;
window.confirmLogout = confirmLogout;
window.goToHomepage = goToHomepage;
window.formatDate = formatDate;
window.generateId = generateId;
window.updateUserMenu = updateUserMenu;
window.updateUserMenuAfterLogin = updateUserMenuAfterLogin;
window.showRegistrationPrompt = showRegistrationPrompt;
window.showRecommendationForm = showRecommendationForm;
window.submitRecommendationForm = submitRecommendationForm;
window.closeRecommendationModal = closeRecommendationModal;
window.refreshStatisticsChart = refreshStatisticsChart;
