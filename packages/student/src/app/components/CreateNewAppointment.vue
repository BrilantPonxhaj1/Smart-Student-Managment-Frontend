<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6 rounded-xl" elevation="3">
          <v-card-title class="justify-center text-h5 font-weight-bold">
            Create New Appointment
          </v-card-title>
          <v-divider></v-divider>

          <v-card-text>
            <v-form ref="createFormRef" v-model="formValid" validate-on="input lazy">
              <v-select
                  v-model="form.professor_profile_id"
                  :items="professorOptions"
                  label="Professor"
                  item-title="label"
                  item-value="value"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.date"
                  label="Date"
                  type="date"
                  :min="todaysDate"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.time"
                  label="Time"
                  type="time"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.location"
                  label="Location"
                  :rules="[rules.required]"
                  required
              />

              <v-text-field
                  v-model="form.purpose"
                  label="Purpose"
                  :rules="[rules.required]"
                  required
              />

              <v-textarea v-model="form.notes" label="Notes (optional)" />

              <v-btn color="primary" @click="save" :loading="submitting" :disabled="submitting">
                Create Appointment
              </v-btn>

              <v-snackbar v-model="success" :timeout="3000" top color="success">
                Appointment created successfully!
              </v-snackbar>
              <v-snackbar v-model="showErrorSnackbar" :timeout="4000" top color="error">
                {{ errorMessage }}
              </v-snackbar>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue';
import { useAppointments } from '../../../../professor/src/app/composables/useAppointments';
import { useUserStore } from '../../../../auth/src/app/store/userStore';
import api from '../../../../../axios';

const {
  submitting,
  fetchProfessors,
  submitCreate,
  success,
  errorMessage
} = useAppointments('create-appointment');
const userStore = useUserStore();

const createFormRef = ref();
const formValid = ref(true);
const showErrorSnackbar = ref(false);
const todaysDate = new Date().toISOString().split('T')[0];

const form = ref({
  professor_profile_id: null,
  date: '',
  time: '',
  location: '',
  purpose: '',
  notes: ''
});

const rules = { required: (v: any) => !!v || 'This field is required' };

const professors = ref([]);
const studentData = ref<any>(null);
const professorOptions = computed(() =>
    professors.value.map((p: any) => ({
      label: `${p.first_name ?? ''} ${p.last_name ?? ''} (${p.email ?? ''})`,
      value: p.id
    }))
);

// Fetch initial data
onMounted(async () => {
  try {
    await userStore.fetchCurrent();
    const studentRes = await api.get('/student/getStudentByUser');
    studentData.value = studentRes.data.data;

    professors.value = await fetchProfessors();
  } catch (e) {
    console.error('Failed to load initial data:', e);
    errorMessage.value = 'Unable to load data.';
    showErrorSnackbar.value = true;
  }
});

// Submit function
async function save() {
  const valid = await createFormRef.value?.validate();
  if (!valid) {
    showErrorSnackbar.value = true;
    errorMessage.value = 'Please correct the highlighted fields.';
    return;
  }

  if (!studentData.value || !userStore.current?.id) {
    showErrorSnackbar.value = true;
    errorMessage.value = 'User or student data not loaded.';
    return;
  }

  const appointment_time = `${form.value.date} ${form.value.time || '00:00'}`;
  const payload = {
    professor_profile_id: form.value.professor_profile_id,
    appointment_time,
    location: form.value.location,
    purpose: form.value.purpose,
    notes: form.value.notes?.trim() || null,
    university_id: studentData.value.university_id,
    department_id: studentData.value.department_id,
    student_profile_id: studentData.value.id,
    requested_by: userStore.current.id,
    status: 'scheduled'
  };

  try {
    await submitCreate(payload);

    // Reset form
    form.value = {
      professor_profile_id: null,
      date: '',
      time: '',
      location: '',
      purpose: '',
      notes: ''
    };

    await nextTick();
    createFormRef.value?.resetValidation();
  } catch {
    showErrorSnackbar.value = true;
  }
}
</script>
