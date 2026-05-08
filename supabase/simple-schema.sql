-- Simple users table (no Supabase Auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'pending',
  approved BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_number TEXT UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  address TEXT,
  signup_date DATE,
  total_amount DECIMAL DEFAULT 0,
  balance DECIMAL DEFAULT 0,
  status TEXT DEFAULT 'active',
  profile_image_url TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Plots table
CREATE TABLE IF NOT EXISTS plots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  locality_id UUID REFERENCES locations(id),
  plot_number TEXT,
  acreage DECIMAL,
  status TEXT DEFAULT 'available',
  plot_picked BOOLEAN DEFAULT false,
  site_plan_done BOOLEAN DEFAULT false,
  site_plan_signed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'pdf',
  file_url TEXT,
  public_id TEXT,
  uploaded_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity logs table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  payment_method TEXT DEFAULT 'cash',
  reference TEXT,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indentures table
CREATE TABLE IF NOT EXISTS indentures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  number_of_indentures INTEGER DEFAULT 1,
  site_plan_signed BOOLEAN DEFAULT false,
  site_plan_date DATE,
  indenture_done BOOLEAN DEFAULT false,
  indenture_date DATE,
  deponent_name TEXT,
  deponent_signed BOOLEAN DEFAULT false,
  boss_signed BOOLEAN DEFAULT false,
  court_signed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE plots ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Simple policies (allow all for now during dev)
CREATE POLICY "Allow all" ON users FOR ALL USING (true);
CREATE POLICY "Allow all locations" ON locations FOR ALL USING (true);
CREATE POLICY "Allow all clients" ON clients FOR ALL USING (true);
CREATE POLICY "Allow all plots" ON plots FOR ALL USING (true);
CREATE POLICY "Allow all documents" ON documents FOR ALL USING (true);
CREATE POLICY "Allow all logs" ON activity_logs FOR ALL USING (true);
CREATE POLICY "Allow all payments" ON payments FOR ALL USING (true);
CREATE POLICY "Allow all indentures" ON indentures FOR ALL USING (true);

-- Seed locations
INSERT INTO locations (name, code, description) VALUES
('Obuasi Municipal', 'OBM', 'Main municipal area'),
('Obuasi East', 'OBE', 'Eastern district'),
('Obuasi West', 'OBW', 'Western district'),
('Anglo', 'ANG', 'Anglogold area'),
('Bogoso', 'BGS', 'Bogoso township'),
('Prestea', 'PST', 'Prestea area')
ON CONFLICT (code) DO NOTHING;

-- Seed demo admin user (create via UI signup, then set role to admin manually)
-- INSERT INTO users (email, password, full_name, role, approved) VALUES
-- ('admin@romeoville.com', 'YOUR_STRONG_PASSWORD_HERE', 'System Admin', 'admin', true)
-- ON CONFLICT (email) DO NOTHING;

-- Seed demo clients
INSERT INTO clients (file_number, full_name, phone, email, address, signup_date, total_amount, balance, status) VALUES
('RV-OBM-26-001', 'Kwame Asante', '+233501234567', 'kwame@email.com', 'Obuasi Central', '2026-01-15', 150000, 50000, 'active'),
('RV-OBM-26-002', 'Akosua Mensah', '+233502345678', 'akosua@email.com', 'Anglogold Estate', '2026-01-20', 200000, 75000, 'active'),
('RV-OBE-26-001', 'Yaw Boateng', '+233503456789', 'yaw@email.com', 'Obuasi East', '2026-02-01', 120000, 0, 'active'),
('RV-OBW-26-001', 'Abena Kwarteng', '+233504567890', 'abena@email.com', 'Obuasi West', '2026-02-10', 180000, 120000, 'active')
ON CONFLICT (file_number) DO NOTHING;