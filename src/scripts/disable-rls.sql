-- =====================================================
-- DISABLE RLS (Row Level Security) FOR ALL TABLES
-- Run this in Supabase SQL Editor
-- =====================================================

-- Disable RLS on users table
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- Disable RLS on clients table
ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- Disable RLS on other tables (if they exist)
ALTER TABLE locations DISABLE ROW LEVEL SECURITY;
ALTER TABLE plots DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE indentures DISABLE ROW LEVEL SECURITY;

-- Verify RLS is disabled
SELECT 
    tablename,
    rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND rowsecurity = true;

-- This query should return empty (no tables with RLS enabled)
-- If any tables still show true, run their ALTER statement again