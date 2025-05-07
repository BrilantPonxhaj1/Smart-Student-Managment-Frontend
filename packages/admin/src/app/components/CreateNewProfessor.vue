<script setup lang="ts">
import {FormKit} from '@formkit/vue'
import { ref, computed } from 'vue'
// import api from '../../../../../axios';

import { useUniversities } from '../composables/useUniversities';
import { useDepartments } from '../composables/useDepartments';
import { useProfessorForm } from '../composables/useProfessorForm'


const { universities } = useUniversities();
const selectedUniv = ref<number>(0);
const { departments } = useDepartments(selectedUniv);
const { submitting, errorMessage, success, error, submitCreate } = useProfessorForm('create-professor');

function onUniversityChange(id: number | null | undefined) {
  selectedUniv.value = id ?? 0;
}

const univOptions = computed(() => [
  { label: 'Choose a university', value: null },
  ...universities.value
])

const deptOptions = computed(() => [
  { label: 'Choose a department', value: null },
  ...departments.value
])

</script>
<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <v-card-title class="justify-center text-h5 font-weight-bold">
            Create New Professor
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <!-- FormKit form wrapper -->
            <FormKit
              type="form"
              id="create-professor"
              :loading="submitting"
              submit-label="Submit"
              @submit="submitCreate"
              class="form-container"
            >
              <!-- Personal Details Section -->
              <v-row>
                <v-col cols="12">
                  <h5 class="section-header">Personal Details</h5>
                </v-col>
                <v-col cols="12" md="6">
                  <FormKit
                    type="text"
                    name="first_name"
                    label="First Name"
                    validation="required"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <FormKit
                    type="text"
                    name="last_name"
                    label="Last Name"
                    validation="required"
                  />
                </v-col>
                <v-col cols="12">
                  <FormKit
                    type="email"
                    name="email"
                    label="Email"
                    validation="required|email"
                  />
                </v-col>
                <v-col cols="12">
                  <FormKit
                    type="password"
                    name="password"
                    label="Password"
                    validation="required"
                  />
                </v-col>
              </v-row>

              <!-- Academic Details Section -->
              <v-row>
                <v-col cols="12">
                  <h5 class="section-header">Academic Details</h5>
                </v-col>
                <v-col cols="12" md="6">
                  <FormKit
                    type="select"
                    name="university_id"
                    label="University"
                    :options = "univOptions"
                    @input="onUniversityChange($event)"
                    validation="required"
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
                <v-col cols="12">
                  <FormKit
                    type="text"
                    name="specialization"
                    label="Specialization"
                    validation="required"
                  />
                </v-col>
                <v-col cols="12">
                  <FormKit
                    type="select"
                    name="academic_role"
                    label="Academic Role"
                    :options="[
                      { label: 'Professor', value: 'Professor' },
                      { label: 'Teaching Assistant', value: 'Teaching Assistant' }
                    ]"
                    validation="required"
                  />
                </v-col>
              </v-row>

              <!-- Submit Button -->
              <!-- <v-row justify="center" class="mt-4">
                <v-btn
                  color="primary"
                  :loading="submitting"
                  block
                  type="submit"
                  elevation="2"
                  @click="submit"
                >
                  Submit
                </v-btn>
              </v-row> -->

              <!-- Snackbars -->
              <v-snackbar
                v-model="success"
                :timeout="3000"
                top
                color="success"
              >
                Professor created successfully!
              </v-snackbar>
              <v-snackbar
                v-model="error"
                :timeout="4000"
                top
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

<style scoped>
.form-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #3f51b5;
}

.submit {
  justify-content: center;
  align-items: center;
}

.v-btn {
  font-weight: bold;
}
</style>

