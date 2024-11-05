#!/usr/bin/env bash

set -e

echo "Get installed Postgres version"
cd "/etc/postgresql/"
postgres_version=$(ls -d * | grep -oP '[0-9]*' | sort -nr | head -n 1)

echo "Updating Postgres ${postgres_version} config"
sudo -u postgres chmod 777 "/etc/postgresql/${postgres_version}/main/postgresql.conf"
sudo echo "max_prepared_transactions = 16" >> "/etc/postgresql/${postgres_version}/main/postgresql.conf"

echo "Starting Postgres ${postgres_version} service"
sudo service postgresql start

echo "Change Postgres ${postgres_version} root password"
sudo -u postgres psql -c "ALTER ROLE postgres $ATTRIBUTES PASSWORD '$PASSWORD';"
