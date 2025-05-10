<template>
  <v-dialog v-model="dialogValue" max-width="600">
    <v-card>
      <v-card-title>Edit Subject</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field v-model="form.code" label="Code" required />
          <v-text-field v-model="form.name" label="Name" required />
          <v-textarea v-model="form.description" label="Description" />
          <v-text-field v-model="form.credits" label="Credits" required />
          <v-select v-model="form.type" :items="subjectTypes" label="Type" required />

          <v-select
              v-model="form.university_id"
              :items="universities.map(u => ({ title: u.label, value: u.value }))"
              label="University"
              required
              @update:modelValue="onUniversityChange"
          />
          <v-select
              v-model="form.department_id"
              :items="departments.map(d => ({ title: d.label, value: d.value }))"
              label="Department"
              required
          />
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
  </v-dialog>

  <v-snackbar v-model="success" :timeout="3000" top color="success">
    Subject updated successfully!
  </v-snackbar>

  <v-snackbar v-model="error" :timeout="4000" top color="error">
    An error occurred while editing the subject!
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSubjects } from '../composables/useSubjects';
import { useUniversities } from '../composables/useUniversities';
import { useDepartments } from '../composables/useDepartments';

const props = defineProps({ modelValue: Boolean, subject: Object });
const emit = defineEmits(['update:modelValue', 'saved']);

const { submitting, success, error, submitEdit } = useSubjects('edit-subject');
const form = ref({ ...props.subject });

// Load universities and departments
const { universities } = useUniversities();
const selectedUniv = ref<number>(props.subject?.university_id || 0);
const { departments } = useDepartments(selectedUniv);

const subjectTypes = ['Core', 'Elective'];

// Reset departments when university changes
function onUniversityChange(newUniversityId: number) {
  selectedUniv.value = newUniversityId;
  form.value.university_id = newUniversityId;
  form.value.department_id = null; // Reset department
}

// Watch for subject prop update
watch(() => props.subject, (s) => {
  form.value = {
    ...s,
    id: s?.id,
    type: s?.type,
    university_id: s?.university?.id ?? s?.university_id,
    department_id: s?.department?.id ?? s?.department_id
  };
  selectedUniv.value = form.value.university_id ?? 0;
});

// Convert form values for backend
function save() {
  const requiredFields = ['code', 'name', 'credits', 'type', 'university_id', 'department_id'];
  const missingField = requiredFields.find(field => {
    const value = form.value[field];
    return value === null || value === undefined || value === '';
  });

  if (missingField) {
    alert('Please fill in all required fields before submitting.');
    return;
  }

  const payload = {
    code: form.value.code,
    name: form.value.name,
    description: form.value.description ?? '', // Optional
    credits: form.value.credits,
    type: form.value.type, // send as string
    university_id: form.value.university_id,
    department_id: form.value.department_id,
  };

  submitEdit(form.value.id, payload).then(() => {
    emit('saved');
    emit('update:modelValue', false);
  });
}

function close() {
  emit('update:modelValue', false);
}

const dialogValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>