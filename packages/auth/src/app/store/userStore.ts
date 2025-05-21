import { defineStore } from 'pinia';
import { ref } from 'vue';
import api from '../../../../../axios';


export const useUserStore = defineStore(
    'user',

    // 1) storeSetup function returns state + actions
    () => {
        const current = ref<null | { first_name: string; last_name: string; email: string; type: string; id: number }>(null)

        async function fetchCurrent() {
            try {
                const { data } = await api.get('/admin/user')
                current.value = data
            } catch {
                current.value = null
            }
        }
        function reset() {
            current.value = null
        }
        return { current, fetchCurrent, reset }
    },

    // 2) options object where `persist` is allowed
    {
        persist: true
    }
)

