CREATE TABLE users
(
    id            integer PRIMARY KEY AUTOINCREMENT,
    name          string,
    password_hash string
);

CREATE TABLE tokens
(
    id      integer PRIMARY KEY AUTOINCREMENT,
    user_id integer,
    token   string
);

CREATE TABLE solitaire
(
    id       integer PRIMARY KEY AUTOINCREMENT,
    user_id  integer,
    state    string,
    joinable boolean
);

CREATE TABLE crazy_eight
(
    id       integer PRIMARY KEY AUTOINCREMENT,
    state    string,
    user1_id integer,
    user2_id integer,
    user3_id integer,
    user4_id integer,
    joinable boolean
);

CREATE TABLE oczko
(
    id       integer PRIMARY KEY AUTOINCREMENT,
    state    string,
    user1_id integer,
    user2_id integer,
    user3_id integer,
    user4_id integer,
    joinable boolean
);

