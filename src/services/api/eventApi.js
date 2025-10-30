// FILE: src/services/api/eventApi.js
// Event API Service
// ============================================================================

import apiClient from './apiClient';

export const eventApi = {
  // Get all events
  getAllEvents: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/events?${queryParams}`);
      return response;
    } catch (error) {
      console.error('❌ Get Events Error:', error);
      throw error;
    }
  },

  // Get event by ID
  getEventById: async (id) => {
    try {
      const response = await apiClient.get(`/events/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get Event Error:', error);
      throw error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (limit = 10) => {
    try {
      const response = await apiClient.get(`/events/upcoming?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('❌ Get Upcoming Events Error:', error);
      throw error;
    }
  },

  // Get nearby events
  getNearbyEvents: async (latitude, longitude, maxDistance = 50000) => {
    try {
      const response = await apiClient.get(
        `/events/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
      );
      return response;
    } catch (error) {
      console.error('❌ Get Nearby Events Error:', error);
      throw error;
    }
  },
};
