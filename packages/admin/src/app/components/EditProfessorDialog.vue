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
        <v-btn color="primary" @click="save" :loading="submitting" :disabled="submitting" >Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar
      v-model="success"
      :timeout="3000"
      top
      color="success"
  >
    Professor created successfully!
  </v-snackbar>
  <v-snackbar
      v-model="error"
      :timeout="4000"
      top
      color="error"
  >
   An error occurred while editing the professor!
  </v-snackbar>
</template>
<script setup lang="ts">
import { useUniversities } from '../composables/useUniversities';
import { useDepartments } from '../composables/useDepartments';
import { useProfessorForm } from '../composables/useProfessorForm';
import { watch, ref, computed } from 'vue';


const props = defineProps({ modelValue: Boolean, professor: Object });
const emit = defineEmits(['update:modelValue', 'saved']);

const { universities } = useUniversities();
const selectedUniv = ref(props.professor?.university_id || 0);
const { departments } = useDepartments(selectedUniv);
const { submitting, success, error, submitEdit } = useProfessorForm('edit-professor');
const form = ref({ ...props.professor });


watch(() => props.professor, p => {
  form.value = { ...p };
  selectedUniv.value = p?.university_id || 0;
});

function save() {
  submitEdit(form.value.id, form.value).
  then(() => {
    emit('saved');
    emit('update:modelValue', false); });
}
function onUniversityChange(val: number) {
  selectedUniv.value = val;
  form.value.department_id = 0; // reset department
}
const dialogValue = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
});
function close() {
  emit('update:modelValue', false);
}
</script>