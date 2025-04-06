<script setup lang="ts">
import SuperAdminSidebar from "../components/Sidebar.vue";
</script>
<template>
  <v-app id="app">
    <SuperAdminSidebar />
    <v-main class="main-content">
      <v-container class="content">
        <router-view />
        <h1 class="h1text">SSMS Admin Dashboard</h1>
        <v-progress-circular model-value="50" :size="128" class="progress-spacing">DUMMY FILL</v-progress-circular>
        <v-progress-circular model-value="95" :size="128" class="progress-spacing">
          <v-btn>
            <v-icon>mdi-account</v-icon>
            <span>test</span>
          </v-btn>
        </v-progress-circular>
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
.progress-spacing{
  margin: 20px;
}


#app {
  display: flex;
  min-width: 0;
  overflow: hidden;
}
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}
.content {
  flex:1;
  padding: 20px;
  overflow: auto;
  max-width: 100%;
}
.h1text{
  text-align: center
}
</style>