<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <v-card-title class="justify-center text-h5 font-weight-bold">
            Create New Exam
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="createFormRef" v-model="formValid" validate-on="input lazy">
              <v-text-field v-model="form.title" label="Title" :rules="[rules.required]" required />

              <v-select
                  v-model="form.exam_type"
                  :items="examTypes"
                  item-title="label"
                  item-value="value"
                  label="Exam Type"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.date"
                  label="Date"
                  type="date"
                  :min="todaysDate"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.time"
                  label="Time"
                  type="time"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.duration"
                  label="Duration (minutes)"
                  type="number"
                  :rules="[rules.required, rules.min5]"
                  required
              />

              <v-text-field
                  v-model="form.max_score"
                  label="Max Score"
                  type="number"
                  :rules="[rules.required, rules.minScore, rules.maxScore]"
                  required
              />

              <v-text-field
                  v-model="form.weight"
                  label="Weight (%)"
                  type="number"
                  :rules="[rules.required, rules.minWeight, rules.maxWeight]"
                  required
              />

              <v-textarea v-model="form.description" label="Description" />

              <v-select
                  v-model="form.course_offering_id"
                  :items="courseOfferingOptions"
                  item-title="offeringTitle"
                  item-value="id"
                  label="Course Offering"
                  :rules="[rules.required]"
                  required
              />

              <v-btn color="primary" @click="save" :loading="submitting" :disabled="submitting">
                Create Exam
              </v-btn>

              <v-snackbar v-model="success" :timeout="3000" top color="success">
                Exam created successfully!
              </v-snackbar>
              <v-snackbar v-model="showErrorSnackbar" :timeout="4000" top color="error">
                {{ errorMessage }}
              </v-snackbar>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { nextTick } from 'vue';
import { useExams } from '../composables/useExams';
import { useCourseOfferings } from '../../../../admin/src/app/composables/useCourseOfferings';
import { useUserStore } from '../../../../auth/src/app/store/userStore';

const { submitting, success, error, errorMessage, submitCreate } = useExams('create-exam');
const createFormRef = ref();
const formValid = ref(true);
const showErrorSnackbar = ref(false);

const examTypes = [
  { label: 'Midterm', value: 'midterm' },
  { label: 'Final', value: 'final' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Project', value: 'project' },
];

const todaysDate = new Date().toLocaleDateString('en-CA');
const form = ref({
  title: '',
  exam_type: examTypes[0].value,
  date: '',
  time: '',
  duration: null,
  max_score: null,
  weight: null,
  description: '',
  course_offering_id: null,
});

const rules = {
  required: (v: any) => !!v || 'This field is required',
  min5: (v: number) => v >= 5 || 'Minimum value is 5',
  minScore: (v: number) => v >= 1 || 'Score must be at least 1',
  maxScore: (v: number) => v <= 100 || 'Score cannot exceed 100',
  minWeight: (v: number) => v >= 0 || 'Weight cannot be negative',
  maxWeight: (v: number) => v <= 100 || 'Weight cannot exceed 100%',
};

const { professorCourseOfferings, fetchProfessorCourseOfferings } = useCourseOfferings();
const userStore = useUserStore();
const selectedCourseOffering = ref<any | null>(null);

onMounted(async () => {
  await userStore.fetchCurrent();
  const userId = userStore.current?.id;

  if (userId) {
    await fetchProfessorCourseOfferings(userId);

    if (professorCourseOfferings.value.length > 0) {
      form.value.course_offering_id = professorCourseOfferings.value[0].id;
    }
  }
});

const courseOfferingOptions = computed(() => {
  return professorCourseOfferings.value?.map((offering: any) => ({
    id: offering.id,
    offeringTitle: `#${offering.id} - ${offering.subject.name} (${offering.subject.code}) - Section ${offering.section}`
  })) || [];
});

watch(() => form.value.course_offering_id, (newId) => {
  if (!newId) {
    selectedCourseOffering.value = null;
    return;
  }

  selectedCourseOffering.value = professorCourseOfferings.value.find(
      (offering: any) => offering.id === newId
  ) || null;
});

async function save() {
  const valid = await createFormRef.value?.validate();
  if (!valid) {
    error.value = true;
    errorMessage.value = 'Please correct the highlighted fields.';
    showErrorSnackbar.value = true;
    return;
  }

  const university_id = selectedCourseOffering.value?.university?.id;
  const department_id = selectedCourseOffering.value?.department?.id;
  const datetime = `${form.value.date} ${form.value.time || '00:00'}`;

  const payload = {
    university_id,
    department_id,
    ...form.value,
    date: datetime,
    description: form.value.description?.trim() || null,
  };

  try {
    error.value = false;
    await submitCreate(payload);

    form.value = {
      title: '',
      exam_type: examTypes[0].value,
      date: '',
      time: '',
      duration: null,
      max_score: null,
      weight: null,
      description: '',
      course_offering_id: null,
    };

    await nextTick();

    createFormRef.value?.resetValidation();
  } catch (e) {
    showErrorSnackbar.value = true;
  }
}
</script>

<style scoped>
.section-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #3f51b5;
}
</style>