import { store } from "./store";
import { io } from "socket.io-client";

/**
 * Create and open new socket with optional namespace
 * @param namespace - optional
 * @returns {Socket|undefined}
 */
const getSocket = (namespace = '', gameId) => {
    const token = 'Bearer ' + store.state.token;
    if (!token) {
        return undefined;
    }
    // TODO: inject uri instead providing it hardcoded
    return io('localhost:3000/' + namespace, {
        extraHeaders: {
            Authorization: token,
        },
        query: {
            "gameId": gameId,
        }
    });
}

export { getSocket };
