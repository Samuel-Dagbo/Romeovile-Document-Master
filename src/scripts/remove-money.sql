-- =====================================================
-- REMOVE MONEY FIELDS AND LOCATIONS TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Drop locations table
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS plots CASCADE;
DROP TABLE IF EXISTS indentures CASCADE;

-- Remove money-related columns from clients table
ALTER TABLE clients DROP COLUMN IF EXISTS total_amount;
ALTER TABLE clients DROP COLUMN IF EXISTS balance;
-- Keep plot_size (land size in acres - not money)

-- Verify changes
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'clients'
ORDER BY ordinal_position;