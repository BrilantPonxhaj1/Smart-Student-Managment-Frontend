import { createApp} from "vue"
import App from './App.vue'
import {router} from './js/lib/router'
import axios from 'axios'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { createPinia } from 'pinia'
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
const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:8000/api'
app.use(router)
app.use(vuetify)
app.use(pinia)
app.use(plugin, formkitConfig)
app.mount('#app')