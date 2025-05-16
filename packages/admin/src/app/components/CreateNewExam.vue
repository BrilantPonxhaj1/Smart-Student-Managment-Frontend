<script setup lang="ts">
import { FormKit } from '@formkit/vue';
import { computed, ref } from 'vue';
import { useExams } from '../composables/useExams';
import { useUniversities } from '../composables/useUniversities';
import { useDepartments } from '../composables/useDepartments';

const { universities } = useUniversities();
const selectedUniv = ref<number>(0);
const { departments } = useDepartments(selectedUniv);

const { submitting, errorMessage, success, error, submitCreate } = useExams('create-exam');

const univOptions = computed(() => [
  { label: 'Choose a university', value: null },
  ...universities.value,
]);

const deptOptions = computed(() => [
  { label: 'Choose a department', value: null },
  ...departments.value,
]);

const todaysDate = new Date().toLocaleDateString('en-CA');

const examTypes = [
  { label: 'Midterm', value: 'midterm' },
  { label: 'Final', value: 'final' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Project', value: 'project' },
];

function onUniversityChange(id: number | null | undefined) {
  selectedUniv.value = id ?? 0;
}

function handleSubmit(values: Record<string, any>) {
  if (!values.university_id || !values.department_id) {
    alert('Please select both university and department.');
    return;
  }

  if (!values.time || !values.date) {
    alert('Please provide both date and time.');
    return;
  }

  values.date = `${values.date} ${values.time}`;
  delete values.time;

  if (!values.description || values.description.trim() === '') {
    values.description = null;
  }

  submitCreate(values);
}
</script>

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
            <FormKit
                type="form"
                id="create-exam"
                :loading="submitting"
                submit-label="Submit"
                @submit="handleSubmit"
                class="form-container"
            >
              <v-row>
                <v-col cols="12" md="6">
                  <FormKit type="text" name="title" label="Title" validation="required" />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="select"
                      name="exam_type"
                      label="Exam Type"
                      :options="examTypes"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="date"
                      name="date"
                      label="Date"
                      :min="todaysDate"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="time"
                      name="time"
                      label="Time"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="number"
                      name="duration"
                      label="Duration (minutes)"
                      validation="required|min:5"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="number"
                      name="max_score"
                      label="Max Score"
                      validation="required|min:1|max:100"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="number"
                      name="weight"
                      label="Weight (%)"
                      validation="required|min:0|max:100"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="number"
                      name="course_offering_id"
                      label="Course Offering ID"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="select"
                      name="university_id"
                      label="University"
                      :options="univOptions"
                      validation="required"
                      @input="onUniversityChange($event)"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="select"
                      name="department_id"
                      label="Department"
                      :options="deptOptions"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" class="pt-2">
                  <FormKit type="textarea" name="description" label="Description" />
                </v-col>
              </v-row>

              <!-- Success Snackbar -->
              <v-snackbar v-model="success" :timeout="3000" top color="success">
                Exam created successfully!
              </v-snackbar>

              <!-- Error Snackbar -->
              <v-snackbar v-model="error" :timeout="4000" top color="error">
                {{ errorMessage }}
              </v-snackbar>
            </FormKit>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Optional: Center the submit button */
:deep(.formkit-actions) {
  display: flex;
  justify-content: center;
}
</style>