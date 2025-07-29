-- Check if assignment table exists and has correct structure
DESCRIBE assignment;

-- Check if there are any assignments in the table
SELECT COUNT(*) as total_assignments FROM assignment;

-- Check assignments for course 2
SELECT id, title, course_id, status, due_date FROM assignment WHERE course_id = 2;

-- Check if the required columns exist
SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'assignment' 
AND TABLE_SCHEMA = DATABASE(); 