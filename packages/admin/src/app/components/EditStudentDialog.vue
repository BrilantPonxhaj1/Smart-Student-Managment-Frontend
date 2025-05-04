<script setup lang="ts">
import { ref, watch, toRefs, onMounted } from 'vue'
import api from '../../../../../axios'
import type { Student } from '../store/studentsStore'

interface EditForm {
  id:               number
  student_number:   string
  first_name:       string
  last_name:        string
  email:            string
  program:          string
  university_id:    number | null
  department_id:    number | null
  year_of_study:    number
  enrollment_year:  number
  type:             string
}

const props = defineProps<{
  modelValue: boolean
  student: (Student & {
    student_number: string
    program:        string
    department_id:  number
    university_id:  number
    year_of_study:  number
    enrollment_year:string
    type:           string
  }) | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
  (e: 'saved'): void
}>()

const { modelValue, student } = toRefs(props)

const form = ref<EditForm>({
  id:               0,
  student_number:   '',
  first_name:       '',
  last_name:        '',
  email:            '',
  program:          '',
  university_id:    null,
  department_id:    null,
  year_of_study:    new Date().getFullYear(),
  enrollment_year:  new Date().getFullYear(),
  type:             '',
})

const universities = ref<{ id: number; name: string }[]>([])
const departments  = ref<{ id: number; name: string }[]>([])

// Load all universities on mount
onMounted(async () => {
  universities.value = (await api.get('/admin/universities')).data
})

// Fetch departments for a given university ID
async function fetchDepts(universityId: number | null) {
  if (!universityId) {
    departments.value = []
    return
  }
  try {
    const res = await api.get(`/admin/departments/${universityId}`)
    departments.value = res.data
  } catch {
    departments.value = []
  }
}

// When the `student` prop changes (i.e. dialog opens),
// initialize the form and load its departments, then pre-select
watch(student, async (val) => {
  if (!val) return
  form.value = {
    id:               val.id,
    student_number:   val.student_number,
    first_name:       val.first_name,
    last_name:        val.last_name,
    email:            val.email,
    program:          val.program,
    university_id:    val.university_id,
    department_id:    null,                // clear first
    year_of_study:    val.year_of_study,
    enrollment_year:  val.enrollment_year,
    type:             val.type,
  }
  await fetchDepts(val.university_id)
  form.value.department_id = val.department_id // then restore
})

function close() {
  emit('update:modelValue', false)
}

const showSuccessSnack = ref(false)
const showErrorSnack   = ref(false)

async function save() {
  try {
    await api.put(`/admin/students/${form.value.id}`, form.value)
    emit('saved')
    showSuccessSnack.value = true
    close()
  } catch (e: any) {
    console.error('Update failed', e)
    showErrorSnack.value = true
  }
}
</script>

<template>
  <v-dialog v-model="modelValue" max-width="600">
    <v-card>
      <v-card-title>Edit Student</v-card-title>
      <v-card-text>
        <v-form>
          <v-text-field
              v-model="form.student_number"
              label="Student Number"
              required
          />
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
              v-model="form.program"
              label="Program"
              required
          />

          <v-select
              v-model="form.university_id"
              :items="universities"
              item-title="name"
              item-value="id"
              label="University"
              required
              @change="(newUni) => { fetchDepts(newUni); form.department_id = null }"
          />
          <v-select
              v-model="form.department_id"
              :items="departments"
              item-title="name"
              item-value="id"
              label="Department"
              :disabled="departments.length === 0"
              placeholder="Select a Department"
              required
          />

          <v-text-field
              v-model.number="form.year_of_study"
              label="Year of Study"
              type="number"
              min="1"
              required
          />
          <v-text-field
              v-model.number="form.enrollment_year"
              label="Enrollment Year"
              type="number"
              min="1900"
              required
          />
        </v-form>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn color="primary" @click="save">Save</v-btn>
      </v-card-actions>

      <v-snackbar
          v-model="showSuccessSnack"
          top
          color="success"
          :timeout="3000"
      >
        Student edited successfully!
      </v-snackbar>
      <v-snackbar
          v-model="showErrorSnack"
          top
          color="error"
          :timeout="4000"
      >
        An error occurred while editing the student!
      </v-snackbar>
    </v-card>
  </v-dialog>
</template>
