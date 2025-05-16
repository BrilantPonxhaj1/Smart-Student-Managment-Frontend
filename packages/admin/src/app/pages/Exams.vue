<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import ListAllExams from '../components/ListAllExams.vue';
import CreateNewExam from '../components/CreateNewExam.vue';

const showForm = ref(false);
const showList = ref(false);

function toggleForm() {
  showForm.value = !showForm.value;
  if (showForm.value) showList.value = false;
}

function toggleList() {
  showList.value = !showList.value;
  if (showList.value) showForm.value = false;
}
</script>

<template>
  <v-app id="app">
    <Sidebar />
    <v-main class="justify-center">
      <v-container class="d-flex justify-lg-space-evenly mb-6 flex-direction-column">
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleList">
          List all exams
        </v-btn>
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleForm">
          Create new exam
        </v-btn>
      </v-container>

      <div v-if="showForm">
        <CreateNewExam />
      </div>
      <div v-if="showList">
        <ListAllExams />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
#app {
  display: flex;
  min-width: 0;
  overflow: hidden;
}
</style>