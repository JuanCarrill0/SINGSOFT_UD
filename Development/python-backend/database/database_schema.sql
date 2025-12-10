-- =============================================
-- SportGear Online - Database Schema Documentation
-- Generated: $(date)
-- =============================================

-- Database: sportgear_db
-- Purpose: E-commerce platform for sports equipment

-- =============================================
-- Table: customer_profiles
-- Purpose: Store local customer profile data referencing external identity (UUID)
-- =============================================
CREATE TABLE IF NOT EXISTS customer_profiles (
    id SERIAL PRIMARY KEY,
    external_user_id VARCHAR(36) UNIQUE NOT NULL,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
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
    user_id VARCHAR(36) NOT NULL, -- External UUID from Auth service
    total DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

-- =============================================
-- Table: order_items
-- Purpose: Order line items linking products to orders
-- =============================================
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL
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
INSERT INTO customer_profiles (external_user_id, name, email) VALUES 
('11111111-1111-1111-1111-111111111111', 'Admin User', 'admin@sportgear.com'),
('22222222-2222-2222-2222-222222222222', 'Test Customer', 'customer@example.com')
ON CONFLICT (external_user_id) DO NOTHING;

INSERT INTO products (name, description, price, category) VALUES 
('Professional Football', 'Size 5 official match football', 49.99, 'Football'),
('Basketball Pro', 'High-quality basketball', 39.99, 'Basketball')
ON CONFLICT DO NOTHING;

INSERT INTO orders (user_id, total, status) VALUES 
('11111111-1111-1111-1111-111111111111', 49.99, 'completed'),
('22222222-2222-2222-2222-222222222222', 39.99, 'processing')
ON CONFLICT DO NOTHING;

INSERT INTO payments (order_id, amount, method, status) VALUES 
(1, 49.99, 'credit_card', 'completed'),
(2, 39.99, 'paypal', 'pending')
ON CONFLICT DO NOTHING;
