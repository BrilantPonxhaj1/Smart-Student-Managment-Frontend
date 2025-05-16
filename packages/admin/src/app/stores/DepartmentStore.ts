import { defineStore } from 'pinia';
import api from '../../../../../axios';
import {ref} from "vue";

export const useDepartmentStore = defineStore('department', () => {
    const departments = ref<{ label: string; value: number }[]>([]);
    const subjects = ref<{ label: string; value: number }[]>([]);
    const professors = ref<{ label: string; value: number }[]>([]);
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
    async function fetchSubjects(deptId: number) {
        if (!deptId) return;
        loading.value = true;
        try {
            const res = await api.get(`/admin/subjects/department/${deptId}`);
            console.log('API Response:', res.data); // For debugging
            // Check if res.data is an array or if it has a data property
            if (Array.isArray(res.data)) {
                subjects.value = res.data.map((s: any) => ({ label: s.name, value: s.id }));
            } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
                subjects.value = res.data.data.map((s: any) => ({ label: s.name, value: s.id }));
            } else {
                console.error('Unexpected response format:', res.data);
                subjects.value = [];
            }
        } catch (error) {
            console.error('Error fetching subjects:', error);
            subjects.value = [];
        } finally {
            loading.value = false;
        }
    }
    async function fetchProfessorsOfDepartment(deptId: number) {
        if (!deptId) return;
        loading.value = true;
        try {
            const res = await api.get(`/admin/professors/department/${deptId}`);
            console.log('Professors API Response:', res.data); // For debugging
            
            // Check if res.data is an array or if it has a data property
            if (Array.isArray(res.data)) {
                professors.value = res.data.map((p: any) => ({ label: p.first_name + ' ' + p.last_name, value: p.id }));
            } else if (res.data && res.data.data && Array.isArray(res.data.data)) {
                professors.value = res.data.data.map((p: any) => ({ label: p.first_name + ' ' + p.last_name, value: p.id }));
            } else {
                console.error('Unexpected professor response format:', res.data);
                professors.value = [];
            }
        } catch (error) {
            console.error('Error fetching professors:', error);
            professors.value = [];
        } finally {
            loading.value = false;
        }
    }


    return { departments, subjects, professors, loading, fetchDepartments, fetchSubjects, fetchProfessorsOfDepartment };
});