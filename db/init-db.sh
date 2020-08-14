#!/usr/bin/env bash

set -e

cd $BASE_DIR

echo "Unpacking migrations"
7z x migrations.zip -omigrations -aoa

echo "Creating database"
if [[ $MODE == 'docker' ]]
then
    docker exec exivity-postgres createdb -U postgres $DB_NAME
else
    unameOut="$(uname -s)"
    case "${unameOut}" in
        Linux*)     sudo -u postgres createdb $DB_NAME ;;
        *)          PGPASSWORD=postgres "C:/Program Files/PostgreSQL/12/bin/createdb" -U postgres $DB_NAME
    esac
    
fi

echo "Running migrations"
chmod u+x bin/$MIGRATE_BIN
./bin/$MIGRATE_BIN -path=migrations -database="postgres://postgres:postgres@localhost:5432/${DB_NAME}?sslmode=disable" up
