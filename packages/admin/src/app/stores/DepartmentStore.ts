import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useDepartmentStore = defineStore('department', () => {
    const departments = ref<{ label: string; value: number }[]>([]);
    const loading = ref(false);

    async function fetchDepartments(univId: number) {
        if (!univId) return;
        loading.value = true;
        try {
            const res = await api.get(`/admin/departments/${univId}`);
            departments.value = res.data.map((d: any) => ({ label: d.name, value: d.id }));
        } finally {
            loading.value = false;
        }
    }

    return { departments, loading, fetchDepartments };
});