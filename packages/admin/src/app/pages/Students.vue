    <script setup lang = "ts">
    import Sidebar from "../components/Sidebar.vue";
    import { ref } from 'vue'

    import CreateNewStudent from "../components/CreateNewStudent.vue";
    import ListAllStudents from "../components/ListAllStudents.vue";

    const showForm = ref(false);
    const showList = ref(false);

    function toggleForm() {
      showForm.value = !showForm.value;
      if (showForm.value) showList.value = false;
    }

    function toggleList() {
      showList.value = !showList.value;
      if (showList.value) showForm.value = false;
    }
</script>


    <template>
      <v-app id="app">
        <Sidebar />
        <v-main class ="justify-center" >
          <v-container class="d-flex justify-lg-space-evenly mb-6 flex-direction-column">
            <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click=toggleList>List all students</v-btn>
            <v-btn color="primary" variant="outlined" class="ma-2" elevation="2" @click="toggleForm">Create new student</v-btn>
          </v-container>
          <div v-if="showForm">
            <CreateNewStudent />
          </div>
          <div v-if="showList">
            <ListAllStudents />
          </div>
        </v-main>

      </v-app>
    </template>
