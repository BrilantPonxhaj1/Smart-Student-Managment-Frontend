import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useProfessorStore = defineStore('professor', () => {
    const submitting = ref(false);

    async function createProfessor(payload: any) {
        submitting.value = true;
        try {
            await api.post('/admin/professors', payload);
        } finally {
            submitting.value = false;
        }
    }

    async function updateProfessor(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/admin/professors/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, createProfessor, updateProfessor };
});