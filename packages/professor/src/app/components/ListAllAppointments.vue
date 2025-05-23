<template>
  <v-card class="pa-4">
    <v-card-title class="text-center text-h5">All Appointments</v-card-title>
    <v-card-text>

      <v-text-field
          v-model="searchQuery"
          label="Search..."
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
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


      <v-alert v-if="error" type="error">{{ error }}</v-alert>
      <v-progress-circular v-else-if="loading" indeterminate class="mx-auto" />

      <!-- Data Table -->
      <v-data-table
          v-else
          :headers="headers"
          :items="filteredAppointments"
          class="elevation-1"
          dense
          hide-default-footer
      >
        <template #item.actions="{ item }">
          <v-btn icon @click="edit(item)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
          <v-btn icon @click="remove(item)">
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </template>
      </v-data-table>
    </v-card-text>

    <EditAppointmentDialog
        v-model="showEditDialog"
        :appointment="selectedAppointment"
        @saved="fetchAppointments"
    />
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import api from '../../../../../axios';
import EditAppointmentDialog from './EditAppointmentDialog.vue';

interface Appointment {
  id: number;
  appointment_time: string;
  location: string;
  purpose: string;
  status: string;
  notes?: string;
}

// State
const appointments = ref<Appointment[]>([]);
const loading = ref(false);
const error = ref('');
const showEditDialog = ref(false);
const selectedAppointment = ref<Appointment | null>(null);

const searchQuery = ref('');
const statusFilter = ref<string[]>([]);
const statusOptions = ['scheduled', 'completed', 'canceled'];

const fromDate = ref<Date | null>(null);
const toDate = ref<Date | null>(null);
const fromMenu = ref(false);
const toMenu = ref(false);

const headers = [
  { title: 'ID', value: 'id' },
  { title: 'Date/Time', value: 'appointment_time' },
  { title: 'Location', value: 'location' },
  { title: 'Purpose', value: 'purpose' },
  { title: 'Status', value: 'status' },
  { title: 'Actions', value: 'actions', sortable: false }
];

const filteredAppointments = computed(() => {
  const q = searchQuery.value.toLowerCase();

  return appointments.value.filter((a) => {
    const matchesSearch =
        a.appointment_time.toLowerCase().includes(q) ||
        a.location?.toLowerCase().includes(q) ||
        a.purpose?.toLowerCase().includes(q);

    const matchesStatus =
        statusFilter.value.length === 0 || statusFilter.value.includes(a.status);

    const appointmentDate = new Date(a.appointment_time);
    const matchesFrom = !fromDate.value || appointmentDate >= fromDate.value;
    const matchesTo = !toDate.value || appointmentDate <= toDate.value;

    return matchesSearch && matchesStatus && matchesFrom && matchesTo;
  });
});

async function fetchAppointments() {
  loading.value = true;
  try {
    const res = await api.get('/professor/appointments');
    appointments.value = res.data.data;
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message;
  } finally {
    loading.value = false;
  }
}

function edit(item: Appointment) {
  selectedAppointment.value = { ...item };
  showEditDialog.value = true;
}

function clearDates() {
  fromDate.value = null;
  toDate.value = null;
}

const isDateFilterActive = computed(() => {
  return !!fromDate.value || !!toDate.value;
});

async function remove(item: Appointment) {
  if (!confirm('Are you sure?')) return;
  try {
    await api.delete(`/professor/appointments/${item.id}`);
    await fetchAppointments();
  } catch (e) {
    alert('Delete failed.');
  }
}

onMounted(fetchAppointments);
</script>