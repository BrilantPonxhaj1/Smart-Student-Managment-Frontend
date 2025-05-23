<template>
  <v-app>
    <v-layout>
      <ProfessorSidebar />

      <v-main class="main">
        <v-container fluid>
          <!-- Filter buttons -->
          <div class="d-flex justify-center mb-4">
            <v-btn color="primary" class="ma-2" @click="toggleList('all')">
              List All Complaints
            </v-btn>
            <v-btn color="primary" class="ma-2" @click="toggleList('open')">
              List Unresolved Complaints
            </v-btn>
          </div>

          <!-- Search input -->
          <v-text-field
              v-model="search"
              label="Search complaints"
              prepend-inner-icon="mdi-magnify"
              class="mb-4"
              density="compact"
              variant="outlined"
              hide-details
          />

          <!-- Complaints table -->
          <v-data-table
              :headers="headers"
              :items="filteredComplaints"
              :loading="loading"
              class="elevation-1"
              fixed-header
              height="400px"
              dense
          >
            <template #item.actions="{ item }">
              <v-icon size="small" color="primary" class="me-2" @click="editComplaint(item)">
                mdi-pencil
              </v-icon>
            </template>

            <template #no-data>
              <p class="text-center">No complaints found.</p>
            </template>
          </v-data-table>

          <!-- Edit Dialog -->
          <EditComplaintDialog
              v-model="showEditDialog"
              :complaint="selectedComplaint"
              @saved="fetchComplaints"
          />
        </v-container>
      </v-main>
    </v-layout>
  </v-app>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import ProfessorSidebar from "../components/ProfessorSidebar.vue";

const complaints = ref<any[]>([]);
const selectedComplaint = ref(null);
const showEditDialog = ref(false);
const loading = ref(false);
const filterType = ref<'all' | 'open'>('all');
const search = ref('');

// Table headers
const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Student', value: 'student_name' },
  { title: 'Category', value: 'category' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false }
];

// Fetch complaints from API
async function fetchComplaints() {
  loading.value = true;
  try {
    const endpoint =
        filterType.value === 'open'
            ? '/professor/complaints/open'
            : '/professor/complaints';
    const res = await fetchProfessorComplaints(endpoint);
    complaints.value = res || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

// Trigger data loading based on filter
function toggleList(type: 'all' | 'open') {
  filterType.value = type;
  fetchComplaints();
}

function editComplaint(item: any) {
  selectedComplaint.value = { ...item };
  showEditDialog.value = true;
}

// Search logic
const filteredComplaints = computed(() => {
  if (!search.value) return complaints.value;
  const term = search.value.toLowerCase();
  return complaints.value.filter((c) =>
      [
        c.title,
        c.description,
        c.category,
        c.student_name
      ].some((field) => field?.toLowerCase().includes(term))
  );
});

// Initial fetch
watch(filterType, fetchComplaints, { immediate: true });
</script>

<style scoped>
.main {
  display: flex;
}
</style>
