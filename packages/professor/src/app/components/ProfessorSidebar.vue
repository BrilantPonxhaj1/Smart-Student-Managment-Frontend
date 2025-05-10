<!-- packages/professor/src/app/components/ProfessorSidebar.vue -->
<template>
  <!-- Plug in the shared Sidebar and project a user slot -->
  <Sidebar :items="menuItems">
    <template #user>
      <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.png">
        <v-list-item-title>
          {{ user.first_name }} {{ user.last_name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
        </v-list-item-subtitle>
      </v-list-item>
    </template>
  </Sidebar>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue'
import Sidebar from '../../../../src/app/components/Sidebar.vue'
import { professorMenu } from '../../../../src/app/composables/useMenu'
import { useUserStore } from '@auth/app/store/userStore'

// Fetch the logged-in professor’s profile once
const userStore = useUserStore()
onMounted(() => userStore.fetchCurrent())

// Reactive reference to the user object
const user = computed(() => userStore.current)

// The array of links/icons for professors
const menuItems = professorMenu
</script>

<style scoped>
@import 'vuetify/styles';
</style>
