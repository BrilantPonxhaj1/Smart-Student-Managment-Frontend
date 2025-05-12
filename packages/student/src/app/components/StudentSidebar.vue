<!-- packages/student/src/app/components/StudentSidebar.vue -->

<template>
  <!-- Shared Sidebar, passing the student menu items -->
  <Sidebar :items="menuItems">
    <!-- Optional user slot: Student’s avatar, name & email -->
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
// 1) Import the generic Sidebar component
import Sidebar from '../../../../src/app/components/Sidebar.vue'
// 2) Bring in the student-specific menu array
import {studentMenu} from '../../../../src/app/composables/useMenu'

// 3) Get the current user from the auth package
import {useUserStore} from '@auth/app/store/userStore'
import {onMounted, computed} from 'vue'

// 4) Fetch & expose the user
const userStore = useUserStore()
onMounted(() => userStore.fetchCurrent())
const user = computed(() => userStore.current)

// 5) Provide the menu items to the Sidebar
const menuItems = studentMenu
</script>

<style scoped>
@import 'vuetify/styles';
</style>
