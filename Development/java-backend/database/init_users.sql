USE sportgear_db;

-- Delete existing test users first
DELETE FROM users WHERE email IN ('admin@sportgear.com', 'store@sportgear.com', 'finance@sportgear.com', 'logistics@sportgear.com', 'customer1@example.com', 'customer2@example.com', 'customer3@example.com');

-- Insertar usuarios de ejemplo
-- Contraseña para todos: password123
-- NOTA: Este hash es válido y fue generado con BCrypt por Spring Security
INSERT INTO users (userid, email, password_hash, first_name, last_name, date_of_birth, phone_number, role, status, created_at) VALUES
(UNHEX(REPLACE(UUID(), '-', '')), 'admin@sportgear.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Admin', 'User', '1990-01-01', '+1234567890', 'SYSTEM_ADMIN', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'store@sportgear.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Store', 'Manager', '1992-03-15', '+1234567891', 'STORE_ADMIN', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'finance@sportgear.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Finance', 'Manager', '1988-07-20', '+1234567892', 'FINANCE_MANAGER', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'logistics@sportgear.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Logistics', 'Operator', '1995-11-30', '+1234567893', 'LOGISTICS_OPERATOR', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'customer1@example.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'John', 'Doe', '1995-05-15', '+1234567894', 'CUSTOMER', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'customer2@example.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Jane', 'Smith', '1998-08-22', '+1234567895', 'CUSTOMER', 'ACTIVE', NOW()),
(UNHEX(REPLACE(UUID(), '-', '')), 'customer3@example.com', '$2a$10$lAaNIsj6MASSP5lLunP19u.bcItqW3swvEvruMyuAXIgTL.AfEWCy', 'Mike', 'Johnson', '1993-12-10', '+1234567896', 'CUSTOMER', 'ACTIVE', NOW());

-- Verificar que se insertaron correctamente
SELECT COUNT(*) as total_users FROM users;
SELECT email, first_name, last_name, role FROM users;
