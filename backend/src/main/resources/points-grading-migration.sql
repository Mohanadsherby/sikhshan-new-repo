-- Add pointsEarned column to assignment_submission table
ALTER TABLE assignment_submission ADD COLUMN points_earned INT;

-- Update existing graded submissions to have points_earned based on grade percentage
-- This assumes total_points is 100 for existing assignments
UPDATE assignment_submission 
SET points_earned = ROUND((grade / 100.0) * 100) 
WHERE grade IS NOT NULL AND points_earned IS NULL;

-- Add constraint to ensure points_earned is non-negative
ALTER TABLE assignment_submission ADD CONSTRAINT chk_points_earned_non_negative CHECK (points_earned >= 0); 