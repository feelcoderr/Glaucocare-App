// FILE: src/services/api/educationalContentApi.js
// Educational Content API Service
// ============================================================================

import apiClient from './apiClient';

export const educationalContentApi = {
  // Get list of educational content
  getEducationalContent: async (params = {}) => {
    try {
      const response = await apiClient.get(`/educational-content`);
      return response;
    } catch (error) {
      console.error('❌ Get Educational Content List Error:', error);
      throw error;
    }
  },
  // Get list of educational content
  getEducationalContentList: async (params = {}) => {
    try {
      const { category, search, published = true, limit = 50, page = 1 } = params;

      const queryParams = new URLSearchParams();
      if (category) queryParams.append('category', category);
      if (search) queryParams.append('search', search);
      if (published !== undefined) queryParams.append('published', published);
      queryParams.append('limit', limit);
      queryParams.append('page', page);

      const response = await apiClient.get(`/educational-content?${queryParams.toString()}`);
      return response;
    } catch (error) {
      console.error('❌ Get Educational Content List Error:', error);
      throw error;
    }
  },

  // Get educational content by slug (preferred)
  getEducationalContentBySlug: async (slug) => {
    try {
      const response = await apiClient.get(`/educational-content/slug/${slug}`);
      return response;
    } catch (error) {
      console.error('❌ Get Educational Content By Slug Error:', error);
      throw error;
    }
  },

  // Get educational content by ID
  getEducationalContentById: async (id) => {
    try {
      const response = await apiClient.get(`/educational-content/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get Educational Content By ID Error:', error);
      throw error;
    }
  },

  // Get educational content by category
  getEducationalContentByCategory: async (category, params = {}) => {
    try {
      const { limit = 50, page = 1 } = params;

      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit);
      queryParams.append('page', page);

      const response = await apiClient.get(
        `/educational-content/category/${category}?${queryParams.toString()}`
      );
      return response;
    } catch (error) {
      console.error('❌ Get Educational Content By Category Error:', error);
      throw error;
    }
  },

  // Get categories list
  getCategories: async () => {
    try {
      const response = await apiClient.get('/educational-content/categories/list');
      return response;
    } catch (error) {
      console.error('❌ Get Categories Error:', error);
      throw error;
    }
  },

  // Admin: Create educational content
  createEducationalContent: async (data) => {
    try {
      const response = await apiClient.post('/educational-content', data);
      return response;
    } catch (error) {
      console.error('❌ Create Educational Content Error:', error);
      throw error;
    }
  },

  // Admin: Update educational content
  updateEducationalContent: async (id, data) => {
    try {
      const response = await apiClient.put(`/educational-content/${id}`, data);
      return response;
    } catch (error) {
      console.error('❌ Update Educational Content Error:', error);
      throw error;
    }
  },

  // Admin: Delete educational content
  deleteEducationalContent: async (id) => {
    try {
      const response = await apiClient.delete(`/educational-content/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Delete Educational Content Error:', error);
      throw error;
    }
  },
};
