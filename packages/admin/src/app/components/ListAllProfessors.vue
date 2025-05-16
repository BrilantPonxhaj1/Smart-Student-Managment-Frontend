<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../../../axios';
import EditProfessorDialog from "./EditProfessorDialog.vue";

// Match the API shape exactly:
interface Professor {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  role: string;
}

const professors = ref<Professor[]>([]);
const loading    = ref(false);
const error      = ref<string | null>(null);

const showEditDialog = ref(false);
const selectedProfessor = ref<Professor | null>(null);

async function fetchProfessors() {
  loading.value = true;
  error.value   = null;
  try {
    const res = await api.get('/admin/professors');
    professors.value = res.data.data;
  } catch (e: any) {
    console.error(e);
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function editProfessor(item: Professor) {
  selectedProfessor.value = { ...item };
  showEditDialog.value = true;
}


onMounted(fetchProfessors);


async function deleteProfessor(item: Professor) {
  if (!confirm(`Delete ${item.first_name} ${item.last_name}?`)) return;
  try {
    await api.delete(`/admin/professors/${item.id}`);
    await fetchProfessors();
  } catch (e) {
    console.error('Delete failed', e);
    alert('Failed to delete professor');
  }
}
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="justify-center text-h5 font-weight-bold mb-4" align="center">
      All Professors
    </v-card-title>

    <v-card-text>
      <v-alert v-if="error" type="error" dense outlined>
        {{ error }}
      </v-alert>

      <v-progress-circular
          v-else-if="loading"
          indeterminate
          class="mx-auto d-block my-6"
          color="primary"
          size="42"
      />

      <v-data-table
          v-else
          :headers="[
          { title: 'ID',         value: 'id' },
          { title: 'First Name', value: 'first_name' },
          { title: 'Last Name',  value: 'last_name' },
          { title: 'Email',      value: 'email' },
          { title: 'Specialization',      value: 'specialization' },
          { title: 'Academic Role',       value: 'academic_role' },
          { text: 'Actions',    value: 'actions', sortable: false }
        ]"
          :items="professors"
          class="elevation-1 rounded compact-table"
          dense
          hide-default-footer

      >
        <!-- disable the ESLint rule here so the plugin doesn't treat .actions as a modifier -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-container class="justify-lg-space-evenly d-flex">
            <v-fab icon="mdi-account-edit" variant="tonal" color="primary" @click="editProfessor(item)"></v-fab>
            <v-fab icon="mdi-trash-can" variant="tonal" color="error" @click="deleteProfessor(item)"></v-fab>

          </v-container>
        </template>

        <template #no-data>
          <div class="text-center pa-4">
              <v-icon icon="mdi-calendar-blank" size="large" class="mb-2"></v-icon>
              <div>No professors found.</div>
          </div>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <EditProfessorDialog
      v-model="showEditDialog"
      :professor="selectedProfessor"
      @saved="fetchProfessors"
  />
</template>

<style scoped>
:deep(.v-data-table) {
    border-radius: 8px;
}

:deep(.v-data-table-header) {
    background-color: #f5f5f5;
}

:deep(.v-data-table-header th) {
    font-weight: 600 !important;
    color: rgba(0, 0, 0, 0.8) !important;
}

:deep(.v-data-table-row:hover) {
    background-color: #f9f9f9;
}

:deep(.compact-table) {
    font-size: 0.875rem;
    max-width: 90%;
    margin: 0 auto;
}

:deep(.compact-table th) {
    padding: 0 8px !important;
    font-size: 0.875rem !important;
}

:deep(.compact-table td) {
    padding: 0 8px !important;
}

</style>
