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
            @update:modelValue="fetchOfferings"
        />

        <CourseOfferingsGrid
            :offerings="store.offerings"
            @register-course="handleRegister"
            @cancel-course="handleCancel"
        />

        <!-- centralized error snackbar -->
        <v-snackbar v-model="showError" color="error" timeout="3000">
          {{ enrollmentStore.error }}
        </v-snackbar>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import {onMounted, computed, ref, watch} from 'vue'
import {useStudentStore} from '../store/studentStore'
import {useEnrollmentStore} from '../store/enrollmentStore'
import AppSidebar from '../components/StudentSidebar.vue'
import SemesterSelector from '../components/SemesterSelector.vue'
import CourseOfferingsGrid from '../components/CourseOfferingGrid.vue'

const store = useStudentStore()
const enrollmentStore = useEnrollmentStore()

// Controls the snackbar’s visibility
const showError = ref(false)

// When the component mounts, load profile/semesters/offerings
onMounted(() => {
  store.loadDashboard()
})

// Whenever enrollmentStore.error changes to a non-null value,
// show the snackbar
watch(
    () => enrollmentStore.error,
    (error) => {
      if (error) showError.value = true
    }
)

const studentName = computed(() =>
    store.profile
        ? `${store.profile.first_name} ${store.profile.last_name}`
        : ''
)

async function fetchOfferings() {
  await store.fetchOfferings()
}

async function handleRegister(courseId) {
  try {
    await enrollmentStore.register(courseId)
    await fetchOfferings()
  } catch {
    // the watch above will flip showError to true
  }
}

async function handleCancel(enrollmentId) {
  try {
    await enrollmentStore.cancel(enrollmentId)
    await fetchOfferings()
  } catch {
    // the watch above will flip showError to true
  }
}
</script>
