import axios from 'axios';

const api = axios.create({
  baseURL: 'https://codeb-ims.onrender.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Automatically attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
