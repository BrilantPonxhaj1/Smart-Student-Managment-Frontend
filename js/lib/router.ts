import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue'; // Adjust the path if necessary
import Welcome from '../pages/Welcome.vue'
import SuperadminDashboard from '../../packages/admin/src/app/pages/Dashboard.vue';


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
    },
    {
        path: '/superadmin/dashboard',
        name: 'SuperadminDashboard',
        component: SuperadminDashboard
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;