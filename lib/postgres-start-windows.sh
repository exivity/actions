#!/usr/bin/env bash

set -e

echo "Updating postgres config"
echo max_prepared_transactions = 16 >> "C:\Program Files\PostgreSQL\13\data\postgresql.conf"	

echo "Starting postgres service"
sc config postgresql-x64-13 start=demand
net start postgresql-x64-13

echo "Change password"
PGPASSWORD=root "C:/Program Files/PostgreSQL/13/bin/psql" -c "SET password_encryption = '$ENCRYPTION';ALTER ROLE postgres $ATTRIBUTES PASSWORD '$PASSWORD';" -U postgres
