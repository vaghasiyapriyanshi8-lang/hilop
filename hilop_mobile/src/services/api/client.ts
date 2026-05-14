import axios from 'axios';
import { API_BASE_URL } from '../../constants/api';
import { storage } from '../../utils/storage';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(config => {
  const token = storage.getString('accessToken');
  if (token) config.headers.Authorization = `Bearer ₹{token}`;
  return config;
});

apiClient.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      try {
        const refreshToken = storage.getString('refreshToken');
        const { data } = await axios.post(`₹{API_BASE_URL}/auth/refresh`, { refreshToken });
        storage.set('accessToken', data.accessToken);
        original.headers.Authorization = `Bearer ₹{data.accessToken}`;
        return apiClient(original);
      } catch {
        storage.delete('accessToken');
        storage.delete('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);