const express = require('express');
const router = express.Router();
const db = require('../db');
const utils = require('../utils');

const GAME_NAME = "tic-tac-toe";

const gameUtilsFactory = require('./gameUtils');
const kikUtils = gameUtilsFactory(GAME_NAME);

router.get('/', function (req, res) {
    res.json({
        gameName: kikUtils.gameName,
        players: kikUtils.playerCount
    });
});

router.get('/available_games', function (req, res) {
    try {
        const availableGames = kikUtils.availableGames();
        res.json({
            status: "ok",
            availableGames: availableGames
        })
    } catch (e) {
        utils.badRequest(res, e, "kik available_games")
    }
});

router.get('/:gameId/join', function (req, res) {
    const gameId = req.params.gameId

    let userId;
    if (!req.query.userId) {
        utils.badRequest(res, new Error("No userId provided"));
        return
    }
    try {
        userId = parseInt(req.query.userId);
        const data = kikUtils.joinGame(gameId, userId);
        res.json(data)
    } catch (e) {
        utils.badRequest(res, e);
    }
});

router.get('/:gameId/leave', function (req, res) {
    const gameId = req.params.gameId

    let userId;
    if (!req.query.userId) {
        utils.badRequest(res, new Error("No userId provided"));
        return
    }
    try {
        userId = parseInt(req.query.userId);
        const data = kikUtils.leaveGame(gameId, userId);
        res.json(data)
    } catch (e) {
        utils.badRequest(res, e);
    }
});

// TODO: Co ma robić ready? Każdy gracz osobno jest "ready" czy to sygnał do startu gry?
router.get('/:gameId/ready', function (req, res) {
    const gameId = req.params.gameId

    // każdy osobno
    // let userId;
    // if (!req.query.userId) {
    //     utils.badRequest(res, new Error("No userId provided"));
    //     return
    // }
    // try {
    //     userId = parseInt(req.query.userId);
    //     const data = kikUtils.leaveGame(gameId, userId);
    //     res.json(data)
    // } catch (e) {
    //     utils.badRequest(res, e);
    // }

    try {
        const data = kikUtils.ready(gameId)
        res.json(data);
    } catch (e) {
        utils.badRequest(res, e);
    }
});

router.get('/:gameId/state', function (req, res) {
    const gameId = req.params.gameId

    try {
        const state = kikUtils.getState(gameId);
        res.json(state);
    } catch (e) {
        utils.badRequest(res, e, "kik available_games")
    }
});

router.post('/:gameId/make_move', function (req, res) {
    res.json({
        status: "NotImplemented",
        gameState: {},
    });
});

module.exports = router;
