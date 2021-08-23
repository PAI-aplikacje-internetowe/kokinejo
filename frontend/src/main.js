import { createApp } from 'vue'
import App from './App.vue'
import KiK_available_games from "./components/KiK_available_games.vue"
import CrazyEights from "./components/CrazyEights.vue";
import KiK from "./components/KiK.vue";
import Home from "./components/Home.vue";
import NotFound from "./components/NotFound.vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import {store} from "./store";
import AvailableGamesList from "./components/AvailableGamesList.vue";

const app = createApp(App)

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
    },
    {
        path: '/kik',
        name: 'kik',
        component: AvailableGamesList,
        props: {
            gameName: 'tic-tac-toe',
        },
    },
    {
        path: '/crazy-eights',
        name: 'crazy-eights',
        component: AvailableGamesList,
        props: {
            gameName: 'crazy eights',
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
