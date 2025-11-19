// FILE: src/store/slices/authSlice.js
// FIXED Redux Auth Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../services/api/authApi';
import { guestApi } from '../../services/api/guestApi';
// Async Thunks
export const sendOTP = createAsyncThunk('auth/sendOTP', async (mobile, { rejectWithValue }) => {
  try {
    const response = await authApi.sendOTP(mobile);
    return response;
  } catch (error) {
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ mobile, otp, rememberMe }, { rejectWithValue }) => {
    try {
      const response = await authApi.verifyOTP(mobile, otp, rememberMe);

      // Store tokens
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const completeRegistration = createAsyncThunk(
  'auth/completeRegistration',
  async ({ fullname, email, languagePreference }, { rejectWithValue }) => {
    try {
      const response = await authApi.completeRegistration(fullname, email, languagePreference);

      // Update stored user data
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async ({ googleId, email, fullname, profilePicture }, { rejectWithValue }) => {
    try {
      const response = await authApi.googleLogin(googleId, email, fullname, profilePicture);

      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const appleLogin = createAsyncThunk(
  'auth/appleLogin',
  async ({ appleId, email, fullname }, { rejectWithValue }) => {
    try {
      const response = await authApi.appleLogin(appleId, email, fullname);

      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authApi.logout();
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    return null;
  } catch (error) {
    await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
    return rejectWithValue(error.response?.data || error.message);
  }
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        return { user, token, isAuthenticated: true };
      }
      return { user: null, token: null, isAuthenticated: false };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  requiresRegistration: null,
  isGuest: false,
};

// Guest Login Thunk
export const guestLogin = createAsyncThunk(
  'auth/guestLogin',
  async (deviceId, { rejectWithValue }) => {
    try {
      const response = await guestApi.guestLogin(deviceId);

      // Store tokens
      await AsyncStorage.setItem('accessToken', response.data.accessToken);
      await AsyncStorage.setItem('refreshToken', response.data.refreshToken);
      await AsyncStorage.setItem('isGuest', 'true');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Convert Guest to User Thunk
export const convertGuestToUser = createAsyncThunk(
  'auth/convertGuestToUser',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await guestApi.convertGuestToUser(mobile, otp);

      // Update guest status
      await AsyncStorage.setItem('isGuest', 'false');

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isGuest = false;
      AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'isGuest']);
    },
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearOTPSent: (state) => {
      state.otpSent = false;
    },
    resetAuth: (state) => {
      return initialState;
    },
    loginAsGuest: (state) => {
      state.isAuthenticated = false; // Stays false
      state.isGuest = true; // Set guest mode to true
      state.user = { id: 'guest', isGuest: true, fullname: 'Guest' };
      state.isLoading = false;
      state.otpSent = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Guest Login
    builder
      .addCase(guestLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(guestLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isGuest = true; // ✅ Set guest flag
      })
      .addCase(guestLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Guest login failed';
      });
    // Send OTP
    builder
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to send OTP';
      });

    // Verify OTP
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.requiresRegistration = action.payload.requiresRegistration;
        // Only set authenticated if registration is not required
        state.isAuthenticated = !action.payload.requiresRegistration;
        state.isGuest = false;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Invalid OTP';
      });

    // Complete Registration
    builder
      .addCase(completeRegistration.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.requiresRegistration = false;
        state.isGuest = false;
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Registration failed';
      });

    // Google Login
    builder
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isGuest = false;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Google login failed';
      });

    // Apple Login
    builder
      .addCase(appleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(appleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isGuest = false;
      })
      .addCase(appleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Apple login failed';
      });

    // Logout
    builder.addCase(logout.fulfilled, (state) => {
      return initialState;
    });

    // Check Auth Status
    builder
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        if (action.payload.isAuthenticated) {
          state.user = action.payload.user;
          state.accessToken = action.payload.token;
          state.isAuthenticated = true;
        } else {
          state.isAuthenticated = false;
        }
      })
      .addCase(checkAuthStatus.rejected, (state) => {
        state.isAuthenticated = false;
      });

    // Convert Guest to User
    builder
      .addCase(convertGuestToUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(convertGuestToUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isGuest = false; // ✅ No longer a guest
      })
      .addCase(convertGuestToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Conversion failed';
      });
  },
});

export const { setUser, clearOTPSent, resetAuth, loginAsGuest, clearError } = authSlice.actions;
export default authSlice.reducer;
