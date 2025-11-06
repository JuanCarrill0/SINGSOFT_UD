-- =============================================
-- SportGear Online - Database Schema Documentation
-- Generated: $(date)
-- =============================================

-- Database: sportgear_db
-- Purpose: E-commerce platform for sports equipment

-- =============================================
-- Table: users
-- Purpose: Store user accounts (customers and admins)
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Table: products  
-- Purpose: Product catalog and inventory
-- =============================================
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE
);

-- =============================================
-- Table: orders
-- Purpose: Customer orders and status tracking
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- =============================================
-- Table: payments
-- Purpose: Payment transactions and processing
-- =============================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- =============================================
-- Sample Data for Testing
-- =============================================
INSERT INTO users (name, email, password) VALUES 
('Admin User', 'admin@sportgear.com', 'hashed_password_123'),
('Test Customer', 'customer@example.com', 'hashed_password_456')
ON CONFLICT (email) DO NOTHING;

INSERT INTO products (name, description, price, category) VALUES 
('Professional Football', 'Size 5 official match football', 49.99, 'Football'),
('Basketball Pro', 'High-quality basketball', 39.99, 'Basketball')
ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, total, status) VALUES 
(1, 49.99, 'completed'),
(2, 39.99, 'processing')
ON CONFLICT DO NOTHING;

INSERT INTO payments (order_id, amount, method, status) VALUES 
(1, 49.99, 'credit_card', 'completed'),
(2, 39.99, 'paypal', 'pending')
ON CONFLICT DO NOTHING;
