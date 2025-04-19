<template>
  <v-dialog v-model="modelValue" max-width="600">
    <v-card>
      <v-card-title>Edit Professor</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              v-model="form.first_name"
              label="First Name"
              required
          />
          <v-text-field
              v-model="form.last_name"
              label="Last Name"
              required
          />
          <v-text-field
              v-model="form.email"
              label="Email"
              type="email"
              required
          />
          <v-text-field
              v-model="form.phone"
              label="Phone"
              required
          />
          <v-select
              v-model="form.role"
              :items="['Professor', 'Teaching Assistant']"
              label="Role"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
      v-model="showSuccessSnack"
      :timeout="3000"
      top
      color="success"
  >
    Professor created successfully!
  </v-snackbar>
  <v-snackbar
      v-model="showErrorSnack"
      :timeout="4000"
      top
      color="error"
  >
   An error occurred while editing the professor!
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, toRefs } from 'vue';
import api from '../../../../../axios';

const props = defineProps<{
  modelValue: boolean;
  professor: any | null;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'saved'): void;
}>();

const { modelValue, professor } = toRefs(props);

const form = ref({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  role: ''
});

watch(professor, (newVal) => {
  if (newVal) form.value = { ...newVal };
});

function close() {
  emit('update:modelValue', false);
}

const showSuccessSnack = ref(false)
const showErrorSnack = ref(false)

async function save() {
  try {
    await api.put(`/admin/professors/${form.value.id}`, form.value);
    emit('saved');
    showSuccessSnack.value = true;
    close();
  } catch (e) {
    console.error('Update failed', e);
    showErrorSnack.value = false;
  }
}
</script>
