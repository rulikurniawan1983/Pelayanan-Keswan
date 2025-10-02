-- Supabase Database Schema for Pelayanan Keswan
-- Run this SQL in your Supabase SQL Editor

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    nik VARCHAR(16) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'masyarakat' CHECK (role IN ('masyarakat', 'petugas', 'admin')),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create animals table
CREATE TABLE IF NOT EXISTS animals (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    age VARCHAR(50),
    gender VARCHAR(20) CHECK (gender IN ('jantan', 'betina')),
    description TEXT,
    owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    animal_name VARCHAR(255) NOT NULL,
    animal_type VARCHAR(50) NOT NULL,
    service_type VARCHAR(50) NOT NULL CHECK (service_type IN ('pengobatan', 'vaksinasi', 'telemedicine', 'konsultasi', 'pemeriksaan', 'operasi')),
    symptoms TEXT,
    service_date TIMESTAMP WITH TIME ZONE NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('normal', 'urgent', 'emergency')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
    owner_name VARCHAR(255) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create medicines table
CREATE TABLE IF NOT EXISTS medicines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    stock INTEGER DEFAULT 0,
    unit VARCHAR(20) DEFAULT 'pcs',
    price DECIMAL(10,2) DEFAULT 0,
    description TEXT,
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'out_of_stock', 'discontinued')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vaccinations table
CREATE TABLE IF NOT EXISTS vaccinations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    vaccine_type VARCHAR(100) NOT NULL,
    vaccination_date TIMESTAMP WITH TIME ZONE NOT NULL,
    next_vaccination_date TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create telemedicine_sessions table
CREATE TABLE IF NOT EXISTS telemedicine_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    animal_id UUID REFERENCES animals(id) ON DELETE CASCADE,
    session_date TIMESTAMP WITH TIME ZONE NOT NULL,
    symptoms TEXT,
    diagnosis TEXT,
    treatment TEXT,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    owner_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_animals_owner_nik ON animals(owner_nik);
CREATE INDEX IF NOT EXISTS idx_services_owner_nik ON services(owner_nik);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);
CREATE INDEX IF NOT EXISTS idx_vaccinations_owner_nik ON vaccinations(owner_nik);
CREATE INDEX IF NOT EXISTS idx_telemedicine_owner_nik ON telemedicine_sessions(owner_nik);

-- Create vet_practice_recommendations table
CREATE TABLE IF NOT EXISTS vet_practice_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    drh_name VARCHAR(255) NOT NULL,
    drh_nik VARCHAR(16) NOT NULL,
    strv_number VARCHAR(100) NOT NULL,
    strv_issued_at DATE NOT NULL,
    strv_valid_until DATE NOT NULL,
    domicile_address TEXT NOT NULL,
    practice_address TEXT NOT NULL,
    practice_type VARCHAR(50) NOT NULL CHECK (practice_type IN ('mandiri','klinik','rumah_sakit','mobil')),
    qualification VARCHAR(255),
    facilities TEXT,
    req_health_cert BOOLEAN DEFAULT FALSE,
    req_skck BOOLEAN DEFAULT FALSE,
    req_diploma BOOLEAN DEFAULT FALSE,
    req_statement BOOLEAN DEFAULT FALSE,
    doc_health_cert TEXT,
    doc_skck TEXT,
    doc_diploma TEXT,
    doc_statement TEXT,
    owner_nik VARCHAR(16) REFERENCES users(nik) ON DELETE SET NULL,
    owner_name VARCHAR(255),
    status VARCHAR(20) DEFAULT 'submitted' CHECK (status IN ('submitted','under_review','approved','rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vet_practice_owner_nik ON vet_practice_recommendations(owner_nik);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_animals_updated_at BEFORE UPDATE ON animals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_medicines_updated_at BEFORE UPDATE ON medicines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user
INSERT INTO users (nik, full_name, email, phone, address, password, role, status) 
VALUES ('1234567890123456', 'Administrator', 'admin@keswan.com', '08123456789', 'Jl. Admin No. 1', 'admin123', 'admin', 'active')
ON CONFLICT (nik) DO NOTHING;

-- Insert default petugas user
INSERT INTO users (nik, full_name, email, phone, address, password, role, status) 
VALUES ('1234567890123457', 'Petugas Kesehatan', 'petugas@keswan.com', '08123456788', 'Jl. Petugas No. 1', 'petugas123', 'petugas', 'active')
ON CONFLICT (nik) DO NOTHING;

-- Insert sample medicines
INSERT INTO medicines (name, type, stock, unit, price, description) VALUES
('Antibiotik Amoxicillin', 'Antibiotik', 100, 'tablet', 5000, 'Antibiotik untuk infeksi bakteri'),
('Vitamin B Kompleks', 'Vitamin', 50, 'botol', 25000, 'Vitamin untuk meningkatkan nafsu makan'),
('Obat Cacing', 'Anthelmintik', 75, 'tablet', 3000, 'Obat untuk mengatasi cacingan'),
('Salep Antibiotik', 'Salep', 30, 'tube', 15000, 'Salep untuk luka infeksi'),
('Vaksin Rabies', 'Vaksin', 20, 'vial', 50000, 'Vaksin untuk mencegah rabies')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);

-- Animals policies
CREATE POLICY "Users can view own animals" ON animals FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own animals" ON animals FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own animals" ON animals FOR UPDATE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can delete own animals" ON animals FOR DELETE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Services policies
CREATE POLICY "Users can view own services" ON services FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own services" ON services FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Staff and admin can view all data
CREATE POLICY "Staff can view all data" ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all animals" ON animals FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all medicines" ON medicines FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all vet practice recommendations" ON vet_practice_recommendations FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

-- Admin can manage all data
CREATE POLICY "Admin can manage all data" ON users FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Admin can manage all animals" ON animals FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Admin can manage all services" ON services FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Admin can manage all medicines" ON medicines FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Users can view own vet practice recommendations" ON vet_practice_recommendations FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own vet practice recommendations" ON vet_practice_recommendations FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
