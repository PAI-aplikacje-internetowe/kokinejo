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

    const stmt = 'INSERT INTO users (name, password_hash) VALUES (?, ?)'
    const params = [data.name, data.password]

    // jako callback nie może być funkcji strzałkowej - z powodu dostępu do `this`
    db.run(stmt, params, function (err, _) {
        if (err) {
            res.status(400).json({"error": err.message})
            console.debug("ERROR EOEO");
            return;
        }
        res.json({
            "message": "success",
            "data": data,
            "id": this.lastID
        })
    });
});

module.exports = router;
