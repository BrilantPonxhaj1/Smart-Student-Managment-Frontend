<script setup lang="ts">
import type { CourseOffering, Assignment } from '../types/index'
import AssignmentsList from './AssignmentsList.vue'
import { defineProps, defineEmits } from 'vue'

const props = defineProps<{ offering: CourseOffering }>()
const emits = defineEmits<{
  (e: 'add', payload: Partial<Assignment>): void
  (e: 'remove', id: number): void
}>()

function onAdd(payload: Partial<Assignment>) {
  emits('add', payload)
}
function onRemove(id: number) {
  emits('remove', id)
}

</script>


<template>
  <v-card class="mb-4">
    <v-card-title>{{ props.offering.subject.name }} ({{ props.offering.semester }})</v-card-title>
    <v-card-text>
      <!-- List + actions -->
      <AssignmentsList
          :assignments="props.offering.assignments"
          :offering="props.offering"
          @add="onAdd"
          @remove="onRemove"
      />
    </v-card-text>
  </v-card>
</template>

<style scoped>

</style>