// FILE: src/services/api/doctorApi.js
// Doctor API Service
// ============================================================================

import apiClient from './apiClient';

export const doctorApi = {
  // Get all doctors with filters
  getAllDoctors: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/doctors?${queryParams}`);
      return response;
    } catch (error) {
      console.error('❌ Get Doctors Error:', error);
      throw error;
    }
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    try {
      const response = await apiClient.get(`/doctors/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get Doctor Details Error:', error);
      throw error;
    }
  },

  // Get nearby doctors
  getNearbyDoctors: async (latitude, longitude, maxDistance = 10000) => {
    try {
      const response = await apiClient.get(
        `/doctors/nearby?latitude=${latitude}&longitude=${longitude}&maxDistance=${maxDistance}`
      );
      return response;
    } catch (error) {
      console.error('❌ Get Nearby Doctors Error:', error);
      throw error;
    }
  },
};
