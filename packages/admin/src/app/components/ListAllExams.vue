<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../../../../axios';
import EditExamDialog from './EditExamDialog.vue';
import { useUniversities } from '../composables/useUniversities';
import { useDepartmentStore } from '../stores/DepartmentStore';
import { storeToRefs } from 'pinia';

interface Exam {
  id: number;
  title: string;
  exam_type: string;
  date: string;
  duration: number;
  max_score: number;
  weight: number;
  description: string;
  university_id: number;
  department_id: number;
}

const exams = ref<Exam[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const deleteSuccess = ref(false);
const showEditDialog = ref(false);
const selectedExam = ref<Exam | null>(null);

const searchQuery = ref('');

// Load universities from store
const { universities } = useUniversities();

// Prepare department name map
const departmentStore = useDepartmentStore();
const { departments: departmentList } = storeToRefs(departmentStore);
const departmentMap = ref<Record<number, string>>({});

// Map university IDs to names
const universityMap = computed(() => {
  const map: Record<number, string> = {};
  universities.value.forEach(u => {
    map[u.value] = u.label;
  });
  return map;
});

// Filter exams by multiple fields
const filteredExams = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return exams.value;

  return exams.value.filter(exam => {
    const idMatch = exam.id.toString().includes(query);
    const titleMatch = exam.title.toLowerCase().includes(query);
    const typeMatch = exam.exam_type.toLowerCase().includes(query);
    const dateMatch = exam.date.toLowerCase().includes(query);
    const deptMatch = (departmentMap.value[exam.department_id] || '').toLowerCase().includes(query);
    const univMatch = (universityMap.value[exam.university_id] || '').toLowerCase().includes(query);

    return idMatch || titleMatch || typeMatch || dateMatch || deptMatch || univMatch;
  });
});

async function fetchDepartmentsForUniversities() {
  const seen = new Set<number>();
  for (const exam of exams.value) {
    const univId = exam.university_id;
    if (!seen.has(univId)) {
      seen.add(univId);
      await departmentStore.fetchDepartments(univId);
      departmentList.value.forEach(d => {
        departmentMap.value[d.value] = d.label;
      });
    }
  }
}

async function fetchAllExams() {
  loading.value = true;
  try {
    const res = await api.get('/admin/exams');
    exams.value = res.data.data;
    await fetchDepartmentsForUniversities(); // fetch dept names after exams
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function handleEdit(exam: Exam) {
  selectedExam.value = { ...exam };
  showEditDialog.value = true;
}

async function handleDelete(exam: Exam) {
  if (!confirm(`Delete exam "${exam.title}"?`)) return;
  try {
    await api.delete(`/admin/exams/${exam.id}`);
    deleteSuccess.value = true;
    await fetchAllExams();
  } catch (e) {
    alert('Failed to delete exam!');
  }
}

onMounted(fetchAllExams);
</script>

<template>
  <v-card class="pa-4">
    <v-card-title class="justify-center text-h5">Exams</v-card-title>

    <v-card-text>
      <v-text-field
          v-model="searchQuery"
          label="Search Exams by ID, Title, Type, Date, Department, or University"
          prepend-inner-icon="mdi-magnify"
          clearable
          class="mb-4"
      />

      <v-alert v-if="error" type="error" dense outlined>{{ error }}</v-alert>
      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <div class="table-scroll-wrapper" v-else>
        <v-data-table
            :headers="[
            { title: 'ID', value: 'id' },
            { title: 'Title', value: 'title' },
            { title: 'Type', value: 'exam_type' },
            { title: 'Date', value: 'date' },
            { title: 'Duration', value: 'duration' },
            { title: 'Score', value: 'max_score' },
            { title: 'Weight(%)', value: 'weight' },
            { title: '', value: 'info', sortable: false },
            { title: '', value: 'actions', sortable: false }
          ]"
            :items="filteredExams"
            class="elevation-1"
            dense
            hide-default-footer
        >
          <template #item.info ="{ item }">
            <v-tooltip location="top">
              <template #activator="{ props }">
                <v-icon v-bind="props" class="ml-1" small>mdi-information-outline</v-icon>
              </template>
              <span>
                <strong>University:</strong>
                {{ universityMap[item.university_id] || 'N/A' }}<br />
                <strong>Department:</strong>
                {{ departmentMap[item.department_id] || 'N/A' }}
              </span>
            </v-tooltip>
          </template>

          <template #item.actions="{ item }">
            <v-container class="d-flex align-center">
              <v-fab
                  class="mr-2"
                  icon="mdi-file-document-edit"
                  variant="outlined"
                  @click="handleEdit(item)"
              />
              <v-fab
                  icon="mdi-trash-can"
                  variant="outlined"
                  @click="handleDelete(item)"
              />
            </v-container>
          </template>

          <template #no-data>No exams found.</template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>

  <EditExamDialog
      v-model="showEditDialog"
      :exam="selectedExam"
      @saved="fetchAllExams"
  />

  <v-snackbar v-model="deleteSuccess" color="success" top :timeout="3000">
    Exam deleted successfully!
  </v-snackbar>
</template>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
}
</style>