-- Add new grading system fields to assignment_submission table
ALTER TABLE assignment_submission ADD COLUMN grade_point DECIMAL(3,1);
ALTER TABLE assignment_submission ADD COLUMN performance_description VARCHAR(50);

-- Update existing graded submissions with new grading system
UPDATE assignment_submission 
SET 
    grade_point = CASE 
        WHEN grade >= 90.0 THEN 4.0
        WHEN grade >= 80.0 THEN 3.6
        WHEN grade >= 70.0 THEN 3.2
        WHEN grade >= 60.0 THEN 2.8
        WHEN grade >= 50.0 THEN 2.4
        WHEN grade >= 40.0 THEN 2.0
        WHEN grade >= 35.0 THEN 1.6
        ELSE 0.0
    END,
    performance_description = CASE 
        WHEN grade >= 90.0 THEN 'Outstanding'
        WHEN grade >= 80.0 THEN 'Excellent'
        WHEN grade >= 70.0 THEN 'Very Good'
        WHEN grade >= 60.0 THEN 'Good'
        WHEN grade >= 50.0 THEN 'Satisfactory'
        WHEN grade >= 40.0 THEN 'Acceptable'
        WHEN grade >= 35.0 THEN 'Basic'
        ELSE 'Fail'
    END,
    letter_grade = CASE 
        WHEN grade >= 90.0 THEN 'A+'
        WHEN grade >= 80.0 THEN 'A'
        WHEN grade >= 70.0 THEN 'B+'
        WHEN grade >= 60.0 THEN 'B'
        WHEN grade >= 50.0 THEN 'C+'
        WHEN grade >= 40.0 THEN 'C'
        WHEN grade >= 35.0 THEN 'D+'
        ELSE 'F'
    END
WHERE grade IS NOT NULL; 