const express = require('express');
const router = express.Router();

const db = require('../db');

function hashPassword(plaintext) {
    return `HASHED_:)_${plaintext}`;
}

// url to:  localhost:3000/signup/
//                           ^   ^
//                           |   L__ z router.post('/', ...)
//                      z app.js
router.post('/', (req, res) => {

    const errors = [];
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.name) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({"error": errors.join(",")});
        return;
    }

    const data = {
        name: req.body.name,
        password: hashPassword(req.body.password)
    };

    const stmt = db.prepare('INSERT INTO users (name, password_hash) VALUES (?, ?)');
    const params = [data.name, data.password];
    try {
        const info = stmt.run(...params);
        res.json({
            message: "success",
            id: info.lastInsertRowid
        })
    } catch (e) {
        console.error(e);
        res.status(400).json({
            error: e.message
        })
    }
});

module.exports = router;
