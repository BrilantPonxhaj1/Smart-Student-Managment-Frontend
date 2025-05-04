<template>
  <v-dialog v-model="dialogValue" max-width="600">
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

          <v-select
              v-model="form.university_id"
              :items="universities"
              item-title="label"
              item-value="value"
              label="University"
              :return-object="false"
              @update:modelValue="onUniversityChange"
              required
          />
          <v-select
              v-model="form.department_id"
              :items="departments"
              item-title="label"
              item-value="value"
              label="Department"
              required
          />

          <v-text-field
              v-model="form.specialization"
              label="Specialization"
              required
          />
          <v-select
              v-model="form.academic_role"
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
import {ref, watch, toRefs, onMounted, computed} from 'vue';
import api from '../../../../../axios';

const props = defineProps<{
  modelValue: boolean;
  professor: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    university_id: number;
    department_id: number;
    specialization: string;
    academic_role: string;
  } | null;
}>();
const emit = defineEmits<{
  (e: 'update:modelValue', val: boolean): void;
  (e: 'saved'): void;
}>();

// get the ref wrapper
const { professor } = toRefs(props);

const form = ref({
  id: 0,
  first_name: '',
  last_name: '',
  email: '',
  university_id: 0,
  department_id: 0,
  specialization: '',
  academic_role: ''
});

const universities = ref<{ label: string; value: number }[]>([]);
const departments  = ref<{ label: string; value: number }[]>([]);


const showSuccessSnack = ref(false);
const showErrorSnack   = ref(false);

// 1) load universities
onMounted(async () => {
  const res = await api.get('/admin/universities');
  universities.value = res.data.map((u: any) => ({
    label: u.name, value: u.id
  }));
});

// 2) when `professor` prop changes, populate form and load departments
watch(
    professor,
    prof => {
      if (prof) {
        form.value = { ...prof };
        loadDepartments(prof.university_id);
      }
    },
    { immediate: true }
);

// load departments helper
async function loadDepartments(univId: number) {
  departments.value = [];
  if (!univId) return;
  const res = await api.get(`/admin/departments/${univId}`);
  departments.value = res.data.map((d: any) => ({
    label: d.name, value: d.id
  }));
}

// when user picks a different university
function onUniversityChange(val: number) {
  form.value.department_id = 0;
  loadDepartments(val);
}

// save handler
async function save() {
  await api.put(`/admin/professors/${form.value.id}`, form.value);
  emit('saved');
  emit('update:modelValue', false);
}
function close() {
  emit('update:modelValue', false);
}

const dialogValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
</script>
