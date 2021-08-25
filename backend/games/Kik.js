const BaseGameController = require('./BaseGameController');
const utils = require('./../utils');

class Kik extends BaseGameController {
    constructor() {
        super('tic-tac-toe');
    }

    moveHandler = (data, socket) => {
        const gameId = data.gameId;
        const fieldId = data.fieldId;
        const playerId = socket.data.user.id;

        const gameData = this.gameUtils.data(gameId);

        try {
            validateMove(gameData);
        } catch (e) {
            return;
        }

        let newState = gameData.gameState;
        newState.board[fieldId] = getPlayerSymbol(playerId, gameData.userIds);

        let winningCombo = findWinningCombo(newState.board);

        if (winningCombo) {
            newState.winner = getUserIdBySymbol(newState.board[winningCombo[0]]);
            newState.started = false;
            newState.currentPlayer = null;
        } else if (!hasPossibleMoves(newState.board)) {
            newState.tied = true;
            newState.started = false;
            newState.currentPlayer = null;
        } else {
            newState.currentPlayer = gameData.userIds[0] === playerId ? gameData.userIds[1] : gameData.userIds[0];
        }

        this.gameUtils.setState(gameId, newState);

        this.sockets.to(gameId).emit('pullState');

        // ------------- helper game logic functions

        function hasPossibleMoves(board) {
            return board.some(field => {
                return field === 0
            });
        }

        function validateMove(gameData) {
            let gameState = gameData.gameState
            if (!gameState.started) {
                throw new Error(`kik:${gameId} is not started`);
            }
            if (gameState.currentPlayer !== playerId) {
                throw new Error(`kik:${gameId} ${playerId} is not current player`);
            }
            if (gameState.board[fieldId] !== 0) {
                throw new Error(`kik:${gameId} field ${fieldId} is not empty`);
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
    }
}

module.exports = Kik;
