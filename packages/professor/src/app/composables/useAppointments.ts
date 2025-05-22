import { ref } from 'vue';
import { useAppointmentStore } from '../store/AppointmentStore';
import { reset } from '@formkit/vue';

export function useAppointments(formId: string) {
    const { submitting, createAppointment, updateAppointment } = useAppointmentStore();
    const errorMessage = ref('');
    const success = ref(false);
    const error = ref(false);

    async function submitCreate(values: Record<string, any>) {
        try {
            await createAppointment(values);
            reset(formId);
            success.value = true;
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    async function submitEdit(id: number, values: Record<string, any>) {
        try {
            await updateAppointment(id, values);
            success.value = true;
        } catch (err: any) {
            errorMessage.value = err.response?.data?.message || 'Unexpected error';
            error.value = true;
        }
    }

    return { submitting, errorMessage, success, error, submitCreate, submitEdit };
}