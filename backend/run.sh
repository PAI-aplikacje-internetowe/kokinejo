#!/usr/bin/env bash

set -e

export PORT=3000

DIR=$(dirname $0)
BACKEND_ROOT="$DIR"

DB_SCHEMA="database.sql"
DB_SCHEMA_PATH="$DIR/$DB_SCHEMA"

DB_FILE="database.db"
DB_PATH="$BACKEND_ROOT/$DB_FILE"

DEV_MODE=false

usage() {
  echo "./run.sh"
  echo "    -h"
  echo "    -c                 remove database"
  echo "    -d                 run in development mode"
  echo "    -p                 use specific port, default: 3000"
}

createDbIfMissing() {
  if [ ! -f "$DB_PATH" ]; then
    echo "Creating database $DB_PATH..."
    sqlite3 "$DB_PATH" ".read '$DB_SCHEMA_PATH'"
    echo "Database $DB_PATH created"
  fi
}

_clear() {
  echo "Removing database $DB_PATH..."
  rm -f "$DB_PATH"
  echo "Removed"
}

runBackend() {
  cd ${BACKEND_ROOT}
  if [ "$DEV_MODE" = true ]; then
    exec npm run dev -- --port "$PORT"
  else
    exec npm run start -- --port "$PORT"
  fi
}

trap ctrl_c INT
ctrl_c() {
  echo "Shutting down application"
  echo "Releasing port $PORT"
  echo "Goodbye!"
}

#################################################### MAIN

while getopts ":hcdp:" option; do
  case $option in
  h)
    usage
    exit 0
    ;;
  c)
    _clear
    exit 0
    ;;
  d)
    DEV_MODE=true
    ;;
  p)
    PORT="$OPTARG"
    ;;
  \?)
    echo "ERROR: unknown parameter $OPTARG"
    usage
    exit 1
    ;;
  esac
done

echo "Welcome to Kokinejo backend application"
createDbIfMissing
runBackend
