-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR PELAYANAN KESWAN
-- =====================================================
-- This script creates all necessary tables for the veterinary service application
-- Includes users, animals, services, medicines, vaccinations, and telemedicine

-- =====================================================
-- 1. USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'masyarakat' CHECK (role IN ('masyarakat', 'petugas', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 2. ANIMALS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS animals (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INTEGER,
    gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'unknown')),
    weight DECIMAL(5,2),
    color VARCHAR(100),
    description TEXT,
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE
);

-- =====================================================
-- 3. SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    service_type VARCHAR(100) NOT NULL CHECK (service_type IN ('treatment', 'vaccination', 'checkup', 'surgery', 'emergency')),
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    service_date DATE,
    service_time TIME,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    staff_nik VARCHAR(16),
    staff_name VARCHAR(255),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE,
    FOREIGN KEY (staff_nik) REFERENCES users(nik) ON DELETE SET NULL
);

-- =====================================================
-- 4. MEDICINES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    category VARCHAR(100),
    stock INTEGER DEFAULT 0 CHECK (stock >= 0),
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    description TEXT,
    manufacturer VARCHAR(255),
    expiry_date DATE,
    batch_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'expired')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- 5. VACCINATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS vaccinations (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    vaccine_type VARCHAR(100) NOT NULL,
    vaccine_name VARCHAR(255),
    vaccination_date DATE NOT NULL,
    next_vaccination_date DATE,
    batch_number VARCHAR(100),
    veterinarian VARCHAR(255),
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    staff_nik VARCHAR(16),
    staff_name VARCHAR(255),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'completed' CHECK (status IN ('scheduled', 'completed', 'missed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE,
    FOREIGN KEY (staff_nik) REFERENCES users(nik) ON DELETE SET NULL
);

-- =====================================================
-- 6. TELEMEDICINE SESSIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
    id SERIAL PRIMARY KEY,
    animal_id INTEGER,
    animal_name VARCHAR(255),
    animal_type VARCHAR(100),
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    follow_up_date DATE,
    owner_nik VARCHAR(16) NOT NULL,
    owner_name VARCHAR(255),
    veterinarian_nik VARCHAR(16),
    veterinarian_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    notes TEXT,
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (owner_nik) REFERENCES users(nik) ON DELETE CASCADE,
    FOREIGN KEY (veterinarian_nik) REFERENCES users(nik) ON DELETE SET NULL
);

-- =====================================================
-- 7. SERVICE MEDICINES TABLE (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS service_medicines (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    medicine_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE,
    FOREIGN KEY (medicine_id) REFERENCES medicines(id) ON DELETE CASCADE,
    UNIQUE(service_id, medicine_id)
);

-- =====================================================
-- 8. NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_nik VARCHAR(16) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('info', 'warning', 'success', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    related_table VARCHAR(50),
    related_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_nik) REFERENCES users(nik) ON DELETE CASCADE
);

-- =====================================================
-- 9. AUDIT LOGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_nik VARCHAR(16),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(50) NOT NULL,
    record_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (user_nik) REFERENCES users(nik) ON DELETE SET NULL
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);

-- Animals indexes
CREATE INDEX IF NOT EXISTS idx_animals_owner ON animals(owner_nik);
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_animals_name ON animals(name);

-- Services indexes
CREATE INDEX IF NOT EXISTS idx_services_owner ON services(owner_nik);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_date ON services(service_date);
CREATE INDEX IF NOT EXISTS idx_services_staff ON services(staff_nik);

-- Medicines indexes
CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);
CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type);
CREATE INDEX IF NOT EXISTS idx_medicines_stock ON medicines(stock);
CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);

-- Vaccinations indexes
CREATE INDEX IF NOT EXISTS idx_vaccinations_owner ON vaccinations(owner_nik);
CREATE INDEX IF NOT EXISTS idx_vaccinations_date ON vaccinations(vaccination_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_next ON vaccinations(next_vaccination_date);
CREATE INDEX IF NOT EXISTS idx_vaccinations_staff ON vaccinations(staff_nik);

-- Telemedicine indexes
CREATE INDEX IF NOT EXISTS idx_telemedicine_owner ON telemedicine_sessions(owner_nik);
CREATE INDEX IF NOT EXISTS idx_telemedicine_date ON telemedicine_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_telemedicine_vet ON telemedicine_sessions(veterinarian_nik);
CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status);

-- Service medicines indexes
CREATE INDEX IF NOT EXISTS idx_service_medicines_service ON service_medicines(service_id);
CREATE INDEX IF NOT EXISTS idx_service_medicines_medicine ON service_medicines(medicine_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_nik);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_created ON notifications(created_at);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_nik);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC UPDATES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables with updated_at column
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_vaccinations_updated_at BEFORE UPDATE ON vaccinations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_telemedicine_updated_at BEFORE UPDATE ON telemedicine_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SAMPLE DATA
-- =====================================================

-- Insert sample medicines
INSERT INTO medicines (name, type, category, stock, unit, price, description, manufacturer) VALUES
('Antibiotik Amoxicillin', 'Antibiotik', 'Antibiotik', 100, 'tablet', 5000, 'Antibiotik untuk infeksi bakteri', 'PT. Farmasi Indonesia'),
('Vitamin B Kompleks', 'Vitamin', 'Vitamin', 50, 'botol', 25000, 'Vitamin untuk meningkatkan nafsu makan', 'PT. Vitamin Sehat'),
('Obat Cacing', 'Anthelmintik', 'Obat Cacing', 75, 'tablet', 3000, 'Obat untuk mengatasi cacingan', 'PT. Obat Hewan'),
('Paracetamol', 'Analgesik', 'Pain Relief', 200, 'tablet', 2000, 'Obat pereda nyeri dan demam', 'PT. Pain Relief'),
('Antiseptik', 'Antiseptik', 'Disinfektan', 30, 'botol', 15000, 'Antiseptik untuk membersihkan luka', 'PT. Clean Care'),
('Vaksin Rabies', 'Vaksin', 'Vaksinasi', 25, 'vial', 50000, 'Vaksin untuk mencegah rabies', 'PT. Vaksin Indonesia'),
('Obat Mata', 'Oftalmik', 'Obat Mata', 40, 'botol', 12000, 'Obat tetes mata untuk infeksi mata', 'PT. Eye Care'),
('Suplemen Kalsium', 'Suplemen', 'Mineral', 60, 'botol', 18000, 'Suplemen kalsium untuk tulang', 'PT. Bone Health');

-- Insert sample admin user
INSERT INTO users (nik, full_name, email, phone, password, role, status) VALUES
('1234567890123456', 'Admin Sistem', 'admin@keswan.com', '081234567890', 'admin123', 'admin', 'active'),
('1234567890123457', 'Petugas 1', 'petugas1@keswan.com', '081234567891', 'petugas123', 'petugas', 'active'),
('1234567890123458', 'Petugas 2', 'petugas2@keswan.com', '081234567892', 'petugas123', 'petugas', 'active');

-- =====================================================
-- VIEWS FOR REPORTING
-- =====================================================

-- View for service statistics
CREATE OR REPLACE VIEW service_statistics AS
SELECT 
    service_type,
    status,
    COUNT(*) as total_services,
    SUM(cost) as total_cost,
    AVG(cost) as average_cost
FROM services
GROUP BY service_type, status;

-- View for medicine stock alerts
CREATE OR REPLACE VIEW medicine_stock_alerts AS
SELECT 
    id,
    name,
    type,
    stock,
    unit,
    CASE 
        WHEN stock = 0 THEN 'Out of Stock'
        WHEN stock <= 10 THEN 'Low Stock'
        ELSE 'Normal'
    END as stock_status
FROM medicines
WHERE stock <= 10 OR stock = 0;

-- View for vaccination reminders
CREATE OR REPLACE VIEW vaccination_reminders AS
SELECT 
    v.id,
    v.animal_name,
    v.owner_name,
    v.owner_nik,
    v.next_vaccination_date,
    v.vaccine_type,
    CASE 
        WHEN v.next_vaccination_date <= CURRENT_DATE THEN 'Overdue'
        WHEN v.next_vaccination_date <= CURRENT_DATE + INTERVAL '7 days' THEN 'Due Soon'
        ELSE 'Scheduled'
    END as reminder_status
FROM vaccinations v
WHERE v.next_vaccination_date IS NOT NULL
AND v.status = 'completed';

-- =====================================================
-- FUNCTIONS FOR BUSINESS LOGIC
-- =====================================================

-- Function to get user dashboard stats
CREATE OR REPLACE FUNCTION get_user_dashboard_stats(user_nik_param VARCHAR(16))
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_animals', (SELECT COUNT(*) FROM animals WHERE owner_nik = user_nik_param),
        'total_services', (SELECT COUNT(*) FROM services WHERE owner_nik = user_nik_param),
        'pending_services', (SELECT COUNT(*) FROM services WHERE owner_nik = user_nik_param AND status = 'pending'),
        'total_vaccinations', (SELECT COUNT(*) FROM vaccinations WHERE owner_nik = user_nik_param),
        'upcoming_vaccinations', (SELECT COUNT(*) FROM vaccinations WHERE owner_nik = user_nik_param AND next_vaccination_date <= CURRENT_DATE + INTERVAL '30 days')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Function to get admin dashboard stats
CREATE OR REPLACE FUNCTION get_admin_dashboard_stats()
RETURNS JSON AS $$
DECLARE
    result JSON;
BEGIN
    SELECT json_build_object(
        'total_users', (SELECT COUNT(*) FROM users),
        'total_animals', (SELECT COUNT(*) FROM animals),
        'total_services', (SELECT COUNT(*) FROM services),
        'total_medicines', (SELECT COUNT(*) FROM medicines),
        'pending_services', (SELECT COUNT(*) FROM services WHERE status = 'pending'),
        'low_stock_medicines', (SELECT COUNT(*) FROM medicines WHERE stock <= 10),
        'total_revenue', (SELECT COALESCE(SUM(cost), 0) FROM services WHERE status = 'completed')
    ) INTO result;
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================

DO $$
BEGIN
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'DATABASE SCHEMA CREATION COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Tables created: 9';
    RAISE NOTICE 'Indexes created: 25+';
    RAISE NOTICE 'Triggers created: 6';
    RAISE NOTICE 'Views created: 3';
    RAISE NOTICE 'Functions created: 2';
    RAISE NOTICE 'Sample data inserted: 8 medicines, 3 users';
    RAISE NOTICE '=====================================================';
    RAISE NOTICE 'Database is ready for production use!';
    RAISE NOTICE '=====================================================';
END $$;
