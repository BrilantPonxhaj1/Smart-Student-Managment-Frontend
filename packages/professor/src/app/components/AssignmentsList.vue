<script setup lang="ts">
import type { Assignment,CourseOffering } from '../types/index'
import { defineProps, defineEmits, ref } from 'vue'
import AssignmentForm from './AssignmentForm.vue'

const props = defineProps<{ assignments: Assignment[], offering: CourseOffering }>()
const emits = defineEmits<{
  (e: 'add', payload: Partial<Assignment>): void
  (e: 'remove', id: number): void
}>()

const showDeleteDialog = ref(false)
const assignmentToDelete = ref<number | null>(null)

function handleAdd(payload: Partial<Assignment>) {
  emits('add', {
    ...payload
  })
}

function confirmDelete(id: number) {
  assignmentToDelete.value = id
  showDeleteDialog.value = true
}

function handleDelete() {
  if (assignmentToDelete.value !== null) {
    emits('remove', assignmentToDelete.value)
    showDeleteDialog.value = false
    assignmentToDelete.value = null
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    year:   'numeric',
    month:  'long',
    day:    'numeric',
  })
}
</script>

<template>
  <v-card class="pa-4" elevation="3">
    <v-card-title class="text-h6 mb-2">Assignments</v-card-title>
    <v-divider class="mb-4" />
    <v-list density="comfortable">
      <v-list-item
        v-for="a in props.assignments"
        :key="a.id"
        class="assignment-row mb-2 rounded"
      >
        <template #prepend>
          <v-avatar color="primary" size="32">
            <v-icon>mdi-file-document-outline</v-icon>
          </v-avatar>
        </template>
        <v-list-item-title>
          <span class="font-weight-medium">{{ a.title }}</span>
          <span class="text-body-2 text-grey-darken-1"> — due {{ formatDate(a.due_date) }}</span>
        </v-list-item-title>
        <template #append>
          <v-tooltip text="Delete Assignment" location="top">
            <template #activator="{ props: tooltip }">
              <v-btn icon color="error" v-bind="tooltip" @click="confirmDelete(a.id)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-list-item>
    </v-list>
    <v-divider class="my-4" />
    <AssignmentForm
      :universityId="props.offering.university.id"
      :courseOfferingId="props.offering.id"
      :departmentId="props.offering.department.id"
      @submit="handleAdd"
    />

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h5">
          Delete Assignment
        </v-card-title>
        <v-card-text>
          Are you sure you want to delete this assignment? This action cannot be undone.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="grey-darken-1"
            variant="text"
            @click="showDeleteDialog = false"
          >
            Cancel
          </v-btn>
          <v-btn
            color="error"
            variant="text"
            @click="handleDelete"
          >
            Delete
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<style scoped>
.assignment-row {
  transition: background 0.2s;
}
.assignment-row:hover {
  background: #f5f5f5;
}
</style>