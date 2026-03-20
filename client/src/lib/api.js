import axios from 'axios';

const ADMIN_TOKEN_KEY = 'yksolarworks_admin_token';

export const getAdminToken = () => window.localStorage.getItem(ADMIN_TOKEN_KEY);

export const setAdminToken = (token) => {
  window.localStorage.setItem(ADMIN_TOKEN_KEY, token);
};

export const clearAdminToken = () => {
  window.localStorage.removeItem(ADMIN_TOKEN_KEY);
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

api.interceptors.request.use((config) => {
  const token = getAdminToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
