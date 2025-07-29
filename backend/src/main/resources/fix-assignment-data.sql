-- Fix assignment submission data type issues
-- This script cleans up any existing data that might have incorrect types

-- First, let's check and clean up any problematic data
UPDATE assignment_submission 
SET grade = NULL 
WHERE grade IS NOT NULL AND CAST(grade AS CHAR) NOT REGEXP '^[0-9]+\.?[0-9]*$';

-- Clean up letter_grade field to ensure it only contains valid letter grades
UPDATE assignment_submission 
SET letter_grade = NULL 
WHERE letter_grade IS NOT NULL AND letter_grade NOT REGEXP '^[A-F][+-]?$';

-- Ensure all numeric fields are properly typed
UPDATE assignment_submission 
SET submission_number = 1 
WHERE submission_number IS NULL OR submission_number < 1;

-- Ensure boolean fields are properly set
UPDATE assignment_submission 
SET is_late = FALSE 
WHERE is_late IS NULL;

-- Ensure status fields are properly set
UPDATE assignment_submission 
SET status = 'SUBMITTED' 
WHERE status IS NULL OR status = '';

-- Ensure timestamps are properly set
UPDATE assignment_submission 
SET submitted_at = NOW() 
WHERE submitted_at IS NULL;

UPDATE assignment_submission 
SET last_modified_at = submitted_at 
WHERE last_modified_at IS NULL;

-- Add constraints to prevent future data issues
ALTER TABLE assignment_submission 
MODIFY COLUMN grade DECIMAL(5,2) NULL,
MODIFY COLUMN letter_grade VARCHAR(5) NULL,
MODIFY COLUMN submission_number INT NOT NULL DEFAULT 1,
MODIFY COLUMN is_late BOOLEAN NOT NULL DEFAULT FALSE,
MODIFY COLUMN status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED';

-- Add check constraints for data validation
ALTER TABLE assignment_submission 
ADD CONSTRAINT chk_grade_range CHECK (grade IS NULL OR (grade >= 0 AND grade <= 100)),
ADD CONSTRAINT chk_letter_grade CHECK (letter_grade IS NULL OR letter_grade REGEXP '^[A-F][+-]?$'),
ADD CONSTRAINT chk_submission_number CHECK (submission_number > 0); 