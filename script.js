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
