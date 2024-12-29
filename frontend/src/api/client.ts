import axios from 'axios';

const API_URL = 'http://localhost:8080/api';


const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    "Authorization": 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NzZjZmExN2RmZjQ0YjQyZmM3OWZlZGYiLCJpYXQiOjE3MzUyNDAxNzcsImV4cCI6MTczNTMyNjU3N30.f1816ZvvLjrIhQ4WCRcC2yZzGI6KBqlVJZhFJzW95vQ'
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  console.log('Interceptor token:', token);
  console.log('Final headers:', config.headers);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.method === 'post') {
    console.log('POST request detected:', config);
  }
  return config;
}, (error) => {
  console.error('Request interceptor error:', error);
  return Promise.reject(error);
});

export {client}
