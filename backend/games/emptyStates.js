/** Each state should provide standard properties:
 * - started
 * - currentPlayer
 * - winner
 *
 * When a game starts (by /ready request) the game state is overridden
 * with a new empty state.
 */

const emptyStates = {
    kik: () => {
        return {
            started: false,
            currentPlayer: null,
            winner: null,
            board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    },
    crazyEight: () => {
        return {
            started: false,
            currentPlayer: null,
            winner: null,
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
