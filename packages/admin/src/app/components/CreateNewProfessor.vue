<script setup lang="ts">
import {FormKit, reset} from '@formkit/vue'
import { onMounted, ref } from 'vue'
import api from '../../../../../axios';

const submitting       = ref(false)
const showSuccessSnack = ref(false)
const showErrorSnack = ref(false)
const errorMessage   = ref('')

const universities = ref<{ label: string, value:number}[]>([])
const departments = ref<{ label: string, value:number}[]>([])

onMounted(async () => {
  try{
      const res = await api.get('/admin/universities')
      universities.value = res.data.map((u:any) => ({ label: u.name, value: u.id }))
  }catch(e) {
    console.error('Faied loading universities', e)
  }
})

function onUniversityChange(univId: number) {
  departments.value = []
  if(!univId) return
  // api.get(`/universities/${univId}/departments`)
  api.get(`/admin/departments/${univId}`) 
     .then(r => {
       departments.value = r.data.map((d:any) => ({ label: d.name, value: d.id }))
     })
     .catch(err => console.error('dept load failed', err))
}

async function submit(values: Record<string, any>) {
  submitting.value = true
  try {
    await api.post('/admin/professors', values);
    reset('create-professor')
    showSuccessSnack.value = true
  } catch (err: any) {

    if (err.response?.status === 422 && err.response.data.errors) {
      const firstField = Object.keys(err.response.data.errors)[0]
      errorMessage.value = err.response.data.errors[firstField][0]
    } else {

      errorMessage.value = err.response?.data?.message
          || 'An unexpected error occurred.'
    }
    showErrorSnack.value = true

  }finally {
    submitting.value = false
  }
}
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
              @submit="submit"
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
                    :options="[{ label: 'Choose a university', value: null }, ...universities]"
                    validation="required"
                    @input="onUniversityChange($event ?? 0)"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <FormKit
                    type="select"
                    name="department_id"
                    label="Department"
                    :options="[{label:'Choose a department', value: null}, ...departments]"
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
                v-model="showSuccessSnack"
                :timeout="3000"
                top
                color="success"
              >
                Professor created successfully!
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

