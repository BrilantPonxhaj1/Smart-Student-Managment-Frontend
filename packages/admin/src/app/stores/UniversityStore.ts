import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export interface University {
    id:   number;
    name: string;
  }

export const useUniversityStore = defineStore('university', () => {
    const universities = ref<{ label: string; value: number }[]>([]);
    const semesters = ref<{ name: string; id: number }[]>([]);
    const loading = ref(false);

    async function fetchUniversities() {
        loading.value = true;
        try {
            const res = await api.get('/admin/universities');
            universities.value = res.data.map((u: any) => ({ label: u.name, value: u.id }));
        } finally {
            loading.value = false;
        }
    }

    async function fetchSemestersByUniversityId(univId: number) {
        if (!univId) return;
        loading.value = true;
        try{
            const res = await api.get(`/admin/semesters/university/${univId}`);
            if (Array.isArray(res.data)) {
                semesters.value = res.data.map((s: any) => ({ name: s.name, id: s.id }));
            } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
                semesters.value = res.data.data.map((s: any) => ({ name: s.name, id: s.id }));
            } else {
                semesters.value = [];
            }
        } finally {
            loading.value = false;
        }
    }

    return { universities, semesters, loading, fetchUniversities, fetchSemestersByUniversityId };
});