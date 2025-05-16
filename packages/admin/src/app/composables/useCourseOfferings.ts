import { ref, reactive, computed } from 'vue';
import { useDepartmentStore } from '../stores/DepartmentStore';
import { useSemesterStore } from '../stores/SemesterStore';
import { useUniversityStore } from '../stores/UniversityStore';
import api from '../../../../../axios';

export interface CourseOfferingFormData {
  university_id: number | null;
  department_id: number | null;
  subject_id: number | null;
  professor_profile_id: number | null;
  semester_id: number | null;
  section: string;
  schedule: string;
  capacity: number | null;
}

export interface Professor {
  id: number;
  user: {
    first_name: string;
    last_name: string;
  };
}

export function useCourseOfferings() {
  const universityStore = useUniversityStore();
  const departmentStore = useDepartmentStore();
  const semesterStore = useSemesterStore();
  
  const universities = computed(() => universityStore.universities);
  const semesters = computed(() => semesterStore.semesters);
  
  const departments = ref([]);
  const subjects = ref([]);
  const professors = ref<Professor[]>([]);
  
  const formData = reactive<CourseOfferingFormData>({
    university_id: null,
    department_id: null,
    subject_id: null,
    professor_profile_id: null,
    semester_id: null,
    section: '',
    schedule: '',
    capacity: null
  });
  
  const formRules = {
    required: (v: any) => !!v || 'This field is required',
    capacity: (v: any) => !v || v >= 1 || 'Capacity must be at least 1',
    maxLength5: (v: any) => !v || v.length <= 5 || 'Maximum 5 characters',
    maxLength255: (v: any) => !v || v.length <= 255 || 'Maximum 255 characters'
  };
  
  // Fetch departments when university changes
  async function fetchDepartmentsByUniversity(universityId: number) {
    try {
      const response = await api.get(`/admin/departments/${universityId}`);
      departments.value = response.data.data || [];
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  }
  
  // Fetch professors
  async function fetchProfessors() {
    try {
      const response = await api.get('/admin/professors');
      professors.value = response.data.data || [];
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  }
  
  // Fetch subjects when department changes
  async function fetchSubjectsByDepartment(departmentId: number) {
    try {
      const response = await api.get(`/api/subjects?department_id=${departmentId}`);
      subjects.value = response.data.data || [];
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }
  
  // Reset form data
  function resetForm() {
    formData.university_id = null;
    formData.department_id = null;
    formData.subject_id = null;
    formData.professor_profile_id = null;
    formData.semester_id = null;
    formData.section = '';
    formData.schedule = '';
    formData.capacity = null;
  }

  return {
    universities,
    departments,
    subjects,
    semesters,
    professors,
    formData,
    formRules,
    fetchDepartmentsByUniversity,
    fetchSubjectsByDepartment,
    fetchProfessors,
    resetForm
  };
} 