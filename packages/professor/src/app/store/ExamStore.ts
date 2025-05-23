import { defineStore } from 'pinia';
import api from '../../../../../axios';
import { ref } from 'vue';

export const useExamStore = defineStore('exam', () => {
    const submitting = ref(false);

    async function createExam(payload: any) {
        submitting.value = true;
        try {
            await api.post('/professor/exams', payload);
        } finally {
            submitting.value = false;
        }
    }

    async function updateExam(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/professor/exams/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, createExam, updateExam };
});