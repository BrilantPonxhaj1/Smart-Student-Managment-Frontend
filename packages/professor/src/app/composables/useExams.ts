import { ref } from 'vue';
import { useExamStore } from '../store/ExamStore';
import { reset } from '@formkit/vue';

export function useExams(formId: string) {
    const { submitting, createExam, updateExam } = useExamStore();
    const errorMessage = ref('');
    const success = ref(false);
    const error = ref(false);

    async function submitCreate(values: Record<string, any>) {
        try {
            await createExam(values);
            reset(formId);
            success.value = true;
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    async function submitEdit(id: number, values: Record<string, any>) {
        try {
            await updateExam(id, values);
            success.value = true;
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    return { submitting, errorMessage, success, error, submitCreate, submitEdit };
}