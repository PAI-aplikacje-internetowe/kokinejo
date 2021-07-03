const Database = require('better-sqlite3');
const debug = require('debug')('backend:db');
const debug_operations = require('debug')('backend:db_operations');
const fs = require('fs');

const DB_SOURCE = "./database.db";
const DB_INIT = './database.sql';

const db = new Database(DB_SOURCE, {verbose: debug_operations});

const stmt = db.prepare(`SELECT count(*) AS 'count'
FROM sqlite_master
WHERE
	type='table'
;`);
const row = stmt.get();
if (row === undefined || row.count == 0) {
	debug('Initializing');
	db.exec(fs.readFileSync(DB_INIT).toString());
	debug('Initialized');
}

module.exports = db;
