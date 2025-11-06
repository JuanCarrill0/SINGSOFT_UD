#!/bin/bash
echo "Setting up SportGear Online Database..."

# Execute the SQL script
psql -U postgres -h localhost -f init_database.sql

echo "Database setup completed!"
