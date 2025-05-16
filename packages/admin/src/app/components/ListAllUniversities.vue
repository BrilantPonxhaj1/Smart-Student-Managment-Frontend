<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../../../axios';
import EditUniversityDialog from "./EditUniversityDialog.vue";

// Full University type with all required fields
interface University {
  id: number;
  name: string;
  code: string;
  address: string;
  departments: { id: number; name: string }[];
}

const universities = ref<University[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const deleteSuccess = ref(false);

const showEditDialog = ref(false);
const selectedUniversity = ref<University | null>(null);

async function fetchUniversities1() {
  loading.value = true;
  error.value = null;
  try {
    const res = await api.get('/admin/universities');
    universities.value = res.data;
  } catch (e: any) {
    console.error(e);
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function editUniversity(university: University) {
  selectedUniversity.value = { ...university };
  showEditDialog.value = true;
}

async function deleteUniversity(university: University) {
  const confirmed = confirm(`Delete university "${university.name}" (${university.code})?`);
  if (!confirmed) return;

  try {
    await api.delete(`/admin/universities/${university.id}`);
    deleteSuccess.value = true;
    await fetchUniversities1();
  } catch (e) {
    console.error('Delete failed:', e);
    alert('Failed to delete university');
  }
}

onMounted(fetchUniversities1);
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="justify-center text-h5" align="center">
      All Universities
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
          { title: 'ID', value: 'id' },
          { title: 'Name', value: 'name' },
          { title: 'Code', value: 'code' },
          { title: 'Address', value: 'address' },
          { title: 'Departments', value: 'departments' },
          { text: '', value: 'actions', sortable: false }
        ]"
          :items="universities"
          class="elevation-1"
          dense
          hide-default-footer
      >
        <!-- Dropdown menu for departments -->
        <template #item.departments="{ item }">
          <v-menu>
            <template #activator="{ props }">
              <v-btn v-bind="props" variant="outlined" size="small">
                View Departments
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                  v-for="(dept, index) in item.departments"
                  :key="index"
              >
                <v-list-item-title>{{ dept.name }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>

        <!-- Edit/Delete buttons -->
        <template #item.actions="{ item }">
          <v-container class="justify-lg-space-evenly d-flex">
            <v-fab icon="mdi-pencil" variant="outlined" @click="editUniversity(item)" />
            <v-fab icon="mdi-trash-can" variant="outlined" @click="deleteUniversity(item)" />
          </v-container>
        </template>

        <template #no-data>
          No universities found.
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>

  <EditUniversityDialog
      v-model="showEditDialog"
      :university="selectedUniversity"
      @saved="fetchUniversities1"
  />
</template>

<style scoped>
</style>
