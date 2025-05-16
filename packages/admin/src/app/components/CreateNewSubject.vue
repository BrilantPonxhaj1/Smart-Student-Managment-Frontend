<script setup lang="ts">
import { FormKit } from '@formkit/vue'
import { ref, computed } from 'vue'
import { useSubjects } from '../composables/useSubjects'
import { useUniversities } from '../composables/useUniversities'
import { useDepartments } from '../composables/useDepartments'

// Load university/department logic
const { universities } = useUniversities()
const selectedUniv = ref<number>(0)
const { departments } = useDepartments(selectedUniv)

// Subject form logic
const { submitting, errorMessage, success, error, submitCreate } = useSubjects('create-subject')

const subjectTypeOptions = [
  { label: 'Core', value: 'Core' },
  { label: 'Elective', value: 'Elective' },
]

const univOptions = computed(() => [
  { label: 'Choose a university', value: null },
  ...universities.value
])

const deptOptions = computed(() => [
  { label: 'Choose a department', value: null },
  ...departments.value
])

function onUniversityChange(id: number | null | undefined) {
  selectedUniv.value = id ?? 0
}

function handleSubmit(values: Record<string, any>) {
  if (!values.description || values.description.trim() === '') {
    values.description = null
  }

  if (!values.university_id || !values.department_id) {
    alert('Please select both university and department.')
    return
  }

  submitCreate(values)
}
</script>

<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <v-card-title class="justify-center text-h5 font-weight-bold">
            Create New Subject
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <FormKit
                type="form"
                id="create-subject"
                :loading="submitting"
                submit-label="Submit"
                @submit="handleSubmit"
                class="form-container"
            >
              <v-row>
                <v-col cols="12">
                  <h5 class="section-header">Subject Information</h5>
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="text"
                      name="code"
                      label="Code"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="text"
                      name="name"
                      label="Name"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12">
                  <FormKit
                      type="textarea"
                      name="description"
                      label="Description"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="text"
                      name="credits"
                      label="Credits"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="select"
                      name="type"
                      label="Type"
                      :options="subjectTypeOptions"
                      validation="required"
                  />
                </v-col>

                <v-col cols="12">
                  <h5 class="section-header">Academic Details</h5>
                </v-col>

                <v-col cols="12" md="6">
                  <FormKit
                      type="select"
                      name="university_id"
                      label="University"
                      :options="univOptions"
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
              </v-row>

              <!-- Snackbars -->
              <v-snackbar v-model="success" :timeout="3000" top color="success">
                Subject created successfully!
              </v-snackbar>
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

.section-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #3f51b5;
}
</style>
