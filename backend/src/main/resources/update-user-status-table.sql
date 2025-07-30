-- Update user_status table structure
-- This script updates the existing user_status table to match the new entity structure

-- Check if the table exists and has the old structure (user_id as primary key)
-- If so, recreate it with the new structure

-- Drop the existing table if it exists
DROP TABLE IF EXISTS user_status;

-- Create the table with the new structure
CREATE TABLE user_status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_online (is_online),
    INDEX idx_last_seen (last_seen)
);

-- Insert sample data for all existing users
INSERT INTO user_status (user_id, is_online, last_seen) 
SELECT id, FALSE, NOW() FROM user; 