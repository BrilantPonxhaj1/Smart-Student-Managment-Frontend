// /src/composables/useAssignments.ts
import api from '../../../../../axios'
import type { CourseOffering, Assignment } from '../types/index';

export function useAssignments() {
    // Fetch all course-offerings for this professor
    async function getCourseOfferings(professorId: number): Promise<CourseOffering[]> {
        const res = await api.get(`/professor/course-offerings/${professorId}`)
        return res.data.data
    }

    // Create a new assignment
    async function createAssignment(payload: Partial<Assignment>): Promise<Assignment> {
        const res = await api.post('/professor/assignments', payload)
        return res.data.data
    }

    // Delete an assignment
    async function deleteAssignment(id: number): Promise<void> {
        await api.delete(`/professor/assignments/${id}`)
    }

    // (Optional) List all assignments across offerings
    async function getAssignments(): Promise<Assignment[]> {
        const res = await api.get('/professor/assignments')
        return res.data.data
    }

    return { getCourseOfferings, createAssignment, deleteAssignment, getAssignments }
}
