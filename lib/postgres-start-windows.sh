#!/usr/bin/env bash

set -e

echo "Updating postgres config"
echo max_prepared_transactions = 16 >> "C:\Program Files\PostgreSQL\14\data\postgresql.conf"	

echo "Starting postgres service"
sc config postgresql-x64-14 start=demand
net start postgresql-x64-14

echo "Change password"
PGPASSWORD=root "C:/Program Files/PostgreSQL/14/bin/psql" -c "ALTER ROLE postgres $ATTRIBUTES PASSWORD '$PASSWORD';" -U postgres
