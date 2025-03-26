import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue'; // Adjust the path if necessary
import Welcome from '../pages/Welcome.vue'

const routes = [
    {
        path: '/',
        redirect: '/welcome',
    },
    {
        path: '/login',
        name: 'Login',
        component: Login,
    },
    {
        path: '/welcome',
        name: 'Welcome',
        component: Welcome
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;