<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Edit Complaint</v-card-title>

      <v-card-text>
        <v-form>
          <v-select
              v-model="form.status"
              :items="statuses"
              label="Status"
              required
          />

          <v-textarea
              v-model="form.resolution_details"
              label="Resolution Details"
              rows="3"
              auto-grow
          />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn
            color="primary"
            :loading="submitting"
            :disabled="submitting"
            @click="save"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-snackbar v-model="success" color="success" top timeout="3000">
      Complaint updated successfully.
    </v-snackbar>
    <v-snackbar v-model="error" color="error" top timeout="4000">
      Failed to update complaint.
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import api from '../../../../../axios';

const props = defineProps({
  modelValue: Boolean,
  complaint: Object,
});
const emit = defineEmits(['update:modelValue', 'saved']);

const form = ref({ status: '', resolution_details: '' });
const submitting = ref(false);
const success = ref(false);
const error = ref(false);

const statuses = ['open', 'in_review', 'resolved', 'closed'];

watch(
    () => props.complaint,
    (val) => {
      if (val) {
        form.value = {
          status: val.status,
          resolution_details: val.resolution_details || '',
        };
      }
    },
    { immediate: true }
);

const dialog = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});

function close() {
  emit('update:modelValue', false);
}

async function save() {
  submitting.value = true;
  error.value = false;

  try {
    await api.put(`/admin/complaints/${props.complaint.id}`, form.value);
    success.value = true;
    emit('saved');
    close();
  } catch (e) {
    console.error('Update failed:', e);
    error.value = true;
  } finally {
    submitting.value = false;
  }
}
</script>

<style scoped>
</style>
