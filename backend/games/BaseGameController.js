const express = require('express');
const utils = require('../utils');

const gameUtilsFactory = require('./gameUtils');
const {getSockets} = require("../sockets");

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
    this.socketInitialized = false;
    this.sockets = null;
  }

  initSocket = () => {
    console.log("initializing " + this.gameUtils.gameName + " sockets");

    const sockets = getSockets(this.gameUtils.gameName)
    this.sockets = sockets;

    sockets.on('connect', socket => {
      const gameId = socket.handshake.query.gameId;
      if (!gameId) {
        socket.disconnect();
      }
      // each namespace has it's own distinctive rooms
      socket.data.gameId = gameId;
      socket.join(gameId);

      sockets.to(gameId).emit('pullState');

      // event handlers
      socket.on('disconnect', () => {
        socket.to(gameId).emit('userDisconnected', socket.data.user.name);
        this.gameUtils.playerLeft(gameId, socket.data.user.id);
      })

      socket.on('gameStart', (gameId) => {
        sockets.to(gameId).emit('pullState');
      })
    });
  }

  getRouter = () => {
    return this.router;
  }

  index = (req, res) => {
    res.json({
      gameName: this.gameUtils.gameName,
      minPlayers: this.gameUtils.minPlayers,
      maxPlayers: this.gameUtils.maxPlayers,
    })
  }

  availableGames = (req, res) => {
    try {
      const availableGames = this.gameUtils.availableGames();
      res.json({
        status: "ok",
        availableGames: availableGames,
        maxPlayers: this.gameUtils.maxPlayers,
      });
    } catch (e) {
      utils.badRequest(res, e, "Available games");
    }
  }

  join = (req, res) => {
    const gameId = req.params.gameId;

    const user = req.user;
    if (!user) {
      utils.badRequest(res, new Error(`No userId provided, url: ${req.originalUrl}`));
      return;
    }
    try {
      const userId = user.id;
      const data = this.gameUtils.joinGame(gameId, userId);
      this.sockets.emit('pullState');
      res.json(data)
    } catch (e) {
      utils.badRequest(res, e);
    }
  }

  leave = (req, res) => {
    const gameId = req.params.gameId;

    let user = req.user;
    if (!user) {
      utils.badRequest(res, new Error(`No userId provided, url: ${req.originalUrl}`));
      return
    }
    try {
      const userId = user.id;
      const data = this.gameUtils.leaveGame(gameId, userId);
      this.sockets.emit('pullState');
      res.json(data)
    } catch (e) {
      utils.badRequest(res, e);
    }
  }

  setReady = (req, res) => {
    const gameId = req.params.gameId;
    const userId = req.user.id;

    try {
      const data = this.gameUtils.ready(gameId, userId)
      this.sockets.emit('pullState');
      res.json(data);
    } catch (e) {
      utils.badRequest(res, e);
    }
  }

  getState = (req, res) => {
    // todo: ugly, slowing down hack - how it can be improved?
    if (!this.socketInitialized) {
      this.initSocket();
      this.socketInitialized = true;
    }
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
