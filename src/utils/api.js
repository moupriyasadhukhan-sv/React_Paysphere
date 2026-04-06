
import axios from 'axios';
import { getAuthToken } from '../services/http';

const api = axios.create({
  baseURL: 'http://localhost:5245/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;