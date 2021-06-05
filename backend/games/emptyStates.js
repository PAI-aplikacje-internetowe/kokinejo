/** Each state should provide standard properties:
 * - started
 * - currentPlayer
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
