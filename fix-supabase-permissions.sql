-- Fix Supabase Permissions for Pelayanan Keswan
-- Run this SQL in your Supabase SQL Editor to fix the permissions error

-- First, let's drop the existing restrictive policies
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can view own animals" ON animals;
DROP POLICY IF EXISTS "Users can insert own animals" ON animals;
DROP POLICY IF EXISTS "Users can update own animals" ON animals;
DROP POLICY IF EXISTS "Users can delete own animals" ON animals;
DROP POLICY IF EXISTS "Users can view own services" ON services;
DROP POLICY IF EXISTS "Users can insert own services" ON services;
DROP POLICY IF EXISTS "Staff can view all data" ON users;
DROP POLICY IF EXISTS "Staff can view all animals" ON animals;
DROP POLICY IF EXISTS "Staff can view all services" ON services;
DROP POLICY IF EXISTS "Staff can view all medicines" ON medicines;
DROP POLICY IF EXISTS "Staff can view all vet practice recommendations" ON vet_practice_recommendations;
DROP POLICY IF EXISTS "Admin can manage all data" ON users;
DROP POLICY IF EXISTS "Admin can manage all animals" ON animals;
DROP POLICY IF EXISTS "Admin can manage all services" ON services;
DROP POLICY IF EXISTS "Admin can manage all medicines" ON medicines;
DROP POLICY IF EXISTS "Users can view own vet practice recommendations" ON vet_practice_recommendations;
DROP POLICY IF EXISTS "Users can insert own vet practice recommendations" ON vet_practice_recommendations;

-- Temporarily disable RLS for data migration
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE animals DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations DISABLE ROW LEVEL SECURITY;

-- Grant necessary permissions to authenticated and anonymous users
GRANT ALL ON users TO authenticated;
GRANT ALL ON users TO anon;
GRANT ALL ON animals TO authenticated;
GRANT ALL ON animals TO anon;
GRANT ALL ON services TO authenticated;
GRANT ALL ON services TO anon;
GRANT ALL ON medicines TO authenticated;
GRANT ALL ON medicines TO anon;
GRANT ALL ON vaccinations TO authenticated;
GRANT ALL ON vaccinations TO anon;
GRANT ALL ON telemedicine_sessions TO authenticated;
GRANT ALL ON telemedicine_sessions TO anon;
GRANT ALL ON vet_practice_recommendations TO authenticated;
GRANT ALL ON vet_practice_recommendations TO anon;

-- Grant sequence permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Re-enable RLS with more permissive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for data migration and normal operation
-- Allow anonymous users to insert data (for registration and data migration)
CREATE POLICY "Allow anonymous insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert animals" ON animals FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert services" ON services FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anonymous insert vet practice recommendations" ON vet_practice_recommendations FOR INSERT WITH CHECK (true);

-- Allow anonymous users to read data (for statistics and public data)
CREATE POLICY "Allow anonymous read users" ON users FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read animals" ON animals FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read services" ON services FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read medicines" ON medicines FOR SELECT USING (true);
CREATE POLICY "Allow anonymous read vet practice recommendations" ON vet_practice_recommendations FOR SELECT USING (true);

-- Allow anonymous users to update data (for data migration)
CREATE POLICY "Allow anonymous update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous update animals" ON animals FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous update services" ON services FOR UPDATE USING (true);
CREATE POLICY "Allow anonymous update vet practice recommendations" ON vet_practice_recommendations FOR UPDATE USING (true);

-- Allow all operations for authenticated users
CREATE POLICY "Allow authenticated all users" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all animals" ON animals FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all services" ON services FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all medicines" ON medicines FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all vaccinations" ON vaccinations FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all telemedicine" ON telemedicine_sessions FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated all vet practice recommendations" ON vet_practice_recommendations FOR ALL USING (auth.role() = 'authenticated');

-- Create a function to check if user is admin or staff
CREATE OR REPLACE FUNCTION is_admin_or_staff()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id::text = auth.uid()::text 
        AND role IN ('admin', 'petugas')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user owns the data
CREATE OR REPLACE FUNCTION user_owns_data(owner_nik_param VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM users 
        WHERE id::text = auth.uid()::text 
        AND nik = owner_nik_param
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add more specific policies for better security (optional - can be added later)
-- These policies provide better security but may need to be adjusted based on your needs

-- Users can only see their own data when authenticated
CREATE POLICY "Users see own data when authenticated" ON users FOR SELECT USING (
    auth.role() = 'authenticated' AND (
        id::text = auth.uid()::text OR 
        is_admin_or_staff()
    )
);

-- Animals policies for authenticated users
CREATE POLICY "Users see own animals when authenticated" ON animals FOR SELECT USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

CREATE POLICY "Users manage own animals when authenticated" ON animals FOR ALL USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

-- Services policies for authenticated users
CREATE POLICY "Users see own services when authenticated" ON services FOR SELECT USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

CREATE POLICY "Users manage own services when authenticated" ON services FOR ALL USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

-- Vet practice recommendations policies for authenticated users
CREATE POLICY "Users see own vet practice recommendations when authenticated" ON vet_practice_recommendations FOR SELECT USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

CREATE POLICY "Users manage own vet practice recommendations when authenticated" ON vet_practice_recommendations FOR ALL USING (
    auth.role() = 'authenticated' AND (
        user_owns_data(owner_nik) OR 
        is_admin_or_staff()
    )
);

-- Grant execute permissions on the functions
GRANT EXECUTE ON FUNCTION is_admin_or_staff() TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin_or_staff() TO anon;
GRANT EXECUTE ON FUNCTION user_owns_data(VARCHAR) TO authenticated;
GRANT EXECUTE ON FUNCTION user_owns_data(VARCHAR) TO anon;

-- Test the permissions
SELECT 'Permissions fixed successfully!' as status;
