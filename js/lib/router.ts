import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Welcome.vue'; // Adjust the path if necessary
import Welcome from '../pages/Test.vue'

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