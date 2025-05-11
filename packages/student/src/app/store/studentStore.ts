// student/src/app/store/studentStore.ts
import { defineStore } from 'pinia'
import api from '../../../../../axios'  // ← use your pre-configured axios instance

/** ─── Data Interfaces ─────────────────────────────────────────── */

// A semester record from GET /api/semesters
export interface Semester {
    id:                   number
    name:                 string
    start_date:           string
    end_date:             string
    registration_deadline: string | null
}

// A course offering record from GET /api/student/course_offerings
export interface CourseOffering {
    id:               number
    subject:          { id: number; code: string; name: string }
    professors:       { id: number; first_name: string; last_name: string }[]
    schedule:         string
    capacity?:        number
    enrolled_count?:  number
    enrolled?:        boolean
}

/** ─── Store State ────────────────────────────────────────────── */
export interface StudentStoreState {
    semesters:        Semester[]       // renamed from 'semester'
    currentSemesterId: number | null
    offerings:        CourseOffering[]
    loading:          boolean
    error:            string | null
}

/** ─── Pinia Store ───────────────────────────────────────────── */
export const useStudentStore = defineStore('student', {
    state: (): StudentStoreState => ({
        semesters:       [],
        currentSemesterId: null,
        offerings:       [],
        loading:         false,
        error:           null,
    }),

    actions: {
        /** Fetch all semesters and pick the first as current */
        async fetchSemesters() {
            this.loading = true
            this.error   = null

            try {
                const res = await api.get('/semesters')
                this.semesters       = res.data.data
                this.currentSemesterId = this.semesters[0]?.id ?? null
            } catch (e: any) {
                this.error = e.response?.data?.message || e.message
            } finally {
                this.loading = false
            }
        },

        /** Fetch offerings for the selected semester */
        async fetchOfferings() {
            if (!this.currentSemesterId) return
            this.loading = true
            this.error   = null

            try {
                const res = await api.get('/student/course_offerings', {
                    params: { semester_id: this.currentSemesterId }
                })
                this.offerings = res.data.data
            } catch (e: any) {
                this.error = e.response?.data?.message || e.message
            } finally {
                this.loading = false
            }
        },

        /** Load both, in sequence */
        async loadDashboard() {
            this.loading = true
            this.error   = null

            try {
                await this.fetchSemesters()
                await this.fetchOfferings()
            } catch {
                // errors have already been set above
            } finally {
                this.loading = false
            }
        }
    }
})
