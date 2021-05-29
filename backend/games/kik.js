const express = require('express');
const router = express.Router();

const gameState = {
    currentPlayer: 1,
    players: [1, 2],
    board: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]
};

router.get('/', function(req, res) {
    res.json({
        gameName: "Kółko i krzyżyk",
        players: 2,
    });
});

router.get('/available_games', function(req, res) {
    res.json({
        status: "ok",
        gamesIds: [1, 2, 3],
    });
});

router.get('/:gameId/join', function(req, res) {
    res.json({
        status: "ok",
        gameState: gameState,
    });
});

router.get('/:gameId/leave', function(req, res) {
    res.json({
        status: "ok",
    });
});

router.get('/:gameId/ready', function(req, res) {
    res.json({
        status: "ok",
    });
});

router.get('/:gameId/state', function(req, res) {
    res.json({
        status: "ok",
        gameState: gameState,
    });
});

router.post('/:gameId/make_move', function(req, res) {
    res.json({
        status: "ok",
        gameState: gameState,
    });
});

module.exports = router;
