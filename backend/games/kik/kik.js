const express = require('express');
const router = express.Router();
const db = require('../../db');
const {getState} = require("./utils");

router.get('/', function (req, res) {
    res.json({
        gameName: "Kółko i krzyżyk",
        players: 2,
    });
});

router.get('/available_games', function (req, res) {
    const stmt = db.prepare(`SELECT id, user1_id, user2_id
                             FROM kik
                             WHERE joinable == true`);

    try {
        const rows = stmt.all();
        const availableGames = rows.map(row => {
            return {
                id: row.id,
                userIds: [row.user1_id, row.user2_id]
            }
        })
        res.json({
            status: "ok",
            availableGames: availableGames
        })
    } catch (e) {
        res.status(400).json({
            status: "error",
            error: e.message
        });
    }
});

router.get('/:gameId/join', function (req, res) {
    const gameId = req.params.gameId
    try {
        const state = getState(gameId);
        res.json({
            status: "ok",
            gameState: state
        });
    } catch (e) {
        console.error(e);
        res.status(400).json({
            status: "error",
            error: e.message
        })
    }
});

router.get('/:gameId/leave', function (req, res) {
    res.json({
        status: "NotImplemented",
    });
});

router.get('/:gameId/ready', function (req, res) {
    res.json({
        status: "NotImplemented",
    });
});

router.get('/:gameId/state', function (req, res) {
    res.json({
        status: "NotImplemented",
        gameState: {},
    });
});

router.post('/:gameId/make_move', function (req, res) {
    res.json({
        status: "NotImplemented",
        gameState: {},
    });
});

module.exports = router;
