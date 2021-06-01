const db = require('../../db');

const INIT_GAMES_COUNT = 10;
let initialized = false;

function initKik() {
    if (!initialized) {
        if (isTableEmpty()) {
            populateGames();
        }
        initialized = true;
    }
}

function isTableEmpty() {
    const stmt = db.prepare('SELECT count(*) FROM kik');
    const info = stmt.get();
    const count = parseInt(info['count(*)']);
    return count === 0;
}

function populateGames() {
    const stmt = db.prepare('INSERT INTO kik (state, user1_id, user2_id, joinable) VALUES (?, null, null, true)');
    console.info(`Creating ${INIT_GAMES_COUNT} tic-tac-toe games`);
    for (let i = 0; i < INIT_GAMES_COUNT; i++) {
        stmt.run(emptyState());
    }
}

function emptyState() {
    return {
        started: false,
        currentPlayer: null,
        players: [
            null,
            null
        ],
        board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ]
    }
}

function getState(gameId) {
    const stmt = db.prepare('SELECT state FROM kik WHERE id = ?')
    try {
        const result = stmt.get(gameId)
        return JSON.parse(result.state);
    } catch (e) {
        console.error(e);
        if (e instanceof TypeError) {
            throw Error(`No game with id ${gameId}`);
        } else if (e instanceof SyntaxError) {
            throw Error(`JSON Parsing error`);
        } else {
            throw Error("Unknown error");
        }
    }
}

module.exports.init = initKik;
module.exports.emptyState = emptyState;
module.exports.getState = getState;
