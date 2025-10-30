// FILE: src/services/api/searchApi.js
// Search API Service
// ============================================================================

import apiClient from './apiClient';

export const searchApi = {
  // Global Search
  globalSearch: async (query, category = null, limit = 5) => {
    try {
      let url = `/search?q=${encodeURIComponent(query)}&limit=${limit}`;
      if (category) {
        url += `&category=${category}`;
      }
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('❌ Search Error:', error);
      throw error;
    }
  },

  // Get Recent Searches
  getRecentSearches: async () => {
    try {
      const response = await apiClient.get('/search/recent');
      return response;
    } catch (error) {
      console.error('❌ Recent Searches Error:', error);
      throw error;
    }
  },

  // Save Search Query
  saveSearch: async (query) => {
    try {
      const response = await apiClient.post('/search/save', { query });
      return response;
    } catch (error) {
      console.error('❌ Save Search Error:', error);
      throw error;
    }
  },

  // Clear Recent Searches
  clearRecentSearches: async () => {
    try {
      const response = await apiClient.delete('/search/recent');
      return response;
    } catch (error) {
      console.error('❌ Clear Searches Error:', error);
      throw error;
    }
  },

  // Get Popular Searches
  getPopularSearches: async () => {
    try {
      const response = await apiClient.get('/search/popular');
      return response;
    } catch (error) {
      console.error('❌ Popular Searches Error:', error);
      throw error;
    }
  },
};
