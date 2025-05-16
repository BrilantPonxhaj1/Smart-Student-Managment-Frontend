<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <v-card-title class="justify-center text-h5 font-weight-bold">
            Create New Semester
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <FormKit
                type="form"
                id="create-semester"
                :loading="submitting"
                submit-label="Create Semester"
                @submit="submitCreate"
                class="form-container"
            >
              <v-row>
                <v-col cols="12">
                  <FormKit
                      type="text"
                      name="name"
                      label="Semester Name"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12">
                  <FormKit
                      type="select"
                      name="university_id"
                      label="University"
                      :options = "univOptions"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="date"
                      name="start_date"
                      label="Start Date"
                      validation="required|date"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <FormKit
                      type="date"
                      name="end_date"
                      label="End Date"
                      validation="required|date"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="date"
                      name="registration_deadline"
                      label="Registration Deadline"
                      validation="required|date"
                  />
                </v-col>

                <v-col cols="12">
                  <FormKit
                      type="text"
                      name="description"
                      label="Description"
                  />
                </v-col>
              </v-row>

              <v-snackbar
                  v-model="success"
                  top
                  :timeout="3000"
                  color="success"
              >
                Semester created successfully!
              </v-snackbar>
              <v-snackbar
                  v-model="error"
                  top
                  :timeout="4000"
                  color="error"
              >
                {{ errorMessage }}
              </v-snackbar>
            </FormKit>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useSemesterStore } from '../stores/SemesterStore';
import {FormKit, reset} from "@formkit/vue";
import { useUniversities } from '../composables/useUniversities';

const { universities } = useUniversities();
const submitting = ref(false);
const success    = ref(false);
const error      = ref(false);
const errorMessage = ref('');

const semesterStore = useSemesterStore();

const univOptions = computed(() => [
  {label: 'Choose a university', value: null},
    ...universities.value
])

async function submitCreate(payload: Record<string, any>) {
  // payload contains: { name, start_date, end_date, registration_deadline, description }
  submitting.value = true;
  try {
    await semesterStore.createSemester(payload);
    reset('create-semester');
    success.value = true;
  } catch (e: any) {
    errorMessage.value = e.response?.data?.message || e.message || 'Failed to create semester';
    error.value = true;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
.form-container {
  gap: 1.5rem;
}
</style>
