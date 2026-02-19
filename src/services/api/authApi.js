import apiClient from './apiClient';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
const getBaseURL = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator
      // return 'http://192.168.250.147:8000/api/v1';
      return process.env.API_BASE_URL || 'https://api.glaucocare.in/api/v1';
    } else {
      // iOS simulator or other
      // return 'http://192.168.250.147:8000/api/v1';
      return process.env.API_BASE_URL || 'https://api.glaucocare.in/api/v1';
    }
  }
  // Production mode
  return 'https://api.glaucocare.in/api/v1';
  // return 'http://192.168.250.147:8000/api/v1';
};

const API_BASE_URL = getBaseURL();

export const authApi = {
  // Send OTP
  sendOTP: async (mobile) => {
    try {
      console.log('🔐 Sending OTP to:', mobile);
      const response = await apiClient.post('/auth/send-otp', { mobile });
      console.log('✅ OTP sent successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Send OTP Error:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (mobile, otp, rememberMe = false) => {
    try {
      console.log('🔐 Verifying OTP:', { mobile, otp, rememberMe });
      const response = await apiClient.post('/auth/verify-otp', { mobile, otp, rememberMe });
      console.log('✅ OTP verified successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      throw error;
    }
  },
  reactivateAccount: async (mobile, otp) => {
    try {
      console.log('🔄 Reactivating account:', { mobile });
      const response = await apiClient.post('/auth/reactivate', { mobile, otp });
      console.log('✅ Account reactivated successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Reactivate Account Error:', error);
      throw error;
    }
  },
  // Complete Registration
  completeRegistration: async (fullname, email, languagePreference, dateOfBirth, gender) => {
    try {
      console.log('📝 Completing registration:', { fullname, email, languagePreference });
      const response = await apiClient.post('/auth/complete-registration', {
        fullname,
        email,
        languagePreference,
        dateOfBirth,
        gender,
      });
      console.log('✅ Registration completed:', response);
      return response;
    } catch (error) {
      console.error('❌ Registration Error:', error);
      throw error;
    }
  },

  // Google Login
  googleLogin: async (googleId, email, fullname, profilePicture) => {
    try {
      console.log('🔐 Google Login:', { googleId, email, fullname });
      const response = await apiClient.post('/auth/google-login', {
        googleId,
        email,
        fullname,
        profilePicture,
      });
      console.log('✅ Google login successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Google Login Error:', error);
      throw error;
    }
  },

  // Apple Login
  appleLogin: async (appleId, email, fullname) => {
    try {
      console.log('🔐 Apple Login:', { appleId, email, fullname });
      const response = await apiClient.post('/auth/apple-login', {
        appleId,
        email,
        fullname,
        profilePicture: null,
      });
      console.log('✅ Apple login successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Apple Login Error:', error);
      throw error;
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      console.error('❌ Get User Error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('❌ Logout Error:', error);
      throw error;
    }
  },

  // Update FCM Token
  updateFCMToken: async (fcmToken) => {
    try {
      const response = await apiClient.put('/users/fcm-token', { fcmToken });
      return response;
    } catch (error) {
      console.error('❌ Update FCM Token Error:', error);
      throw error;
    }
  },

  // Verify if token is still valid
  verifyToken: async () => {
    try {
      const response = await apiClient.get('/auth/verify-token');
      return response;
    } catch (error) {
      console.error('❌ Token verification failed:', error);
      throw error;
    }
  },

  // Manual token refresh (if needed)
  refreshToken: async () => {
    try {
      console.log('🔄 Manually refreshing token...');
      const refreshToken = await AsyncStorage.getItem('refreshToken');

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

      const { accessToken, refreshToken: newRefreshToken } = response.data.data;

      await AsyncStorage.setItem('accessToken', accessToken);
      await AsyncStorage.setItem('refreshToken', newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('❌ Manual token refresh failed:', error);
      throw error;
    }
  },
};
