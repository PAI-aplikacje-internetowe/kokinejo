#!/usr/bin/env bash

set -e # exit on error
DIR=$(dirname $0)
cd ${DIR}
DIR=$(pwd)

BACKEND_DIR=${DIR}/backend
FRONTEND_DIR=${DIR}/frontend


# --------------------------------------- Functions


check_env_files() {
  if [[ ! -f "$BACKEND_DIR/.env" && ! -f "$FRONTEND_DIR/.env" ]]; then
    echo "Backend and frontend .env files do not exist. Default configurations will be used"
    echo "If you want to generate config files run create-config.sh"
  elif [[ ! -f "$BACKEND_DIR/.env" ]]; then
    echo "Backend .env file does not exist. Default configuration will be used"
    echo "If you want to generate config file run create-config.sh"
  elif [[ ! -f "$FRONTEND_DIR/.env" ]]; then
    echo "Frontend .env file does not exist. Default configuration will be used"
    echo "If you want to generate config file run create-config.sh"
  fi
}

build_backend() {
  if [[ ! -d "$BACKEND_DIR/node_modules" ]]; then
    cd ${BACKEND_DIR}
    npm install
  fi
}

run_backend() {
  cd ${BACKEND_DIR}
  if [[ -f ".env" ]]; then
    BACKEND_PORT=$(grep "PORT" .env | cut -d '=' -f2)
  else
    BACKEND_PORT=3000
  fi
  ./run.sh -p "$BACKEND_PORT"
}

build_frontend() {
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    cd ${FRONTEND_DIR}
    npm install
    npm run build
  elif [ -f ".config_has_changed" ]; then
    echo "Config has changed, building frontend"
    cd ${FRONTEND_DIR}
    npm run build
  fi
}

run_frontend() {
  cd ${FRONTEND_DIR}
  if [[ -f ".env" ]]; then
    FRONTEND_PORT=$(grep "VITE_FRONTEND_PORT" .env | cut -d '=' -f2)
  else
    FRONTEND_PORT=8080
  fi
  npm run serve -- --port "$FRONTEND_PORT"
}

# --------------------------------------- Main

check_env_files
build_backend
build_frontend
(trap 'kill 0' SIGINT; run_backend & run_frontend)
