<script setup lang="ts">
import Sidebar from '../components/Sidebar.vue';
import ListCourseOfferings from '../components/ListCourseOfferings.vue';
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <v-app class="main">
        <v-container>
            <Sidebar />
            <v-main class="justify-center">
                <v-container>
                    <ListCourseOfferings />
                </v-container>
            </v-main>
        </v-container>
    </v-app>
</template>

<style scoped>
.main {
    display: flex;
}
</style>