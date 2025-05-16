<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useCourseOfferingStore, type CourseOffering } from '../stores/CourseOfferingStore';
import { useRouter } from 'vue-router';

const courseOfferingStore = useCourseOfferingStore();
const router = useRouter();
const headers = [
  { title: 'University', key: 'university.name' },
  { title: 'Department', key: 'department.name' },
  { title: 'Subject', key: 'subject.name' },
  { title: 'Professor', key: 'professors.name' },
  { title: 'Semester', key: 'semester' },
  { title: 'Section', key: 'section' },
  { title: 'Schedule', key: 'schedule' },
  { title: 'Capacity', key: 'capacity' },
  { title: 'Actions', key: 'actions', sortable: false },
];

const loading = ref(false);
const search = ref('');
const dialog = ref(false);
const idToDelete = ref<number | null>(null);

onMounted(async () => {
  loading.value = true;
  await courseOfferingStore.fetchCourseOfferings();
  loading.value = false;
});

const handleEdit = (item: CourseOffering) => {
  router.push({ name: 'EditCourseOffering', params: { id: item.id } });
};

const openDeleteDialog = (id: number) => {
  idToDelete.value = id;
  dialog.value = true;
};

const handleDelete = async () => {
  if (idToDelete.value) {
    await courseOfferingStore.deleteCourseOffering(idToDelete.value);
    dialog.value = false;
    idToDelete.value = null;
  }
};

const getProfessorName = (item: CourseOffering): string => {
  if (item.professor_profile && item.professor_profile.user) {
    return `${item.professor_profile.user.first_name} ${item.professor_profile.user.last_name}`;
  }
  return 'N/A';
};
</script>

<template>
  <v-card class="mx-auto" title="Course Offerings" subtitle="Manage course offerings" width="100%">
    <template v-slot:append>
      <v-btn color="primary" prepend-icon="mdi-plus" :to="{ name: 'CreateCourseOffering' }">
        Add Course Offering
      </v-btn>
    </template>
    
    <v-card-text>
      <v-text-field
        v-model="search"
        density="compact"
        variant="outlined"
        label="Search"
        append-inner-icon="mdi-magnify"
        single-line
        hide-details
        class="mb-4"
      ></v-text-field>
      
      <v-data-table
        :headers="headers"
        :items="courseOfferingStore.courseOfferings"
        :search="search"
        :loading="loading || courseOfferingStore.loading"
        item-value="id"
      >
        <!-- Professor name column -->
        <template v-slot:item.professorName="{ item }">
          {{ getProfessorName(item) }}
        </template>
        
        <!-- Schedule column -->
        <template v-slot:item.schedule="{ item }">
          <span v-if="item.schedule">{{ item.schedule }}</span>
          <span v-else class="text-disabled">Not specified</span>
        </template>
        
        <!-- Section column -->
        <template v-slot:item.section="{ item }">
          <span v-if="item.section">{{ item.section }}</span>
          <span v-else class="text-disabled">Not specified</span>
        </template>
        
        <!-- Capacity column -->
        <template v-slot:item.capacity="{ item }">
          <span v-if="item.capacity">{{ item.capacity }}</span>
          <span v-else class="text-disabled">Not specified</span>
        </template>
        
        <!-- Actions column -->
        <template v-slot:item.actions="{ item }">
          <v-icon
            size="small"
            color="primary"
            class="me-2"
            @click="handleEdit(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            size="small"
            color="error"
            @click="openDeleteDialog(item.id)"
          >
            mdi-delete
          </v-icon>
        </template>
        
        <!-- No data placeholder -->
        <template v-slot:no-data>
          <p class="text-center">No course offerings available</p>
        </template>
      </v-data-table>
    </v-card-text>
  </v-card>
  
  <!-- Delete Confirmation Dialog -->
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-title>Delete Course Offering</v-card-title>
      <v-card-text>
        Are you sure you want to delete this course offering?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="dialog = false">Cancel</v-btn>
        <v-btn color="error" variant="text" @click="handleDelete">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.v-card-text {
  padding-top: 20px;
}
</style> 