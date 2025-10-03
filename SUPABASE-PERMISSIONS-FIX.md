# Fix Supabase Permissions Error

## Problem
You're getting the error: `ERROR: 42501: must be owner of table users`

This happens because Supabase's Row Level Security (RLS) policies are too restrictive and prevent anonymous users from inserting data.

## Quick Fix (Recommended)

### Step 1: Run the Quick Fix SQL
1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `quick-fix-permissions.sql`
4. Click **Run**

This will:
- Temporarily disable RLS
- Grant all necessary permissions
- Re-enable RLS with permissive policies
- Allow data migration to work

### Step 2: Test the Migration
1. Open `migrate-to-supabase.html` in your browser
2. Click "Start Migration"
3. The migration should now work without permission errors

## Detailed Fix (For Production)

If you want more security after migration, use `fix-supabase-permissions.sql` which provides:
- Anonymous access for data migration
- Authenticated user access with proper restrictions
- Admin/staff role-based access
- User ownership validation

## Alternative: Disable RLS Temporarily

If you just need to migrate data quickly:

```sql
-- Disable RLS on all tables
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE animals DISABLE ROW LEVEL SECURITY;
ALTER TABLE services DISABLE ROW LEVEL SECURITY;
ALTER TABLE medicines DISABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations DISABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions DISABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations DISABLE ROW LEVEL SECURITY;

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
```

## After Migration

Once your data is migrated, you can:

1. **Re-enable RLS** (if you disabled it completely):
```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE animals ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicines ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemedicine_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE vet_practice_recommendations ENABLE ROW LEVEL SECURITY;
```

2. **Add proper security policies** based on your needs

## Verification

After running the fix, you should be able to:
- ✅ Insert data into all tables
- ✅ Read data from all tables
- ✅ Update data in all tables
- ✅ Run the migration script successfully

## Troubleshooting

If you still get permission errors:

1. **Check your Supabase project settings**:
   - Go to Settings > API
   - Make sure your API keys are correct
   - Check if RLS is enabled in project settings

2. **Verify table ownership**:
   ```sql
   SELECT table_name, table_owner 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

3. **Check current policies**:
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
   FROM pg_policies 
   WHERE schemaname = 'public';
   ```

## Security Note

The quick fix uses permissive policies that allow all operations. For production use, you should implement more restrictive policies based on your security requirements.
