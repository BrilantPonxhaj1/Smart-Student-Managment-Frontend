<template>
  <v-card class="mx-auto" max-width="400" outlined>
    <v-card-title class="justify-space-between">
      <div>
        <div class="text-h6">{{ offering.subject.name }}</div>
        <div class="text-subtitle-2 grey--text">{{ offering.subject.code }}</div>
      </div>
      <v-chip
          :color="offering.enrolled ? 'green lighten-4' : 'blue lighten-4'"
          small
      >
        {{ offering.enrolled ? 'Enrolled' : 'Available' }}
      </v-chip>
    </v-card-title>

    <v-card-text>
      <div><strong>Schedule:</strong> {{ offering.schedule }}</div>
      <div class="mt-2">
        <strong>Professors:</strong>
        <v-chip
            v-for="p in offering.professors"
            :key="p.id"
            small
            class="ma-1"
        >
          {{ p.name }}
        </v-chip>
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn
          v-if="!offering.enrolled"
          color="primary"
          text
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleEnroll"
      >
        Register
      </v-btn>

      <v-btn
          v-else
          color="error"
          text
          :loading="isLoading"
          :disabled="isLoading"
          @click="handleCancel"
      >
        Cancel Enrollment
      </v-btn>
    </v-card-actions>
  </v-card>
</template>


<script setup>
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useEnrollmentStore } from '../store/enrollmentStore'

const props = defineProps({
  offering: { type: Object, required: true }
})

const emit = defineEmits(['register', 'cancel'])
const enrollmentStore = useEnrollmentStore()

// Reactive flag from the store to show loading on the buttons
const isLoading = computed(() => enrollmentStore.isLoading)
// Emit only—API call happens in the parent/dashboard
function handleEnroll() {
  emit('register', props.offering.id)
}

function handleCancel() {
  emit('cancel', props.offering.enrollment_id)
}
</script>
