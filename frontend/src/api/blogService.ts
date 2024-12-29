import { client } from './client';

export const blogService = {
  getBlogs: async (page = 1, limit = 10) => {
    const response = await client.get(`/blogs?page=${page}&limit=${limit}`);
    return response.data;
  },

  getBlogById: async (id: string) => {
    const response = await client.get(`/blogs/${id}`);
    return response.data;
  },

  createBlog: async (blogData: any) => {
    const response = await client.post('/blogs', blogData);
    return response.data;
  },

  updateBlog: async (id: string, blogData: any) => {
    const response = await client.put(`/blogs/${id}`, blogData);
    return response.data;
  },

  deleteBlog: async (id: string) => {
    const response = await client.delete(`/blogs/${id}`);
    return response.data;
  },

  getTags: async () => {
    const response = await client.get('/blogs/tags');
    return response.data;
  },
};