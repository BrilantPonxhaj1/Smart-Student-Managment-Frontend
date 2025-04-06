//We use this to intercept the api calls and make them use the bearer token generated on the login otherwise the calls wont work we will loook into the future on how we do that
import axios from 'axios';
import { useLoginStore } from './packages/auth/src/app/store/loginStore';

const api = axios.create({
  baseURL: 'http://localhost:8000/api', // or process.env.VUE_APP_API_BASE_URL
});

api.interceptors.request.use(
  (config) => {
    const loginStore = useLoginStore();
    if (loginStore.token && loginStore.token.access_token) {
      config.headers.Authorization = `Bearer ${loginStore.token.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
