<template>
  <v-dialog v-model="dialogValue" max-width="700px">
    <v-card>
      <v-card-title>Edit Appointment</v-card-title>
      <v-card-text>
        <v-form ref="editFormRef" v-model="formValid">
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
          <v-text-field
              v-model="form.appointment_time"
              label="Appointment Time"
              type="datetime-local"
              :rules="[rules.required]"
              required
          />
          <v-select
              v-model="form.status"
              label="Status"
              :items="statusOptions"
              :rules="[rules.required]"
              required
          />
          <v-textarea v-model="form.notes" label="Notes" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save" :loading="submitting" :disabled="submitting">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="success" :timeout="3000" top color="success">
      Appointment updated successfully!
    </v-snackbar>
    <v-snackbar v-model="showErrorSnackbar" :timeout="4000" top color="error">
      {{ errorMessage }}
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useAppointments } from '../composables/useAppointments';

const props = defineProps({
  modelValue: Boolean,
  appointment: Object
});
const emit = defineEmits(['update:modelValue', 'saved']);

const { submitting, success, error, errorMessage, submitEdit } = useAppointments('edit-appointment');

const editFormRef = ref();
const formValid = ref(true);
const showErrorSnackbar = ref(false);

const statusOptions = ['scheduled', 'completed', 'canceled'];

const form = ref({
  id: props.appointment?.id,
  appointment_time: props.appointment?.appointment_time,
  location: props.appointment?.location,
  purpose: props.appointment?.purpose,
  status: props.appointment?.status || 'scheduled',
  notes: props.appointment?.notes,
  requested_by: props.appointment?.requested_by
});

const rules = {
  required: (v: any) => !!v || 'This field is required'
};

const dialogValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

watch(() => props.appointment, (a) => {
  form.value = {
    id: a?.id,
    appointment_time: a?.appointment_time,
    location: a?.location,
    purpose: a?.purpose,
    status: a?.status || 'scheduled',
    notes: a?.notes,
    requested_by: a?.requested_by
  };
});

async function save() {
  const valid = await editFormRef.value?.validate();
  if (!valid) return;

  try {
    await submitEdit(form.value.id, form.value);
    emit('saved');
    dialogValue.value = false;
  } catch {
    showErrorSnackbar.value = true;
  }
}

function close() {
  dialogValue.value = false;
}
</script>