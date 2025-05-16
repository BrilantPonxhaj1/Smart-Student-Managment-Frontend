<script setup lang="ts">
import { onMounted } from "vue";
import { useUserStore } from '../../../../auth/src/app/store/userStore';
import { useLoginStore } from "../../../../auth/src/app/store/loginStore";
import { useRouter } from 'vue-router';
import { computed } from 'vue';
import { adminMenu } from '../../../../src/app/composables/useMenu';
const items = adminMenu;

const userStore = useUserStore();
const loginStore = useLoginStore();
const router = useRouter();
const user = computed(() => userStore.current);
onMounted(() => userStore.fetchCurrent());

async function handleLogout() {
  loginStore.logout();
  userStore.reset();
  localStorage.removeItem('access_token');

  await router.push({ name: 'Login' });
}

function goToProfile(){
    router.push({name: 'Profile'})
}

</script>
<template>
  <v-navigation-drawer permanent width="300">
    <v-list>
      <!-- it takes the page longer to load bcs of this i think we should remove it-->
      <v-list-item v-if="user" prepend-avatar="https://cdn.vuetifyjs.com/images/john.png">
        <v-list-item-title>
          {{ user.first_name }} {{ user.last_name }}
        </v-list-item-title>
        <v-list-item-subtitle>
          {{ user.email }}
        </v-list-item-subtitle>
        <template v-slot:append>
          <v-btn icon="mdi-menu-down" variant="text">
            <v-btn
                icon="mdi-account"
                variant="text"
                to="/superadmin/profile"
            ></v-btn>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-divider></v-divider>

    <v-list :lines="false"  nav>
      <v-list-item v-for="(item, i) in items" :key="i" :to="item.route" :value="item" color="primary">
        <template v-slot:prepend>
          <v-icon :icon="item.icon"></v-icon>
        </template>

        <v-list-item-title v-text="item.text"></v-list-item-title>
      </v-list-item>
      <!--    Logout Button   -->
      <v-list-item @click="handleLogout" color="primary">
        <template v-slot:prepend>
          <v-icon icon="mdi-logout" />
        </template>
        <v-list-item-title>Logout</v-list-item-title>
      </v-list-item>
    </v-list>

  </v-navigation-drawer>
</template>
<style scoped>
@import "vuetify/styles";
</style>