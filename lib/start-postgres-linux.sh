#!/usr/bin/env bash

set -e

echo "Updating postgres config"
sudo -u postgres chmod 777 /etc/postgresql/12/main/postgresql.conf
sudo echo max_prepared_transactions = 16 >> /etc/postgresql/12/main/postgresql.conf	

echo "Starting postgres service"
sudo service postgresql start

echo "Change password"
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'postgres';"
