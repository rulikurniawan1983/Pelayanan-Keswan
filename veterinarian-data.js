// Veterinarian Data Management
// This file manages veterinarian data for the selection system

// Sample veterinarian data
const veterinarianData = [
    {
        id: 'vet001',
        name: 'Dr. Sarah Wijaya, M.Vet',
        specialization: 'Umum',
        experience: '8 tahun',
        rating: 4.9,
        availability: 'available',
        schedule: {
            monday: '08:00-17:00',
            tuesday: '08:00-17:00',
            wednesday: '08:00-17:00',
            thursday: '08:00-17:00',
            friday: '08:00-17:00',
            saturday: '08:00-12:00',
            sunday: 'closed'
        },
        services: ['pengobatan', 'vaksinasi', 'telemedicine'],
        phone: '08123456789',
        email: 'dr.sarah@keswan.com'
    },
    {
        id: 'vet002',
        name: 'Dr. Ahmad Rahman, M.Vet',
        specialization: 'Bedah',
        experience: '12 tahun',
        rating: 4.8,
        availability: 'available',
        schedule: {
            monday: '09:00-18:00',
            tuesday: '09:00-18:00',
            wednesday: '09:00-18:00',
            thursday: '09:00-18:00',
            friday: '09:00-18:00',
            saturday: '09:00-13:00',
            sunday: 'closed'
        },
        services: ['pengobatan', 'operasi', 'telemedicine'],
        phone: '08123456790',
        email: 'dr.ahmad@keswan.com'
    },
    {
        id: 'vet003',
        name: 'Dr. Maria Santos, M.Vet',
        specialization: 'Dermatologi',
        experience: '6 tahun',
        rating: 4.7,
        availability: 'available',
        schedule: {
            monday: '10:00-19:00',
            tuesday: '10:00-19:00',
            wednesday: '10:00-19:00',
            thursday: '10:00-19:00',
            friday: '10:00-19:00',
            saturday: '10:00-14:00',
            sunday: 'closed'
        },
        services: ['pengobatan', 'vaksinasi', 'telemedicine'],
        phone: '08123456791',
        email: 'dr.maria@keswan.com'
    },
    {
        id: 'vet004',
        name: 'Dr. Budi Santoso, M.Vet',
        specialization: 'Umum',
        experience: '10 tahun',
        rating: 4.6,
        availability: 'busy',
        schedule: {
            monday: '08:00-16:00',
            tuesday: '08:00-16:00',
            wednesday: '08:00-16:00',
            thursday: '08:00-16:00',
            friday: '08:00-16:00',
            saturday: '08:00-12:00',
            sunday: 'closed'
        },
        services: ['pengobatan', 'vaksinasi', 'telemedicine'],
        phone: '08123456792',
        email: 'dr.budi@keswan.com'
    },
    {
        id: 'vet005',
        name: 'Dr. Lisa Chen, M.Vet',
        specialization: 'Kardiologi',
        experience: '7 tahun',
        rating: 4.9,
        availability: 'available',
        schedule: {
            monday: '09:00-17:00',
            tuesday: '09:00-17:00',
            wednesday: '09:00-17:00',
            thursday: '09:00-17:00',
            friday: '09:00-17:00',
            saturday: '09:00-13:00',
            sunday: 'closed'
        },
        services: ['pengobatan', 'telemedicine'],
        phone: '08123456793',
        email: 'dr.lisa@keswan.com'
    }
];

// Get veterinarians by service type
function getVeterinariansByService(serviceType) {
    return veterinarianData.filter(vet => 
        vet.services.includes(serviceType) && vet.availability === 'available'
    );
}

// Get veterinarian by ID
function getVeterinarianById(id) {
    return veterinarianData.find(vet => vet.id === id);
}

// Get available veterinarians for a specific service and time
function getAvailableVeterinarians(serviceType, dateTime) {
    const date = new Date(dateTime);
    const dayOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    const time = date.toTimeString().slice(0, 5);
    
    return veterinarianData.filter(vet => {
        // Check if vet provides the service
        if (!vet.services.includes(serviceType)) return false;
        
        // Check if vet is available
        if (vet.availability !== 'available') return false;
        
        // Check schedule
        const schedule = vet.schedule[dayOfWeek];
        if (schedule === 'closed') return false;
        
        // Check if time is within working hours
        if (schedule && schedule !== 'closed') {
            const [start, end] = schedule.split('-');
            return time >= start && time <= end;
        }
        
        return false;
    });
}

// Create veterinarian selection HTML
function createVeterinarianSelectionHTML(serviceType, dateTime = null) {
    const veterinarians = dateTime ? 
        getAvailableVeterinarians(serviceType, dateTime) : 
        getVeterinariansByService(serviceType);
    
    if (veterinarians.length === 0) {
        return `
            <div class="alert alert-warning">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Tidak ada dokter hewan yang tersedia untuk layanan ini.
            </div>
        `;
    }
    
    let html = `
        <div class="row g-3">
            <div class="col-12">
                <h6 class="text-navy mb-3">
                    <i class="fas fa-user-md me-2"></i>Pilih Dokter Hewan
                </h6>
            </div>
    `;
    
    veterinarians.forEach(vet => {
        const availabilityBadge = vet.availability === 'available' ? 
            '<span class="badge bg-success">Tersedia</span>' : 
            '<span class="badge bg-warning">Sibuk</span>';
        
        html += `
            <div class="col-md-6">
                <div class="card vet-card h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title mb-0">${vet.name}</h6>
                            ${availabilityBadge}
                        </div>
                        <p class="text-muted mb-2">
                            <i class="fas fa-graduation-cap me-1"></i>${vet.specialization}
                        </p>
                        <p class="text-muted mb-2">
                            <i class="fas fa-clock me-1"></i>${vet.experience} pengalaman
                        </p>
                        <div class="d-flex align-items-center mb-2">
                            <div class="rating me-2">
                                ${'★'.repeat(Math.floor(vet.rating))}${'☆'.repeat(5 - Math.floor(vet.rating))}
                            </div>
                            <span class="text-muted">${vet.rating}</span>
                        </div>
                        <div class="form-check">
                            <input class="form-check-input" type="radio" name="selectedVet" value="${vet.id}" id="vet_${vet.id}">
                            <label class="form-check-label" for="vet_${vet.id}">
                                Pilih Dokter
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    
    return html;
}

// Get selected veterinarian
function getSelectedVeterinarian() {
    const selectedVetRadio = document.querySelector('input[name="selectedVet"]:checked');
    if (selectedVetRadio) {
        return getVeterinarianById(selectedVetRadio.value);
    }
    return null;
}

// Validate veterinarian selection
function validateVeterinarianSelection() {
    const selectedVet = getSelectedVeterinarian();
    if (!selectedVet) {
        showAlert('Silakan pilih dokter hewan terlebih dahulu.', 'warning');
        return false;
    }
    return true;
}

// Export functions
window.getVeterinariansByService = getVeterinariansByService;
window.getVeterinarianById = getVeterinarianById;
window.getAvailableVeterinarians = getAvailableVeterinarians;
window.createVeterinarianSelectionHTML = createVeterinarianSelectionHTML;
window.getSelectedVeterinarian = getSelectedVeterinarian;
window.validateVeterinarianSelection = validateVeterinarianSelection;
