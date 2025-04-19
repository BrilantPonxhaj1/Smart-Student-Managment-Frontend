<script setup lang="ts">

import {ref} from 'vue';
const items = ref([
  { text: 'My Files', icon: 'mdi-folder', route: '/superadmin/dashboard' },
  { text: 'Students', icon: 'mdi-account-school',route: '/admin/students'},
  { text : 'Professors' , icon: 'mdi-account-tie', route:'/admin/professors'},
]);
</script>
<template>
  <v-navigation-drawer permanent width="300">
    <v-list>
      <!-- it takes the page longer to load bcs of this i think we should remove it-->
      <v-list-item prepend-avatar="https://cdn.vuetifyjs.com/images/john.png" subtitle="john@google.com"
        title="John Leider">
        <template v-slot:append>
          <v-btn icon="mdi-menu-down" size="small" variant="text"></v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list :lines="false"  nav>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.route" :value="item" color="primary">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
@import "vuetify/styles";
</style>