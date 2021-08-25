import { createApp } from 'vue'
import App from './App.vue'
import CrazyEights from "./components/CrazyEights.vue";
import KiK from "./components/KiK.vue";
import Home from "./components/Home.vue";
import NotFound from "./components/NotFound.vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import {store} from "./store";
import AvailableGamesList from "./components/AvailableGamesList.vue";

const app = createApp(App)

const url = import.meta.env.VITE_ENDPOINT || `http://${window.location.hostname}:3000`;

app.provide('ENDPOINT_INDEX', `${url}/`);
app.provide('ENDPOINT_AUTH', `${url}/auth`);
app.provide('ENDPOINT_AUTH_ME', `${url}/auth/me`);

app.provide('ENDPOINT_CRAZY8', `${url}/crazy8`);
app.provide('ENDPOINT_CRAZY8_AVAIL', `${url}/crazy8/available_games`);

app.provide('ENDPOINT_KIK', `${url}/kik`);
app.provide('ENDPOINT_KIK_AVAIL', `${url}/kik/available_games`);

const routes= [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/kik/game/:id',
        name: 'game',
        component: KiK,
        props: {
            minPlayers: 2,
            maxPlayers: 2,
        },
    },
    {
        path: '/kik',
        name: 'kik',
        component: AvailableGamesList,
        props: {
            gameName: 'tic-tac-toe',
            endpointKey: 'ENDPOINT_KIK_AVAIL',
        },
    },
    {
        path: '/crazy-eights',
        name: 'crazy-eights',
        component: AvailableGamesList,
        props: {
            gameName: 'crazy eights',
            endpointKey: 'ENDPOINT_CRAZY8_AVAIL',
        },
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound,
    },
]

const router = createRouter ({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'is-active',
})
app.use(router);
app.use(store);

app.mount('#app')
