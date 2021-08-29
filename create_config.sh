#!/usr/bin/env bash

set -e # exit on error

# --------------------------------------- default variables - you can change it

ALLOW_LAN=false

BACKEND_PORT=3000
FRONTEND_PORT=8080

# --------------------------------------- Computed variables

DIR=$(dirname $0)
cd ${DIR}

BACKEND_DIR=${DIR}/backend
FRONTEND_DIR=${DIR}/frontend


write_config() {

if [ "$ALLOW_LAN" = true ]; then
  IP_LAN=$(ip route get 1 | sed -n 's/^.*src \([0-9.]*\) .*$/\1/p')
  ALLOW_LIST=http://localhost:${FRONTEND_PORT},http://${IP_LAN}:${FRONTEND_PORT}
else
  ALLOW_LIST=http://localhost:${FRONTEND_PORT}
fi

# Frontend configuration
cat << EOF > ${FRONTEND_DIR}/.env
VITE_ENDPOINT="http://localhost:${BACKEND_PORT}"
VITE_FRONTEND_HOST="0.0.0.0"
VITE_FRONTEND_PORT=${FRONTEND_PORT}
EOF

# Backend configuration
cat << EOF > ${BACKEND_DIR}/.env
ALLOW_LIST=${ALLOW_LIST}
PORT=${BACKEND_PORT}
EOF

}

help() {
  echo "Usage: $0 [OPTION...]"
  echo ""
  echo "  -b PORT        backend port"
  echo "  -f PORT        frontend port"
  echo "  -h             gives this help"
  echo "  -l             add local IP address to cors allow list"
}

print_config() {
  printf '%-15s %s\n'  \
        "Backend port" $BACKEND_PORT \
        "Frontend port" $FRONTEND_PORT \
        "Lan exposed" $ALLOW_LAN \
        "Allow list" $ALLOW_LIST
}

# --------------------------------------- Main

while getopts ":b:f:hl" option; do
  case $option in
  b)
    BACKEND_PORT="$OPTARG"
    ;;
  f)
    FRONTEND_PORT="$OPTARG"
    ;;
  h)
    help
    exit 0
    ;;
  l)
    ALLOW_LAN=true
    ;;
  \?)
    echo "Unknown option $OPTARG."
    help
    exit 1
    ;;
  esac
done

write_config
print_config
