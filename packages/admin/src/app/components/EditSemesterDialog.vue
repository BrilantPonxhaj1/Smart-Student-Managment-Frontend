<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useSemesterStore } from '../stores/SemesterStore';
import type { Semester } from '../stores/SemesterStore';

const props = defineProps<{
  modelValue: boolean
  semester: Semester | null
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void;
  (e: 'updated'): void;
}>();

// const dialogValue = ref(props.modelValue);

const dialog = computed({
  get:  () => props.modelValue,
  set:  v => emit('update:modelValue', v)
});

const form = ref<Partial<Semester>>({
  name: '',
  start_date: '',
  end_date: '',
  registration_deadline: '',
  description: '',
});

const submitting = ref(false);
const semesterStore = useSemesterStore();

// Watch for dialog open and fill form
watch(() => props.modelValue, (open) => {
  if (open && props.semester) {
    form.value = { ...props.semester }
  }
})

// watch(dialogValue, (val) => {
//   emit('update:modelValue', val);
// });

function close() {
  dialog.value = false;
}

async function save() {
  if (!props.semester) return
  submitting.value = true

  try {
    await semesterStore.updateSemester(props.semester.id, form.value)
    emit('updated'); // to refresh list
    close();
  } catch (e) {
    console.error('Update failed:', e);
    alert('Failed to update semester');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="600">
    <v-card>
      <v-card-title>Edit Semester</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              v-model="form.name"
              label="Name"
              required
          />
          <v-date-picker
              v-model="form.start_date"
              label="Start Date"
              required
          />
          <v-date-picker
              v-model="form.end_date"
              label="End Date"
              required
          />

          <v-date-picker
              v-model="form.registration_deadline"
              label="Registration Deadline"
              required
          />

          <v-text-field
              v-model="form.description"
              label="Description"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save" :loading="submitting" :disabled="submitting" >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>