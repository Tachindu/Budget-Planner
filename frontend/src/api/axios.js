import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Attach token to request if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // we will save token here after login
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
