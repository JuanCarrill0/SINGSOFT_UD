# Workshop 3 – SportGear Online: Backend, Frontend and Testing Implementation

## Project Overview
This technical report presents the implementation phase of the **SportGear Online** e-commerce platform, focusing on backend service development, frontend integration, and full testing coverage.  
The project implements a **distributed full-stack architecture** composed of two independent backend services and a React frontend.  
All components were developed following **Test-Driven Development (TDD)** to ensure reliability, maintainability, and code quality.

## Authors
- **Juan Esteban Carrillo Garcia** – 20212020147  
- **Alejandro Sebastián González Torres** – 20191020143  
- **Miguel Angel Babativa Niño** – 20191020069  

# Technical Architecture

## Backend Services

### 1. Spring Boot Authentication Service (Java)
- Manages user registration, authentication, and JWT token generation  
- Uses **MySQL** for user data persistence  
- Implements **Spring Security** with JWT validation  
- Exposes REST API endpoints for user management  

### 2. FastAPI Business Logic Service (Python)
- Handles product catalog, orders, and payment processing  
- Uses **PostgreSQL** for business data  
- CRUD operations implemented using **SQLAlchemy ORM**  
- Automatically generates API documentation with **Swagger UI**

## Frontend

### React Application
- Modern and responsive user interface for e-commerce operations  
- Communicates with both backend services via **REST APIs**  
- Implements user authentication, product browsing, and order management  
- Uses JWT tokens stored in Local Storage for secure API communication  

# Key Features Implemented

## Authentication & Security
- User registration and login with JWT  
- Secure password hashing  
- Token-based API authorization  
- CORS configuration for cross-origin communication  

## Product Management
- Full CRUD operations  
- Dynamic product catalog  
- Inventory and category management  

## Order Processing
- Shopping cart functionality  
- Order creation, tracking and status management  
- Payment processing simulation  
- Order history per user  

# Testing Strategy

- Development followed a **Test-Driven Development (TDD)** methodology  
- **JUnit 5** tests for the Spring Boot authentication backend  
- **Pytest** test suite for the FastAPI backend  
- **Postman** used for API endpoint validation  
- Unit and integration testing across services  

# Technical Stack

## Backend Technologies
- Java **Spring Boot 3**  
- Python **FastAPI**  
- **MySQL** (Authentication data)  
- **PostgreSQL** (Business data)  
- **JWT** authentication  
- **SQLAlchemy** ORM  

## Frontend Technologies
- **React**  
- **REST API** communication  
- **Local Storage** token persistence  

## Testing Tools
- **JUnit 5**  
- **Pytest**  
- **Postman**

# Project Structure

sportgear-online/
├── auth-backend/ (Spring Boot)
│   ├── controllers/
│   ├── models/
│   ├── repositories/
│   ├── security/
│   └── tests/
├── business-backend/ (FastAPI)
│   ├── routes/
│   ├── models/
│   ├── schemas/
│   └── tests/
└── frontend/ (React)
    ├── components/
    ├── pages/
    └── services/

# API Endpoints

## Authentication Service (Spring Boot)
- POST /api/auth/register – Register user  
- POST /api/auth/login – Authenticate user  
- GET /api/auth/users/{id} – Retrieve user data  

## Business Logic Service (FastAPI)
- GET /products – Get all products  
- POST /products – Create product  
- GET /orders – Retrieve orders  
- POST /payments – Process payment  
- GET /users – List users  

# Testing Results

## Java Backend (Spring Boot)
- Full JUnit test suite executed  
- Validated authentication flow  
- Verified JWT generation and decoding  
- Confirmed database persistence integrity  

## Python Backend (FastAPI)
- Pytest coverage: **68%**  
- Verified CRUD flows  
- Schema validation tests  
- API reliability and correctness tests  

# Key Achievements
- Successful integration of Java and Python distributed backends  
- Secure JWT-based authentication system  
- Comprehensive testing under TDD  
- Fully functional e-commerce workflow  
- Modular architecture enabling independent scaling  
- Clean and maintainable codebase  

# Challenges Addressed
- Communication between heterogeneous backends  
- JWT token validation and expiration handling  
- Data consistency across distributed components  
- Unified testing approach for two different tech stacks  
- Frontend synchronization with both services  

# Future Work
Planned for **Workshop 4**:

- Docker & Docker Compose containerization  
- Cucumber BDD acceptance testing  
- Performance testing with Apache JMeter  
- CI/CD pipeline with GitHub Actions  
- Deployment-ready production setup  

# Academic Context
This project was developed for the **Software Engineering Seminar** course at **Francisco José de Caldas District University**, demonstrating practical skills in distributed systems, quality assurance, and software engineering best practices.
"""