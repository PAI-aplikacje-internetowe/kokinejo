import { createStore } from "vuex";

const KEY = 'KOKINEJO';
const storage = localStorage;
const debug = true;

const defaultState = {
    count: 0,
}

const loadData = (state) => {
    try {
        const value = storage.getItem(KEY);
        if (!value) return;
        const data = JSON.parse(value);
        state.count = data.count;
        state.token = data.token;
    } catch (e) {
        // nothing stored, or wrong data - do nothing
    }
}

const saveData = (state) => {
    try {
        storage.setItem(KEY, JSON.stringify({
            count: state.count,
            token: state.token,
        }));
    } catch (e) {
        // do nothing, when there is no storage
    }
}

const store = createStore({
    state() {
        const state = defaultState;
        loadData(state);
        return state;
    },
    mutations: {
        increment(state) {
            state.count++
            saveData(state);
        },
        setToken(state, newToken) {
            if (debug) {
                console.log(`Setting new token: ${newToken}`)
            }
            state.token = newToken;
            saveData(state);
        },
        clearToken(state) {
            delete state.token;
            saveData(state);
        }
    }
})

export { store };
