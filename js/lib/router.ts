import { createRouter, createWebHistory } from 'vue-router';
import Login from '../../packages/auth/src/app/pages/Login.vue'; // Adjust the path as needed
import SuperadminDashboard from '../../packages/admin/src/app/pages/Dashboard.vue';
import ListStudents from '../../packages/admin/src/app/pages/Students.vue';
import Professors from '../../packages/admin/src/app/pages/Professors.vue';
import ProfessorsDashboard from '../../packages/professor/src/app/pages/ProfessorDashboard.vue';
import StudentsDashboard from '../../packages/student/src/app/pages/StudentDashboard.vue';
import Forbidden from '../../src/GeneralPages/Forbidden.vue';
import AdminProfile from '../../packages/admin/src/app/pages/AdminProfile.vue'
import Universities from "../../packages/admin/src/app/pages/Universities.vue";

import Subjects from "../../packages/admin/src/app/pages/Subjects.vue";
import Semester from '../../packages/admin/src/app/pages/Semester.vue';
import CourseOfferings from '../../packages/admin/src/app/pages/CourseOffering.vue';
import CreateCourseOffering from '../../packages/admin/src/app/pages/CreateCourseOffering.vue';
import EditCourseOffering from '../../packages/admin/src/app/pages/EditCourseOffering.vue';
// import Exam from "../../packages/professor/src/app/pages/Exam.vue";
import ProfessorAppointments from "../../packages/professor/src/app/pages/ProfessorAppointments.vue";
import StudentAppointments from "../../packages/student/src/app/pages/StudentAppointments.vue";

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
        path: '/superadmin/professors',
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
        path: '/admin/universities',
        name: 'Universities',
        component: Universities,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/admin/subjects',
        name: 'Subjects',
        component: Subjects,
        meta : { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/superadmin/semester',
        name: 'Semester',
        component: Semester,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/superadmin/course-offerings',
        name: 'CourseOffering',
        component: CourseOfferings,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/superadmin/course-offerings/create',
        name: 'CreateCourseOffering',
        component: CreateCourseOffering,
        meta: { requiresAuth: true, roles: ['superadmin'] }
    },
    {
        path: '/superadmin/course-offerings/:id/edit',
        name: 'EditCourseOffering',
        component: EditCourseOffering,
        meta: { requiresAuth: true, roles: ['superadmin'] }

    },

    // {
    //     path: '/professors/exams',
    //     name: 'Exams',
    //     component: Exam,
    //     meta: { requiresAuth: true, roles: ['teacher'] }
    //
    // },
    {
        path: '/professors/appointments',
        name: 'ProfessorAppointments',
        component: ProfessorAppointments,
        meta: { requiresAuth: true, roles: ['teacher'] }

    },
    {
        path: '/student/appointments',
        name: 'StudentAppointments',
        component: StudentAppointments,
        meta: { requiresAuth: true, roles: ['student'] }

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
