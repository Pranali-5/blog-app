import { client } from './client';

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const response = await client.post('/auth/login', credentials);
    return response.data;
  },

  signup: async (userData: { name: string; email: string; password: string }) => {
    const response = await client.post('/auth/signup', userData);
    return response.data;
  }
}; 