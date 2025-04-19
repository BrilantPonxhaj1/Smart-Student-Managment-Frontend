import { createRouter, createWebHistory } from 'vue-router';
import Login from '../../packages/auth/src/app/pages/Login.vue'; // Adjust the path as needed
import SuperadminDashboard from '../../packages/admin/src/app/pages/Dashboard.vue';
import ListStudents from '../../packages/admin/src/app/pages/ListStudents.vue';
import Professors from '../../packages/admin/src/app/pages/Professors.vue';

const routes = [
  {
    path: '/',
    redirect: '/login', // Redirect the root path to /login
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
   {
        path: '/superadmin/dashboard',
        name: 'SuperadminDashboard',
        component: SuperadminDashboard,
    },
    {
        path: '/admin/students',
        name: 'Students',
        component: ListStudents
    }, 
    {
        path: '/admin/professors',
        name: 'Professors',
        component: Professors
    }

];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
