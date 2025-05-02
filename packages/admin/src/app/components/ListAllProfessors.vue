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
    <v-card-title class="justify-center text-h5" align="center">
      All Professors
    </v-card-title>

    <v-card-text>
      <v-alert v-if="error" type="error" dense outlined>
        {{ error }}
      </v-alert>

      <v-progress-circular
          v-else-if="loading"
          indeterminate
          class="mx-auto"
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
          class="elevation-1"
          dense
          hide-default-footer

      >
        <!-- disable the ESLint rule here so the plugin doesn't treat .actions as a modifier -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-container class="justify-lg-space-evenly d-flex">
            <v-fab icon="mdi-account-edit" variant="outlined" @click="editProfessor(item)"></v-fab>
            <v-fab icon="mdi-trash-can" variant="outlined" @click="deleteProfessor(item)"></v-fab>

          </v-container>
        </template>

        <template #no-data>
          No professors found.
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

</style>
