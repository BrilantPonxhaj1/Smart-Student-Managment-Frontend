<script setup lang="ts">
import { FormKit, reset } from '@formkit/vue'
import { ref, onMounted } from 'vue'
import api from '../../../../../axios'

const submitting       = ref(false)
const showSuccessSnack = ref(false)
const showErrorSnack   = ref(false)
const errorMessage     = ref('')

// the arrays we’ll feed into our FormKit selects
const universities = ref<{ id: number; name: string }[]>([])
const departments  = ref<{ id: number; name: string }[]>([])

// Load all universities on mount
onMounted(async () => {
  try {
    universities.value = (await api.get('/admin/universities')).data
  } catch {
    // handle error if you like
  }
})

// whenever the user picks a university, load its departments
function onUniversityChange(uniId: number) {
  if (!uniId) {
    departments.value = []
    return
  }
  api.get(`/admin/departments/${uniId}`)
      .then(res => { departments.value = res.data })
      .catch(() => { departments.value = [] })
}

async function submit(values: Record<string, any>) {
  submitting.value = true
  try {
    await api.post('/admin/students', values)
    reset('create-students')
    showSuccessSnack.value = true
  } catch (err: any) {
    if (err.response?.status === 422 && err.response.data.errors) {
      const field = Object.keys(err.response.data.errors)[0]
      errorMessage.value = err.response.data.errors[field][0]
    } else {
      errorMessage.value = err.response?.data?.message || 'An unexpected error occurred.'
    }
    showErrorSnack.value = true
  } finally {
    submitting.value = false
  }
}
</script>

<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="5">
        <v-card class="pa-4 rounded-xl" elevation="2">
          <v-card-title class="justify-center">
            Create New Student
          </v-card-title>
          <v-card-text>
            <FormKit
                type="form"
                id="create-students"
                :loading="submitting"
                submit-label="Submit"
                @submit="submit"
            >
              <FormKit
                  type="text"
                  name="student_number"
                  label="Student Number"
                  validation="required"
              />

              <FormKit
                  type="text"
                  name="first_name"
                  label="First Name"
                  validation="required"
              />

              <FormKit
                  type="text"
                  name="last_name"
                  label="Last Name"
                  validation="required"
              />

              <FormKit
                  type="email"
                  name="email"
                  label="Email"
                  validation="required|email"
              />

              <FormKit
                  type="password"
                  name="password"
                  label="Password"
                  validation="required|length:8"
              />

              <FormKit
                  type="password"
                  name="password_confirmation"
                  label="Confirm Password"
                  validation="required|confirm:password"
              />

              <FormKit
                  type="text"
                  name="program"
                  label="Program"
                  validation="required"
              />

              <FormKit
                  type="select"
                  name="university_id"
                  label="University"
                  :options="universities.map(u => ({ label: u.name, value: u.id }))"
                  validation="required"
                  @input="onUniversityChange"
              />

              <FormKit
                  type="select"
                  name="department_id"
                  label="Department"
                  :options="departments.map(d => ({ label: d.name, value: d.id }))"
                  validation="required"
              />

              <!-- Year of Study -->
              <FormKit
                  type="number"
                  name="year_of_study"
                  label="Year of Study"
                  validation="required|integer|min:1"
              />

              <!-- Enrollment Year -->
              <FormKit
                  type="number"
                  name="enrollment_year"
                  label="Enrollment Year"
                  validation="required|integer|min:1900"
              />

              <!-- Success & Error snacks -->
              <v-snackbar
                  v-model="showSuccessSnack"
                  :timeout="3000"
                  top
                  color="success"
              >
                Student created successfully!
              </v-snackbar>

              <v-snackbar
                  v-model="showErrorSnack"
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
.submit {
  justify-content: center;
  align-items: center;
  text-align: center;
}
</style>
