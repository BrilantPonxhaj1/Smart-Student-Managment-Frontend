<template>
  <!-- This is your root application component -->
    <v-app>
      <router-view></router-view>
    </v-app>
</template>


<script setup lang="ts">
      import { onMounted } from 'vue';
      import { useUserStore } from './packages/auth/src/app/store/userStore';
      const userStore = useUserStore()
      onMounted(() => {
        userStore.fetchCurrent();
        document.title = 'SSMS';
        const link = document.createElement('link');
        link.rel = 'icon';
        // e zavendsojme me logon tani e SSMS
        link.href = 'https://static.vecteezy.com/system/resources/previews/017/348/073/non_2x/human-brain-and-lightbulb-creative-idea-concept-line-icon-light-bulb-inspiration-knowledge-smart-solution-linear-symbol-innovation-outline-sign-editable-stroke-isolated-illustration-vector.jpg'
        document.head.appendChild(link);
      });
</script>

<style>
/* Global styles */
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}

/* Add any global CSS rules here */
</style>
