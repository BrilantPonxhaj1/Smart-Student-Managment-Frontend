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
import { ref, computed, onMounted } from 'vue';
import { useAppointments } from '../../../../professor/src/app/composables/useAppointments';
import { useDepartments } from '../../../../admin/src/app/composables/useDepartments';
import { useUserStore } from '../../../../auth/src/app/store/userStore';

const { submitting, success, error, errorMessage, submitCreate } = useAppointments('create-appointment');
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

const rules = {
  required: (v: any) => !!v || 'This field is required'
};

// Get user info
const userStore = useUserStore();
const user = ref<any>(null);
const universityId = ref<number | null>(null);
const departmentId = ref<number | null>(null);

// Use department composable
const { professors, fetchProfessors } = useDepartments(universityId);
const professorOptions = computed(() => professors.value);

onMounted(async () => {
  await userStore.fetchCurrent();
  user.value = userStore.current;

  // You can adjust these if your API returns them differently
  universityId.value = user.value?.universityId;
  departmentId.value = user.value?.department_id;
  console.log("University: universityId");
  console.log("Department: departmentId");
  if (departmentId.value) {
    await fetchProfessors(departmentId.value);
  }
});

async function save() {
  const valid = await createFormRef.value?.validate();
  if (!valid) {
    error.value = true;
    errorMessage.value = 'Please correct the highlighted fields.';
    showErrorSnackbar.value = true;
    return;
  }

  const appointment_time = `${form.value.date} ${form.value.time || '00:00'}`;

  const payload = {
    professor_profile_id: form.value.professor_profile_id,
    appointment_time,
    location: form.value.location,
    purpose: form.value.purpose,
    notes: form.value.notes?.trim() || null
  };

  try {
    error.value = false;
    await submitCreate(payload);

    form.value = {
      professor_profile_id: null,
      date: '',
      time: '',
      location: '',
      purpose: '',
      notes: ''
    };

    createFormRef.value?.resetValidation();
  } catch (e) {
    showErrorSnackbar.value = true;
  }
}
</script>
