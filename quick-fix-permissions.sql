-- Quick Fix for Supabase Permissions Error
-- Run this in Supabase SQL Editor to fix the "must be owner of table" error

-- Temporarily disable RLS for all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE animals DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations DISABLE ROW LEVEL SECURITY;

-- Grant all permissions to authenticated and anonymous users
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Re-enable RLS with permissive policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow all operations
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on animals" ON animals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on services" ON services FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on medicines" ON medicines FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vaccinations" ON vaccinations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on telemedicine_sessions" ON telemedicine_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on vet_practice_recommendations" ON vet_practice_recommendations FOR ALL USING (true) WITH CHECK (true);

SELECT 'Permissions fixed! You can now migrate data.' as status;
