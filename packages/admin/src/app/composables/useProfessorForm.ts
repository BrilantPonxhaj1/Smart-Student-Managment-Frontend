import { reset } from '@formkit/vue';
import { ref } from 'vue';
import { useProfessorStore } from '../stores/ProfessorStore';



export function useProfessorForm(formId: string) {
    const { submitting, createProfessor, updateProfessor } = useProfessorStore();
    const errorMessage = ref('');
    const success = ref(false);
    const error = ref(false);

    async function submitCreate(values: Record<string, any>) {
        try {
            await createProfessor(values);
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
            await updateProfessor(id, values);
            success.value = true;
        } catch {
            error.value = true;
        }
    }

    return { submitting, errorMessage, success, error, submitCreate, submitEdit };
}