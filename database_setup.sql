-- =====================================================
-- Expense Tracker Database Setup Script
-- =====================================================

-- Create Database
CREATE DATABASE IF NOT EXISTS expense_tracker;
USE expense_tracker;

-- =====================================================
-- TABLE DEFINITIONS
-- =====================================================

-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    status TINYINT DEFAULT 1 COMMENT '1=active, 2=inactive',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    category_id INT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    INDEX idx_user_date (user_id, date),
    INDEX idx_category (category_id),
    INDEX idx_date (date)
);

-- =====================================================
-- SAMPLE DATA INSERTION
-- =====================================================

-- Insert Sample Users
INSERT INTO users (name, email, status) VALUES
('John Doe', 'john.doe@example.com', 1),
('Jane Smith', 'jane.smith@example.com', 1),
('Mike Johnson', 'mike.johnson@example.com', 1),
('Sarah Wilson', 'sarah.wilson@example.com', 1),
('Alex Chen', 'alex.chen@example.com', 1),
('Emma Davis', 'emma.davis@example.com', 1);

-- Insert Sample Categories
INSERT INTO categories (name) VALUES
('Food & Dining'),
('Transportation'),
('Shopping'),
('Entertainment'),
('Bills & Utilities'),
('Healthcare'),
('Travel'),
('Education'),
('Personal Care'),
('Groceries'),
('Fitness'),
('Technology'),
('Home & Garden'),
('Insurance'),
('Other');

-- Insert Comprehensive Sample Expenses (with varied dates for better statistics)
INSERT INTO expenses (user_id, category_id, amount, date, description) VALUES
-- User 1 (John Doe) - September 2025
(1, 1, 25.50, '2025-09-05', 'Lunch at Italian restaurant'),
(1, 2, 45.00, '2025-09-05', 'Uber ride to downtown'),
(1, 10, 120.00, '2025-09-04', 'Weekly grocery shopping'),
(1, 1, 18.75, '2025-09-04', 'Morning coffee and croissant'),
(1, 4, 50.00, '2025-09-03', 'Movie tickets for weekend'),
(1, 5, 85.50, '2025-09-02', 'Monthly electricity bill'),
(1, 1, 32.25, '2025-09-01', 'Dinner with friends'),

-- User 1 - August 2025
(1, 12, 299.99, '2025-08-28', 'New smartphone case and accessories'),
(1, 11, 45.00, '2025-08-26', 'Monthly gym membership'),
(1, 3, 89.99, '2025-08-25', 'New running shoes'),
(1, 1, 155.80, '2025-08-24', 'Holiday dinner celebration'),
(1, 2, 65.00, '2025-08-23', 'Taxi ride on holiday'),
(1, 3, 200.00, '2025-08-22', 'Gifts shopping'),
(1, 7, 450.00, '2025-08-20', 'Holiday flight tickets'),

-- User 1 - July 2025
(1, 1, 45.50, '2025-07-28', 'Special dinner'),
(1, 2, 30.00, '2025-07-25', 'Bus fare for the week'),
(1, 5, 125.00, '2025-07-20', 'Internet and cable bill'),
(1, 1, 28.75, '2025-07-15', 'Fast food lunch'),
(1, 6, 150.00, '2025-07-10', 'Annual health checkup'),
(1, 1, 35.00, '2025-07-08', 'Weekend brunch'),
(1, 2, 28.50, '2025-07-07', 'Taxi to airport'),
(1, 5, 110.00, '2025-07-05', 'Monthly utilities'),

-- User 2 (Jane Smith) - September 2025
(2, 1, 42.00, '2025-09-05', 'Brunch with colleagues'),
(2, 2, 35.50, '2025-09-04', 'Gas for weekly commute'),
(2, 6, 150.00, '2025-09-03', 'Dental cleaning appointment'),

-- User 2 - August 2025
(2, 1, 180.00, '2025-08-31', 'Dinner celebration'),
(2, 6, 200.00, '2025-08-28', 'Medical checkup'),
(2, 3, 320.00, '2025-08-20', 'Holiday shopping spree'),
(2, 7, 380.00, '2025-08-18', 'Weekend getaway hotel'),

-- User 2 - July 2025
(2, 1, 38.50, '2025-07-25', 'Dinner out'),
(2, 2, 55.00, '2025-07-20', 'Car maintenance service'),
(2, 5, 95.00, '2025-07-15', 'Monthly utility bills'),
(2, 9, 45.00, '2025-07-10', 'Manicure and pedicure'),
(2, 6, 175.00, '2025-07-08', 'Medical consultation'),
(2, 1, 45.25, '2025-07-05', 'Dinner date'),

-- User 3 (Mike Johnson) - September 2025
(3, 2, 60.00, '2025-09-05', 'Train ticket'),
(3, 1, 35.75, '2025-09-04', 'Business lunch'),

-- User 3 - August 2025
(3, 7, 450.00, '2025-08-22', 'Hotel booking'),
(3, 1, 90.00, '2025-08-20', 'Dinner with partners'),

-- User 3 - July 2025
(3, 1, 55.25, '2025-07-28', 'Restaurant meal'),
(3, 7, 275.00, '2025-07-20', 'Conference hotel'),
(3, 12, 199.99, '2025-07-15', 'Wireless headphones'),
(3, 5, 145.00, '2025-07-10', 'Office utilities'),
(3, 7, 380.00, '2025-07-08', 'Business trip hotel'),
(3, 1, 52.75, '2025-07-05', 'Client lunch'),

-- User 4 (Sarah Wilson) - September 2025
(4, 8, 200.00, '2025-09-05', 'Excel online course'),
(4, 1, 31.25, '2025-09-04', 'Healthy lunch bowl'),

-- User 4 - August 2025
(4, 8, 150.00, '2025-08-20', 'Workshop fee'),
(4, 1, 65.00, '2025-08-18', 'Dinner with family'),

-- User 4 - July 2025
(4, 8, 99.99, '2025-07-25', 'Certification course'),
(4, 1, 42.75, '2025-07-20', 'Thanksgiving lunch'),
(4, 11, 60.00, '2025-07-15', 'Fitness membership'),
(4, 6, 180.00, '2025-07-10', 'Physical exam'),
(4, 8, 129.99, '2025-07-08', 'Language course'),

-- User 5 (Alex Chen) - September 2025
(5, 12, 1299.99, '2025-09-05', 'New MacBook Pro'),
(5, 1, 28.50, '2025-09-04', 'Sushi lunch'),

-- User 5 - August 2025
(5, 12, 599.99, '2025-08-25', 'Gaming monitor'),
(5, 7, 320.00, '2025-08-20', 'Conference travel'),

-- User 5 - July 2025
(5, 1, 95.50, '2025-07-15', 'Team dinner'),
(5, 8, 199.99, '2025-07-10', 'Cloud certification'),
(5, 12, 799.99, '2025-07-08', 'New smartphone'),

-- User 6 (Emma Davis) - September 2025
(6, 13, 450.00, '2025-09-05', 'Dining room furniture'),
(6, 1, 38.75, '2025-09-04', 'Family dinner'),

-- User 6 - August 2025
(6, 13, 299.99, '2025-08-22', 'Home decorations'),
(6, 1, 125.00, '2025-08-20', 'Family dinner'),
(6, 3, 280.00, '2025-08-18', 'Family shopping'),

-- User 6 - July 2025
(6, 7, 420.00, '2025-07-15', 'Vacation booking'),
(6, 13, 350.00, '2025-07-08', 'Living room makeover');

-- Verify data insertion
SELECT 'Users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Expenses', COUNT(*) FROM expenses;