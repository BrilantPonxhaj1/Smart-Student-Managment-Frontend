import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useSubjectStore = defineStore('subject', () => {
    const submitting = ref(false);

    async function createSubject(payload: any) {
        submitting.value = true;
        try {
            await api.post('/admin/subjects', payload);
        } finally {
            submitting.value = false;
        }
    }

    async function updateSubject(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/admin/subjects/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, createSubject, updateSubject };
});