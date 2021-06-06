/** Each state should provide standard properties:
 * - started
 * - currentPlayer
 *
 * When a game starts (by /ready request) the game state is overridden
 * with a new empty state.
 */

const emptyStates = {
    kik: {
        started: false,
        currentPlayer: null,
        board: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    },
    crazyEight: {
        started: false,
        currentPlayer: null,
    },
    solitaire: {
        started: false,
        currentPlayer: null,
    },
    oczko: {
        started: false,
        currentPlayer: null,
    },
}

module.exports = emptyStates
