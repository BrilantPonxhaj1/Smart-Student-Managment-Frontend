import { Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useDepartmentStore } from '../stores/DepartmentStore';

export function useDepartments(selectedUnivId: Ref<number>) {
    const store = useDepartmentStore();
    const { departments, professors, loading } = storeToRefs(store);

    watch(
        selectedUnivId,
        (id) => {
            store.fetchDepartments(id);
        },
        { immediate: true }
    );

    async function fetchProfessors(deptId: number) {
        await store.fetchProfessorsOfDepartment(deptId);
    }

    return {
        departments,
        professors,
        loading,
        fetchProfessors
    };
}
