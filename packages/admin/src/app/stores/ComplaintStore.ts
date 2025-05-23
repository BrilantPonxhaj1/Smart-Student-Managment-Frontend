import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../../../../../axios';

export interface Complaint {
    id: number;
    title: string;
    description: string;
    category: string;
    status: string;
    resolution_details?: string | null;
    [key: string]: any; // për fusha shtesë si professor/subject nëse shtohen
}

export const useComplaintStore = defineStore('complaint', () => {
    const complaints = ref<Complaint[]>([]);
    const loading = ref(false);
    const submitting = ref(false);
    const error = ref('');

    async function fetchAllComplaints() {
        loading.value = true;
        try {
            const res = await api.get('/admin/complaints');
            complaints.value = res.data.data;
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch complaints';
        } finally {
            loading.value = false;
        }
    }

    async function fetchOpenComplaints() {
        loading.value = true;
        try {
            const res = await api.get('/admin/complaints/open');
            complaints.value = res.data.data;
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Failed to fetch open complaints';
        } finally {
            loading.value = false;
        }
    }

    async function updateComplaint(id: number, data: Partial<Complaint>) {
        submitting.value = true;
        try {
            await api.put(`/admin/complaints/${id}`, data);
        } catch (e: any) {
            error.value = e.response?.data?.message || 'Update failed';
        } finally {
            submitting.value = false;
        }
    }

    return {
        complaints,
        loading,
        submitting,
        error,
        fetchAllComplaints,
        fetchOpenComplaints,
        updateComplaint,
    };
});
