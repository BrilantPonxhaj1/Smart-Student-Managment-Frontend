import { defineStore } from 'pinia'
import type { CourseOffering, Assignment } from '../types/index'
import { useAssignments } from '../composables/useAssignments'

export const useAssignmentStore = defineStore('assignments', {
    state: () => ({
        offerings: [] as CourseOffering[],
        loading: false,
        errorMessage: '',
        successMessage: '',
    }),
    actions: {
        async fetchOfferings(professorId: number) {
            this.loading = true
            this.errorMessage = ''
            this.successMessage = ''
            try {
                const { getCourseOfferings } = useAssignments()
                const data = await getCourseOfferings(professorId)

                this.offerings = data.map(off => ({
                    ...off,
                    assignments: off.assignments ?? [],
                }))
            } catch (e: any) {
                this.errorMessage = e.message || 'Failed to load offerings'
            } finally {
                this.loading = false
            }
        },

        async addAssignment(courseOfferingId: number, payload: Partial<Assignment>): Promise<void> {
            // const { createAssignment } = useAssignments()
            // const newA = await createAssignment({ ...payload, course_offering_id: courseOfferingId })
            // const off = this.offerings.find(o => o.id === courseOfferingId)
            // if (!off) {
            //     this.error = `Course offering ${courseOfferingId} not found`
            // }
            // // If for some reason it was still undefined:
            // if (!Array.isArray(off.assignments)) {
            //     off.assignments = []
            // }
            // off.assignments.push(newA)

            this.errorMessage = ''
            this.successMessage = ''
            try {
                const { createAssignment } = useAssignments()
                const newA = await createAssignment({ ...payload, course_offering_id: courseOfferingId })
                const off = this.offerings.find(o => o.id === courseOfferingId)
                if (!off) throw new Error('Course offering not found')
                off.assignments = off.assignments ?? []
                off.assignments.push(newA)
                this.successMessage = 'Assignment created successfully'
            } catch (e: any) {
                this.errorMessage = e.message || 'Failed to create assignment'
            }
        },
        async removeAssignment(id: number, courseOfferingId: number) {
/*            const { deleteAssignment } = useAssignments()
            await deleteAssignment(id)
            const off = this.offerings.find(o => o.id === courseOfferingId)
            off!.assignments = off!.assignments.filter(a => a.id !== id)*/
            this.errorMessage = ''
            this.successMessage = ''
            try {
                const { deleteAssignment } = useAssignments()
                await deleteAssignment(id)
                const off = this.offerings.find(o => o.id === courseOfferingId)
                if (off) off.assignments = off.assignments.filter(a => a.id !== id)
                this.successMessage = 'Assignment deleted successfully'
            } catch (e: any) {
                this.errorMessage = e.message || 'Failed to delete assignment'
            }
        },
    },
})