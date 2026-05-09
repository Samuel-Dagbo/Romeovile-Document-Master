-- =====================================================
-- ROMEVILLE DOCUMENT MASTER - DATABASE SCHEMA
-- Run this in Supabase SQL Editor
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    password TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'pending' CHECK (role IN ('admin', 'user', 'pending')),
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- CLIENTS TABLE - Complete Schema
-- =====================================================
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic Info
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    address TEXT,
    location TEXT,
    file_number TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
    
    -- Dates
    signup_date TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Financial
    total_amount NUMERIC DEFAULT 0,
    balance NUMERIC DEFAULT 0,
    
    -- Plot Information
    plot_number TEXT,
    plot_size NUMERIC,
    plot_location TEXT,
    
    -- Site Plan
    site_plan BOOLEAN DEFAULT false,
    site_plan_done BOOLEAN DEFAULT false,
    site_plan_signed BOOLEAN DEFAULT false,
    
    -- Indenture Information
    number_of_indentures NUMERIC DEFAULT 1,
    indenture_done BOOLEAN DEFAULT false,
    indenture_date TEXT,
    indenture_signed BOOLEAN DEFAULT false,
    
    -- Signatures
    deponent_signed BOOLEAN DEFAULT false,
    deponent_name TEXT,
    client_witness_name TEXT,
    boss_signed BOOLEAN DEFAULT false,
    court_signed BOOLEAN DEFAULT false
);

-- =====================================================
-- LOCATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    district TEXT,
    region TEXT,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PLOTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS plots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    plot_number TEXT NOT NULL,
    acreage NUMERIC,
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'sold', 'reserved')),
    locality_id UUID REFERENCES locations(id),
    plot_picked BOOLEAN DEFAULT false,
    site_plan_done BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- DOCUMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT,
    file_url TEXT,
    file_size TEXT,
    uploaded_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- PAYMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    method TEXT,
    reference TEXT,
    date TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDENTURES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS indentures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    indenture_number TEXT,
    plot_id UUID REFERENCES plots(id),
    date TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ENABLE RLS (Row Level Security) - Optional
-- =====================================================
-- Note: If using custom auth (not Supabase Auth), you may want to disable RLS
-- ALTER TABLE users DISABLE ROW LEVEL SECURITY;
-- ALTER TABLE clients DISABLE ROW LEVEL SECURITY;

-- =====================================================
-- SEED DATA - Sample Admin User (Optional)
-- =====================================================
-- Note: Password should be hashed with SHA256
-- INSERT INTO users (email, password, full_name, role, approved)
-- VALUES ('admin@romeoville.com', 'admin123', 'System Admin', 'admin', true);

-- =====================================================
-- SAMPLE CLIENTS (Optional)
-- =====================================================
-- INSERT INTO clients (full_name, phone, email, address, location, file_number, total_amount, balance, status, signup_date, plot_number, plot_size, site_plan_done, indenture_done)
-- VALUES 
--   ('John Doe', '+233501234567', 'john@example.com', 'Accra, Ghana', 'Accra', 'RV-000001', 150000, 50000, 'active', '2026-01-15', 'PL-001', 2.5, true, false),
--   ('Jane Smith', '+233509876543', 'jane@example.com', 'Kumasi, Ghana', 'Kumasi', 'RV-000002', 200000, 100000, 'active', '2026-02-01', 'PL-002', 3.0, true, true);

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify your tables:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';