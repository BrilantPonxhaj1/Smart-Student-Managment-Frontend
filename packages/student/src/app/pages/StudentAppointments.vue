<template>
  <v-app id="app">
    <Sidebar />
    <v-main class="justify-center">
      <v-container class="d-flex justify-lg-space-evenly mb-6 flex-direction-column">
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleList">
          List all appointments
        </v-btn>
        <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleForm">
          Create new appointment
        </v-btn>
      </v-container>
      <div v-if="showForm">
        <CreateNewAppointment />
      </div>
      <div v-if="showList">
        <ListAllAppointments />
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '../components/StudentSidebar.vue';
import CreateNewAppointment from '../components/CreateNewAppointment.vue';
import ListAllAppointments from '../components/ListAllAppointments.vue';

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