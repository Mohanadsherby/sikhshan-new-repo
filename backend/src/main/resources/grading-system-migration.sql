-- Grading System Database Migration
-- This migration creates the necessary tables for the comprehensive grading system

-- Course Grade table
CREATE TABLE IF NOT EXISTS course_grade (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    
    -- Assignment grades
    assignment_total_points DOUBLE DEFAULT 0.0,
    assignment_points_earned DOUBLE DEFAULT 0.0,
    assignment_percentage DOUBLE DEFAULT 0.0,
    assignment_count INT DEFAULT 0,
    assignment_graded_count INT DEFAULT 0,
    
    -- Quiz grades
    quiz_total_points DOUBLE DEFAULT 0.0,
    quiz_points_earned DOUBLE DEFAULT 0.0,
    quiz_percentage DOUBLE DEFAULT 0.0,
    quiz_count INT DEFAULT 0,
    quiz_attempted_count INT DEFAULT 0,
    
    -- Overall course grade
    total_points DOUBLE DEFAULT 0.0,
    points_earned DOUBLE DEFAULT 0.0,
    final_percentage DOUBLE DEFAULT 0.0,
    letter_grade VARCHAR(5),
    grade_point DOUBLE,
    performance_description VARCHAR(50),
    
    -- Grading weights (configurable by instructor)
    assignment_weight DOUBLE DEFAULT 60.0,
    quiz_weight DOUBLE DEFAULT 40.0,
    
    -- Timestamps
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Status
    status VARCHAR(20) DEFAULT 'ACTIVE',
    
    -- Foreign keys
    FOREIGN KEY (student_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES course(id) ON DELETE CASCADE,
    
    -- Unique constraint to ensure one grade per student per course
    UNIQUE KEY unique_student_course (student_id, course_id),
    
    -- Indexes for performance
    INDEX idx_student_id (student_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status),
    INDEX idx_letter_grade (letter_grade),
    INDEX idx_final_percentage (final_percentage)
);

-- Update existing assignment_submission table to ensure grading fields exist
ALTER TABLE assignment_submission 
ADD COLUMN IF NOT EXISTS grade DOUBLE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS points_earned INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS letter_grade VARCHAR(5) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS grade_point DOUBLE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS performance_description VARCHAR(50) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS feedback TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS graded_at TIMESTAMP NULL;

-- Update existing quiz_attempt table to ensure grading fields exist
ALTER TABLE quiz_attempt 
ADD COLUMN IF NOT EXISTS points_earned INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS percentage DOUBLE DEFAULT NULL,
ADD COLUMN IF NOT EXISTS letter_grade VARCHAR(5) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS performance_description VARCHAR(50) DEFAULT NULL;

-- Insert sample grading data for testing (optional)
-- This can be removed in production
INSERT IGNORE INTO course_grade (student_id, course_id, assignment_total_points, assignment_points_earned, 
                                assignment_percentage, assignment_count, assignment_graded_count,
                                quiz_total_points, quiz_points_earned, quiz_percentage, quiz_count, 
                                quiz_attempted_count, total_points, points_earned, final_percentage, 
                                letter_grade, grade_point, performance_description, assignment_weight, quiz_weight)
SELECT 
    e.student_id,
    e.course_id,
    0.0,
    0.0,
    0.0,
    0,
    0,
    0.0,
    0.0,
    0.0,
    0,
    0,
    0.0,
    0.0,
    0.0,
    'N/A',
    0.0,
    'No grades yet',
    60.0,
    40.0
FROM enrollment e
WHERE NOT EXISTS (
    SELECT 1 FROM course_grade cg 
    WHERE cg.student_id = e.student_id AND cg.course_id = e.course_id
); 