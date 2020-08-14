#!/usr/bin/env bash

set -e

echo "Updating postgres config"
echo max_prepared_transactions = 16 >> "C:\Program Files\PostgreSQL\12\data\postgresql.conf"	
echo "::add-path::C:\Program Files\PostgreSQL\12\bin"	

echo "Starting postgres service"
sc config postgresql-x64-12 start=demand
net start postgresql-x64-12

echo "Change password"
PGPASSWORD=root psql -c "ALTER USER postgres PASSWORD 'postgres';" -U postgres
