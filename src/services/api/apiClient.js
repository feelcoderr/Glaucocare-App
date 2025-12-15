import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { store } from '../../store/store';
import { forceLogout } from '../../store/slices/authSlice';
// IMPORTANT: For Android Emulator, use 10.0.2.2 instead of localhost
// For iOS Simulator, use localhost
// For physical device, use your computer's IP address
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

console.log('🔗 API Base URL:', API_BASE_URL);

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log('📤 API Request:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      baseURL: config.baseURL,
      data: config.data,
    });

    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('📥 API Response:', {
      url: response.config.url,
      status: response.status,
      data: response.data,
    });
    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data,
    });

    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        success: false,
        message: 'Network Error: Cannot connect to server. Please check if backend is running.',
        error: error.message,
      });
    }

    // Handle 401 with token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, { refreshToken });

          const { accessToken, refreshToken: newRefreshToken } = response.data.data;

          await AsyncStorage.setItem('accessToken', accessToken);
          await AsyncStorage.setItem('refreshToken', newRefreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Clear storage and force logout
        await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
        store.dispatch(forceLogout());
        return Promise.reject(refreshError);
      }

      // If no refresh token, force logout
      console.log('🚪 No refresh token available - Forcing logout');
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
      store.dispatch(forceLogout());
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default apiClient;
