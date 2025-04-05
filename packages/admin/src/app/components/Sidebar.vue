<script setup lang="ts">

import {ref} from 'vue';
const items = ref([
  { text: 'My Files', icon: 'mdi-folder', route: '/superadmin/dashboard' },
  { text: 'Shared with me', icon: 'mdi-account-multiple', route: '/welcome' },
  { text: 'Starred', icon: 'mdi-star' },
  { text: 'Recent', icon: 'mdi-history' },
  { text: 'Offline', icon: 'mdi-check-circle' },
  { text: 'Uploads', icon: 'mdi-upload' },
  { text: 'Backups', icon: 'mdi-cloud-upload' },
  { text: 'Dashboard', icon: 'mdi-view-dashboard' },
  { text: 'Settings', icon: 'mdi-cog' },
  { text: 'Notifications', icon: 'mdi-bell' },
  { text: 'Messages', icon: 'mdi-email' },
  { text: 'Profile', icon: 'mdi-account' },
  { text: 'Help', icon: 'mdi-help-circle' },
  { text: 'Logout', icon: 'mdi-logout' },
]);
</script>
<template>
  <v-navigation-drawer permanent width="256">
    <v-list>
      <v-list-item
          prepend-avatar="https://cdn.vuetifyjs.com/images/john.png"
          subtitle="john@google.com"
          title="John Leider"
      >
        <template v-slot:append>
          <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list :lines="false" density="compact" nav>
      <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.route"
          :value="item"
          color="primary"
      >
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
    <v-divider>
      <v-btn color="secondary" rounded="true" variant="elevated">test</v-btn>
    </v-divider>
  </v-navigation-drawer>
</template>
<style scoped>
@import "vuetify/styles";
</style>