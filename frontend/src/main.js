import { createApp } from 'vue'
import App from './App.vue'
import KiK_available_games from "./components/KiK_available_games.vue"
import CrazyEights from "./components/CrazyEights.vue";
import KiK from "./components/KiK.vue";
import Home from "./components/Home.vue";
import NotFound from "./components/NotFound.vue";
import { createRouter, createWebHashHistory } from 'vue-router';
import { store } from "./store";

const app = createApp(App)

const routes= [
    {
        path: '/',
        name: 'home',
        component: Home,
    },
    {
        path: '/kik',
        name: 'kik',
        component: KiK_available_games
    },
    {
        path: '/kik/game/:id',
        name: 'game',
        component: KiK,
    },
    {
        path: '/crazy-eights',
        name: 'crazy-eights',
        component: CrazyEights
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
