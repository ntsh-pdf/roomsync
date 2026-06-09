-- Create the database
CREATE DATABASE IF NOT EXISTS booking_system;
USE booking_system;

-- 1. Users Table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Resources Table (What people are booking, e.g., "Conference Room A")
CREATE TABLE resources (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    capacity INT DEFAULT 1,
    is_available BOOLEAN DEFAULT TRUE
);

-- 3. Reservations Table
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    resource_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    end_time DATETIME NOT NULL,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'confirmed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

-- Optional: Add some sample data so we can test later
INSERT INTO resources (name, description, capacity) VALUES 
('Conference Room A', 'Equipped with projector and whiteboard', 10),
('Meeting Booth 1', 'Small private booth for 2 people', 2),
('Hot Desk 05', 'Open space desk with dual monitors', 1);