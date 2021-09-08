CREATE TABLE users
(
  id            integer PRIMARY KEY AUTOINCREMENT,
  name          string,
  password_hash string
);

CREATE TABLE tokens
(
  id      integer PRIMARY KEY AUTOINCREMENT,
  user_id integer NOT NULL REFERENCES users,
  token   string UNIQUE
);

CREATE TABLE kik
(
  id       integer PRIMARY KEY AUTOINCREMENT,
  state    string,
  user1_id integer REFERENCES users,
  user2_id integer REFERENCES users,
  joinable boolean
);

CREATE TABLE solitaire
(
  id       integer PRIMARY KEY AUTOINCREMENT,
  user_id  integer REFERENCES users,
  state    string,
  joinable boolean
);

CREATE TABLE crazy_eight
(
  id       integer PRIMARY KEY AUTOINCREMENT,
  state    string,
  user1_id integer REFERENCES users,
  user2_id integer REFERENCES users,
  user3_id integer REFERENCES users,
  user4_id integer REFERENCES users,
  joinable boolean
);

CREATE TABLE oczko
(
  id       integer PRIMARY KEY AUTOINCREMENT,
  state    string,
  user1_id integer REFERENCES users,
  user2_id integer REFERENCES users,
  user3_id integer REFERENCES users,
  user4_id integer REFERENCES users,
  joinable boolean
);

