/** Each state should provide standard properties:
 * - started
 * - currentPlayer
 * - winner
 *
 * When a game starts (by /ready request) the game state is overridden
 * with a new empty state.
 */
const Cards = require('./Cards');

const emptyStates = {
    kik: () => {
        return {
            started: false,
            currentPlayer: null,
            winner: null,
            tied: false,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    crazyEight: () => {
        let shuffledDeck = Cards.shuffledFullDeck;
        return {
            started: false,
            currentPlayer: null,
            winner: null,
            stockPile: shuffledDeck,
            discardPile: [],
            playersHands: []
        }
    },
    solitaire: () => {
        return {
            started: false,
            currentPlayer: null,
            winner: null,
        }
    },
    oczko: () => {
        return {
            started: false,
            currentPlayer: null,
            winner: null,
        }
    },
}

module.exports = emptyStates
