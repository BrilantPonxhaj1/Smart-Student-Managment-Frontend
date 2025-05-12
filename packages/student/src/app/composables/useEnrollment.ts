import { ref } from 'vue';
import { EnrollmentService, EnrollmentRequest } from '../../../../src/api-client/services/EnrollmentService';

export function useEnrollment() {
  const isEnrolling = ref(false);
  const error = ref<string | null>(null);

  const enrollInCourse = async (courseOfferingId: number, studentId: number) => {
    try {
      isEnrolling.value = true;
      error.value = null;
      
      const request: EnrollmentRequest = {
        courseOfferingId,
        studentId
      };
      
      const response = await EnrollmentService.enrollInCourse(request);
      return response;
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to enroll in course';
      throw e;
    } finally {
      isEnrolling.value = false;
    }
  };

  const cancelEnrollment = async (enrollmentId: number) => {
    try {
      isEnrolling.value = true;
      error.value = null;
      await EnrollmentService.cancelEnrollment(enrollmentId);
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to cancel enrollment';
      throw e;
    } finally {
      isEnrolling.value = false;
    }
  };

  return {
    isEnrolling,
    error,
    enrollInCourse,
    cancelEnrollment
  };
} 