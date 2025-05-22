<template>
  <v-card class="pa-4">
    <v-card-title class="text-center text-h5">All Appointments</v-card-title>
    <v-card-text>
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <div v-else class="table-scroll-wrapper">
        <v-data-table
            :headers="headers"
            :items="appointments"
            class="elevation-1"
            dense
            hide-default-footer
        >
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '../../../../../axios';

const appointments = ref([]);
const loading = ref(false);
const error = ref(null);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Professor', value: 'professor_name' },
  { title: 'Time', value: 'appointment_time' },
  { title: 'Location', value: 'location' },
  { title: 'Purpose', value: 'purpose' },
  { title: 'Status', value: 'status' }
];

onMounted(fetchAppointments);

async function fetchAppointments() {
  loading.value = true;
  try {
    const res = await api.get('/student/appointments');
    appointments.value = res.data.data.map((item: any) => ({
      id: item.id,
      professor_name: item.professor_profile?.user?.first_name + ' ' + item.professor_profile?.user?.last_name,
      appointment_time: item.appointment_time,
      location: item.location,
      purpose: item.purpose,
      status: item.status
    }));
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
}
</style>