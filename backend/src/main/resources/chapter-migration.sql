-- Create chapter table if it doesn't exist
CREATE TABLE IF NOT EXISTS chapter (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    chapter_number INT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE
);

-- Add unique constraint for chapter number per course
ALTER TABLE chapter ADD CONSTRAINT unique_chapter_number_per_course UNIQUE (course_id, chapter_number);

-- Add chapter_id column to course_attachment table if it doesn't exist
ALTER TABLE course_attachment ADD COLUMN IF NOT EXISTS chapter_id BIGINT NULL;

-- Add foreign key constraint if it doesn't exist
SET @constraint_exists = (
    SELECT COUNT(*) 
    FROM information_schema.TABLE_CONSTRAINTS 
    WHERE CONSTRAINT_SCHEMA = DATABASE() 
    AND TABLE_NAME = 'course_attachment' 
    AND CONSTRAINT_NAME = 'fk_course_attachment_chapter'
);

SET @sql = IF(@constraint_exists = 0, 
    'ALTER TABLE course_attachment ADD CONSTRAINT fk_course_attachment_chapter FOREIGN KEY (chapter_id) REFERENCES chapter(id) ON DELETE SET NULL',
    'SELECT "Foreign key constraint already exists"'
);

PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chapter_course_id ON chapter(course_id);
CREATE INDEX IF NOT EXISTS idx_course_attachment_chapter_id ON course_attachment(chapter_id); 