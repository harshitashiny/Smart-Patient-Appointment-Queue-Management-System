import axios from 'axios';

const getBaseURL = () => {
  // If explicitly configured via Vite env variable (e.g. Vercel deployment pointing to Render API)
  if (import.meta.env.VITE_API_URL) {
    const raw = import.meta.env.VITE_API_URL.replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  // In production when served from the same server (Render unified fullstack)
  if (import.meta.env.PROD) {
    return '/api';
  }
  // Default for local development
  return 'http://localhost:5000/api';
};

const api = axios.create({
  baseURL: getBaseURL(),
});

// Add a request interceptor to add the auth token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // If the /auth/me call fails with 401, the token is invalid/expired
      // Clear it so the user gets redirected to login on next navigation
      const requestUrl = error.config?.url || '';
      if (requestUrl.includes('/auth/me')) {
        localStorage.removeItem('token');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
