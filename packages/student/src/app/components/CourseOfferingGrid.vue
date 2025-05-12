<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" v-if="!offerings.length">
        <v-alert type="info" text>
          No course offerings for this semester.
        </v-alert>
      </v-col>

      <v-col
          v-else
          v-for="off in offerings"
          :key="off.id"
          cols="12" sm="6" md="4"
      >
        <CourseOfferingCard
            :offering="off"
            @register="$emit('register-course', $event)"
            @cancel="$emit('cancel-course', $event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import CourseOfferingCard from './CourseOfferingCard.vue'

const props = defineProps({
  offerings: { type: Array, default: () => [] }
})
const emit = defineEmits(['register-course', 'cancel-course'])
</script>
