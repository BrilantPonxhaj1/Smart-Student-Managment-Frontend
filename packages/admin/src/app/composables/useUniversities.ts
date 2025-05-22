// import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';

import { useUniversityStore } from '../stores/UniversityStore';
import { watch } from 'vue';
import { ref } from 'vue';

export function useUniversities() {
    const uniStore = useUniversityStore();
    const { submitting, createUniversity, updateUniversity } = useUniversityStore();
    const errorMessage = ref('');
    const success = ref(false);
    const error = ref(false);
    const {universities} = storeToRefs(uniStore)
    const isValidUniversity = (u: any) =>
        typeof u.value === 'number' && typeof u.label === 'string';

    const needsRefetch = !universities.value.length || universities.value.some(u => !isValidUniversity(u));

    if (needsRefetch) {
        uniStore.fetchUniversities();
    }

    async function submitCreateUniversity(values: Record<string, any>) {
        try {
            await createUniversity(values);
            success.value = true;
        } catch (err: unknown) {
            const e = err as any;
            errorMessage.value = e.response?.data?.errors
                ? Object.values(e.response.data.errors)[0]
                : e.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    async function submitEditUniversity(id: number, values: Record<string, any>) {
        try {
            await updateUniversity(id, values);
            success.value = true;
        } catch (err: any) {
            console.error('Edit failed:', err.response?.data || err);
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    return {
        submitting,
        universities,
        errorMessage,
        success,
        error,
        submitCreateUniversity,
        submitEditUniversity
    };
}

export function useUnis() {
    const uniStore = useUniversityStore();
    const { universities } = storeToRefs(uniStore);
  
    watch(
      () => universities.value.length,
      len => { if (len === 0) uniStore.fetchUniversities(); },
      { immediate: true }
    );
  
    // universities are already Array<{ label: string; value: number }>
    return { unis: universities };
  }
