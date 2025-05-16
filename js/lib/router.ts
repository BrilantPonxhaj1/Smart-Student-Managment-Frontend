import { createRouter, createWebHistory } from 'vue-router';
import Login from '../../packages/auth/src/app/pages/Login.vue'; // Adjust the path as needed
import SuperadminDashboard from '../../packages/admin/src/app/pages/Dashboard.vue';
import ListStudents from '../../packages/admin/src/app/pages/Students.vue';
import Professors from '../../packages/admin/src/app/pages/Professors.vue';
import ProfessorsDashboard from '../../packages/professor/src/app/pages/ProfessorDashboard.vue';
import StudentsDashboard from '../../packages/student/src/app/pages/StudentDashboard.vue';
import Forbidden from '../../src/GeneralPages/Forbidden.vue';
import AdminProfile from '../../packages/admin/src/app/pages/AdminProfile.vue'
import Exams from "../../packages/admin/src/app/pages/Exams.vue";


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
        meta : { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/admin/students',
        name: 'Students',
        component: ListStudents,
        meta : { requiresAuth: true, roles: ['superadmin'] }
    }, 
    {
        path: '/admin/professors',
        name: 'Professors',
        component: Professors,
        meta : { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/professors/dashboard',
        name: 'ProfessorsDashboard',
        component: ProfessorsDashboard,
        meta : { requiresAuth: true, roles: ['teacher'] }
    },
    {
        path: '/student/dashboard',
        name: 'StudentsDashboard',
        component: StudentsDashboard,
        meta : { requiresAuth: true, roles: ['student'] }
    },
    {
        path: '/superadmin/profile',
        name: 'AdminProfile',
        component: AdminProfile,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/admin/exams',
        name: 'Exams',
        component: Exams,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/forbidden',
        name: 'Forbidden',
        component: Forbidden
    }

];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
