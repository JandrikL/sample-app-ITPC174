import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000'; // <-- no /api

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear any stored user data and redirect to login
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const getCsrfToken = async () => {
  const res = await api.get('/csrf-token');
  api.defaults.headers.common['X-CSRF-TOKEN'] = res.data.token; // <-- critical
  return res;
};


export const authAPI = {
  getCsrfToken,
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  logout: () => api.post('/logout'),
  me: () => api.get('/me'),
  verifyEmail: (id, hash) => {
    return api.get(`/email/verify/${id}/${hash}`);
  },
  
  forgotPassword: (data) => {
    return api.post('/forgot-password', data);
  },
  
  resetPassword: (data) => {
    return api.post('/reset-password', data);
  }
};

export const testValue = 42;
console.log('api.js loaded');

export default api;