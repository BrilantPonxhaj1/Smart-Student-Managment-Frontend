// import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useUniversityStore } from '../stores/UniversityStore';

export function useUniversities() {
    const uniStore = useUniversityStore();
    const { universities } = storeToRefs(uniStore)
    if (!universities.value.length) {
        uniStore.fetchUniversities();
    }
    return { universities };
}