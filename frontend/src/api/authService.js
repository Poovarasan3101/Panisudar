import client from './client';

/**
 * Auth Service connected to Django REST API
 * Endpoints:
 *   POST /api/auth/register/
 *   POST /api/auth/login/
 *   POST /api/auth/token/refresh/
 *   GET  /api/auth/me/
 */

function extractErrorMessage(err) {
  if (err?.response?.data) {
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data.detail) return data.detail;
    if (data.error) return data.error;
    const firstKey = Object.keys(data)[0];
    if (firstKey) {
      const val = data[firstKey];
      return Array.isArray(val) ? `${firstKey}: ${val[0]}` : String(val);
    }
  }
  return err.message || 'An error occurred during authentication.';
}

export const authService = {
  async register({ fullName, email, password, role }) {
    try {
      const { data } = await client.post('/auth/register/', {
        fullName,
        email,
        password,
        role: role || 'job_seeker',
      });
      if (data.access) {
        localStorage.setItem('access_token', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      if (data.user) {
        this.saveCurrentUser(data.user);
      }
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async login({ email, password }) {
    try {
      const { data } = await client.post('/auth/login/', { email, password });
      if (data.access) {
        localStorage.setItem('access_token', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refresh_token', data.refresh);
      }
      if (data.user) {
        this.saveCurrentUser(data.user);
      }
      return data;
    } catch (err) {
      throw new Error(extractErrorMessage(err));
    }
  },

  async getMe() {
    try {
      const { data } = await client.get('/auth/me/');
      if (data) {
        this.saveCurrentUser(data);
      }
      return data;
    } catch (err) {
      return null;
    }
  },

  async logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('current_user');
  },

  getCurrentUser() {
    const stored = localStorage.getItem('current_user');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        return null;
      }
    }
    return null;
  },

  saveCurrentUser(user) {
    localStorage.setItem('current_user', JSON.stringify(user));
  },
};

export default authService;
