import axios from 'axios';
import { store } from '@/store';
import { logout } from '@/store/authSlice';

const API_BASE_URL = 'https://library-backend-production-b9cf.up.railway.app';

const client = axios.create({
  baseURL: API_BASE_URL,
});

client.interceptors.request.use((config) => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default client;
