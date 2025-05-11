<script setup lang="ts">
import { ref, watch, onMounted, defineEmits, defineProps, computed } from 'vue';
import { useCourseOfferings, type Professor } from '../composables/useCourseOfferings';
import { useCourseOfferingStore, type CourseOffering } from '../stores/CourseOfferingStore';
import { useSemesterStore } from '../stores/SemesterStore';
import { useUniversityStore } from '../stores/UniversityStore';

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
  departments,
  subjects,
  professors,
  semesters,
  formData,
  formRules,
  fetchDepartmentsByUniversity,
  fetchSubjectsByDepartment,
  fetchProfessors,
} = useCourseOfferings();

const universityStore = useUniversityStore();
const semesterStore = useSemesterStore();
const courseOfferingStore = useCourseOfferingStore();

const loading = ref(false);
const formValid = ref(true);
const submitting = ref(false);

// Watch for university change to load departments
watch(() => formData.university_id, async (newVal) => {
  if (newVal) {
    formData.department_id = null;
    formData.subject_id = null;
    await fetchDepartmentsByUniversity(newVal);
  }
});

// Watch for department change to load subjects
watch(() => formData.department_id, async (newVal) => {
  if (newVal) {
    formData.subject_id = null;
    await fetchSubjectsByDepartment(newVal);
  }
});

onMounted(async () => {
  loading.value = true;
  
  try {
    // Load all required data
    await Promise.all([
      universityStore.universities.length === 0 ? universityStore.fetchUniversities() : Promise.resolve(),
      semesterStore.semesters.length === 0 ? semesterStore.fetchSemesters() : Promise.resolve(),
      fetchProfessors()
    ]);
    
    // If editing, load the existing course offering data
    if (props.editMode && props.courseOfferingId) {
      const courseOffering = await courseOfferingStore.fetchCourseOffering(props.courseOfferingId);
      
      if (courseOffering) {
        // Populate form data
        formData.university_id = courseOffering.university_id;
        
        // Fetch departments for the selected university
        await fetchDepartmentsByUniversity(courseOffering.university_id);
        formData.department_id = courseOffering.department_id;
        
        // Fetch subjects for the selected department
        await fetchSubjectsByDepartment(courseOffering.department_id);
        
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

const handleSubmit = async () => {
  submitting.value = true;
  
  try {
    if (props.editMode && props.courseOfferingId) {
      await courseOfferingStore.updateCourseOffering(props.courseOfferingId, payloadData.value);
    } else {
      await courseOfferingStore.createCourseOffering(payloadData.value);
    }
    
    emit('saved');
  } catch (error) {
    console.error('Error submitting form:', error);
  } finally {
    submitting.value = false;
  }
};

const handleCancel = () => {
  emit('cancel');
};

// Get professor display name
const getProfessorDisplayName = (professor: Professor): string => {
  if (professor?.user) {
    return `${professor.user.first_name} ${professor.user.last_name}`;
  }
  return '';
};
</script>

<template>
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
                v-model.number="formData.university_id"
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
                v-model.number="formData.department_id"
                :items="departments"
                item-title="name"
                item-value="id"
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
                v-model.number="formData.subject_id"
                :items="subjects"
                item-title="name"
                item-value="id"
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
                v-model.number="formData.professor_profile_id"
                :items="professors"
                :item-title="(item) => item && item.user ? `${item.user.first_name} ${item.user.last_name}` : ''"
                item-value="id"
                label="Professor"
                :rules="[formRules.required]"
                :loading="loading"
                :disabled="submitting"
                clearable
              ></v-select>
            </v-col>
            
            <!-- Semester -->
            <v-col cols="12" md="6">
              <v-select
                v-model.number="formData.semester_id"
                :items="semesters"
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
</template> 