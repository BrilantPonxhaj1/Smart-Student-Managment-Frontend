<template>
  <v-card class="mx-auto" max-width="400" outlined>
    <v-card-title class="justify-space-between">
      <div>
        <div class="text-h6">{{ offering.subject.name }}</div>
        <div class="text-subtitle-2 grey--text">{{ offering.subject.code }}</div>
      </div>
      <v-chip :color="offering.enrolled ? 'green lighten-4' : 'blue lighten-4'" small>
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

    <v-card-actions v-if="!offering.enrolled">
      <v-btn color="primary" text @click="$emit('register', offering.id)">
        Register
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

const props = defineProps({
  offering: {type: Object, required: true}
})
const emit = defineEmits(['register'])
</script>
