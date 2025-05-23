// /src/types/index.ts

export interface Assignment {
    id: number
    university_id: number
    university_name: string
    department_id: number
    department_name: string
    course_offering_id: number

    // Nested course-offering info
    course_offering: {
        subject_id: number
        subject_name: string
        section: string
        schedule: string
    }

    title: string
    description?: string
    due_date: string       // ISO date string, e.g. "2025-06-01"
    max_score?: number
    assignment_type?: string

    // Optional loaded relations
    professor?: { /* shape of ProfessorResource, if you need it */ }
    course?: { /* shape of CourseOfferingResource, if you need it */ }
}

export interface CourseOffering {
    id: number

    university: {
        id: number
        name: string
    }
    department: {
        id: number
        name: string
    }
    subject: {
        code: string
        name: string
    }
    semester: string         // e.g. "Spring 2025"
    section: string
    schedule: string
    capacity: number
    professors: {
        id: number
        name: string
    }

    // Attach assignments array
    assignments: Assignment[]
}
