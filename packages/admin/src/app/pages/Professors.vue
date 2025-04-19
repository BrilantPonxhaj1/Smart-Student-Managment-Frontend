<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/Sidebar.vue';
import CreateNewProfessor from "../components/CreateNewProfessor.vue";
import ListAllProfessors from "../components/ListAllProfessors.vue";

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
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click=toggleList>List all professors</v-btn>
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleForm">Create new professor</v-btn>
<!--        <v-btn>Delete a professor account</v-btn>-->
      </v-container>
      <div v-if="showForm">
          <CreateNewProfessor />
      </div>
      <div v-if="showList">
          <ListAllProfessors />
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