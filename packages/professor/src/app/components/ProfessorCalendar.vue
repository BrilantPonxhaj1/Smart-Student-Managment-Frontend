<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCalendarStore } from '../store/calendarStore';

const calendar = useCalendarStore();
const { type, types, weekday, weekdays, value, events } = storeToRefs(calendar)

function refresh() {
  calendar.getEvents()
}



</script>

<template>
  <v-card class="pa-4">
    <v-sheet class="d-flex mb-4" height="54" tile>
      <v-select
          v-model="type"
          :items="types"
          class="ma-2"
          density="compact"
          label="View Mode"
          variant="outlined"
          hide-details
      />
      <v-select
          v-model="weekday"
          :items="weekdays"
          class="ma-2"
          density="compact"
          label="Weekdays"
          variant="outlined"
          hide-details
      />
      <v-spacer/>
      <v-btn @click="refresh" variant="outlined" class="ma-2">Refresh</v-btn>
    </v-sheet>

    <v-sheet>
      <v-calendar
          v-model="value"
          :events="events"
          :view-mode="type"
          :weekdays="weekday"
          color="primary"
          height="600"
      />
    </v-sheet>
  </v-card>
</template>

<style scoped>
.v-sheet {
  background-color: white;
}
</style>