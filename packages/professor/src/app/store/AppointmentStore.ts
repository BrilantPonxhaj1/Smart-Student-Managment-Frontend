import { defineStore } from 'pinia';
import api from '../../../../../axios';
import { ref } from 'vue';

export const useAppointmentStore = defineStore('appointment', () => {
    const submitting = ref(false);

    async function createAppointment(payload: any) {
        submitting.value = true;
        try {
            await api.post('/student/appointments', payload);
        } finally {
            submitting.value = false;
        }
    }

    async function updateAppointment(id: number, payload: any) {
        submitting.value = true;
        try {
            await api.put(`/professor/appointments/${id}`, payload);
        } finally {
            submitting.value = false;
        }
    }

    return { submitting, createAppointment, updateAppointment };
});

