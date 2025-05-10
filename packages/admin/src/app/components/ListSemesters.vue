<script setup lang="ts">
import { useSemesterStore } from '../stores/SemesterStore';
import {computed, onMounted, ref} from 'vue';
import EditSemesterDialog from "./EditSemesterDialog.vue";

interface Semester {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    registration_deadline: string;
    description: string;
}

const semesterStore = useSemesterStore();
const semesters = computed(() => semesterStore.semesters);
const loading = computed(() => semesterStore.loading);

const error = computed(() => semesterStore.error);
const showEditDialog = ref(false);

const selectedSemester = ref<Semester | null>(null);
function editSemester(item: Semester) {
  selectedSemester.value = { ...item };
  showEditDialog.value = true;

}
async function deleteSemester(item: Semester) {
  if (!confirm(`Delete ${item.name}?`)) return;
  try {
        await semesterStore.deleteSemester(item.id);
    } catch (e) {
        console.error('Delete failed', e);
        alert('Failed to delete semester');
    }

}

onMounted(() => semesterStore.fetchSemesters());
</script>

<template>
    <v-card class="pa-4">
    <v-card-title class="justify-center text-h5 font-weight-bold mb-4" align="center">
      Semester
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
        {title: 'ID',         value: 'id'},
        {title: 'Name',       value: 'name'},
        {title: 'Start Date', value: 'start_date'},
        {title: 'End Date',   value: 'end_date'},
        {title: 'Registration Deadline', value: 'registration_deadline'},
        {title: 'Description', value: 'description'},
        {value: 'actions', sortable: false}
      ]"
      :items="semesters"
      class="elevation-1 rounded compact-table"
      dense
      hide-default-footer
      >
      <!-- disable the ESLint rule here so the plugin doesn't treat .actions as a modifier -->
        <!-- eslint-disable-next-line vue/valid-v-slot -->
        <template #item.actions="{ item }">
          <v-container class="justify-lg-space-evenly d-flex">
            <v-fab icon="mdi-account-edit" variant="tonal" color="primary" @click="editSemester(item)"></v-fab>
            <v-fab icon="mdi-trash-can" variant="tonal" color="error" @click="deleteSemester(item)"></v-fab>

          </v-container>
        </template>

        <template #no-data>
          <div class="text-center pa-4">
            <v-icon icon="mdi-calendar-blank" size="large" class="mb-2"></v-icon>
            <div>No semesters found.</div>
          </div>
        </template>
      </v-data-table>

      </v-card-text>
    </v-card>

  <EditSemesterDialog
      v-model="showEditDialog"
      :semester="selectedSemester"
      @updated="semesterStore.fetchSemesters"
  />
</template>

<style scoped>

</style>
