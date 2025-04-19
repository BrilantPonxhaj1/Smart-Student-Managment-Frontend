<script setup lang="ts">

import {FormKit, reset} from '@formkit/vue'
import { ref } from 'vue'
import api from '../../../../../axios';

const submitting = ref(false)
const showSuccessSnack = ref(false)
const showErrorSnack = ref(false)
const errorMessage = ref('');

async function submit(values: Record<string, any>) {
  submitting.value = true
  try{
    await api.post('/admin/students', values);
    reset('create-students')
    showSuccessSnack.value = true
  } catch (err: any) {
    if(err.response?.status === 422 && err.response.data.errors) {
      const firstField = Object.keys(err.response.data.errors)[0]
      errorMessage.value = err.response.data.error[firstField][0]
    } else {

      errorMessage.value = err.response?.data?.message
      || 'An unexpected error occurred.'
    }
    showErrorSnack.value = true
  } finally {
    submitting.value = false
  }
}

</script>

<template>

  <v-container fill-height fliud>
    <v-row align ="center" justify="center">
      <v-col cols ="12" md ="8" lg = "5">
        <v-card class="pa-4 rounded-xl" elevation ="2">
          <v-card-title class ="justify-center">
            Create New Student
          </v-card-title>
          <v-card-text class = "d-flex align-content-center justify-center flex-column">
            <!-- FormKit form wrapper -->
            <FormKit
              type = "form"
              id = "create-student"
              :loading = "submitting"
              submit-label="Submit"
              @submit="submit"
              class ="submit"
            >
            <!-- First Name -->
              <FormKit
                  type="text"
                  name="first_name"
                  label="First Name"
                  validation="required"
              />
              <!-- Last Name -->
              <FormKit
                  type="text"
                  name="last_name"
                  label="Last Name"
                  validation="required"
              />
              <!-- Email -->
              <FormKit
                  type="email"
                  name="email"
                  label="Email"
                  validation="required|email"
              />
              <!-- Phone -->
              <FormKit
                  type="tel"
                  name="phone"
                  label="Phone Number"
                  validation="required"
              />
              <!-- Password -->
              <FormKit
                  type="password"
                  name="password"
                  label="Password"
                  validation="required"
              />
              <!-- Role -->
              <FormKit
                  type="select"
                  name="role"
                  label="Role"
                  :options="[
                  { label: 'Student', value: 'Student' }
                ]"
                  validation="required"
              />
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
  align-text: center;
}
</style>