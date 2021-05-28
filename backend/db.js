const sqlite3 = require('sqlite3').verbose();

const DB_SOURCE = "./database.db";

const db = new sqlite3.Database(DB_SOURCE, (err) => {
    if (err) {
        console.error("Can' open database");
        console.error(JSON.stringify(err));
    } else {
        console.debug("Connected to SQLite database");
    }
});

module.exports = db;
