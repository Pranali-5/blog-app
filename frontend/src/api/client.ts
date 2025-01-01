import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL as string;
const BASE_URL = import.meta.env.VITE_BASE_URL as string;

const client = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
});

client.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/admin/signin';
    }
    return Promise.reject(error);
  }
);

export { client, API_URL, BASE_URL };

declare global {
    interface ImportMeta {
        env: {
            [key: string]: string | undefined; // Adjust the type as necessary
        };
    }
}
