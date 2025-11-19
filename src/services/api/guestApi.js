// FILE: src/services/api/guestApi.js

import apiClient from './apiClient';

export const guestApi = {
  // Guest Login
  guestLogin: async (deviceId = null) => {
    try {
      const response = await apiClient.post('/auth/guest-login', {
        deviceId,
      });
      return response;
    } catch (error) {
      console.error('❌ Guest Login Error:', error);
      throw error;
    }
  },

  // Convert Guest to Regular User
  convertGuestToUser: async (mobile, otp) => {
    try {
      const response = await apiClient.post('/auth/convert-guest', {
        mobile,
        otp,
      });
      return response;
    } catch (error) {
      console.error('❌ Convert Guest Error:', error);
      throw error;
    }
  },

  // Delete Guest Account
  deleteGuestAccount: async () => {
    try {
      const response = await apiClient.delete('/auth/delete-guest');
      return response;
    } catch (error) {
      console.error('❌ Delete Guest Error:', error);
      throw error;
    }
  },

  // Check Guest Status
  checkGuestStatus: async () => {
    try {
      const response = await apiClient.get('/auth/is-guest');
      return response;
    } catch (error) {
      console.error('❌ Check Guest Status Error:', error);
      throw error;
    }
  },
};
