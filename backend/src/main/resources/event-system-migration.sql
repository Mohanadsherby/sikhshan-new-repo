-- Event System Migration
-- Create event table

CREATE TABLE IF NOT EXISTS event (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    type ENUM('ASSIGNMENT', 'EXAM', 'MEETING', 'OTHER') NOT NULL,
    created_by BIGINT NOT NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME,
    FOREIGN KEY (created_by) REFERENCES user(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_event_date ON event(event_date);
CREATE INDEX idx_event_created_by ON event(created_by);
CREATE INDEX idx_event_type ON event(type);
CREATE INDEX idx_event_date_type ON event(event_date, type);

-- Insert sample events for testing
INSERT INTO event (title, description, event_date, start_time, end_time, type, created_by, created_at) VALUES
('CS101 Assignment Due', 'Submit Programming Basics assignment', '2024-12-15', '23:59:00', '23:59:00', 'ASSIGNMENT', 1, NOW()),
('CS201 Midterm Exam', 'Covers chapters 1-5', '2024-12-20', '14:00:00', '16:00:00', 'EXAM', 1, NOW()),
('Study Group Meeting', 'Prepare for CS101 final exam', '2024-12-18', '15:00:00', '17:00:00', 'MEETING', 1, NOW()); 