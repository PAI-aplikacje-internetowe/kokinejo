import { createApp } from 'vue'
import App from './App.vue'
import KiK_available_games from "./components/KiK_available_games.vue"
import KiK from "./components/KiK.vue";
import { createRouter, createWebHashHistory } from 'vue-router';

const app = createApp(App)

const routes= [
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

]

const router = createRouter ({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'is-active',
})
app.use(router);

app.mount('#app')