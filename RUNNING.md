# Kokinejo

## Docker

Instead of reading everything below you can just use docker or docker-compose.
Docker image is `wlepich/kokinejo`.

In the main directory there is a `docker-compose.yml` file, so you can
run it by typing `docker-compose up`.

## Configuration 

Run `create_config.sh` once. It will create .env files in both
backend directory and frontend directory. It will contain configuration
for applications. With `-h` argument, you can see its capabilities.
You can choose ports for both applications and choose if you want to
add your local IP address to CORS allow list.

## Running 

For running please use the `run.sh` script.

## Requirements

In order to run the application you will need:

- npm, node
- sqlite3
