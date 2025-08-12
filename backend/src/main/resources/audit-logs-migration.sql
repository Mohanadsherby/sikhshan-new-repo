-- Audit Logs Migration Script
-- This script creates the audit_logs table for comprehensive system logging

-- Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
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
    
    -- Foreign key constraint
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    
    -- Indexes for better query performance
    INDEX idx_audit_logs_timestamp (timestamp),
    INDEX idx_audit_logs_user_id (user_id),
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

-- Add comments to table and columns for documentation
ALTER TABLE audit_logs COMMENT = 'System audit logs for tracking user actions and system events';

-- Insert some sample audit logs for testing (optional)
INSERT INTO audit_logs (timestamp, username, action, details, status, ip_address) VALUES
(NOW(), 'System', 'SYSTEM_STARTUP', 'Application started successfully', 'SUCCESS', '127.0.0.1'),
(NOW(), 'System', 'DATABASE_CONNECTION', 'Database connection established', 'SUCCESS', '127.0.0.1'),
(NOW(), 'System', 'AUDIT_SYSTEM_INIT', 'Audit logging system initialized', 'SUCCESS', '127.0.0.1');

-- Create a view for recent audit logs (last 24 hours)
CREATE OR REPLACE VIEW recent_audit_logs AS
SELECT * FROM audit_logs 
WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR)
ORDER BY timestamp DESC;

-- Create a view for error logs
CREATE OR REPLACE VIEW error_audit_logs AS
SELECT * FROM audit_logs 
WHERE status = 'ERROR'
ORDER BY timestamp DESC;

-- Create a view for failed requests (4xx and 5xx status codes)
CREATE OR REPLACE VIEW failed_request_logs AS
SELECT * FROM audit_logs 
WHERE response_status >= 400
ORDER BY timestamp DESC;

-- Create a view for slow queries (execution time > 5 seconds)
CREATE OR REPLACE VIEW slow_query_logs AS
SELECT * FROM audit_logs 
WHERE execution_time > 5000
ORDER BY execution_time DESC;

-- Create a stored procedure for cleaning up old logs
DELIMITER //
CREATE PROCEDURE CleanupOldAuditLogs(IN days_to_keep INT)
BEGIN
    DECLARE cutoff_date DATETIME;
    SET cutoff_date = DATE_SUB(NOW(), INTERVAL days_to_keep DAY);
    
    DELETE FROM audit_logs WHERE timestamp < cutoff_date;
    
    SELECT ROW_COUNT() AS deleted_records;
END //
DELIMITER ;

-- Create a stored procedure for getting audit log statistics
DELIMITER //
CREATE PROCEDURE GetAuditLogStats()
BEGIN
    -- Total logs
    SELECT COUNT(*) AS total_logs FROM audit_logs;
    
    -- Logs by status
    SELECT status, COUNT(*) as count 
    FROM audit_logs 
    GROUP BY status 
    ORDER BY count DESC;
    
    -- Logs by action (top 10)
    SELECT action, COUNT(*) as count 
    FROM audit_logs 
    GROUP BY action 
    ORDER BY count DESC 
    LIMIT 10;
    
    -- Logs by user (top 10)
    SELECT username, COUNT(*) as count 
    FROM audit_logs 
    GROUP BY username 
    ORDER BY count DESC 
    LIMIT 10;
    
    -- Recent activity (last 24 hours)
    SELECT COUNT(*) as recent_logs 
    FROM audit_logs 
    WHERE timestamp >= DATE_SUB(NOW(), INTERVAL 24 HOUR);
    
    -- Error logs count
    SELECT COUNT(*) as error_logs 
    FROM audit_logs 
    WHERE status = 'ERROR';
END //
DELIMITER ;

-- Create triggers for automatic logging (optional - can be implemented in application layer)
-- These triggers would automatically log certain database operations

-- Example trigger for user table changes (if needed)
-- DELIMITER //
-- CREATE TRIGGER after_user_insert
-- AFTER INSERT ON users
-- FOR EACH ROW
-- BEGIN
--     INSERT INTO audit_logs (timestamp, username, action, details, status, resource_type, resource_id)
--     VALUES (NOW(), 'System', 'CREATE_USER', CONCAT('User created: ', NEW.name), 'SUCCESS', 'USER', NEW.id);
-- END //
-- DELIMITER ;

-- Grant necessary permissions (adjust as needed)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON audit_logs TO 'application_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE CleanupOldAuditLogs TO 'application_user'@'localhost';
-- GRANT EXECUTE ON PROCEDURE GetAuditLogStats TO 'application_user'@'localhost'; 