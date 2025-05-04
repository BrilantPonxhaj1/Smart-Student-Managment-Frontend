import {defineStore} from 'pinia';
import api from '../../../../../axios';

export interface Student {
    id: number;
    student_number: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    role: string;
    program: string;
    department_id: number;
    university_id: number;
    year_of_study: number;
    enrollment_year: number;
    type: string;
}

export const useStudentsStore = defineStore('students', {
    state: () => ({
        list: [] as Student[],
        loading: false,
        error: null as string | null,
    }),
    actions: {
        async fetchAll() {
            this.loading = true;
            this.error = null;
            try {
                const res = await api.get<Student[]>('/admin/students');
                this.list = res.data;      // now each object has all 12 properties
            } catch (e: any) {
                this.error = e.response?.data?.message || e.message;
            } finally {
                this.loading = false;
            }
        },
        async deleteById(id: number) {
            await api.delete(`/admin/students/${id}`);
            this.list = this.list.filter(s => s.id !== id);
        },
    },
});
