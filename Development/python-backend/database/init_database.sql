-- =============================================
-- SportGear Online Database Initialization Script
-- PostgreSQL Database Setup
-- =============================================

-- Create database if it doesn't exist
SELECT 'CREATE DATABASE sportgear_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sportgear_db')\gexec

-- Connect to the database
\c sportgear_db;

-- =============================================
-- Create Tables
-- =============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    category VARCHAR(100),
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0),
    status VARCHAR(50) DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10,2) NOT NULL CHECK (amount >= 0),
    method VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =============================================
-- Create Indexes for better performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- =============================================
-- Insert Sample Data (Optional - for testing)
-- =============================================

-- Sample Users (passwords are hashed - 'password123')
INSERT INTO users (name, email, password) VALUES 
('Admin User', 'admin@sportgear.com', '$2b$12$hashed_password_here'),
('Juan Perez', 'juan@example.com', '$2b$12$hashed_password_here'),
('Maria Garcia', 'maria@example.com', '$2b$12$hashed_password_here')
ON CONFLICT (email) DO NOTHING;

-- Sample Products
INSERT INTO products (name, description, price, category, stock_quantity) VALUES 
('Professional Football', 'Official size 5 football for professional matches', 49.99, 'Football', 50),
('Basketball Pro', 'High-quality indoor/outdoor basketball', 39.99, 'Basketball', 30),
('Running Shoes', 'Lightweight running shoes with cushion technology', 89.99, 'Footwear', 25),
('Yoga Mat', 'Non-slip premium yoga mat', 29.99, 'Fitness', 40),
('Tennis Racket', 'Professional tennis racket with carbon fiber', 129.99, 'Tennis', 15)
ON CONFLICT DO NOTHING;

-- Sample Orders
INSERT INTO orders (user_id, total, status, shipping_address) VALUES 
(1, 89.99, 'completed', '123 Main St, Bogotá, Colombia'),
(2, 169.98, 'processing', '456 Oak Ave, Medellín, Colombia')
ON CONFLICT DO NOTHING;

-- Sample Payments
INSERT INTO payments (order_id, amount, method, status, transaction_id) VALUES 
(1, 89.99, 'credit_card', 'completed', 'TXN_001'),
(2, 169.98, 'paypal', 'pending', 'TXN_002')
ON CONFLICT DO NOTHING;

-- =============================================
-- Display created tables and sample data
-- =============================================

\echo '=== Database Schema Created Successfully ==='
\dt

\echo '=== Sample Users ==='
SELECT id, name, email FROM users;

\echo '=== Sample Products ==='
SELECT id, name, price, category FROM products;

\echo '=== Database sportgear_db is ready! ==='
