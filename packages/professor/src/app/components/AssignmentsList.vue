<script setup lang="ts">
import type { Assignment,CourseOffering } from '../types/index'
import { defineProps, defineEmits } from 'vue'
import AssignmentForm from './AssignmentForm.vue'

const props = defineProps<{ assignments: Assignment[], offering: CourseOffering }>()
const emits = defineEmits<{
  (e: 'add', payload: Partial<Assignment>): void
  (e: 'remove', id: number): void
}>()

function handleAdd(payload: Partial<Assignment>) {
  emits('add', {
    ...payload
  })
}
</script>

<template>
  <div>
    <div v-for="a in props.assignments" :key="a.id" class="d-flex align-center mb-2">
      <div class="flex-grow-1">{{ a.title }} — due {{ a.due_date }}</div>
      <v-btn icon @click="$emit('remove', a.id)">
        <v-icon color="error">mdi-delete</v-icon>
      </v-btn>
    </div>
    <AssignmentForm
        :universityId="props.offering.university.id"
        :courseOfferingId="props.offering.id"
        :departmentId = "props.offering.department.id"
        @submit="handleAdd"
    />
  </div>
</template>

<style scoped>

</style>