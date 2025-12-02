// src/services/api/userApi.js
import apiClient from './apiClient';

export const userApi = {
  // Update basic profile fields (JSON)
  updateProfile: async (payload) => {
    try {
      // apiClient already returns response.data via interceptor
      const response = await apiClient.put('/users/profile', payload);
      return response;
    } catch (error) {
      console.error('❌ updateProfile error:', error);
      throw error;
    }
  },

  // Upload profile picture (multipart/form-data)
  updateProfilePicture: async (formData) => {
    try {
      // note: when using FormData, ensure apiClient allows multipart
      const response = await apiClient.put('/users/profile-picture', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response;
    } catch (error) {
      console.error('❌ updateProfilePicture error:', error);
      throw error;
    }
  },

  // Get current user (if needed)
  getMe: async () => {
    try {
      const response = await apiClient.get('/users/me');
      return response;
    } catch (error) {
      console.error('❌ getMe error:', error);
      throw error;
    }
  },
};
