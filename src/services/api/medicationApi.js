// FILE: src/services/api/medicationApi.js
// Medication API Service
// ============================================================================

import apiClient from './apiClient';

export const medicationApi = {
  // Get medication library
  getMedicationLibrary: async () => {
    try {
      const response = await apiClient.get('/medications/library');
      return response;
    } catch (error) {
      console.error('❌ Get Medication Library Error:', error);
      throw error;
    }
  },

  // Search medications
  searchMedications: async (searchQuery) => {
    try {
      const response = await apiClient.get(`/medications/search?search=${searchQuery}`);
      return response;
    } catch (error) {
      console.error('❌ Search Medications Error:', error);
      throw error;
    }
  },

  // Create medication reminder
  createReminder: async (reminderData) => {
    try {
      const response = await apiClient.post('/medications/reminders', reminderData);
      return response;
    } catch (error) {
      console.error('❌ Create Reminder Error:', error);
      throw error;
    }
  },

  // Get user reminders
  getUserReminders: async (isActive = true) => {
    try {
      const response = await apiClient.get(`/medications/reminders?isActive=${isActive}`);
      return response;
    } catch (error) {
      console.error('❌ Get Reminders Error:', error);
      throw error;
    }
  },

  // Update reminder
  updateReminder: async (id, reminderData) => {
    try {
      const response = await apiClient.put(`/medications/reminders/${id}`, reminderData);
      return response;
    } catch (error) {
      console.error('❌ Update Reminder Error:', error);
      throw error;
    }
  },

  // Mark medication as taken
  markAsTaken: async (id, time) => {
    try {
      const response = await apiClient.put(`/medications/reminders/${id}/mark-taken`, { time });
      return response;
    } catch (error) {
      console.error('❌ Mark as Taken Error:', error);
      throw error;
    }
  },

  // Delete reminder
  deleteReminder: async (id) => {
    try {
      const response = await apiClient.delete(`/medications/reminders/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Delete Reminder Error:', error);
      throw error;
    }
  },
};
