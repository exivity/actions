#!/usr/bin/env bash

cd ../.db-artefacts

echo "Unpacking migrations"
7z x migrations.zip -omigrations -aoa

echo "Creating database"
docker exec exivity-postgres createdb -U postgres $DB_NAME

echo "Running migrations"
chmod u+x bin/$MIGRATE_BIN
./bin/$MIGRATE_BIN -path=migrations -database="postgres://postgres:postgres@localhost:5432/${DB_NAME}?sslmode=disable" up
