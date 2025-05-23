<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useComplaintStore } from '../stores/ComplaintStore';
import EditComplaintDialog from './EditComplaintDialog.vue';

const showEditDialog = ref(false);
const selectedComplaint = ref<any | null>(null);
const search = ref('');

const store = useComplaintStore();
const { complaints, loading, fetchAllComplaints } = store;

onMounted(fetchAllComplaints);

function editComplaint(complaint: any) {
  selectedComplaint.value = { ...complaint };
  showEditDialog.value = true;
}

const filteredComplaints = computed(() => {
  const term = search.value.toLowerCase();
  return complaints.filter((c) =>
      [c.title, c.description, c.category, c.professor_name, c.subject_name]
          .some(field => field?.toLowerCase().includes(term))
  );
});

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Description', value: 'description' },
  { title: 'Category', value: 'category' },
  { title: 'Status', value: 'status' },
  { title: 'Professor', value: 'professor_name' },
  { title: 'Subject', value: 'subject_name' },
  { title: 'Actions', value: 'actions', sortable: false }
];
</script>

<template>
  <v-card class="mx-auto" max-width="100%" title="All Complaints" subtitle="Manage student complaints">
    <template v-slot:append>
      <v-btn color="primary" prepend-icon="mdi-refresh" @click="fetchAllComplaints">
        Refresh
      </v-btn>
    </template>

    <v-card-text>
      <v-text-field
          v-model="search"
          density="compact"
          variant="outlined"
          label="Search by title, description, professor or subject"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          class="mb-4"
      />

      <v-data-table
          :headers="headers"
          :items="filteredComplaints"
          :loading="loading"
          item-value="id"
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
    </v-card-text>
  </v-card>

  <EditComplaintDialog
      v-model="showEditDialog"
      :complaint="selectedComplaint"
      @saved="fetchAllComplaints"
  />
</template>

<style scoped>
.v-card-text {
  padding-top: 20px;
  overflow-x: auto;
}
</style>