-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sportgear_db;
USE sportgear_db;

-- Drop table if exists (para desarrollo)
DROP TABLE IF EXISTS users;

-- Create users table QUE COINCIDA CON TU ENTIDAD
CREATE TABLE users (
    user_id BINARY(16) PRIMARY KEY,  -- Para UUID
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    phone_number VARCHAR(20),
    role ENUM('CUSTOMER', 'STORE_ADMIN', 'FINANCE_MANAGER', 'LOGISTICS_OPERATOR', 'SYSTEM_ADMIN'),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);