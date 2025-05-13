<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, defineProps, computed } from 'vue';
import { useCourseOfferings, type Professor, type CourseOfferingFormData } from '../composables/useCourseOfferings';
import { useCourseOfferingStore, type CourseOffering } from '../stores/CourseOfferingStore';
import { useUniversityStore } from '../stores/UniversityStore';
import { useDepartmentStore } from '../stores/DepartmentStore';
import { useDepartments } from '../composables/useDepartments';
import { storeToRefs } from 'pinia';

// Define the appropriate types for the form data
interface FormData {
  university_id: number | null;
  department_id: number | null;
  subject_id: number | null;
  professor_profile_id: number | null;
  semester_id: number | null;
  section: string;
  schedule: string;
  capacity: number | null;
}

const props = defineProps<{
  editMode: boolean;
  courseOfferingId?: number;
}>();

const emit = defineEmits<{
  (e: 'saved'): void;
  (e: 'cancel'): void;
}>();

const {
  universities,
  semesters,
  formData,
  formRules,
} = useCourseOfferings();

const universityStore = useUniversityStore();
const departmentStore = useDepartmentStore();
const courseOfferingStore = useCourseOfferingStore();

// Get subjects, professors, and semesters using storeToRefs
const { subjects, professors } = storeToRefs(departmentStore);
const { semesters: universitySemesters } = storeToRefs(universityStore);

const loading = ref(false);
const formValid = ref(true);
const submitting = ref(false);


const snackbar        = ref(false);
const snackbarMessage = ref('');
const snackbarColor   = ref<'success'|'error'>('success');

// Create a reactive reference for the university ID
const selectedUniversityId = computed(() => formData.university_id || 0);

// Use the departments composable
const { departments } = useDepartments(selectedUniversityId);

// Watch for university change
watch(() => formData.university_id, async (newVal) => {
  if (newVal) {
    formData.department_id = null;
    formData.subject_id = null;
    formData.professor_profile_id = null;
    // Fetch semesters for the selected university
    await universityStore.fetchSemestersByUniversityId(newVal);
  } else {
    // Clear semesters when no university is selected
    universitySemesters.value = [];
  }
});

// Watch for department change to load subjects and professors
watch(() => formData.department_id, async (newVal) => {
  if (newVal) {
    formData.subject_id = null;
    formData.professor_profile_id = null;
    
    // Load subjects and professors for the selected department
    await Promise.all([
      departmentStore.fetchSubjects(newVal),
      departmentStore.fetchProfessorsOfDepartment(newVal)
    ]);
  }
});

onMounted(async () => {
  loading.value = true;
  
  try {
    // Load all required data
    await universityStore.fetchUniversities();
    
    // If editing, load the existing course offering data
    if (props.editMode && props.courseOfferingId) {
      const courseOffering = await courseOfferingStore.fetchCourseOffering(props.courseOfferingId);
      
      if (courseOffering) {
        // Populate form data
        formData.university_id = courseOffering.university_id;
        formData.department_id = courseOffering.department_id;
        
        // Load subjects and professors for the selected department
        if (courseOffering.department_id) {
          await Promise.all([
            departmentStore.fetchSubjects(courseOffering.department_id),
            departmentStore.fetchProfessorsOfDepartment(courseOffering.department_id)
          ]);
        }

        // Fetch semesters for the selected university
        if (courseOffering.university_id) {
          await universityStore.fetchSemestersByUniversityId(courseOffering.university_id);
        }
        
        // Set remaining form fields
        formData.subject_id = courseOffering.subject_id;
        formData.professor_profile_id = courseOffering.professor_profile_id;
        formData.semester_id = courseOffering.semester_id;
        formData.section = courseOffering.section || '';
        formData.schedule = courseOffering.schedule || '';
        formData.capacity = courseOffering.capacity || null;
      }
    }
  } catch (error) {
    console.error('Error loading form data:', error);
  } finally {
    loading.value = false;
  }
});

// Create a computed property that converts form data to the required format
const payloadData = computed(() => {
  return {
    university_id: formData.university_id !== null ? formData.university_id : undefined,
    department_id: formData.department_id !== null ? formData.department_id : undefined,
    subject_id: formData.subject_id !== null ? formData.subject_id : undefined,
    professor_profile_id: formData.professor_profile_id !== null ? formData.professor_profile_id : undefined,
    semester_id: formData.semester_id !== null ? formData.semester_id : undefined,
    section: formData.section || undefined,
    schedule: formData.schedule || undefined,
    capacity: formData.capacity !== null ? formData.capacity : undefined
  };
});

// Function to clear form fields
const clearForm = () => {
  formData.university_id = null;
  formData.department_id = null;
  formData.subject_id = null;
  formData.professor_profile_id = null;
  formData.semester_id = null;
  formData.section = '';
  formData.schedule = '';
  formData.capacity = null;
};

const handleSubmit = async () => {
  submitting.value = true;
  snackbar.value = false;
  
  try {
    if (props.editMode && props.courseOfferingId) {
      await courseOfferingStore.updateCourseOffering(props.courseOfferingId, payloadData.value);
    } else {
      await courseOfferingStore.createCourseOffering(payloadData.value);
      clearForm(); // Clear form after successful creation
    }
    snackbarMessage.value = 'Course-Offering saved successfully';
    snackbarColor.value   = 'success';
    snackbar.value        = true;
    emit('saved');
  } catch (error) {
    console.error('Error submitting form:', error);
    snackbarMessage.value = 'Something went wrong while saving course-offering';
    snackbarColor.value   = 'error';
    snackbar.value        = true;
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>

<template>
  <div>
    <v-card>
      <v-card-title>
        {{ editMode ? 'Edit Course Offering' : 'Create New Course Offering' }}
      </v-card-title>
      
      <v-card-text>
        <v-form
          v-model="formValid"
          @submit.prevent="handleSubmit"
        >
          <v-container>
            <v-row>
              <!-- University -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.university_id"
                  :items="universities"
                  item-title="label"
                  item-value="value"
                  label="University"
                  :rules="[formRules.required]"
                  :loading="loading"
                  :disabled="submitting"
                  clearable
                ></v-select>
              </v-col>
              
              <!-- Department -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.department_id"
                  :items="departments"
                  item-title="label"
                  item-value="value"
                  label="Department"
                  :rules="[formRules.required]"
                  :loading="loading"
                  :disabled="!formData.university_id || submitting"
                  clearable
                ></v-select>
              </v-col>
              
              <!-- Subject -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.subject_id"
                  :items="subjects"
                  item-title="label"
                  item-value="value"
                  label="Subject"
                  :rules="[formRules.required]"
                  :loading="loading"
                  :disabled="!formData.department_id || submitting"
                  clearable
                ></v-select>
              </v-col>
              
              <!-- Professor -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.professor_profile_id"
                  :items="professors"
                  item-title="label"
                  item-value="value"
                  label="Professor"
                  :rules="[formRules.required]"
                  :loading="loading"
                  :disabled="!formData.department_id || submitting"
                  clearable
                ></v-select>
              </v-col>
              
              <!-- Semester -->
              <v-col cols="12" md="6">
                <v-select
                  v-model.number="formData.semester_id"
                  :items="universitySemesters"
                  item-title="name"
                  item-value="id"
                  label="Semester"
                  :rules="[formRules.required]"
                  :loading="loading"
                  :disabled="submitting"
                  clearable
                ></v-select>
              </v-col>
              
              <!-- Section -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.section"
                  label="Section"
                  :rules="[formRules.maxLength5]"
                  :disabled="submitting"
                  hint="Optional (max 5 characters)"
                  persistent-hint
                ></v-text-field>
              </v-col>
              
              <!-- Schedule -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.schedule"
                  label="Schedule"
                  :rules="[formRules.maxLength255]"
                  :disabled="submitting"
                  hint="Optional (e.g., 'Mon/Wed 10:00-12:00')"
                  persistent-hint
                ></v-text-field>
              </v-col>
              
              <!-- Capacity -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model.number="formData.capacity"
                  type="number"
                  label="Capacity"
                  :rules="[formRules.capacity]"
                  :disabled="submitting"
                  hint="Optional (minimum 1)"
                  persistent-hint
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          variant="text"
          :loading="submitting"
          :disabled="!formValid || submitting"
          @click="handleSubmit"
        >
          {{ editMode ? 'Update' : 'Create' }}
        </v-btn>
        <v-btn
          color="grey"
          variant="text"
          :disabled="submitting"
          @click="handleCancel"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar
    v-model="snackbar"
    :color="snackbarColor"
    timeout="2000"
  >
    {{ snackbarMessage }}
  </v-snackbar>

  </div>
</template> 