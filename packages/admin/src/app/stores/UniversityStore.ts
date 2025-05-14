import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useUniversityStore = defineStore('university', () => {
    const universities = ref<{ label: string; value: number }[]>([]);
    const loading = ref(false);
    const submitting = ref(false);

    async function fetchUniversities() {
        loading.value = true;
        try {
            const res = await api.get('/admin/universities');
            universities.value = res.data.map((u: any) => ({ label: u.name, value: u.id }));
        } finally {
            loading.value = false;
        }
    }

    async function createUniversity(payload: any) {
        submitting.value = true;
        try {
            await api.post('/admin/universities', payload);
        } finally {
            submitting.value = false;
        }
    }
    async function updateUniversity(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/admin/universities/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, universities, loading, createUniversity, updateUniversity, fetchUniversities };
});