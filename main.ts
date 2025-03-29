import { createApp} from "vue"
import App from './App.vue'
import router from './js/lib/router'
import axios from 'axios'

const app = createApp(App)
axios.defaults.baseURL = 'http://localhost:8000/api'
app.use(router)
app.mount('#app')