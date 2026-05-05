import axios from 'axios';

// Create an Axios instance
const API = axios.create({
  baseURL: 'http://localhost:4000/api', // Pointing to the new Node.js backend
});

// Interceptor to attach JWT token to requests
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

// Auth services
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);

// Project services
export const predict = (data) => API.post('/projects/predict', data);
export const getHistory = () => API.get('/projects/history');
export const compareProjects = (project1, project2) =>
  API.post('/projects/compare', { project1, project2 });

export default API;
