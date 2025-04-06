    <script setup>
    import SuperAdminSidebar from "../components/Sidebar.vue";
    import { ref } from 'vue'

</script>
<template>
    <v-container fluid>
        <v-row>
            <v-col cols="12" sm="7" md="2">
                <SuperAdminSidebar />
            </v-col>

            <v-col cols="12" sm="3" md="8">
                <v-table theme="white">
                    <thead>
                        <tr>
                            <th class="text-left">Name</th>
                            <th class="text-left"></th>
                        </tr>
                    </thead>
                    <tbody>
                      
                    </tbody>
                </v-table>
            </v-col>
        </v-row>
    </v-container>

</template>