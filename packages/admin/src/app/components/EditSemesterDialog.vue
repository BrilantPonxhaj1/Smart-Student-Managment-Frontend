<script setup lang="ts">
import { computed, watch, ref } from 'vue';
import { useSemesterStore, type Semester } from '../stores/SemesterStore';
import { useUnis } from '../composables/useUniversities';

const props = defineProps<{
  modelValue: boolean;
  semester: Semester | null;
}>();

const emit = defineEmits(['update:modelValue', 'saved']);

// Get universities list
const { unis:universities } = useUnis();

// two‑way proxy for the parent v-model
const dialog = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
});

const form = ref<Partial<Semester & { university_id: number }>>({});
const submitting = ref(false);
const semesterStore = useSemesterStore();

// when opened, populate the form
watch(() => props.modelValue, open => {
  if (open && props.semester) {
    form.value = { ...props.semester, university_id: (props.semester as any).university_id };
  }
});

function close() {
  dialog.value = false;
}

async function save() {
  if (!props.semester) return;
  submitting.value = true;


  const payload = {
    name:                     form.value.name,
    start_date:               form.value.start_date,
    end_date:                 form.value.end_date,
    registration_deadline:    form.value.registration_deadline,
    description:              form.value.description,
  };
  try {
    await semesterStore.updateSemester(props.semester.id, payload);
    emit('saved');
    close();
  } catch (error) {
    console.error('Error updating semester:', error);
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
          <v-text-field
              v-model="form.start_date"
              label="Start Date"
              type="date"
              required
          />
          <v-text-field
              v-model="form.end_date"
              label="End Date"
              type="date"
              required
          />
          <v-text-field
              v-model="form.registration_deadline"
              label="Registration Deadline"
              type="date"
              required
          />
          <v-text-field v-model="form.description" label="Description" required />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer/>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save" :loading="submitting">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>

</style>