<template>
  <v-dialog v-model="dialogValue" max-width="600">
    <v-card>
      <v-card-title>Edit University</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              v-model="form.name"
              label="Name"
              required
          />
          <v-text-field
              v-model="form.code"
              label="Code"
              required
          />
          <v-text-field
              v-model="form.address"
              label="Address"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn
            color="primary"
            @click="save"
            :loading="submitting"
            :disabled="submitting"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-snackbar v-model="success" :timeout="3000" top color="success">
    University updated successfully!
  </v-snackbar>
  <v-snackbar v-model="error" :timeout="4000" top color="error">
    An error occurred while editing the university!
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import api from '../../../../../axios';

const props = defineProps({
  modelValue: Boolean,
  university: Object,
});
const emit = defineEmits(['update:modelValue', 'saved']);

const submitting = ref(false);
const success = ref(false);
const error = ref(false);

const form = ref({ ...props.university });
watch(
    () => props.university,
    (u) => {
      form.value = { ...u };
    },
    { immediate: true }
);

async function save() {
  submitting.value = true;
  error.value = false;
  try {
    const updatedForm = {
      ...form.value,
    };

    await api.put(`/admin/universities/${form.value.id}`, updatedForm);
    success.value = true;
    emit('saved');
    emit('update:modelValue', false);
  } catch (e) {
    console.error(e);
    error.value = true;
  } finally {
    submitting.value = false;
  }
}

const dialogValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});

function close() {
  emit('update:modelValue', false);
}
</script>
