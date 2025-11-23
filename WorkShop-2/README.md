# Workshop 2 – SportGear Online

## Project Overview
This document presents the conceptual and structural design of **SportGear Online**, an e-commerce platform specialized in sports equipment and apparel.  
The study integrates **business** and **technical** perspectives using four key design tools to create a comprehensive framework that links strategic vision with software implementation.  
The goal is to deliver an **efficient**, **scalable**, and **user-centered** digital solution.

## Authors
- **Juan Esteban Carrillo Garcia** – 20212020147  
- **Alejandro Sebastian Gonzalez Torres** – 20191020143  
- **Miguel Angel Babativa Nino** – 20191020069  

## Document Structure

### 1. Class Diagrams
The class model outlines the digital backbone of SportGear Online, centered on the customer journey—from browsing products to final order fulfillment.  
It establishes relationships between essential domain classes, ensuring realistic ownership structures and supporting the entire business operation.

### 2. Architecture Diagram
This section presents the **Integration Architecture Diagram**, detailing how internal modules and external systems interact to support a secure and scalable e-commerce environment.

Key components include:
- **Application Server / API Gateway**
- **Secure communication via RESTful APIs**
- **HTTPS protocol for encrypted connections**
- **Integration with external services**

### 3. Business Model Processes
The business processes describe a cyclical flow integrating three operational dimensions:

#### Frontstage
- Customer-facing experiences:  
  *Attraction → Conversion → Retention*

#### Backstage
- Internal operations:  
  *Inventory management → Order processing → Logistics*

#### Technology Platform
- Digital infrastructure automating and connecting all processes.

**Key documented processes include:**
- User Registration  
- Product Management  
- Inventory Reconciliation  
- Order Fulfillment  
- Discount Management  

### 4. Web UI Progress
This section showcases the visual evolution of the platform’s interface, highlighting a **modern**, **clean**, and **sports-inspired** design.

Featured mockups include:
- **Home Page** with navigation, product categories, and featured items  
- **Shopping Cart** with order summary and discount application  
- **Responsive layouts** adaptable to desktop and mobile  
- **Intuitive navigation** designed around user experience best practices  

## Technical Approach
The project incorporates multiple design methodologies to ensure both functional accuracy and technical robustness:

- **Business Model Canvas** — Strategic foundation  
- **User Stories** — User-oriented requirement definition  
- **User Story Mapping** — Structured visualization of full user journeys  
- **CRC Cards** — Class-Responsibility-Collaboration modeling for OO architecture  

## Key Design Features
- **Dedicated Money class** to ensure precision and avoid calculation errors  
- **Historical price tracking** via OrderItem snapshots  
- **Role-based employee access** (Store Admin, Finance Manager)  
- **Secure API integrations** with external services  
- **Comprehensive automation** of business processes  

## References
This project draws upon established software engineering resources and literature, including:

- CRC card methodology  
- UML modeling techniques  
- User Story Mapping frameworks  
- Enterprise Java and Spring Framework development practices  
