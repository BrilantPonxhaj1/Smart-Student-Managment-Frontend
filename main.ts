import { createApp} from "vue"
import App from './App.vue'
import {router} from './js/lib/router'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import {createPinia} from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import { plugin, defaultConfig } from '@formkit/vue';
import '@formkit/themes/genesis';

const vuetify = createVuetify({
    components,
    directives
})
const formkitConfig = defaultConfig({
    theme: 'genesis'
})

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:8000/api'
app.use(router)
app.use(vuetify)
app.use(pinia)
app.use(plugin, formkitConfig)
//-------------------GLOBAL NAV GUARD--------------------------------------
 import { useUserStore }  from './packages/auth/src/app/store/userStore';
router.beforeEach((async(to, from) => {
    const userStore = useUserStore()                // get current user
    const user      = userStore.current
    const token = localStorage.getItem('access_token')

    if (token && !userStore.current) {
        await userStore.fetchCurrent()
    }

    const requires = to.meta.requiresAuth as boolean || false
    const roles    = to.meta.roles as string[] | undefined

    // 1) not logged in → force to /login
    if (requires && !user) {
        return { name: 'Login' }
    }
    // 2) role mismatch → send to Forbidden page
    if (roles && (!user || !roles.includes(user.type))) {
        return { name: 'Forbidden' }
    }

}))
//-------------------GLOBAL NAV GUARD--------------------------------------
app.mount('#app')