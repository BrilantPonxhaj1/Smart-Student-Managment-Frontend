<template>
  <v-app>
    <v-layout>
      <Sidebar />

      <v-main class="main">
        <v-container fluid>
          <div class="d-flex justify-center mb-4">
            <v-btn color="primary" class="ma-2" @click="toggleList('all')">
              List All Complaints
            </v-btn>
            <v-btn color="primary" class="ma-2" @click="toggleList('open')">
              List Unresolved Complaints
            </v-btn>
          </div>

          <v-data-table
              :headers="headers"
              :items="filteredComplaints"
              :loading="loading"
              class="elevation-1 mt-4"
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
<style>
.main{
  display: flex;
}
</style>
<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import api from '../../../../../axios';
import EditComplaintDialog from '../components/EditComplaintDialog.vue';
import Sidebar from '../components/Sidebar.vue';

const complaints = ref<any[]>([]);
const selectedComplaint = ref(null);
const showEditDialog = ref(false);
const loading = ref(false);
const filterType = ref<'all' | 'open'>('all');
const search = ref('');

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Category', value: 'category' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false },
];

async function fetchComplaints() {
  loading.value = true;
  try {
    const endpoint =
        filterType.value === 'open'
            ? '/admin/complaints/open'
            : '/admin/complaints';
    const res = await api.get(endpoint);
    complaints.value = res.data?.data || [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function toggleList(type: 'all' | 'open') {
  filterType.value = type;
  fetchComplaints();
}

function editComplaint(item: any) {
  selectedComplaint.value = { ...item };
  showEditDialog.value = true;
}

const filteredComplaints = computed(() => {
  if (!search.value) return complaints.value;
  const term = search.value.toLowerCase();
  return complaints.value.filter((c) =>
      [
        c.title,
        c.description,
        c.category,
      ].some((field) => field?.toLowerCase().includes(term))
  );
});

watch(filterType, fetchComplaints, { immediate: true });
</script>