-- Create superadmin user if it doesn't exist
INSERT INTO user (name, email, password, role, created_at, updated_at)
SELECT 'Super Admin', 'admin@sikhshan.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8JqQK8i', 'SUPERADMIN', NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM user WHERE email = 'admin@sikhshan.com'
);

-- The password above is 'admin123' hashed with BCrypt 