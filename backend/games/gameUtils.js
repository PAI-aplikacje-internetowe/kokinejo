const db = require('./../db');
const emptyStates = require('./emptyStates');
let instances = new Map();

const gameInfo = {
    'tic-tac-toe': {
        minPlayers: 2,
        maxPlayers: 2,
        tableName: 'kik',
        emptyState: emptyStates.kik
    },
    'crazy-eight': {
        minPlayers: 2,
        maxPlayers: 4,
        tableName: 'crazy_eight',
        emptyState: emptyStates.crazyEight
    },
    'solitaire': {
        minPlayers: 1,
        maxPlayers: 1,
        tableName: 'solitaire',
        emptyState: emptyStates.solitaire
    },
    'oczko': {
        minPlayers: 2,
        maxPlayers: 4,
        tableName: 'oczko',
        emptyState: emptyStates.oczko
    }
}

/** Return object with common game utilities
 */
function gameUtilsFactory(gameName) {
    let existing = instances.get(gameName);
    if (existing) {
        return existing;
    }

    if (!gameInfo.hasOwnProperty(gameName)) {
        throw Error(`No saved gameInfo about ${gameName}`);
    }

    const info = gameInfo[gameName];

    let gameUtils = {
        minPlayers: info.minPlayers,
        maxPlayers: info.maxPlayers,
        tableName: info.tableName,
        gameName: gameName,
        initialized: false,
        init: init,
        data: data,
        setState: setState,
        availableGames: availableGames,
        joinGame: joinGame,
        leaveGame: leaveGame,
        ready: ready,
    }

    let userIdFieldsName = [];
    let userIdPlaceholders = []
    for (let i = 1; i <= info.maxPlayers; i++) {
        userIdFieldsName.push(`user${i}_id`);
        userIdPlaceholders.push('null');
    }

    function userIdsString() {
        return userIdFieldsName.toString();
    }

    function init(gamesCount = 10) {
        if (!gameUtils.initialized) {
            console.info(`Initializing ${gameUtils.gameName}`);
            if (isTableEmpty()) {
                populateGames(gamesCount);
            }
            gameUtils.initialized = true;
        }
    }

    function getRow(gameId) {
        const stmt = db.prepare(`SELECT * FROM ${gameUtils.tableName} WHERE id = ?`);
        try {
            const result = stmt.get(gameId)
            const id = result.id;
            const state = JSON.parse(result.state);
            const joinable = result.joinable;
            const userIds = userIdFieldsName.map(userId => {
                return result[userId]
            });
            return {
                id: id,
                userIds: userIds,
                gameState: state,
                joinable: joinable
            }
        } catch (e) {
            console.error(e);
            if (e instanceof TypeError) {
                throw Error(`No game with id ${gameId} in table ${gameUtils.tableName}`);
            } else if (e instanceof SyntaxError) {
                throw Error(`JSON Parsing error, wrong game state, id: ${gameId}, table: ${gameUtils.tableName}`);
            } else {
                throw Error(`Unknown error while getting game state, table: ${gameUtils.tableName}`);
            }
        }
    }

    function data(gameId) {
        const row = getRow(gameId);
        return {
            userIds: row.userIds,
            gameState: row.gameState
        }
    }

    function setState(gameId, newState) {
        let oldState = data(gameId);
        let newStateString = newState instanceof Object ? JSON.stringify(newState) : newState;
        const stmt = db.prepare(`UPDATE ${gameUtils.tableName} SET state = ? WHERE id = ?`);
        const info = stmt.run(newStateString, gameId);
        console.debug(`${gameUtils.gameName}, set state, changed ${info.changes} rows`);
    }

    function ready(gameId) {
        const row = getRow(gameId);

        const playersInGame = row.userIds.reduceRight((acc, u) => u != null ? acc+1 : acc, 0)
        if (playersInGame !== gameUtils.minPlayers) {
            throw Error(`Not enough players: ${playersInGame}/${gameUtils.minPlayers} in ${gameUtils.gameName}:${gameId}`);
        }

        const oldGameState = row.gameState;
        if (oldGameState.started) {
            throw Error(`${gameUtils.gameName}:${gameId} already started`);
        }
        let newState = JSON.parse(JSON.stringify(oldGameState));
        newState.currentPlayer = row.userIds[0];
        newState.started = true;
        gameUtils.setState(gameId, newState);
        return data(gameId);
    }

    function joinGame(gameId, playerId) {
        const row = getRow(gameId);
        if (playerId < 1) {
            throw Error("Wrong user id");
        }
        if (row.userIds.includes(playerId)) {
            throw Error(`User ${playerId} already is in ${gameUtils.gameName}:${gameId}`);
        }
        if (!row.joinable) {
            throw Error(`Game ${gameUtils.gameName}:${gameId} is not joinable`);
        }

        const freeSeat = row.userIds.indexOf(null) + 1;
        if (!hasFreeSeats(row.userIds)) {
            setJoinabale(false, gameId);
        }

        const stmt = db.prepare(`UPDATE ${gameUtils.tableName} SET user${freeSeat}_id = ? WHERE id = ?`);
        const info = stmt.run(playerId, gameId);
        console.debug(`${gameUtils.gameName}:${gameId}, player ${playerId} joined, changed ${info.changes} rows`);

        const newRow = getRow(gameId);

        return {
            status: "ok",
            userIds: newRow.userIds,
            gameState: newRow.gameState
        }
    }

    function hasFreeSeats(usersArray) {
        return usersArray.indexOf(null) !== -1;
    }

    function leaveGame(gameId, playerId) {
        const row = getRow(gameId);
        if (playerId < 1) {
            throw Error("Wrong user id");
        }
        if (!row.userIds.includes(playerId)) {
            throw Error(`User ${playerId} is not present in ${gameUtils.gameName}:${gameId}`);
        }

        const seatToFree = row.userIds.indexOf(playerId) + 1;
        if (!row.joinable) {
            setJoinabale(true, gameId);
        }

        const stmt = db.prepare(`UPDATE ${gameUtils.tableName} SET user${seatToFree}_id = ? WHERE id = ?`);
        const info = stmt.run(null, gameId);
        console.debug(`${gameUtils.gameName}:${gameId}, player ${playerId} left, changed ${info.changes} rows`);

        const newRow = getRow(gameId);

        return {
            status: "ok",
            userIds: newRow.userIds,
            gameState: newRow.gameState
        }
    }

    function setJoinabale(value, gameId) {
        let valueToInsert = value ? 1 : 0;
        const stmt = db.prepare(`UPDATE kik SET joinable = ? WHERE id = ?`);
        const info = stmt.run(valueToInsert, gameId);
        console.debug(`${gameUtils.gameName}:${gameId}, joinable set to ${value}, changed ${info.changes} rows`);
    }

    function availableGames() {
        const stmt = db.prepare(`SELECT id, ${userIdsString()}
                             FROM ${gameUtils.tableName}
                             WHERE joinable == true`);

        // todo wl: poprawić czytelność
        const rows = stmt.all();
        return rows.map(row => {
            let userIds = [];
            for (let i = 1; i <= gameUtils.maxPlayers; i++) {
                let key = `user${i}_id`;
                if (row.hasOwnProperty(key)) {
                    userIds.push(row[key]);
                }
            }
            return {
                id: row.id,
                userIds: userIds
            }
        });
    }


    function isTableEmpty() {
        const stmt = db.prepare(`SELECT count(*) FROM ${gameUtils.tableName}`);
        const info = stmt.get();
        const count = parseInt(info['count(*)']);
        return count === 0;
    }

    function populateGames(gamesCount) {
        const stmt = db.prepare(`INSERT INTO ${gameUtils.tableName} (state, ${userIdsString()}, joinable)
                                 VALUES (?, ${userIdPlaceholders.toString()}, true)`);
        console.info(`Creating ${gamesCount} ${gameUtils.gameName} games`);
        for (let i = 0; i < gamesCount; i++) {
            stmt.run(JSON.stringify(info.emptyState));
        }
    }

    instances.set(gameName, gameUtils);
    return gameUtils;
}

module.exports = gameUtilsFactory;
