#!/usr/bin/env bash

set -e
export LC_ALL=en_US.utf8

echo "Get installed Postgres version"
cd "C:/Program Files/PostgreSQL/"
postgres_version=$(ls -d * | grep -oP '[0-9]*' | sort -nr | head -n 1)
config_file="C:/PostgreSQL/${postgres_version}/data/postgresql.conf"

echo "Updating Postgres ${postgres_version} config"
echo "max_prepared_transactions = 16" >> "${config_file}"

echo "Starting Postgres ${postgres_version} service"
sc config "postgresql-x64-${postgres_version}" start=demand
net start "postgresql-x64-${postgres_version}"

echo "Change Postgres ${postgres_version} root password"
PGPASSWORD=root "C:/Program Files/PostgreSQL/${postgres_version}/bin/psql" -c "ALTER ROLE postgres $ATTRIBUTES PASSWORD '$PASSWORD';" -U postgres
