// FILE: src/services/api/notificationPreferencesApi.js
// Notification Preferences API Service
// ============================================================================

import apiClient from './apiClient';

export const notificationPreferencesApi = {
  // Get user's notification preferences
  getPreferences: async () => {
    try {
      console.log('📋 Fetching notification preferences');
      const response = await apiClient.get('/notification-preferences');
      console.log('✅ Preferences fetched');
      return response;
    } catch (error) {
      console.error('❌ Get Preferences Error:', error);
      throw error;
    }
  },

  // Update notification preferences
  updatePreferences: async (preferences) => {
    try {
      console.log('📝 Updating notification preferences');
      const response = await apiClient.put('/notification-preferences', preferences);
      console.log('✅ Preferences updated');
      return response;
    } catch (error) {
      console.error('❌ Update Preferences Error:', error);
      throw error;
    }
  },

  // Turn off all notifications
  turnOffAll: async () => {
    try {
      console.log('🔕 Turning off all notifications');
      const response = await apiClient.post('/notification-preferences/turn-off-all');
      console.log('✅ All notifications turned off');
      return response;
    } catch (error) {
      console.error('❌ Turn Off All Error:', error);
      throw error;
    }
  },

  // Reset to default preferences
  resetToDefaults: async () => {
    try {
      console.log('🔄 Resetting to defaults');
      const response = await apiClient.post('/notification-preferences/reset');
      console.log('✅ Reset to defaults');
      return response;
    } catch (error) {
      console.error('❌ Reset Error:', error);
      throw error;
    }
  },
};
