<template>
  <v-app>
    <AppSidebar />

    <v-main>
      <v-container>
        <v-row align="center" class="mt-6 mb-4">
          <v-col>
            <h1 class="text-h4">Welcome, {{ studentName }}</h1>
          </v-col>
        </v-row>

        <SemesterSelector
            :semesters="store.semesters"
            v-model="store.currentSemesterId"
            @update:modelValue="store.fetchOfferings"

        />

        <CourseOfferingsGrid
            :offerings="store.offerings"
            @register-course="handleRegister"
        />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useStudentStore }       from '../store/studentStore'
import AppSidebar                from '../components/StudentSidebar.vue'
import SemesterSelector          from '../components/SemesterSelector.vue'
import CourseOfferingsGrid       from '../components/CourseOfferingGrid.vue'

const store = useStudentStore()
onMounted(() => store.loadDashboard())

const studentName = computed(() =>
    store.profile
        ? `${store.profile.first_name} ${store.profile.last_name}`
        : ''
)

function handleRegister(courseId) {
  // call store.register(courseId) or API…
}
</script>
