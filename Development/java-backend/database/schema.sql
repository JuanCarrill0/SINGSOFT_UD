-- Create database if not exists
CREATE DATABASE IF NOT EXISTS sportgear_db;
USE sportgear_db;

-- Drop tables if exists (para desarrollo)
DROP TABLE IF EXISTS addresses;
DROP TABLE IF EXISTS users;

-- Create users table QUE COINCIDA CON TU ENTIDAD
CREATE TABLE users (
    userid BINARY(16) PRIMARY KEY,  -- Para UUID (debe coincidir con @Id en User entity)
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    date_of_birth DATE,
    phone_number VARCHAR(255),
    role ENUM('CUSTOMER', 'STORE_ADMIN', 'FINANCE_MANAGER', 'LOGISTICS_OPERATOR', 'SYSTEM_ADMIN'),
    status ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);