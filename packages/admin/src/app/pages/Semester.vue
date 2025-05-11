<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import { ref } from 'vue';
import CreateNewSemester from '../components/CreateNewSemester.vue';
import ListSemesters from '../components/ListSemesters.vue';


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
    <v-container>
      <Sidebar />
      <v-main class="justify-center">
        <v-container class="d-flex justify-lg-space-evenly mb-6 flex-direction-column">
            <v-btn
                color="primary"
                variant="tonal"
                class="ma-2 px-6 py-3 text-capitalize font-weight-medium rounded-pill"
                elevation="3"
                prepend-icon="mdi-format-list-bulleted"
                @click="toggleList"
            >
                List all semesters
            </v-btn>
            <v-btn
                color="primary"
                variant="tonal" 
                class="ma-2 px-6 py-3 text-capitalize font-weight-medium rounded-pill"
                elevation="3"
                prepend-icon="mdi-plus"
                @click="toggleForm"
            >
                Create new semester
            </v-btn>
        </v-container>
          <div v-show="showForm">
            <CreateNewSemester />
          </div>
          <div v-show="showList">
            <ListSemesters />
          </div>

      </v-main>
    </v-container>
  </v-app>
</template>


