-- Seed locations
INSERT INTO locations (name, code, description) VALUES
('Obuasi Municipal', 'OBM', 'Main municipal area'),
('Obuasi East', 'OBE', 'Eastern district'),
('Obuasi West', 'OBW', 'Western district'),
('Anglo', 'ANG', 'Anglogold area'),
('Bogoso', 'BGS', 'Bogoso township'),
('Prestea', 'PST', 'Prestea area')
ON CONFLICT (code) DO NOTHING;

-- Seed demo clients (IDs will be auto-generated)
INSERT INTO clients (file_number, full_name, phone, email, address, signup_date, total_amount, balance, status) VALUES
('RV-OBM-26-001', 'Kwame Asante', '+233501234567', 'kwame@email.com', 'Obuasi Central', '2026-01-15', 150000.00, 50000.00, 'active'),
('RV-OBM-26-002', 'Akosua Mensah', '+233502345678', 'akosua@email.com', 'Anglogold Estate', '2026-01-20', 200000.00, 75000.00, 'active'),
('RV-OBE-26-001', 'Yaw Boateng', '+233503456789', 'yaw@email.com', 'Obuasi East', '2026-02-01', 120000.00, 0.00, 'active'),
('RV-OBW-26-001', 'Abena Kwarteng', '+233504567890', 'abena@email.com', 'Obuasi West', '2026-02-10', 180000.00, 120000.00, 'active'),
('RV-ANG-26-001', 'Kofi Osei', '+233505678901', 'kofi@email.com', 'Anglo Area', '2026-02-15', 250000.00, 200000.00, 'inactive'),
('RV-BGS-26-001', 'Efua Darko', '+233506789012', 'efua@email.com', 'Bogoso Central', '2026-03-01', 90000.00, 30000.00, 'active'),
('RV-PST-26-001', 'Kwesi Asamoah', '+233507890123', 'kwesi@email.com', 'Prestea Township', '2026-03-05', 220000.00, 150000.00, 'active');

-- Seed demo plots (first get client IDs)
DO $$
DECLARE
  client_rec RECORD;
  loc_obm UUID;
  loc_obe UUID;
  loc_obw UUID;
  loc_bgs UUID;
BEGIN
  -- Get location IDs
  SELECT id INTO loc_obm FROM locations WHERE code = 'OBM';
  SELECT id INTO loc_obe FROM locations WHERE code = 'OBE';
  SELECT id INTO loc_obw FROM locations WHERE code = 'OBW';
  SELECT id INTO loc_bgs FROM locations WHERE code = 'BGS';

  -- Create plots for first 5 clients
  FOR client_rec IN SELECT id FROM clients LIMIT 5 LOOP
    INSERT INTO plots (client_id, locality_id, plot_number, acreage, status, plot_picked, site_plan_done)
    VALUES (
      client_rec.id,
      loc_obm,
      'PL-' || LPAD(floor(random() * 999 + 1)::text, 3, '0'),
      (random() * 2 + 1)::DECIMAL(5,2),
      'sold',
      true,
      random() > 0.5
    );
  END LOOP;
END $$;

-- Seed demo activity logs (using actual user IDs from profiles)
DO $$
DECLARE
  admin_user UUID;
BEGIN
  SELECT id INTO admin_user FROM profiles LIMIT 1;
  
  IF admin_user IS NOT NULL THEN
    INSERT INTO activity_logs (user_id, action, description) VALUES
    (admin_user, 'CREATE_CLIENT', 'Created client: Kwame Asante'),
    (admin_user, 'CREATE_CLIENT', 'Created client: Akosua Mensah'),
    (admin_user, 'CREATE_PAYMENT', 'Recorded payment for Kwame Asante - ₵50,000'),
    (admin_user, 'CREATE_CLIENT', 'Created client: Abena Kwarteng'),
    (admin_user, 'UPLOAD_DOCUMENT', 'Uploaded site plan for Plot PL-001');
  END IF;
END $$;