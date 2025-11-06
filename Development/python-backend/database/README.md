# Database Setup for SportGear Online

## Database Structure
- **Database Name**: `sportgear_db`
- **Database System**: PostgreSQL
- **Tables**: `users`, `products`, `orders`, `payments`

## Quick Setup

### Method 1: Using SQL Script
```bash
psql -U postgres -h localhost -f init_database.sql








psql -U postgres -h localhost -d sportgear_db

















cat > database/setup_database.sh << 'EOF'
#!/bin/bash
echo "Setting up SportGear Online Database..."

# Execute the SQL script
psql -U postgres -h localhost -f init_database.sql

echo "Database setup completed!"
