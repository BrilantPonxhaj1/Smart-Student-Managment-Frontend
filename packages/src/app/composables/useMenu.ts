
export const adminMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/superadmin/dashboard' },
    { text: 'Students',   icon: 'mdi-account-school',           route: '/admin/students' },
    { text: 'Professors', icon: 'mdi-account-tie', route: '/superadmin/professors' },
    { text: 'Semesters',  icon: 'mdi-calendar-check',          route: '/superadmin/semester' },
    { text: 'Universities', icon: 'mdi-school', route: '/admin/universities' },
    { text : 'Subjects', icon: 'mdi-book-open-variant', route: '/admin/subjects'},
    { text: 'Course Offerings',    icon: 'mdi-book-open-page-variant', route: '/superadmin/course-offerings' },
]

export const professorMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/professors/dashboard' },
    { text: 'Exams',   icon: 'mdi-file-document-edit', route: '/professors/exams' },
    { text: 'Assignments', icon: 'mdi-clipboard-text', route: '/professors/assignments' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/professors/courses' },
]

export const studentMenu = [
    { text: 'Dashboard', icon: 'mdi-view-dashboard', route: '/student/dashboard' },
    { text: 'Semesters', icon: 'mdi-calendar',        route: '/student/semesters' },
    { text: 'Courses',   icon: 'mdi-book-open-page-variant', route: '/student/courses' },
    { text: 'Profile',   icon: 'mdi-account',           route: '/student/profile' },
]
