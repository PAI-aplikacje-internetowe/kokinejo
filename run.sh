#!/usr/bin/env bash

export PORT=3000

DIR=$(dirname $0)
BACKEND_ROOT="$DIR/backend"

DB_SCHEMA="database.sql"
DB_SCHEMA_PATH="$DIR/$DB_SCHEMA"

DB_FILE="database.db"
DB_PATH="$BACKEND_ROOT/$DB_FILE"

usage() {
  echo "./run.sh"
  echo "    -h --help"
  echo "    -c --clear         remove database"
  echo "    -p --port <PORT>   use specific port, default: 3000"
}

createDbIfMissing() {
  echo "Creating database $DB_PATH..."
  if [ ! -f "$DB_PATH" ]; then
    cat "$DB_SCHEMA_PATH" | sqlite3 "$DB_PATH"
  fi
  echo "Database $DB_PATH created"
}

_clear() {
  echo "Removing database $DB_PATH..."
  rm -f "$DB_PATH"
  echo "Removed"
}

runBackend() {
  cd ${BACKEND_ROOT}
  npm start
}

trap ctrl_c INT
ctrl_c() {
  echo "Shutting down application"
  echo "Releasing port $PORT"
  echo "Goodbye!"
}

#################################################### MAIN

while [ "$1" != "" ]; do
  case $1 in
  -h | --help)
    usage
    exit 0
    ;;
  -c | --clear)
    _clear
    exit 0
    ;;
  -p | --port)
    PORT="$2"
    shift
    ;;
  *)
    echo "ERROR: unknown parameter $1"
    usage
    exit 1
    ;;
  esac
  shift
done

echo "Welcome to Kokinejo backend application"
createDbIfMissing
runBackend
