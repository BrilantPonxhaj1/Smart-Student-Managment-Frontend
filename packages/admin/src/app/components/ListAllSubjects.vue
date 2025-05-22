<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../../../axios';
import EditDialogSubject from './EditSubjectDialog.vue';

interface Subject {
  id: number;
  code: string;
  name: string;
  university_id: number;
  department_id: number;
  description: string;
  credits: string;
  type: number;
}

const subjects = ref<Subject[]>([]);
const loading = ref(false);
const deleteSuccess = ref(false);
const error = ref<string | null>(null);

const showEditDialog = ref(false);
const selectedSubject = ref<Subject | null>(null);

async function fetchAllSubjects() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/admin/subjects');
    subjects.value = res.data.data;
  } catch (e: any) {
    console.error(e);
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function handleEditSubject(subject: Subject) {
  selectedSubject.value = { ...subject };
  showEditDialog.value = true;
}

async function handleDeleteSubject(subject: Subject) {
  const confirmed = confirm(`Delete subject "${subject.name}" (${subject.code})?`);
  if (!confirmed) return;

  try {
    await api.delete(`/admin/subjects/${subject.id}`);
    deleteSuccess.value = true;
    await fetchAllSubjects();
  } catch (e) {
    console.error('Delete failed:', e);
    alert('Failed to delete subject');
  }
}

onMounted(fetchAllSubjects);
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="justify-center text-h5" align="center">
      All Subjects
    </v-card-title>

    <v-card-text>
      <v-alert v-if="error" type="error" dense outlined>
        {{ error }}
      </v-alert>

      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <!-- Scrollable wrapper for the table -->
      <div class="table-scroll-wrapper" v-else>
        <v-data-table
            :headers="[
            { title: 'ID', value: 'id' },
            { title: 'Name', value: 'name' },
            { title: 'Code', value: 'code' },
            { title: 'UniversityID', value: 'university_id' },
            { title: 'DepartmentID', value: 'department_id' },
            // { title: 'Description', value: 'description' },
            { title: 'Credits', value: 'credits' },
            { title: 'Type', value: 'type' },
            { title: '', value: 'actions', sortable: false }
          ]"
            :items="subjects"
            class="elevation-1"
            dense
            hide-default-footer
        >
          <!-- eslint-disable-next-line vue/valid-v-slot -->
          <template #item.actions="{ item }">
            <v-container class="d-flex align-center">
              <v-fab
                  class="mr-2"
                  icon="mdi-square-edit-outline"
                  variant="outlined"
                  @click="handleEditSubject(item)"
              />
              <v-fab
                  icon="mdi-trash-can"
                  variant="outlined"
                  @click="handleDeleteSubject(item)"
              />
            </v-container>
          </template>

          <template #no-data>
            No subjects found.
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>

  <EditDialogSubject
      v-model="showEditDialog"
      :subject="selectedSubject"
      @saved="fetchAllSubjects"
  />
  <v-snackbar
      v-model="deleteSuccess"
      color="success"
      top
      :timeout="3000"
  >
    Subject deleted successfully!
  </v-snackbar>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
}
</style>
