// src/app/composables/useMenu.ts

import { route } from "ziggy-js"


export const adminMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/superadmin/dashboard' },
    { text: 'Students',   icon: 'mdi-account-school',           route: '/admin/students' },
    { text: 'Professors', icon: 'mdi-account-tie', route: '/superadmin/professors' },
    { text: 'Semesters',  icon: 'mdi-calendar-check',          route: '/superadmin/semester' },
    { text: 'Universities', icon: 'mdi-school', route: '/admin/universities' },
    { text : 'Subjects', icon: 'mdi-book-open-variant', route: '/admin/subjects'},
    { text: 'Course Offerings',    icon: 'mdi-book-open-page-variant', route: '/superadmin/course-offerings' },
    { text: 'Complaints',    icon: 'mdi-account-alert', route: '/superadmin/complaints' },
]

export const professorMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/professors/dashboard' },
    { text: 'Calendar',  icon: 'mdi-calendar',        route: '/professors/calendar' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/professors/courses' },
    { text: 'Exams',   icon: 'mdi-file-document-edit', route: '/professors/exams' },
    { text: 'Complaints',    icon: 'mdi-account-alert', route: '/professors/complaints' },
]

export const studentMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/student/dashboard' },
    { text: 'Semesters', icon: 'mdi-calendar',        route: '/student/semesters' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/student/courses' },
    { text: 'Profile',   icon: 'mdi-account',           route: '/student/profile' },
]
