import {Ref, watch} from 'vue';
import { storeToRefs } from 'pinia'
import { useDepartmentStore } from '../stores/DepartmentStore';

export function useDepartments(selectedUnivId: Ref<number>) {
    const store = useDepartmentStore()
    // Preserve reactivity on `departments`
    const { departments } = storeToRefs(store)
    // Reload whenever university ID changes
    watch(
        selectedUnivId,
        id => {
            store.fetchDepartments(id)
        },
        { immediate: true }
    )
    return { departments }
}