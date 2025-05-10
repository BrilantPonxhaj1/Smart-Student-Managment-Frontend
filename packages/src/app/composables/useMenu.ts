// src/app/composables/useMenu.ts


export const adminMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/superadmin/dashboard' },
    { text: 'Semesters',  icon: 'mdi-calendar',          route: '/admin/semesters' },
    { text: 'Courses',    icon: 'mdi-book-open-page-variant', route: '/admin/subjects' },
    { text: 'Students',   icon: 'mdi-account',           route: '/admin/students' },
]

export const professorMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/professors/dashboard' },
    { text: 'Calendar',  icon: 'mdi-calendar',        route: '/professors/calendar' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/professors/courses' },
]

export const studentMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/student/dashboard' },
    { text: 'Semesters', icon: 'mdi-calendar',        route: '/student/semesters' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/student/courses' },
    { text: 'Profile',   icon: 'mdi-account',           route: '/student/profile' },
]
