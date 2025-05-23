// packages/src/app/composables/useProfessorComplaints.ts
import api from '../../../../axios';

export interface ProfessorComplaint {
    id: number;
    title: string;
    description: string;
    status: string;
    category: string;
    student_name: string;
    [key: string]: any;
}

/**
 * Fetch all complaints submitted to the professor
 */
export async function fetchProfessorComplaints(): Promise<ProfessorComplaint[]> {
    try {
        const response = await api.get('/professor/complaints');
        return response.data?.data || [];
    } catch (error) {
        console.error('Failed to fetch professor complaints:', error);
        return [];
    }
}

/**
 * Fetch only unresolved complaints
 */
export async function fetchUnresolvedComplaints(): Promise<ProfessorComplaint[]> {
    try {
        const response = await api.get('/professor/complaints/open');
        return response.data?.data || [];
    } catch (error) {
        console.error('Failed to fetch unresolved complaints:', error);
        return [];
    }
}

/**
 * Update a complaint (e.g., mark as resolved or edit)
 */
export async function updateComplaint(id: number, payload: Partial<ProfessorComplaint>) {
    try {
        const response = await api.put(`/professor/complaints/${id}`, payload);
        return response.data;
    } catch (error) {
        console.error(`Failed to update complaint ${id}:`, error);
        throw error;
    }
}

/**
 * Optionally delete a complaint
 */
export async function deleteComplaint(id: number) {
    try {
        await api.delete(`/professor/complaints/${id}`);
    } catch (error) {
        console.error(`Failed to delete complaint ${id}:`, error);
        throw error;
    }
}
