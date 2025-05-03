<script setup lang="ts">
import { ref } from 'vue'
import {useLoginStore } from '../store/loginStore'
import {redirectUser} from '../composables/redirectUser'
import { useUserStore } from '../../../../auth/src/app/store/userStore';
const form = ref(false)
const email = ref<string>('');
const password = ref<string>('');
const loading = ref(false)
const loginStore = useLoginStore()
const {redirectToDashboard} = redirectUser();

const required = (value: any) => !!value || 'Field is required'
const userStore = useUserStore();
async function onSubmit() {
    loading.value = true
  try{
    const user = await loginStore.login(email.value, password.value)
    if (user) {
      await userStore.fetchCurrent()
      redirectToDashboard(user.type)
    }
  }finally {
    loading.value = false
  }

}
</script>
<template>
    <v-sheet class="d-flex align-center justify-center" style="height: 100vh; background-color: #f5f5f5;">
        <v-card class="d-flex flex-column align-center justify-center px-6 py-8 mt-17 w-25 h-50 rounded-xl">
            <v-card-title class="text-h4">Login</v-card-title>
            <v-form v-model="form" @submit.prevent="onSubmit" class="w-100" style="max-width: 500px;">
                <v-text-field v-model="email" :readonly="loading" :rules="[required]" class="mb-2" label="Email"
                    clearable variant="outlined" prepend-inner-icon="mdi-email-outline" rounded></v-text-field>
                <v-text-field v-model="password" :readonly="loading" :rules="[required]" label="Password"
                    placeholder="Enter your password" clearable variant="outlined" prepend-inner-icon="mdi-lock-outline"
                    rounded></v-text-field>
                <v-btn :disabled="!form || loading" :loading="loading" color="black" size="large" type="submit" variant="elevated"
                    block rounded>
                    Sign In
                </v-btn>
            </v-form>
        </v-card>
    </v-sheet>
</template>
