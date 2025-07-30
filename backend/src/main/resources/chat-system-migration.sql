-- Chat System Database Migration
-- This migration creates the necessary tables for the chat system

-- Chat rooms table
CREATE TABLE IF NOT EXISTS chat_room (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user1_id BIGINT NOT NULL,
    user2_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user1_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (user2_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE KEY unique_chat_pair (user1_id, user2_id),
    INDEX idx_user1 (user1_id),
    INDEX idx_user2 (user2_id),
    INDEX idx_last_message (last_message_at)
);

-- Messages table with deletion tracking
CREATE TABLE IF NOT EXISTS message (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    chat_room_id BIGINT NOT NULL,
    sender_id BIGINT NOT NULL,
    content TEXT NOT NULL,
    message_type ENUM('TEXT', 'FILE', 'IMAGE') DEFAULT 'TEXT',
    file_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP NULL,
    deleted_by BIGINT NULL,
    FOREIGN KEY (chat_room_id) REFERENCES chat_room(id) ON DELETE CASCADE,
    FOREIGN KEY (sender_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (deleted_by) REFERENCES user(id) ON DELETE SET NULL,
    INDEX idx_chat_room (chat_room_id),
    INDEX idx_sender (sender_id),
    INDEX idx_created_at (created_at),
    INDEX idx_is_deleted (is_deleted)
);

-- User online status table
CREATE TABLE IF NOT EXISTS user_status (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL UNIQUE,
    is_online BOOLEAN DEFAULT FALSE,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_is_online (is_online),
    INDEX idx_last_seen (last_seen)
);

-- Insert sample data for testing
INSERT INTO user_status (user_id, is_online, last_seen) 
SELECT id, FALSE, NOW() FROM user 
WHERE id NOT IN (SELECT user_id FROM user_status);

-- Create indexes for better performance
CREATE INDEX idx_chat_room_users ON chat_room(user1_id, user2_id);
CREATE INDEX idx_message_chat_created ON message(chat_room_id, created_at);
CREATE INDEX idx_message_sender_created ON message(sender_id, created_at); 