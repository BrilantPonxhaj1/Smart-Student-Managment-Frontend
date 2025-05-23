<template>
  <v-card class="pa-4">
    <v-card-title class="text-center text-h5">All Exams</v-card-title>
    <v-card-text>
      <v-text-field
          v-model="searchQuery"
          label="Search exams by ID, title, type, date, or duration"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
      />

      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <div v-else class="table-scroll-wrapper">
        <v-data-table
            :headers="headers"
            :items="filteredExams"
            class="elevation-1"
            dense
            hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-container class="d-flex align-center">
              <v-btn
                  icon
                  :disabled="isPastExam(item.date)"
                  :class="{ 'opacity-50': isPastExam(item.date) }"
                  @click="!isPastExam(item.date) && editExam(item)"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                  icon
                  :disabled="isPastExam(item.date)"
                  :class="{ 'opacity-50': isPastExam(item.date) }"
                  @click="!isPastExam(item.date) && deleteExam(item)"
              >
                <v-icon color="red">mdi-delete</v-icon>
              </v-btn>
            </v-container>
          </template>
        </v-data-table>
      </div>
    </v-card-text>

    <EditExamDialog
        v-model="showEditDialog"
        :exam="selectedExam"
        @saved="fetchExams"
    />

    <v-snackbar v-model="deleteSuccess" color="success" top :timeout="3000">
      Exam deleted successfully!
    </v-snackbar>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../../../../../axios';
import EditExamDialog from '../components/EditExamDialog.vue';

const exams = ref([]);
const loading = ref(false);
const error = ref(null);
const showEditDialog = ref(false);
const selectedExam = ref(null);
const deleteSuccess = ref(false);
const searchQuery = ref('');

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Title', value: 'title' },
  { title: 'Type', value: 'exam_type' },
  { title: 'Date', value: 'date' },
  { title: 'Duration', value: 'duration' },
  { title: 'Max Score', value: 'max_score' },
  { title: 'Weight (%)', value: 'weight' },
  { title: 'Actions', value: 'actions', sortable: false },
];

const filteredExams = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return exams.value.filter((exam: any) => {
    return (
        String(exam.id).includes(query) ||
        (exam.title && exam.title.toLowerCase().includes(query)) ||
        (exam.exam_type && exam.exam_type.toLowerCase().includes(query)) ||
        (exam.date && exam.date.toLowerCase().includes(query)) ||
        (String(exam.duration).includes(query))
    );
  });
});

async function fetchExams() {
  loading.value = true;
  try {
    const res = await api.get('/professor/exams');
    exams.value = res.data.data;
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function editExam(exam: any) {
  selectedExam.value = { ...exam };
  showEditDialog.value = true;
}

async function deleteExam(exam: any) {
  const confirmed = confirm(`Are you sure you want to delete "${exam.title}"?`);
  if (!confirmed) return;
  try {
    await api.delete(`/professor/exams/${exam.id}`);
    deleteSuccess.value = true;
    await fetchExams();
  } catch (e) {
    alert('Delete failed.');
    console.error(e);
  }
}

function isPastExam(dateString: string): boolean {
  const now = new Date();
  const examDate = new Date(dateString);
  return examDate < now;
}

onMounted(fetchExams);
</script>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
}

.opacity-50 {
  opacity: 0.5;
  pointer-events: none;
}
</style>