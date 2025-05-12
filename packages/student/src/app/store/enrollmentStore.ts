// src/stores/enrollments.ts
import { defineStore } from 'pinia'
import api from '../../../../../axios'  // ← use your pre-configured axios instance

export interface EnrollmentState {
    isLoading: boolean
    error: string | null
}

export const useEnrollmentStore = defineStore('enrollment', {
    state: (): EnrollmentState => ({
        isLoading: false,
        error: null,
    }),

    actions: {
        /**
         * Register the current student in a course offering.
         */
        async register(offeringId: number): Promise<void> {
            this.isLoading = true
            this.error = null
            try {
                await api.post(`/student/course_offerings/${offeringId}/register`)
            } catch (e: any) {
                // capture the API’s error message
                this.error = e.response?.data?.message || 'Failed to register'
                // re-throw so callers can react (e.g. show snackbar)
                throw e
            } finally {
                this.isLoading = false
            }
        },

        /**
         * Cancel (drop) an existing enrollment by its ID.
         */
        async cancel(enrollmentId: number): Promise<void> {
            this.isLoading = true
            this.error = null
            try {
                await api.delete(`/student/enrollments/${enrollmentId}`)
            } catch (e: any) {
                this.error = e.response?.data?.message || 'Failed to cancel'
                throw e
            } finally {
                this.isLoading = false
            }
        },
    },
})
