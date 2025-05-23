<template>
  <v-card class="pa-4">
    <v-card-title class="text-center text-h5">Appointments</v-card-title>

    <v-card-text>
      <v-text-field
          v-model="searchQuery"
          label="Search by ID, Professor, Location, Purpose"
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
          clearable
      />

      <v-row class="mb-4" dense>
        <v-col cols="12" sm="6" md="3">
          <v-select
              v-model="statusFilter"
              :items="statusOptions"
              label="Filter by Status"
              multiple
              clearable
              chips
          />
        </v-col>

        <v-col cols="6" sm="3" md="2">
          <v-menu v-model="fromMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                  v-bind="props"
                  :model-value="fromDate ? fromDate.toISOString().split('T')[0] : ''"
                  label="From Date"
                  readonly
                  clearable
                  prepend-inner-icon="mdi-calendar"
              />
            </template>
            <v-date-picker
                v-model="fromDate"
                @update:model-value="fromMenu = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="6" sm="3" md="2">
          <v-menu v-model="toMenu" :close-on-content-click="false">
            <template #activator="{ props }">
              <v-text-field
                  v-bind="props"
                  :model-value="toDate ? toDate.toISOString().split('T')[0] : ''"
                  label="To Date"
                  readonly
                  clearable
                  prepend-inner-icon="mdi-calendar"
              />
            </template>
            <v-date-picker
                v-model="toDate"
                @update:model-value="toMenu = false"
            />
          </v-menu>
        </v-col>

        <v-col cols="12" sm="6" md="5" class="d-flex align-end">
          <v-btn
              :color="isDateFilterActive ? 'primary' : 'primary'"
              :variant="isDateFilterActive ? 'flat' : 'outlined'"
              class="text-uppercase"
              @click="clearDates"
          >
            Clear Dates
          </v-btn>
        </v-col>
      </v-row>

      <!-- Alerts and Loading -->
      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <!-- Table -->
      <div v-else class="table-scroll-wrapper">
        <v-data-table
            :headers="headers"
            :items="filteredAppointments"
            class="elevation-1"
            dense
            hide-default-footer
        >
          <template #item.actions="{ item }">
            <v-btn
                icon
                :disabled="!canDeleteAppointment(item.appointment_time)"
                :class="{ 'opacity-50': !canDeleteAppointment(item.appointment_time) }"
                @click="remove(item)"
            >
              <v-icon color="red">mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import api from '../../../../../axios';

interface Appointment {
  id: number;
  professor_name: string;
  appointment_time: string;
  location: string;
  purpose: string;
  status: string;
}

// State
const appointments = ref<Appointment[]>([]);
const loading = ref(false);
const error = ref('');
const searchQuery = ref('');
const statusFilter = ref<string[]>([]);
const statusOptions = ['scheduled', 'completed', 'canceled'];
const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);
const fromMenu = ref(false);
const toMenu = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Professor', value: 'professor_name' },
  { title: 'Time', value: 'appointment_time' },
  { title: 'Location', value: 'location' },
  { title: 'Purpose', value: 'purpose' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false }
];

// Filtering
const filteredAppointments = computed(() => {
  const q = searchQuery.value.toLowerCase();

  return appointments.value.filter((a) => {
    const matchesSearch =
        a.id.toString().includes(q) ||
        a.professor_name.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.purpose.toLowerCase().includes(q);

    const matchesStatus =
        statusFilter.value.length === 0 || statusFilter.value.includes(a.status);

    const appointmentDate = new Date(a.appointment_time);
    const matchesFrom = !fromDate.value || appointmentDate >= fromDate.value;
    const matchesTo = !toDate.value || appointmentDate <= toDate.value;

    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });
});

const isDateFilterActive = computed(() => !!fromDate.value || !!toDate.value);

function clearDates() {
  fromDate.value = null;
  toDate.value = null;
}

async function fetchAppointments() {
  loading.value = true;
  try {
    const res = await api.get('/student/appointments');
    appointments.value = res.data.data.map((item: any) => ({
      id: item.id,
      professor_name: item.professor_profile?.user
          ? `${item.professor_profile.user.first_name} ${item.professor_profile.user.last_name}`
          : '',
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

async function remove(item: Appointment) {
  if (!confirm('Are you sure you want to delete this appointment?')) return;
  try {
    await api.delete(`/student/appointments/${item.id}`);
    await fetchAppointments();
  } catch (e: any) {
    alert('Delete failed.');
  }
}

function canDeleteAppointment(dateStr: string): boolean {
  const appointmentDate = new Date(dateStr);
  const now = new Date();
  const diffInMs = appointmentDate.getTime() - now.getTime();
  const diffInMinutes = diffInMs / (1000 * 60);
  return diffInMinutes >= 60;
}

onMounted(fetchAppointments);
</script>

<style scoped>
.table-scroll-wrapper {
  max-height: 400px;
  overflow-y: auto;
}
.opacity-50 {
  opacity: 0.5;
  pointer-events: none;
}
</style>