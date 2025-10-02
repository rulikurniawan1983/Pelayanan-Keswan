-- Create Database Tables for Pelayanan Keswan
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

-- Create service_medicines table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS service_medicines (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    medicine_id UUID REFERENCES medicines(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_nik VARCHAR(16) NOT NULL REFERENCES users(nik) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_nik VARCHAR(16) REFERENCES users(nik) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100) NOT NULL,
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_nik ON users(nik);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_animals_owner_nik ON animals(owner_nik);
CREATE INDEX IF NOT EXISTS idx_animals_type ON animals(type);
CREATE INDEX IF NOT EXISTS idx_services_owner_nik ON services(owner_nik);
CREATE INDEX IF NOT EXISTS idx_services_status ON services(status);
CREATE INDEX IF NOT EXISTS idx_services_service_type ON services(service_type);
CREATE INDEX IF NOT EXISTS idx_services_service_date ON services(service_date);
CREATE INDEX IF NOT EXISTS idx_medicines_status ON medicines(status);
CREATE INDEX IF NOT EXISTS idx_medicines_type ON medicines(type);
CREATE INDEX IF NOT EXISTS idx_vaccinations_owner_nik ON vaccinations(owner_nik);
CREATE INDEX IF NOT EXISTS idx_vaccinations_vaccination_date ON vaccinations(vaccination_date);
CREATE INDEX IF NOT EXISTS idx_telemedicine_owner_nik ON telemedicine_sessions(owner_nik);
CREATE INDEX IF NOT EXISTS idx_telemedicine_status ON telemedicine_sessions(status);
CREATE INDEX IF NOT EXISTS idx_service_medicines_service_id ON service_medicines(service_id);
CREATE INDEX IF NOT EXISTS idx_service_medicines_medicine_id ON service_medicines(medicine_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_nik ON notifications(user_nik);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_nik ON audit_logs(user_nik);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);

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

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (user_nik, action, table_name, record_id, new_values)
        VALUES (NEW.owner_nik, 'INSERT', TG_TABLE_NAME, NEW.id, row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (user_nik, action, table_name, record_id, old_values, new_values)
        VALUES (NEW.owner_nik, 'UPDATE', TG_TABLE_NAME, NEW.id, row_to_json(OLD), row_to_json(NEW));
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (user_nik, action, table_name, record_id, old_values)
        VALUES (OLD.owner_nik, 'DELETE', TG_TABLE_NAME, OLD.id, row_to_json(OLD));
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

-- Create audit triggers
CREATE TRIGGER audit_animals_trigger AFTER INSERT OR UPDATE OR DELETE ON animals FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_services_trigger AFTER INSERT OR UPDATE OR DELETE ON services FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_medicines_trigger AFTER INSERT OR UPDATE OR DELETE ON medicines FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_vaccinations_trigger AFTER INSERT OR UPDATE OR DELETE ON vaccinations FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER audit_telemedicine_trigger AFTER INSERT OR UPDATE OR DELETE ON telemedicine_sessions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

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
('Vaksin Rabies', 'Vaksin', 20, 'vial', 50000, 'Vaksin untuk mencegah rabies'),
('Penisilin', 'Antibiotik', 80, 'vial', 35000, 'Antibiotik untuk infeksi berat'),
('Dexamethasone', 'Steroid', 60, 'vial', 25000, 'Anti-inflamasi dan anti-alergi'),
('Ketamine', 'Anestesi', 25, 'vial', 75000, 'Anestesi untuk operasi'),
('Lidocaine', 'Anestesi Lokal', 40, 'vial', 20000, 'Anestesi lokal'),
('Metronidazole', 'Antibiotik', 90, 'tablet', 4000, 'Antibiotik untuk infeksi anaerob')
ON CONFLICT DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own data" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Animals policies
CREATE POLICY "Users can view own animals" ON animals FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own animals" ON animals FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own animals" ON animals FOR UPDATE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can delete own animals" ON animals FOR DELETE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Services policies
CREATE POLICY "Users can view own services" ON services FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own services" ON services FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own services" ON services FOR UPDATE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Vaccinations policies
CREATE POLICY "Users can view own vaccinations" ON vaccinations FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own vaccinations" ON vaccinations FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own vaccinations" ON vaccinations FOR UPDATE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Telemedicine policies
CREATE POLICY "Users can view own telemedicine" ON telemedicine_sessions FOR SELECT USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can insert own telemedicine" ON telemedicine_sessions FOR INSERT WITH CHECK (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own telemedicine" ON telemedicine_sessions FOR UPDATE USING (owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (user_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (user_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text));

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

CREATE POLICY "Staff can view all vaccinations" ON vaccinations FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all telemedicine" ON telemedicine_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

CREATE POLICY "Staff can view all notifications" ON notifications FOR ALL USING (
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

CREATE POLICY "Admin can manage all vaccinations" ON vaccinations FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Admin can manage all telemedicine" ON telemedicine_sessions FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

CREATE POLICY "Admin can manage all notifications" ON notifications FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Service medicines policies
CREATE POLICY "Users can view own service medicines" ON service_medicines FOR SELECT USING (
    service_id IN (SELECT id FROM services WHERE owner_nik IN (SELECT nik FROM users WHERE id::text = auth.uid()::text))
);

CREATE POLICY "Staff can view all service medicines" ON service_medicines FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role IN ('petugas', 'admin'))
);

-- Audit logs policies (only admin can view)
CREATE POLICY "Admin can view audit logs" ON audit_logs FOR ALL USING (
    EXISTS (SELECT 1 FROM users WHERE id::text = auth.uid()::text AND role = 'admin')
);

-- Create views for better data access
CREATE OR REPLACE VIEW user_stats AS
SELECT 
    u.nik,
    u.full_name,
    u.email,
    u.role,
    u.status,
    COUNT(DISTINCT a.id) as animal_count,
    COUNT(DISTINCT s.id) as service_count,
    COUNT(DISTINCT v.id) as vaccination_count,
    COUNT(DISTINCT t.id) as telemedicine_count,
    u.created_at
FROM users u
LEFT JOIN animals a ON u.nik = a.owner_nik
LEFT JOIN services s ON u.nik = s.owner_nik
LEFT JOIN vaccinations v ON u.nik = v.owner_nik
LEFT JOIN telemedicine_sessions t ON u.nik = t.owner_nik
GROUP BY u.nik, u.full_name, u.email, u.role, u.status, u.created_at;

CREATE OR REPLACE VIEW service_summary AS
SELECT 
    s.id,
    s.animal_name,
    s.animal_type,
    s.service_type,
    s.status,
    s.priority,
    s.service_date,
    s.owner_name,
    s.owner_nik,
    COUNT(sm.id) as medicine_count,
    s.created_at
FROM services s
LEFT JOIN service_medicines sm ON s.id = sm.service_id
GROUP BY s.id, s.animal_name, s.animal_type, s.service_type, s.status, s.priority, s.service_date, s.owner_name, s.owner_nik, s.created_at;

CREATE OR REPLACE VIEW medicine_stock AS
SELECT 
    m.id,
    m.name,
    m.type,
    m.stock,
    m.unit,
    m.price,
    m.status,
    CASE 
        WHEN m.stock = 0 THEN 'out_of_stock'
        WHEN m.stock < 10 THEN 'low_stock'
        ELSE 'in_stock'
    END as stock_status,
    m.created_at
FROM medicines m;

-- Create functions for common operations
CREATE OR REPLACE FUNCTION get_user_animals(user_nik_param VARCHAR(16))
RETURNS TABLE (
    id UUID,
    name VARCHAR(255),
    type VARCHAR(50),
    age VARCHAR(50),
    gender VARCHAR(20),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT a.id, a.name, a.type, a.age, a.gender, a.description, a.created_at
    FROM animals a
    WHERE a.owner_nik = user_nik_param
    ORDER BY a.created_at DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_user_services(user_nik_param VARCHAR(16))
RETURNS TABLE (
    id UUID,
    animal_name VARCHAR(255),
    animal_type VARCHAR(50),
    service_type VARCHAR(50),
    status VARCHAR(20),
    priority VARCHAR(20),
    service_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT s.id, s.animal_name, s.animal_type, s.service_type, s.status, s.priority, s.service_date, s.created_at
    FROM services s
    WHERE s.owner_nik = user_nik_param
    ORDER BY s.service_date DESC;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION get_dashboard_stats()
RETURNS TABLE (
    total_users BIGINT,
    total_animals BIGINT,
    total_services BIGINT,
    total_medicines BIGINT,
    active_services BIGINT,
    pending_services BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM users WHERE status = 'active') as total_users,
        (SELECT COUNT(*) FROM animals) as total_animals,
        (SELECT COUNT(*) FROM services) as total_services,
        (SELECT COUNT(*) FROM medicines) as total_medicines,
        (SELECT COUNT(*) FROM services WHERE status = 'in_progress') as active_services,
        (SELECT COUNT(*) FROM services WHERE status = 'pending') as pending_services;
END;
$$ LANGUAGE plpgsql;

-- Create notification function
CREATE OR REPLACE FUNCTION create_notification(
    user_nik_param VARCHAR(16),
    title_param VARCHAR(255),
    message_param TEXT,
    type_param VARCHAR(50) DEFAULT 'info'
)
RETURNS UUID AS $$
DECLARE
    notification_id UUID;
BEGIN
    INSERT INTO notifications (user_nik, title, message, type)
    VALUES (user_nik_param, title_param, message_param, type_param)
    RETURNING id INTO notification_id;
    
    RETURN notification_id;
END;
$$ LANGUAGE plpgsql;

-- Create service completion function
CREATE OR REPLACE FUNCTION complete_service(service_id_param UUID, notes_param TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE services 
    SET status = 'completed', notes = notes_param, updated_at = NOW()
    WHERE id = service_id_param;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create medicine stock update function
CREATE OR REPLACE FUNCTION update_medicine_stock(medicine_id_param UUID, new_stock INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE medicines 
    SET stock = new_stock, updated_at = NOW()
    WHERE id = medicine_id_param;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Create materialized view for performance
CREATE MATERIALIZED VIEW IF NOT EXISTS monthly_stats AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as total_services,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_services,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_services,
    COUNT(*) FILTER (WHERE service_type = 'pengobatan') as treatment_services,
    COUNT(*) FILTER (WHERE service_type = 'vaksinasi') as vaccination_services,
    COUNT(*) FILTER (WHERE service_type = 'telemedicine') as telemedicine_services
FROM services
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Create index on materialized view
CREATE INDEX IF NOT EXISTS idx_monthly_stats_month ON monthly_stats(month);

-- Create refresh function for materialized view
CREATE OR REPLACE FUNCTION refresh_monthly_stats()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW monthly_stats;
END;
$$ LANGUAGE plpgsql;

-- Create scheduled refresh (requires pg_cron extension)
-- SELECT cron.schedule('refresh-monthly-stats', '0 0 1 * *', 'SELECT refresh_monthly_stats();');

-- Final message
SELECT 'Database tables created successfully!' as message;
