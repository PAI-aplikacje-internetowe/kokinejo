const debug = require('debug')('backend:users');
const db = require('../db');
const bcrypt = require('bcrypt');
const { v4: uuid } = require('uuid');

const saltRounds = 11;

const getUserByName = db.prepare(`SELECT id
    , name
    , password_hash
  FROM users
  WHERE name = ?`);
const check =(username, password, callback = (_, x) => x) => {
  debug('check: %o', username);
  const user = getUserByName.get(username);
  if (user === undefined)
    return callback(null, false);
  bcrypt.compare(password, user.password_hash).then((match) => {
    if (!match)
      return callback(null, false);

    return callback(null, {
      id: user.id,
      name: user.name,
    });
  });
};

const addUser = db.prepare(`INSERT INTO users
  (name, password_hash)
  VALUES (?, ?)`);
const create = (username, password) => {
  debug('create: %o', username);
  const user = getUserByName.get(username);
  if (user !== undefined)
    return Promise.reject('User already exists');
  return bcrypt.hash(password, saltRounds).then((hash) => {
    const info = addUser.run(username, hash);
    return {
      id: info.lastInsertRowid,
      username,
    }
  });
};

const createToken = db.prepare(`INSERT INTO tokens
  (user_id, token)
  VALUES (?, ?)`);
const newToken = (user_id) => {
  debug('createToken: %o', user_id);
  if (!user_id)
    return Promise.reject('Wrong user_id');
  const token = uuid();
  createToken.run(user_id, token);
  return Promise.resolve(token);
};

const getUserById = db.prepare(`SELECT id
    , name
  FROM users
  WHERE id = ?`);
const getToken = db.prepare(`SELECT user_id
  FROM tokens
  WHERE token = ?`);
const checkToken = (token, callback = (_, x) => x) => {
  debug('checkToken: %o', token);
  if (!token || !token.length || token.length != 36)
    return callback(null, false);
  const { user_id } = getToken.get(token) || {};
  if (user_id === undefined)
    return callback(null, false);
  const user = getUserById.get(user_id);
  if (user === undefined)
    return callback(null, false);
  return callback(null, user);
};

module.exports = {
  check,
  create,
  newToken,
  checkToken,
}
