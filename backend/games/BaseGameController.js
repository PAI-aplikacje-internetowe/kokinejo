const express = require('express');
const utils = require('../utils');

const gameUtilsFactory = require('./gameUtils');

class BaseGameController {
    constructor(gameName) {
        this.router = express.Router();
        this.gameUtils = gameUtilsFactory(gameName)
        this.router.get('/', this.index);
        this.router.get('/available_games', this.availableGames);
        this.router.get('/:gameId/join', this.join);
        this.router.get('/:gameId/leave', this.leave);
        this.router.get('/:gameId/ready', this.setReady);
        this.router.get('/:gameId/state', this.getState);
    }

    getRouter = () => {
        return this.router;
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
           const filteredState = this.filterStateForUser(gameData.gameState);
           res.json({
               status: "ok",
               userIds: gameData.userIds,
               gameState: filteredState,
           });
       } catch (e) {
           utils.badRequest(res, e);
       }
   }

   filterStateForUser = (gameState) => {
        // this implementation does not filter anything
        // everyone can get full state of the game
        // you can override this method to hide some sensitive game data
        return gameState;
   }
}

module.exports = BaseGameController;
