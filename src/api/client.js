import axios from 'axios';
import { getToken } from '../services/SecureStorage';

const BASE_URL = `https://weline-backend-production.up.railway.app/api/v1`;

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

apiClient.interceptors.request.use(
  async (config) => {
    if (config.url.includes('/auth/')) {
      return config;
    }

    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;