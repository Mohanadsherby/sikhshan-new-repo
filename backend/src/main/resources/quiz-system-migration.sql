-- Quiz System Migration Script
-- This script updates the database structure for the enhanced quiz system

-- 1. Update existing quiz table
ALTER TABLE quiz 
ADD COLUMN total_points INT DEFAULT 100 NOT NULL,
ADD COLUMN status VARCHAR(20) DEFAULT 'ACTIVE';

-- 2. Create question table
CREATE TABLE question (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    type VARCHAR(20) NOT NULL,
    points INT DEFAULT 1 NOT NULL,
    correct_answer TEXT,
    quiz_id BIGINT NOT NULL,
    FOREIGN KEY (quiz_id) REFERENCES quiz(id) ON DELETE CASCADE
);

-- 3. Create question_option table
CREATE TABLE question_option (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE,
    question_id BIGINT NOT NULL,
    FOREIGN KEY (question_id) REFERENCES question(id) ON DELETE CASCADE
);

-- 4. Update existing quiz_attempt table
ALTER TABLE quiz_attempt 
ADD COLUMN points_earned INT,
ADD COLUMN percentage DOUBLE,
ADD COLUMN letter_grade VARCHAR(5),
ADD COLUMN status VARCHAR(20) DEFAULT 'IN_PROGRESS',
ADD COLUMN performance_description VARCHAR(50);

-- 5. Update answers column to use TEXT instead of LOB
ALTER TABLE quiz_attempt 
MODIFY COLUMN answers TEXT;

-- 6. Add indexes for better performance
CREATE INDEX idx_question_quiz_id ON question(quiz_id);
CREATE INDEX idx_question_option_question_id ON question_option(question_id);
CREATE INDEX idx_quiz_attempt_quiz_student_status ON quiz_attempt(quiz_id, student_id, status);
CREATE INDEX idx_quiz_attempt_student_id ON quiz_attempt(student_id);
CREATE INDEX idx_quiz_attempt_quiz_id ON quiz_attempt(quiz_id);

-- 7. Insert sample data (optional - for testing)
-- Sample quiz with questions
INSERT INTO quiz (name, description, start_date_time, duration_minutes, total_points, status, course_id, instructor_id, created_at) 
VALUES (
    'Sample Quiz - Introduction to Programming',
    'This is a sample quiz to test the new quiz system',
    DATE_ADD(NOW(), INTERVAL 1 HOUR),
    60,
    100,
    'ACTIVE',
    1,
    1,
    NOW()
);

-- Sample questions for the quiz
INSERT INTO question (text, type, points, correct_answer, quiz_id) VALUES
('What is the primary purpose of a variable in programming?', 'MULTIPLE_CHOICE', 10, NULL, LAST_INSERT_ID()),
('Is JavaScript a compiled language?', 'TRUE_FALSE', 5, 'false', LAST_INSERT_ID()),
('What does HTML stand for?', 'SHORT_ANSWER', 10, 'HyperText Markup Language', LAST_INSERT_ID());

-- Sample options for multiple choice question
INSERT INTO question_option (text, is_correct, question_id) VALUES
('To store data temporarily', TRUE, (SELECT id FROM question WHERE text LIKE '%variable%' LIMIT 1)),
('To display text on screen', FALSE, (SELECT id FROM question WHERE text LIKE '%variable%' LIMIT 1)),
('To connect to database', FALSE, (SELECT id FROM question WHERE text LIKE '%variable%' LIMIT 1)),
('To create functions', FALSE, (SELECT id FROM question WHERE text LIKE '%variable%' LIMIT 1));

-- 8. Update existing quiz attempts to have default values
UPDATE quiz_attempt 
SET status = 'SUBMITTED' 
WHERE status IS NULL;

UPDATE quiz_attempt 
SET points_earned = 0 
WHERE points_earned IS NULL;

UPDATE quiz_attempt 
SET percentage = 0.0 
WHERE percentage IS NULL;

UPDATE quiz_attempt 
SET letter_grade = 'F' 
WHERE letter_grade IS NULL;

-- 9. Add constraints for data integrity
ALTER TABLE question 
ADD CONSTRAINT chk_question_type 
CHECK (type IN ('MULTIPLE_CHOICE', 'TRUE_FALSE', 'SHORT_ANSWER'));

ALTER TABLE quiz_attempt 
ADD CONSTRAINT chk_attempt_status 
CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'GRADED'));

ALTER TABLE quiz 
ADD CONSTRAINT chk_quiz_status 
CHECK (status IN ('ACTIVE', 'INACTIVE', 'DRAFT'));

-- 10. Create view for quiz statistics (optional)
CREATE VIEW quiz_statistics AS
SELECT 
    q.id as quiz_id,
    q.name as quiz_name,
    q.total_points,
    COUNT(qa.id) as total_attempts,
    AVG(qa.percentage) as average_score,
    MIN(qa.percentage) as lowest_score,
    MAX(qa.percentage) as highest_score
FROM quiz q
LEFT JOIN quiz_attempt qa ON q.id = qa.quiz_id AND qa.status = 'SUBMITTED'
GROUP BY q.id, q.name, q.total_points;

-- Migration completed successfully
SELECT 'Quiz system migration completed successfully!' as status; 