import { createApp } from 'vue'
import App from './App.vue'
import KiK_available_games from "./components/KiK_available_games.vue"
import KiK from "./components/KiK.vue";
import { createRouter, createWebHashHistory } from 'vue-router';

const app = createApp(App)

const routes= [
    {
        path: '/kik/game',
        name: 'game',
        component: KiK,
        params: true
    },
    {
        path: '/kik',
        name: 'kik',
        component: KiK_available_games
    }
]

const router = createRouter ({
    history: createWebHashHistory(),
    routes,
    linkActiveClass: 'is-active',
})
app.use(router);

app.mount('#app')