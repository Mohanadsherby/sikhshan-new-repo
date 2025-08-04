-- Fixed Audit Logs Migration Script
-- This script creates the audit_logs table with proper structure

-- Drop the table if it exists to ensure clean creation
DROP TABLE IF EXISTS audit_logs;

-- Create audit_logs table with proper structure
CREATE TABLE audit_logs (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    timestamp DATETIME NOT NULL,
    user_id BIGINT,
    username VARCHAR(255) NOT NULL,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    status VARCHAR(20) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    resource_type VARCHAR(50),
    resource_id BIGINT,
    old_values TEXT,
    new_values TEXT,
    session_id VARCHAR(255),
    request_method VARCHAR(10),
    request_url TEXT,
    response_status INT,
    execution_time BIGINT,
    error_message TEXT,
    
    -- Foreign key constraint (only if users table exists)
    INDEX idx_audit_logs_user_id (user_id),
    INDEX idx_audit_logs_timestamp (timestamp),
    INDEX idx_audit_logs_username (username),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_status (status),
    INDEX idx_audit_logs_ip_address (ip_address),
    INDEX idx_audit_logs_resource_type (resource_type),
    INDEX idx_audit_logs_resource_id (resource_id),
    INDEX idx_audit_logs_session_id (session_id),
    INDEX idx_audit_logs_response_status (response_status),
    INDEX idx_audit_logs_execution_time (execution_time),
    
    -- Composite indexes for common query patterns
    INDEX idx_audit_logs_user_timestamp (user_id, timestamp),
    INDEX idx_audit_logs_action_timestamp (action, timestamp),
    INDEX idx_audit_logs_status_timestamp (status, timestamp),
    INDEX idx_audit_logs_resource_timestamp (resource_type, resource_id, timestamp)
);

-- Add foreign key constraint if users table exists
-- Note: This will only work if the users table exists and has the correct structure
-- If you get an error here, you may need to create the users table first or adjust the constraint
-- ALTER TABLE audit_logs ADD CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

-- Add comments to table and columns for documentation
ALTER TABLE audit_logs COMMENT = 'System audit logs for tracking user actions and system events';

-- Insert some sample audit logs for testing
INSERT INTO audit_logs (timestamp, username, action, details, status, ip_address) VALUES
(NOW(), 'System', 'SYSTEM_STARTUP', 'Application started successfully', 'SUCCESS', '127.0.0.1'),
(NOW(), 'System', 'DATABASE_CONNECTION', 'Database connection established', 'SUCCESS', '127.0.0.1'),
(NOW(), 'System', 'AUDIT_SYSTEM_INIT', 'Audit logging system initialized', 'SUCCESS', '127.0.0.1'),
(NOW(), 'John Doe', 'LOGIN', 'User logged in successfully', 'SUCCESS', '192.168.1.100'),
(NOW(), 'Jane Smith', 'CREATE_COURSE', 'Created new course: Introduction to Programming', 'SUCCESS', '192.168.1.101'),
(NOW(), 'Admin User', 'DELETE_USER', 'Failed to delete user account - user has active enrollments', 'ERROR', '192.168.1.102'),
(NOW(), 'System', 'SYSTEM_BACKUP', 'Daily backup completed successfully', 'SUCCESS', '127.0.0.1'),
(NOW(), 'Faculty Member', 'CREATE_ASSIGNMENT', 'Created assignment: Final Project', 'SUCCESS', '192.168.1.103'),
(NOW(), 'Student User', 'SUBMIT_ASSIGNMENT', 'Submitted assignment: Final Project', 'SUCCESS', '192.168.1.104'),
(NOW(), 'Faculty Member', 'GRADE_ASSIGNMENT', 'Graded assignment: Final Project - Score: 85/100', 'SUCCESS', '192.168.1.103'),
(NOW(), 'System', 'SYSTEM_RESTORE', 'System restore from backup completed', 'WARNING', '127.0.0.1');

-- Create views for common queries
CREATE OR REPLACE VIEW recent_audit_logs AS
SELECT * FROM audit_logs 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY timestamp DESC;

CREATE OR REPLACE VIEW error_audit_logs AS
SELECT * FROM audit_logs 
WHERE status = 'ERROR'
ORDER BY timestamp DESC;

CREATE OR REPLACE VIEW failed_request_logs AS
SELECT * FROM audit_logs 
WHERE response_status >= 400
ORDER BY timestamp DESC;

CREATE OR REPLACE VIEW slow_query_logs AS
SELECT * FROM audit_logs 
WHERE execution_time > 5000
ORDER BY execution_time DESC; 