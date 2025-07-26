-- Update enrollment table to add missing columns
ALTER TABLE enrollment ADD COLUMN IF NOT EXISTS enrollment_date DATE;
ALTER TABLE enrollment ADD COLUMN IF NOT EXISTS status VARCHAR(50);

-- Set default values for existing records
UPDATE enrollment SET enrollment_date = CURRENT_DATE WHERE enrollment_date IS NULL;
UPDATE enrollment SET status = 'ACTIVE' WHERE status IS NULL; 