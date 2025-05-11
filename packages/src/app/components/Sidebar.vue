<!-- src/app/components/Sidebar.vue -->
<template>
  <v-navigation-drawer permanent width="300">
    <!-- user slot: you can override this in each layout -->
    <slot name="user"/>

    <v-divider/>

    <v-list nav dense>
      <v-list-item
          v-for="item in items"
          :key="item.text"
          :to="item.route"
          router
          link
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>

      <!-- Logout always at the bottom -->
      <v-list-item @click="logout">
        <template #prepend>
          <v-icon icon="mdi-logout" />
        </template>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import { useRouter }   from 'vue-router'
import { useLoginStore } from '@auth/app/store/loginStore'

const props = defineProps<{
  items: { text: string; icon: string; route: string }[]
}>()

const router = useRouter()
const login  = useLoginStore()

function logout() {
  login.logout()
  localStorage.removeItem('access_token')
  router.push({ name: 'Login' })
}
</script>

<style scoped>
@import 'vuetify/styles';
</style>
