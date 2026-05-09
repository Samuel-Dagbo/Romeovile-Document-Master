-- Disable RLS on ALL remaining tables
-- Run this in Supabase SQL Editor

-- Disable RLS on auth tables that might be enabled
ALTER TABLE auth.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.refresh_tokens DISABLE ROW LEVEL SECURITY;
ALTER TABLE auth.sessions DISABLE ROW LEVEL SECURITY;

-- Disable RLS on public tables
ALTER TABLE public.activity_log DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;

-- Also make sure our main tables have RLS disabled
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE plots DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE indentures DISABLE ROW LEVEL SECURITY;

-- Verify all RLS is disabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;