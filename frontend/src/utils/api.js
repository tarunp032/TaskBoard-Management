import axios from 'axios';

const api = axios.create({
  baseURL: "https://taskboard-management-1.onrender.com/api"
});

// Add token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
