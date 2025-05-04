<script setup lang="ts">
import { ref, onMounted } from 'vue';
import {Student, useStudentsStore} from '../store/studentsStore';
import EditStudentDialog from './EditStudentDialog.vue';

const store = useStudentsStore();
const showEditDialog   = ref(false);
const selectedStudent  = ref<Student | null>(null);

onMounted(() => store.fetchAll());


function editStudent(s: Student) {
  selectedStudent.value = { ...s };
  showEditDialog.value   = true;
}

async function deleteStudent(s: Student) {
  if (!confirm(`Delete ${s.first_name} ${s.last_name}?`)) return;
  try {
    await store.deleteById(s.id);
  } catch {
    alert('Failed to delete student');
  }
}
</script>

<template>

  <v-alert v-if="store.error" type="error" dense outlined>
    {{ store.error }}
  </v-alert>

  <v-progress-circular
      v-else-if="store.loading"
      indeterminate
      class="mx-auto"
  />

  <v-data-table
      :headers="[
    { title: 'ID',              value: 'id' },
    { title: 'First Name',      value: 'first_name' },
    { title: 'Last Name',       value: 'last_name' },
    { title: 'Student Number',  value: 'student_number' },
    { title: 'Program',         value: 'program' },
    { title: 'Department',      value: 'department' },
    { title: 'University',      value: 'university' },
    { title: 'Email',           value: 'email' },
    { text:  'Actions',         value: 'actions', sortable: false }
  ]"
      :items="store.list"
      dense
      hide-default-footer
      class="elevation-1"
  >
    <template #item.actions="{ item }">
      <v-container class="d-flex justify-lg-space-evenly">
        <v-fab icon="mdi-account-edit"
               variant="outlined"
               @click="editStudent(item)" />
        <v-fab icon="mdi-trash-can"
               variant="outlined"
               @click="deleteStudent(item)" />
      </v-container>
    </template>
    <template #no-data>
      No students found.
    </template>
  </v-data-table>

  <EditStudentDialog
      v-model="showEditDialog"
      :student="selectedStudent"
      @saved="store.fetchAll"
  />
</template>
