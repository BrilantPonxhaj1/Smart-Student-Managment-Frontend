<script setup lang="ts">
import ProfessorSidebar from "../components/ProfessorSidebar.vue";
import ProfessorCalendar from "../components/ProfessorCalendar.vue";
</script>

<template>
  <v-app id="app">
    <ProfessorSidebar />
    <v-main>
      <v-container class ="content" >
        <h1 style="text-align: center">Professor Dashboard</h1>
        <ProfessorCalendar />
      </v-container>
    </v-main>

  </v-app>
</template>

<style scoped>

</style>