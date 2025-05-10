<template>
  <v-select
      :items="semesters"
      item-title="name"
      item-value="id"
      :model-value="modelValue"
      @update:modelValue="$emit('update:modelValue', $event)"
      label="Semester"
      dense
      outlined
      class="my-4"
  />
</template>

<script setup>
const props = defineProps({
  modelValue: { type: [String, Number], default: null },
  semesters:  { type: Array,       default: () => [] }
})
const emit = defineEmits(['update:modelValue'])
</script>
