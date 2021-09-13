import {createStore} from "vuex";

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
    state.myId = data.myId;
    state.myName = data.myName;
  } catch (e) {
    // nothing stored, or wrong data - do nothing
  }
}

const saveData = (state) => {
  try {
    storage.setItem(KEY, JSON.stringify({
      count: state.count,
      token: state.token,
      myId: state.myId,
      myName: state.myName,
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
      state.token = newToken;
      saveData(state);
    },
    clearToken(state) {
      delete state.token;
      saveData(state);
    },
    setMyData(state, data) {
      state.myName = data.name;
      state.myId = data.id;
      saveData(state);
    },
    logout(state) {
      state.myName = undefined;
      state.myId = undefined;
      state.token = undefined;
      saveData(state);
    }
  }
})

export {store};
