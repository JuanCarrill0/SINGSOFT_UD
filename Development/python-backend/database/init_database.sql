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

-- Orders table (user_id references MySQL users via API validation)
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,  -- UUID from MySQL users table
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

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);

-- =============================================
-- Insert Sample Data (Optional - for testing)
-- =============================================

-- Sample Products
INSERT INTO products (name, description, price, category, stock_quantity) VALUES 
('Professional Football', 'Official size 5 football for professional matches', 49.99, 'Football', 50),
('Basketball Pro', 'High-quality indoor/outdoor basketball', 39.99, 'Basketball', 30),
('Running Shoes', 'Lightweight running shoes with cushion technology', 89.99, 'Footwear', 25),
('Yoga Mat', 'Non-slip premium yoga mat', 29.99, 'Fitness', 40),
('Tennis Racket', 'Professional tennis racket with carbon fiber', 129.99, 'Tennis', 15)
ON CONFLICT DO NOTHING;

-- NOTE: Orders and Payments require valid user_id from MySQL
-- Sample data should be created via API after user registration

-- =============================================
-- Display created tables and sample data
-- =============================================

\echo '=== Database Schema Created Successfully ==='
\dt

\echo '=== Sample Products ==='
SELECT id, name, price, category FROM products;

\echo '=== Database sportgear_db is ready! ==='
