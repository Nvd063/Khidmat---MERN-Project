import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api', // Aapka backend base URL
});

// Request Interceptor: Har API call se pehle Token add karega
API.interceptors.request.use(
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

export default API;