const Database = require('better-sqlite3');

const DB_SOURCE = "./database.db";

const db = new Database(DB_SOURCE, {verbose: console.debug});

module.exports = db;
