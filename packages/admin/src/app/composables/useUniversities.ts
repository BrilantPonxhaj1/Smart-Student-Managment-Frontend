// import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { University, useUniversityStore } from '../stores/UniversityStore';
import { computed, watch } from 'vue';
import { ref } from 'vue';

export function useUniversities() {
    const uniStore = useUniversityStore();
    const { universities } = storeToRefs(uniStore)
    if (!universities.value.length) {
        uniStore.fetchUniversities();
    }
    return { universities };
}

export function useUnis() {
    const uniStore = useUniversityStore();
    const { universities } = storeToRefs(uniStore);
  
    watch(
      () => universities.value.length,
      len => { if (len === 0) uniStore.fetchUniversities(); },
      { immediate: true }
    );
  
    // universities is already Array<{ label: string; value: number }>
    return { unis: universities };
  }