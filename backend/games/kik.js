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
    const gameId = req.params.gameId;

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
    const gameId = req.params.gameId;

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

router.get('/:gameId/ready', function (req, res) {
    const gameId = req.params.gameId;

    try {
        const data = kikUtils.ready(gameId)
        res.json(data);
    } catch (e) {
        utils.badRequest(res, e);
    }
});

router.get('/:gameId/state', function (req, res) {
    const gameId = req.params.gameId;

    try {
        const gameData = kikUtils.data(gameId);
        res.json({
            status: "ok",
            userIds: gameData.userIds,
            gameState: gameData.gameState
        });
    } catch (e) {
        utils.badRequest(res, e, "kik available_games")

    }
});

router.post('/:gameId/make_move', function (req, res) {
    const gameId = req.params.gameId;

    let bodyErrors = findBodyErrors();
    if (bodyErrors.length) {
        utils.badRequest(res, new Error(bodyErrors));
        return;
    }

    const playerId = req.body.playerId;
    const move = req.body.move;
    const gameData = kikUtils.data(gameId);

    try {
        validateMove(gameData);
    } catch (e) {
        utils.badRequest(res, e);
        return;
    }

    let newState = gameData.gameState;
    newState.board[move] = getPlayerSymbol(playerId, gameData.userIds);

    let winningCombo = findWinningCombo(newState.board);
    let winnerId = null;

    if (winningCombo) {
        winnerId = getUserIdBySymbol(newState.board[winningCombo[0]]);
        newState.started = false;
        newState.currentPlayer = null;
    } else {
        newState.currentPlayer = gameData.userIds[0] === playerId ? gameData.userIds[1] : gameData.userIds[0];
    }

    kikUtils.setState(gameId, newState);

    res.json({
        status: "ok",
        winner: winnerId,
        gameState: kikUtils.data(gameId).gameState
    });

    // ------------- helper game logic functions

    function validateMove(gameData) {
        let gameState = gameData.gameState
        if (!gameState.started) {
            throw new Error(`${GAME_NAME}:${gameId} is not started`);
        }
        if (gameState.currentPlayer !== playerId) {
            throw new Error(`${GAME_NAME}:${gameId} ${playerId} is not current player`);
        }
        if (gameState.board[move] !== 0) {
            throw new Error(`${GAME_NAME}:${gameId} field ${move} is not empty`);
        }
        return true;
    }

    function findWinningCombo(board) {
        const winningCombos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winningCombos.find(combo => {
            return (
                board[combo[0]] &&
                board[combo[0]] === board[combo[1]] &&
                board[combo[0]] === board[combo[2]]
            );
        })
    }

    function getPlayerSymbol() {
        // 1 - 'o'
        // 2 - 'x'
        // user on seat 1 has 'x', user on seat 2 has 'o'
        return playerId === gameData.userIds[0] ? 1 : 2
    }

    function getUserIdBySymbol(symbol) {
        if (symbol === 1) {
            return gameData.userIds[0]
        } else {
            return gameData.userIds[1];
        }
    }

    function findBodyErrors() {
        let errors = [];
        let body = req.body;

        if (!body.hasOwnProperty('playerId')) {
            errors.push("missing playerId property");
        } else if (!parseInt(body.playerId)) {
            errors.push("playerId is not a number");
        }

        if (!body.hasOwnProperty('move')) {
            errors.push("missing move property");
        } else {
            let parsed = parseInt(body.move);
            if (!isCoordinateInRange(parsed)) {
                errors.push(`move is out of range`);
            }
        }

        function isCoordinateInRange(coordinate) {
            return 0 <= coordinate && coordinate <= 8;
        }

        return errors;
    }
});



module.exports = router;
