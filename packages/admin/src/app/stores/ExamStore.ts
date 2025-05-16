import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../../../../../axios';

export const useExamStore = defineStore('exam', () => {
    const submitting = ref(false);

    async function createExam(payload: any) {
        submitting.value = true;
        try {
            await api.post('/admin/exams', payload);
        } finally {
            submitting.value = false;
        }
    }

    async function updateExam(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/admin/exams/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, createExam, updateExam };
});