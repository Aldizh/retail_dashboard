import axios from 'axios';

// Create axios instance with backend base URL
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001',
  withCredentials: true, // Important for cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for JWT token and debugging
api.interceptors.request.use(
  (config) => {
    // Add JWT token to Authorization header
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default api;