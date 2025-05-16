<script setup lang="ts">
import { FormKit, reset } from '@formkit/vue'
import { ref } from 'vue'
import api from '../../../../../axios'

const submitting = ref(false)
const showSuccessSnack = ref(false)
const showErrorSnack = ref(false)
const errorMessage = ref('')

async function submit(values: Record<string, any>) {
  submitting.value = true
  try {
    await api.post('/admin/universities', values)
    reset('create-university')
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
            Create New University
          </v-card-title>
          <v-card-text>
            <FormKit
                type="form"
                id="create-university"
                :loading="submitting"
                submit-label="Create University"
                @submit="submit"
            >
              <FormKit
                  type="text"
                  name="name"
                  label="University Name"
                  validation="required"
              />

              <FormKit
                  type="text"
                  name="code"
                  label="University Code"
                  validation="required"
              />

              <FormKit
                  type="text"
                  name="address"
                  label="Address"
                  validation="required"
              />

              <!-- Success & Error snacks -->
              <v-snackbar
                  v-model="showSuccessSnack"
                  :timeout="3000"
                  top
                  color="success"
              >
                University created successfully!
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
