<script setup lang="ts">
import {computed, ref} from 'vue'
import { defineEmits } from 'vue'
import type { Assignment } from '../types/index';

const props = defineProps<{
  universityId: number
  courseOfferingId: number
  departmentId: number
}>()

const title = ref('')
const dueDate = ref('')
const description = ref('')
const maxScore = ref<number | null>(null)
const assignmentType = ref<'homework' | 'project' | 'lab'>('homework')
const loading = ref(false)

const emits = defineEmits<{
  (e: 'submit', payload: Partial<Assignment>): void
}>()

const payload = computed(() => ({
  university_id: props.universityId,
  department_id: props.departmentId,
  course_offering_id: props.courseOfferingId,
  title: title.value,
  due_date: dueDate.value,
  description: description.value || undefined,
  max_score: maxScore.value ?? undefined,
  assignment_type: assignmentType.value,
}))

async function submit() {
  loading.value = true
  await emits('submit', payload.value)
  title.value = ''
  dueDate.value = ''
  description.value = ''
  maxScore.value = null
  assignmentType.value = 'homework'
  loading.value = false
}

function reset() {
  title.value = ''
  dueDate.value = ''
  description.value = ''
  maxScore.value = null
  assignmentType.value = 'homework'
}

</script>

<template>
  <v-card class="assignment-form pa-6" elevation="2">
    <v-card-title class="text-h5 mb-6 d-flex align-center">
      <v-icon icon="mdi-book-plus" class="mr-2" color="primary" />
      Create New Assignment
    </v-card-title>
    
    <v-form @submit.prevent="submit" class="d-flex flex-column gap-4">
      <v-card-text class="pa-0">
        <div class="d-flex flex-column gap-4">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="text-subtitle-1 font-weight-medium mb-2">Basic Information</div>
            <v-text-field
              v-model="title"
              label="Assignment Title"
              required
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Title is required']"
              placeholder="Enter assignment title"
              prepend-inner-icon="mdi-format-title"
            />
            <v-textarea
              v-model="description"
              label="Description"
              variant="outlined"
              density="comfortable"
              placeholder="Enter assignment description"
              auto-grow
              rows="3"
              prepend-inner-icon="mdi-text-box-outline"
            />
          </div>

          <!-- Assignment Details Section -->
          <div class="form-section">
            <div class="text-subtitle-1 font-weight-medium mb-2">Assignment Details</div>
            <div class="d-flex gap-4">
              <v-select
                v-model="assignmentType"
                :items="[
                  { title: 'Homework', value: 'homework' },
                  { title: 'Project', value: 'project' },
                  { title: 'Lab', value: 'lab' }
                ]"
                item-title="title"
                item-value="value"
                label="Assignment Type"
                variant="outlined"
                density="comfortable"
                required
                :rules="[v => !!v || 'Type is required']"
                class="flex-grow-1"
                prepend-inner-icon="mdi-tag-outline"
              />
              <v-text-field
                v-model.number="maxScore"
                type="number"
                label="Max Score"
                required
                variant="outlined"
                density="comfortable"
                :rules="[
                  v => v !== null || 'Score is required',
                  v => (v >= 0) || 'Must be non-negative',
                  v => (v <= 100) || '100 is the maximum score',
                ]"
                placeholder="e.g. 100"
                class="flex-grow-1"
                prepend-inner-icon="mdi-numeric"
              />
            </div>
            <v-text-field
              v-model="dueDate"
              type="date"
              label="Due Date"
              required
              variant="outlined"
              density="comfortable"
              :rules="[v => !!v || 'Due date is required']"
              prepend-inner-icon="mdi-calendar"
            />
          </div>
        </div>
      </v-card-text>

      <v-divider class="my-4" />

      <div class="d-flex gap-4">
        <v-btn
          type="submit"
          :loading="loading"
          color="primary"
          size="large"
          class="flex-grow-1"
          elevation="2"
          :disabled="loading"
        >
          <v-icon start icon="mdi-plus-circle" class="mr-2" />
          {{ loading ? 'Creating...' : 'Create Assignment' }}
        </v-btn>
        <v-btn
          variant="outlined"
          color="error"
          size="large"
          class="flex-grow-1"
          @click="reset"
          :disabled="loading"
        >
          <v-icon start icon="mdi-close-circle" class="mr-2" />
          Cancel
        </v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<style scoped>
.assignment-form {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
}

.gap-4 {
  gap: 16px;
}

.form-section {
  background-color: rgb(var(--v-theme-surface));
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgb(var(--v-border-color));
}

.v-btn {
  transition: all 0.3s ease;
}

.v-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.v-btn:active {
  transform: translateY(0);
}

:deep(.v-field__input) {
  padding-top: 8px;
  padding-bottom: 8px;
}

:deep(.v-field__prepend-inner) {
  padding-top: 8px;
}
</style>