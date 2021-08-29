#!/usr/bin/env bash

set -e # exit on error
DIR=$(dirname $0)
cd ${DIR}
DIR=$(pwd)

BACKEND_DIR=${DIR}/backend
FRONTEND_DIR=${DIR}/frontend

DEV_MODE=false


# --------------------------------------- Functions

help() {
  echo "Usage: $0 [OPTION...]"
  echo ""
  echo "  -d             run in development mode (app reacts to code change)"
  echo "  -h             gives this help"
}

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
  if [ "$DEV_MODE" = true ]; then
    echo "running backend in dev mode"
    ./run.sh -d -p $BACKEND_PORT
  else
    ./run.sh -p $BACKEND_PORT
  fi
}

build_frontend() {
  if [[ ! -d "$FRONTEND_DIR/node_modules" ]]; then
    cd ${FRONTEND_DIR}
    npm install
  fi

  if [[ -f ".config_has_changed" && "$DEV_MODE" = false ]]; then
    rm ".config_has_changed"
    echo "Config has changed, building frontend"
    cd ${FRONTEND_DIR}
    npm run build
  elif [[ ! -d "$FRONTEND_DIR/dist" ]]; then
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

  if [ "$DEV_MODE" = true ]; then
    npm run dev -- --port "$FRONTEND_PORT"
  else
    npm run serve -- --port "$FRONTEND_PORT"
  fi
}

# --------------------------------------- Main


while getopts ":dh" option; do
  case $option in
  d)
    DEV_MODE=true
    ;;
  h)
    help
    exit 0
    ;;
  \?)
    echo "Unknown option $OPTARG."
    help
    exit 1
    ;;
  esac
done

check_env_files
build_backend
build_frontend
(trap 'kill 0' SIGINT; run_backend & run_frontend)
