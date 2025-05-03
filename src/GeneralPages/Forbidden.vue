<script setup lang="ts">

</script>

<template>
  <v-container class="text-center pa-12">
    <v-icon size="64" color="error">mdi-block-helper</v-icon>
    <h2>403 – Forbidden</h2>
    <p>You do not have permission to view this page.</p>
    <v-btn color="primary" @click="$router.back()">Go Back</v-btn>
  </v-container>
</template>

<style scoped>

</style>