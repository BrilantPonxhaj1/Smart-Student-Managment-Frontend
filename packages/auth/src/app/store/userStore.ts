import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import api from '../../../../../axios';


export const useUserStore = defineStore(
    'user',

    // 1) storeSetup function returns state + actions
    () => {
        const current = ref<null | {id:number; first_name: string; last_name: string; email: string; type: string }>(null)
        const professor = ref<null | {id:number; user_id:number; university_id:number; department_id:number }>(null)
        const professorId = computed(() => professor.value?.id ?? null)
        async function fetchCurrent() {
            try {
                const { data } = await api.get('/admin/user')
                current.value = data
            } catch {
                current.value = null
            }
        }
        async function fetchProfessorProfile(){
            if (!current.value) {
                professor.value = null
                return
            }
            try{
                const res = await api.get(`professor/users/${current.value.id}`)
                professor.value = res.data.data
            }catch {
                professor.value = null
            }
        }
        function reset() {
            current.value = null
            professor.value = null
        }
        return { current, fetchCurrent, reset, fetchProfessorProfile, professorId }
    },

    // 2) options object where `persist` is allowed
    {
        persist: true
    }
)

