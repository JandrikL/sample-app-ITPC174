import axios from 'axios';
import Cookies from 'js-cookie';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  xsrfCookieName: 'XSRF-TOKEN',  
  xsrfHeaderName: 'X-XSRF-TOKEN',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Automatically attach CSRF token to every request
api.interceptors.request.use((config) => {
  const csrfToken = Cookies.get('XSRF-TOKEN');
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
  }
  return config;
});

// Handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const getCsrfToken = async () => {
  return api.get('/sanctum/csrf-cookie');
};

export const authAPI = {
  getCsrfToken,
  login: (credentials) => api.post('/api/login', credentials),
  register: (userData) => api.post('/api/register', userData),
  logout: () => api.post('/api/logout'),
  me: () => api.get('/api/me'),
  verifyEmail: (id, hash) => api.get(`/api/email/verify/${id}/${hash}`),
  forgotPassword: (data) => api.post('/api/forgot-password', data),
  resetPassword: (data) => api.post('/api/reset-password', data),
};

export default api;
