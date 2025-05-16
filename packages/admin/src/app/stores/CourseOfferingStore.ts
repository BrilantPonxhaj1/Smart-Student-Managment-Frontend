import { defineStore } from 'pinia';
import api from '../../../../../axios';
import { ref } from 'vue';

export interface CourseOffering {
    id: number;
    university_id: number;
    department_id: number;
    subject_id: number;
    professor_profile_id: number;
    semester_id: number;
    section?: string;
    schedule?: string;
    capacity?: number;
    university?: {
        id: number;
        name: string;
    };
    department?: {
        id: number;
        name: string;
    };
    subject?: {
        id: number;
        name: string;
    };
    professor_profile?: {
        id: number;
        user: {
            first_name: string;
            last_name: string;
        }
    };
    semester?: {
        id: number;
        name: string;
    };
}

export const useCourseOfferingStore = defineStore('courseOffering', () => {
    const courseOfferings = ref<CourseOffering[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);
    const selectedOffering = ref<CourseOffering | null>(null);

    async function fetchCourseOfferings() {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get('/admin/course-offerings');
            courseOfferings.value = res.data.data;
        } catch (e: any) {
            console.error(e);
            error.value = e.response?.data?.message || e.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchCourseOffering(id: number) {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.get(`/admin/course-offerings/${id}`);
            selectedOffering.value = res.data.data;
            return res.data.data;
        } catch (e: any) {
            console.error(e);
            error.value = e.response?.data?.message || e.message;
            return null;
        } finally {
            loading.value = false;
        }
    }

    async function createCourseOffering(courseOffering: Partial<CourseOffering>) {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.post('/admin/course-offerings', courseOffering);
            await fetchCourseOfferings();
            return res.data.data;
        } catch (e: any) {
            console.error('Create failed', e);
            error.value = e.response?.data?.message || e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function updateCourseOffering(id: number, courseOffering: Partial<CourseOffering>) {
        loading.value = true;
        error.value = null;
        try {
            const res = await api.put(`/admin/course-offerings/${id}`, courseOffering);
            await fetchCourseOfferings();
            return res.data.data;
        } catch (e: any) {
            console.error('Update failed', e);
            error.value = e.response?.data?.message || e.message;
            throw e;
        } finally {
            loading.value = false;
        }
    }

    async function deleteCourseOffering(id: number) {
        loading.value = true;
        error.value = null;
        try {
            await api.delete(`/admin/course-offerings/${id}`);
            await fetchCourseOfferings();
            return true;
        } catch (e: any) {
            console.error('Delete failed', e);
            error.value = e.response?.data?.message || e.message;
            return false;
        } finally {
            loading.value = false;
        }
    }

    return { 
        courseOfferings, 
        loading, 
        error,
        selectedOffering,
        fetchCourseOfferings,
        fetchCourseOffering,
        createCourseOffering,
        updateCourseOffering,
        deleteCourseOffering
    };
}); 