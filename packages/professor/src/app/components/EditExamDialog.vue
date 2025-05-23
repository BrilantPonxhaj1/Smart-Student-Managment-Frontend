<template>
  <v-dialog v-model="dialogValue" max-width="700px">
    <v-card>
      <v-card-title>Edit Exam</v-card-title>
      <v-card-text>
        <v-form ref="editFormRef" v-model="formValid">
          <v-text-field
              v-model="form.title"
              label="Title"
              :rules="[rules.required]"
              required
          />

          <v-select
              v-model="form.exam_type"
              :items="examTypes"
              item-title="label"
              item-value="value"
              label="Exam Type"
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
              v-model="form.duration"
              label="Duration (minutes)"
              type="number"
              :rules="[rules.required, rules.min5]"
              required
          />

          <v-text-field
              v-model="form.max_score"
              label="Max Score"
              type="number"
              :rules="[rules.required, rules.max100]"
              required
          />

          <v-text-field
              v-model="form.weight"
              label="Weight (%)"
              type="number"
              :rules="[rules.required, rules.minWeight, rules.maxWeight]"
              required
          />

          <v-textarea
              v-model="form.description"
              label="Description"
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
    Exam updated successfully!
  </v-snackbar>

  <v-snackbar v-model="showErrorSnackbar" :timeout="4000" top color="error">
    {{ errorMessage }}
  </v-snackbar>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useExams } from '../composables/useExams';

const props = defineProps({
  modelValue: Boolean,
  exam: Object
});

const emit = defineEmits(['update:modelValue', 'saved']);
const { submitting, success, error, errorMessage, submitEdit } = useExams('edit-exam');

const editFormRef = ref();
const formValid = ref(true);

const examTypes = [
  { label: 'Midterm', value: 'midterm' },
  { label: 'Final', value: 'final' },
  { label: 'Quiz', value: 'quiz' },
  { label: 'Project', value: 'project' },
];

const todaysDate = new Date().toLocaleDateString('en-CA');
const showErrorSnackbar = ref(false);

const [initialDate, initialTime] = props.exam?.date?.split(' ') ?? ['', ''];

const form = ref({
  id: props.exam?.id,
  title: props.exam?.title,
  exam_type: props.exam?.exam_type,
  date: initialDate,
  time: initialTime?.slice(0, 5) ?? '',
  duration: props.exam?.duration,
  max_score: props.exam?.max_score,
  weight: props.exam?.weight,
  description: props.exam?.description ?? '',
  university_id: props.exam?.university_id,
  department_id: props.exam?.department_id,
  course_offering_id: props.exam?.course_offering_id
});

const rules = {
  required: (v: any) => !!v || 'This field is required',
  min5: (v: number) => v >= 5 || 'Minimum value is 5',
  max100: (v: number) => v <= 100 || 'Maximum value is 100',
  minWeight: (v: number) => v >= 0 || 'Weight cannot be negative',
  maxWeight: (v: number) => v <= 100 || 'Weight cannot exceed 100%'
};

const dialogValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
});

watch(errorMessage, (msg) => {
  if (error.value && msg) {
    showErrorSnackbar.value = true;
  }
});

watch(() => props.exam, (e) => {
  const [datePart, timePart = ''] = e?.date?.split(' ') ?? [];
  form.value = {
    id: e?.id,
    title: e?.title,
    exam_type: e?.exam_type,
    date: datePart,
    time: timePart.slice(0, 5),
    duration: e?.duration,
    max_score: e?.max_score,
    weight: e?.weight,
    description: e?.description ?? '',
    university_id: e?.university_id,
    department_id: e?.department_id,
    course_offering_id: e?.course_offering_id
  };
});

async function save() {
  const valid = await editFormRef.value?.validate();
  if (!valid) return;

  const datetime = `${form.value.date} ${form.value.time || '00:00'}`;
  const payload = {
    id: form.value.id,
    title: form.value.title,
    exam_type: form.value.exam_type,
    date: datetime,
    duration: form.value.duration,
    max_score: form.value.max_score,
    weight: form.value.weight,
    description: form.value.description,
    university_id: form.value.university_id,
    department_id: form.value.department_id,
    course_offering_id: form.value.course_offering_id
  };

  error.value = false;

  submitEdit(form.value.id, payload).then(() => {
    if (!error.value) {
      emit('saved');
      emit('update:modelValue', false);
    }
  });
}

function close() {
  emit('update:modelValue', false);
}
</script>
