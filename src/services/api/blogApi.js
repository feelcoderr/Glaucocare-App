// FILE: src/services/api/blogApi.js
// Blog API Service
// ============================================================================

import apiClient from './apiClient';

export const blogApi = {
  // Get All Published Blogs
  getAllBlogs: async (params = {}) => {
    try {
      const { page = 1, limit = 10, category, tag, search } = params;
      let url = `/blogs?page=${page}&limit=${limit}`;
      if (category) url += `&category=${category}`;
      if (tag) url += `&tag=${tag}`;
      if (search) url += `&search=${encodeURIComponent(search)}`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('❌ Get Blogs Error:', error);
      throw error;
    }
  },

  // Get Blog by ID or Slug
  getBlogByIdOrSlug: async (identifier) => {
    try {
      const response = await apiClient.get(`/blogs/${identifier}`);
      return response;
    } catch (error) {
      console.error('❌ Get Blog Error:', error);
      throw error;
    }
  },

  // Get Featured Blogs
  getFeaturedBlogs: async () => {
    try {
      const response = await apiClient.get('/blogs/featured');
      return response;
    } catch (error) {
      console.error('❌ Get Featured Blogs Error:', error);
      throw error;
    }
  },

  // Get Blogs by Category
  getBlogsByCategory: async (category, page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(
        `/blogs/category/${category}?page=${page}&limit=${limit}`
      );
      return response;
    } catch (error) {
      console.error('❌ Get Blogs by Category Error:', error);
      throw error;
    }
  },
};
