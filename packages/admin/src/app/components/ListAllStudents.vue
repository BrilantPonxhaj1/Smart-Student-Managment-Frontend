<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../../../axios';

interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}
const students = ref<Student[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showEditDialog = ref(false);
const selectedStudent = ref<Student | null>(null);

async function fetchStudents() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('admin/students');
    students.value = res.data.data;
  } catch (e: any) {
    console.error(e);
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}
function editStudent(item: Student) {
  selectedStudent.value = { ...item};
  showEditDialog.value = true;
}
onMounted(fetchStudents);

async function deleteStudent(item: Student) {
  if(!confirm(`Delete ${item.first_name} ${item.last_name}?`)) return;
  try {
    await api.delete(`/admin/students/${item.id}`);
    await fetchStudents();
  } catch (e) {
    console.error('Delete failed', e);
    alert('Failed to delete student');
  }
}

import EditStudentDialog from "./EditStudentDialog.vue";
</script>

<template>
  <v-card class = "pa-4">
    <v-card-title class ="justify-center text-h5" align="center">
      All Students
    </v-card-title>
    <v-card-text>
      <v-alert v-if ="error" type="error" dense outlined>
        {{error}}
      </v-alert>

      <v-progress-circular
        v-else-if="loading"
        indeterminate
        class ="mx-auto"
        />

      <v-data-table
          v-else
          :headers="[
          { title: 'ID',         value: 'id' },
          { title: 'First Name', value: 'first_name' },
          { title: 'Last Name',  value: 'last_name' },
          { title: 'Email',      value: 'email' },
          { title: 'Phone',      value: 'phone' },
          { title: 'Role',       value: 'role' },
          { text: 'Actions',    value: 'actions', sortable: false }
        ]"
          :items="students"
          class="elevation-1"
          dense
          hide-default-footer

      >
        <!-- disable the ESLint rule here so the plugin doesn't treat .actions as a modifier -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-container class="justify-lg-space-evenly d-flex">
            <v-fab icon="mdi-account-edit" variant="outlined" @click="editStudent(item)"></v-fab>
            <v-fab icon="mdi-trash-can" variant="outlined" @click="deleteStudent(item)"></v-fab>

          </v-container>
        </template>
        <template #no-data>
          No students found.
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <EditStudentDialog
      v-model="showEditDialog"
      :student="selectedStudent"
      @saved="fetchStudents"
  />
</template>

<style scoped>

</style>