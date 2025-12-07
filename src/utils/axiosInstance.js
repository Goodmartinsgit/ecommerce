import axios from 'axios';
import { baseUrl } from '../config/config';

const axiosInstance = axios.create({
  baseURL: baseUrl,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
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

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (!response) {
      console.error('Network error:', error.message);
      return Promise.reject({
        message: 'Network error. Please check your connection.',
        code: 'NETWORK_ERROR',
      });
    }

    const { status, data } = response;

    // Handle 401 Unauthorized
    if (status === 401) {
      console.warn('Unauthorized access - clearing auth data');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }

      return Promise.reject({
        message: data?.message || 'Session expired. Please login again.',
        code: data?.code || 'UNAUTHORIZED',
        status: 401,
      });
    }

    // Handle 403 Forbidden
    if (status === 403) {
      console.warn('Access forbidden:', data?.message);
      return Promise.reject({
        message: data?.message || 'You do not have permission to perform this action.',
        code: data?.code || 'FORBIDDEN',
        status: 403,
      });
    }

    // Handle 404 Not Found
    if (status === 404) {
      return Promise.reject({
        message: data?.message || 'Resource not found.',
        code: data?.code || 'NOT_FOUND',
        status: 404,
      });
    }

    // Handle 429 Rate Limit
    if (status === 429) {
      return Promise.reject({
        message: data?.message || 'Too many requests. Please try again later.',
        code: data?.code || 'RATE_LIMIT',
        status: 429,
      });
    }

    // Handle 500 Server Error
    if (status >= 500) {
      console.error('Server error:', data);
      return Promise.reject({
        message: data?.message || 'Server error. Please try again later.',
        code: data?.code || 'SERVER_ERROR',
        status,
      });
    }

    // Handle other errors
    return Promise.reject({
      message: data?.message || 'An error occurred. Please try again.',
      code: data?.code || 'ERROR',
      status,
      data: data?.data,
    });
  }
);

export default axiosInstance;
