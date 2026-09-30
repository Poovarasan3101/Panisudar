import axios from 'axios';

/**
 * Axios client configured for the Django REST API.
 * To switch from mock data to real API: set VITE_API_URL in .env
 * The proxy in vite.config.js will forward /api requests to localhost:8000
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // If sending FormData, do not force application/json or manually set multipart/form-data
    // Let the browser set multipart/form-data with boundary automatically
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor — handle token refresh / auth errors
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Do not attempt refresh on login or token refresh endpoints
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/token/') || originalRequest?.url?.includes('/auth/login/');

    // Attempt token refresh on 401
    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        try {
          const apiBase = import.meta.env.VITE_API_URL || '/api';
          const refreshUrl = apiBase.endsWith('/')
            ? `${apiBase}auth/token/refresh/`
            : `${apiBase}/auth/token/refresh/`;

          const res = await axios.post(refreshUrl, { refresh });
          const newAccess = res.data.access;
          localStorage.setItem('access_token', newAccess);
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;
          return client(originalRequest);
        } catch (refreshErr) {
          // Refresh failed — clear auth
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
          return Promise.reject(refreshErr);
        }
      }
    }

    return Promise.reject(error);
  },
);

export default client;
