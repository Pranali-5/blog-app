import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;

const client = axios.create({
  baseURL: `${BASE_URL}/api`,
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

export { client, BASE_URL };

declare global {
    interface ImportMeta {
        env: {
            [key: string]: string | undefined; // Adjust the type as necessary
        };
    }
}
