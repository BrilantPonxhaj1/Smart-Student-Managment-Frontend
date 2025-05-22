<template>
  <Sidebar />
  <v-main>
    <v-container>
      <v-row>
        <v-col cols="12">
          <ListAllAppointments />
        </v-col>
      </v-row>
    </v-container>
  </v-main>
</template>

<script setup lang="ts">
import Sidebar from '../components/ProfessorSidebar.vue';
import ListAllAppointments from '../components/ListAllAppointments.vue';
</script>