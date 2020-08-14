#!/usr/bin/env bash

set -e

echo "Updating postgres config"
echo max_prepared_transactions = 16 >> "C:\Program Files\PostgreSQL\12\data\postgresql.conf"	

echo "Starting postgres service"
sc config postgresql-x64-12 start=demand
net start postgresql-x64-12

echo "Change password"
"C:/Program Files/PostgreSQL/12/bin/psql" -c "ALTER ROLE postgres $ATTRIBUTES PASSWORD 'postgres';" -U postgres
