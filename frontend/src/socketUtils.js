import { store } from "./store";
import { io } from "socket.io-client";
import { inject } from "vue";

/**
 * Create and open new socket with optional namespace
 * @param namespace - optional
 * @returns {Socket|undefined}
 */
const getSocket = (namespace = '', gameId) => {
    const url = inject('ENDPOINT_INDEX');
    const token = 'Bearer ' + store.state.token;
    if (!token) {
        return undefined;
    }
    return io(url + namespace, {
        extraHeaders: {
            Authorization: token,
        },
        query: {
            "gameId": gameId,
        }
    });
}

export { getSocket };
