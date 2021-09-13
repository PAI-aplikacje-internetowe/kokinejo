FROM ubuntu:20.04

RUN apt-get update &&  \
    DEBIAN_FRONTEND=noninteraactive \
    apt-get -y install \
    build-essential \
    sqlite3 \
    curl

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -

RUN apt-get install nodejs

RUN ["mkdir", "-p", "kokinejo"]
WORKDIR /kokinejo

COPY . .

RUN ["bash", "-e", "--", "run.sh", "-b"]

CMD ["bash", "-e", "run.sh"]

EXPOSE 3000 8080
