import { reset } from '@formkit/vue';
import { ref } from 'vue';
import { useSubjectStore } from '../stores/SubjectStore';



export function useSubjects(formId: string) {
    const { submitting, createSubject, updateSubject } = useSubjectStore();
    const errorMessage = ref('');
    const success = ref(false);
    const error = ref(false);

    async function submitCreate(values: Record<string, any>) {
        try {
            await createSubject(values);
            reset(formId);
            success.value = true;
        } catch (err: unknown) {
            const e = err as any;
            errorMessage.value = e.response?.data?.errors
                ? Object.values(e.response.data.errors)[0]
                : e.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    async function submitEdit(id: number, values: Record<string, any>) {
        try {
            await updateSubject(id, values);
            success.value = true;
        } catch (err: any) {
            console.error('Edit failed:', err.response?.data || err);
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }


    return { submitting, errorMessage, success, error, submitCreate, submitEdit };
}