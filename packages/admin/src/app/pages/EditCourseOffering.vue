<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import CourseOfferingForm from '../components/CourseOfferingForm.vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const courseOfferingId = Number(route.params.id);

const handleSaved = () => {
  router.push({ name: '/superadmin/course-offerings' });
};

const handleCancel = () => {
  router.push({ name: '/superadmin/course-offerings' });
};
</script>

<template>
  <v-app class="main">
    <v-container>
      <Sidebar />
      <v-main class="justify-center">
        <v-container>
          <v-row>
            <v-col cols="12">
              <v-btn
                color="secondary"
                variant="text"
                prepend-icon="mdi-arrow-left"
                @click="router.back()"
                class="mb-4"
              >
                Back to Course Offerings
              </v-btn>
              <CourseOfferingForm 
                :editMode="true"
                :courseOfferingId="courseOfferingId"
                @saved="handleSaved"
                @cancel="handleCancel"
              />
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-container>
  </v-app>
</template>

<style scoped>
.main {
  display: flex;
}
</style> 