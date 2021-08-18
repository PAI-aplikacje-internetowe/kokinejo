import { store } from "./store";

const get = (url) => {
    return fetch(url, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.state.token}`,
        },
    });
}

const post = (url, data) => {
    return fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.state.token}`,
        },
        body: JSON.stringify(data),
    });
}

export { get, post };
