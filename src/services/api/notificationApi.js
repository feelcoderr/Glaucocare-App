// FILE: src/services/api/notificationApi.js
// Notification API Service
// ============================================================================

import apiClient from './apiClient';

export const notificationApi = {
  // Get All Notifications
  getAllNotifications: async (page = 1, limit = 20, isRead = null) => {
    try {
      let url = `/notifications?page=${page}&limit=${limit}`;
      if (isRead !== null) {
        url += `&isRead=${isRead}`;
      }
      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('❌ Get Notifications Error:', error);
      throw error;
    }
  },

  // Get Unread Count
  getUnreadCount: async () => {
    try {
      const response = await apiClient.get('/notifications/unread-count');
      return response;
    } catch (error) {
      console.error('❌ Unread Count Error:', error);
      throw error;
    }
  },

  // Mark as Read
  markAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`/notifications/${notificationId}/read`);
      return response;
    } catch (error) {
      console.error('❌ Mark as Read Error:', error);
      throw error;
    }
  },

  // Mark All as Read
  markAllAsRead: async () => {
    try {
      const response = await apiClient.put('/notifications/read-all');
      return response;
    } catch (error) {
      console.error('❌ Mark All as Read Error:', error);
      throw error;
    }
  },

  // Delete Notification
  deleteNotification: async (notificationId) => {
    try {
      const response = await apiClient.delete(`/notifications/${notificationId}`);
      return response;
    } catch (error) {
      console.error('❌ Delete Notification Error:', error);
      throw error;
    }
  },

  // Clear All Notifications
  clearAll: async () => {
    try {
      const response = await apiClient.delete('/notifications/all');
      return response;
    } catch (error) {
      console.error('❌ Clear All Error:', error);
      throw error;
    }
  },
};
