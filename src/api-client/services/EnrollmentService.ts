import { apiClient } from '../core/apiClient';

export interface EnrollmentRequest {
  courseOfferingId: number;
  studentId: number;
}

export interface EnrollmentResponse {
  id: number;
  courseOfferingId: number;
  studentId: number;
  status: string;
  enrollmentDate: string;
}

export class EnrollmentService {
  static async enrollInCourse(request: EnrollmentRequest): Promise<EnrollmentResponse> {
    const response = await apiClient.post<EnrollmentResponse>('/api/enrollments', request);
    return response.data;
  }

  static async getEnrollments(studentId: number): Promise<EnrollmentResponse[]> {
    const response = await apiClient.get<EnrollmentResponse[]>(`/api/enrollments/student/${studentId}`);
    return response.data;
  }

  static async cancelEnrollment(enrollmentId: number): Promise<void> {
    await apiClient.delete(`/api/enrollments/${enrollmentId}`);
  }
} 