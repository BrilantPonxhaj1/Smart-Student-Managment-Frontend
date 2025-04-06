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
                <v-btn :disabled="!form" :loading="loading" color="black" size="large" type="submit" variant="elevated"
                    block rounded>
                    Sign In
                </v-btn>
            </v-form>
        </v-card>
    </v-sheet>
</template>
<script setup>
import { ref } from 'vue'

const form = ref(false)
const email = ref(null)
const password = ref(null)
const loading = ref(false)

function onSubmit() {
    if (!form.value) return
    loading.value = true
    setTimeout(() => (loading.value = false), 2000)
}
function required(v) {
    return !!v || 'Field is required'
}
</script>