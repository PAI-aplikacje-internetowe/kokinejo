import { store } from "./store";

const get = (url) => {
    return fetch(url, {
        method: 'GET',
        cache: 'no-cache',
        'cache-control': 'no-cache',
        pragma: 'no-cache',
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
        mode: 'cors',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${store.state.token}`,
        },
        body: JSON.stringify(data),
    });
}

export { get, post };
