const express = require('express');
const router = express.Router();
const utils = require('../utils');

const gameUtilsFactory = require('./gameUtils');

class BaseGameController {
    constructor(gameName) {
        this.gameUtils = gameUtilsFactory(gameName)
        router.get('/', this.index);
        router.get('/available_games', this.availableGames);
        router.get('/:gameId/join', this.join);
        router.get('/:gameId/leave', this.leave);
        router.get('/:gameId/ready', this.setReady);
        router.get('/:gameId/state', this.getState);
    }

    getRouter = () => {
        return router;
    }

    index = (req, res) => {
        res.json({
            gameName: this.gameUtils.gameName,
            players: this.gameUtils.playerCount
        })
    }

    availableGames = (req, res) => {
        try {
            const availableGames = this.gameUtils.availableGames();
            res.json({
                status: "ok",
                availableGames: availableGames
            });
        } catch (e) {
            utils.badRequest(res, e, "Available games");
        }
    }

    join = (req, res) => {
        const gameId = req.params.gameId;

        let userId;
        if (!req.query.userId) {
            utils.badRequest(res, new Error(`No userId provided, url: ${req.originalUrl}`));
            return;
        }
        try {
            userId = parseInt(req.query.userId);
            const data = this.gameUtils.joinGame(gameId, userId);
            res.json(data)
        } catch (e) {
            utils.badRequest(res, e);
        }
    }

   leave = (req, res) => {
       const gameId = req.params.gameId;

       let userId;
       if (!req.query.userId) {
           utils.badRequest(res, new Error(`No userId provided, url: ${req.originalUrl}`));
           return
       }
       try {
           userId = parseInt(req.query.userId);
           const data = this.gameUtils.leaveGame(gameId, userId);
           res.json(data)
       } catch (e) {
           utils.badRequest(res, e);
       }
   }

   setReady = (req, res) => {
       const gameId = req.params.gameId;

       try {
           const data = this.gameUtils.ready(gameId)
           res.json(data);
       } catch (e) {
           utils.badRequest(res, e);
       }
   }

   getState = (req, res) => {
       const gameId = req.params.gameId;

       try {
           const gameData = this.gameUtils.data(gameId);
           res.json({
               status: "ok",
               userIds: gameData.userIds,
               gameState: gameData.gameState
           });
       } catch (e) {
           utils.badRequest(res, e);
       }
   }
}

module.exports = BaseGameController;
