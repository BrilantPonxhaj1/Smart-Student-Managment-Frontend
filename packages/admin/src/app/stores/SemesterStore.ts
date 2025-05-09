import {defineStore} from 'pinia';
import api from '../../../../../axios';
import {ref} from 'vue';

interface Semester {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    description: string;
}

export const useSemesterStore = defineStore('semester', () => {
    const semesters = ref<{ label: string; value: number }[]>([]);
    const loading = ref(false);
    const error      = ref<string | null>(null);


    async function fetchSemesters() {
        loading.value = true;
        try {
            const res = await api.get('/admin/semester');
            //const semesterData = res.data.data || res.data;
            //semesters.value = semesterData.map((s: Semester) => ({ label: s.name, value: s.id }));
            semesters.value = res.data.data;
        } catch (e: any) {
            console.error(e);
            error.value = e.response?.data?.message || e.message;
        }
         finally {
            loading.value = false;
        }
    }

    async function createSemester(semester: any) {
        try {
            await api.post('/admin/semester', semester);
            await fetchSemesters();
        } catch (e) {
            console.error('Create failed', e);
            alert('Failed to create semester');
        }
    }

    async function updateSemester(id: number, semester: any) {
        try {
            await api.put(`/admin/semester/${id}`, semester);
            await fetchSemesters();
        } catch (e) {
            console.error('Update failed', e);
            alert('Failed to update semester');
        }
    }

    async function deleteSemester(id: number) {
        try {
            await api.delete(`/admin/semester/${id}`);
            await fetchSemesters();
        } catch (e) {
            console.error('Delete failed', e);
            alert('Failed to delete semester');
        }
    }

    return { semesters, loading, fetchSemesters, createSemester, updateSemester, deleteSemester, error };
})
