import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useUniversityStore = defineStore('university', () => {
    const universities = ref<{ label: string; value: number }[]>([]);
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

    return { universities, loading, fetchUniversities };
});