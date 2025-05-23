<script setup lang="ts">
import ProfessorSidebar from '../components/ProfessorSidebar.vue';
import { useAssignmentStore } from "../store/assignmentStore";
import { onMounted, computed, watch } from 'vue'
import CourseOfferingCard from "../components/CourseOfferingCard.vue";
import { useUserStore } from "../../../../auth/src/app/store/userStore";


const store = useAssignmentStore()
const userStore = useUserStore()

const showSuccess = computed<boolean>({
  get: () => store.successMessage !== '',
  set: val => { if (!val) store.successMessage = '' }
})
const showError = computed<boolean>({
  get: () => store.errorMessage !== '',
  set: val => { if (!val) store.errorMessage = '' }
})


onMounted(async () => {
  await userStore.fetchCurrent()
  await userStore.fetchProfessorProfile()
})


watch(
    () => userStore.professorId,
    (profId) => {
      if (profId !== null) {
        store.fetchOfferings(profId)
      }
    },
    { immediate: true }
)
</script>


<template>
  <v-app id="app">
    <ProfessorSidebar />
    <v-main class="main-content">
      <v-container class="content">
        <v-skeleton-loader v-if="store.loading" type="card" />
        <CourseOfferingCard
            v-for="off in store.offerings"
            :key="off.id"
            :offering="off"
            @add="payload => store.addAssignment(off.id, payload)"
            @remove="id => store.removeAssignment(id, off.id)"
        />
        <div v-if="!store.loading && store.offerings.length === 0">
          You have no course offerings this semester.
        </div>

        <!-- Success Snackbar -->
        <v-snackbar
            v-model="showSuccess"
            color="success"
            timeout="3000"
            top
            @click:outside="store.successMessage = ''"
        >
          {{ store.successMessage }}
        </v-snackbar>

        <!-- Error Snackbar -->
        <v-snackbar
            v-model="showError"
            color="error"
            timeout="3000"
            top
            @click:outside="store.errorMessage = ''"
        >
          {{ store.errorMessage }}
        </v-snackbar>

      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>

</style>