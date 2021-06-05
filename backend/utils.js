const config = require('../config');

// If you add util function here, don't forget to add it in 'utils' object
// at the bottom of the file!

/**
 * Helper function for sending bad request (400) with error message
 * Value of optional parameter 'info' will be logged.
 * Be careful - when using badRequest, remember to return from routing function,
 * check for example in 'kik.js'
 */
function badRequest(res, err, info = undefined) {
    let errMessage = err.message || "Unknown error";

    if (info) {
        console.error(`${info} | ${err}`);
    } else {
        console.error(err);
    }

    res.status(400).json({
        status: "error",
        error: errMessage
    })
}

/**
 * Probably not useful
 * Helper function for sending game state to provided 'res'
 * In dev mode checks 'state' for having settled
 * fields and warns if 'state' doesn't have them
 */
function sendGameState(res, state) {
    if (config.devMode) {
        checkGameStatePropsExistence(state);
    }

    res.json({
        status: "ok",
        gameState: state
    });
}

function checkGameStatePropsExistence(gameState) {
    const properties = [
        "started",
        "currentPlayer"
    ];
    let missingProperties = [];
    properties.forEach(p => {
        if (!gameState.hasOwnProperty(p)) {
            missingProperties.push(p)
        }
    });
    if (missingProperties.length) {
        console.warn(`WARN | GameState has missing fields: ${missingProperties.toString()}`);
    }
}

const utils = {
    badRequest: badRequest,
    sendGameState: sendGameState,
}

module.exports = utils;
