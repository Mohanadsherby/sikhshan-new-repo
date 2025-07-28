-- Assignment table updates
ALTER TABLE assignment 
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE',
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_url TEXT,
ADD COLUMN original_file_name VARCHAR(255),
MODIFY COLUMN due_date DATETIME,
MODIFY COLUMN created_at DATETIME;

-- Assignment submission table updates
ALTER TABLE assignment_submission 
ADD COLUMN last_modified_at DATETIME,
ADD COLUMN status VARCHAR(30) DEFAULT 'SUBMITTED',
ADD COLUMN cloudinary_public_id VARCHAR(255),
ADD COLUMN cloudinary_url TEXT,
ADD COLUMN original_file_name VARCHAR(255),
ADD COLUMN grade DECIMAL(5,2),
ADD COLUMN letter_grade VARCHAR(5),
ADD COLUMN feedback TEXT,
ADD COLUMN graded_at DATETIME,
ADD COLUMN submission_number INT DEFAULT 1,
ADD COLUMN is_late BOOLEAN DEFAULT FALSE,
MODIFY COLUMN submitted_at DATETIME;

-- Update existing records
UPDATE assignment SET status = 'ACTIVE' WHERE status IS NULL;
UPDATE assignment SET created_at = NOW() WHERE created_at IS NULL;

UPDATE assignment_submission SET status = 'SUBMITTED' WHERE status IS NULL;
UPDATE assignment_submission SET last_modified_at = submitted_at WHERE last_modified_at IS NULL;
UPDATE assignment_submission SET submission_number = 1 WHERE submission_number IS NULL;
UPDATE assignment_submission SET is_late = FALSE WHERE is_late IS NULL;

-- Add indexes for better performance
CREATE INDEX idx_assignment_course_status ON assignment(course_id, status);
CREATE INDEX idx_assignment_due_date ON assignment(due_date);
CREATE INDEX idx_assignment_instructor ON assignment(instructor_id);

CREATE INDEX idx_submission_assignment_student ON assignment_submission(assignment_id, student_id);
CREATE INDEX idx_submission_status ON assignment_submission(status);
CREATE INDEX idx_submission_submitted_at ON assignment_submission(submitted_at);
CREATE INDEX idx_submission_student_course ON assignment_submission(student_id); 