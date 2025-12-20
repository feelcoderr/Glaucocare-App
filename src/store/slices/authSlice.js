// FILE: src/store/slices/authSlice.js
// FIXED Redux Auth Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authApi } from '../../services/api/authApi';
import { guestApi } from '../../services/api/guestApi';
import { userApi } from '../../services/api/userApi';
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
export const reactivateAccount = createAsyncThunk(
  'auth/reactivateAccount',
  async ({ mobile, otp }, { rejectWithValue }) => {
    try {
      const response = await authApi.reactivateAccount(mobile, otp);
      console.log('✅ Reactivate Account Response:', response);
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
  async ({ fullname, email, languagePreference, dateOfBirth, gender }, { rejectWithValue }) => {
    try {
      const response = await authApi.completeRegistration(
        fullname,
        email,
        languagePreference,
        dateOfBirth,
        gender
      );

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
export const deleteAccount = createAsyncThunk(
  'user/deleteAccount',
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const isGuest = auth?.user?.isGuest || false;
      const response = await userApi.deleteAccount(isGuest);
      await AsyncStorage.clear();
      return { success: true, data: response.data };
    } catch (err) {
      await AsyncStorage.clear();
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);
export const checkAuthStatus = createAsyncThunk(
  'auth/checkAuthStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('accessToken');
      const userStr = await AsyncStorage.getItem('user');

      if (token && userStr) {
        const user = JSON.parse(userStr);
        await authApi.verifyToken();
        return { user, token, isAuthenticated: true };
      }
      await AsyncStorage.multiRemove(['accessToken', 'refreshToken', 'user']);
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
  isDeleting: false,
  error: null,
  otpSent: false,
  requiresRegistration: null,
  isGuest: false,
  isReactivating: false,
  accountDeactivated: false,
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
      console.log('📱 Converting guest to user:', mobile);

      const response = await guestApi.convertGuestToUser(mobile, otp);

      console.log('✅ Conversion response:', response.data);

      // Update guest status in AsyncStorage
      await AsyncStorage.setItem('isGuest', 'false');

      return response.data; // Should contain: { user, requiresRegistration: true }
    } catch (error) {
      console.error('❌ Convert guest error:', error);
      return rejectWithValue(error.response?.data || { message: error.message });
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
      state.accountDeactivated = false;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearOTPSent: (state) => {
      state.otpSent = false;
    },
    forceLogout: (state) => {
      return {
        ...initialState,
        isLoading: false,
        isCheckingAuth: false,
      };
    },
    resetAuth: (state) => {
      return {
        ...initialState,
        isLoading: false,
        isCheckingAuth: false,
      };
    },
    loginAsGuest: (state) => {
      state.isAuthenticated = false; // Stays false
      state.isGuest = true; // Set guest mode to true
      state.user = { id: 'guest', isGuest: true, fullname: 'Guest' };
      state.isLoading = false;
      state.otpSent = false;
      state.error = null;
    },
    setAccountDeactivated: (state, action) => {
      state.accountDeactivated = true;
      state.error = action.payload;
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
        console.log('❌ OTP Verification failed:', action.payload);
        state.error = action.payload || 'Invalid OTP';
      });
    builder
      .addCase(reactivateAccount.pending, (state) => {
        state.isReactivating = true;
        state.error = null;
      })
      .addCase(reactivateAccount.fulfilled, (state, action) => {
        state.isReactivating = false;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
        state.isGuest = false;
        state.accountDeactivated = false;
      })
      .addCase(reactivateAccount.rejected, (state, action) => {
        state.isReactivating = false;
        state.error = action.payload?.message || 'Failed to reactivate account';
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
        state.isGuest = false;
        state.requiresRegistration = false;
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

    builder
      .addCase(convertGuestToUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(convertGuestToUser.fulfilled, (state, action) => {
        state.isLoading = false;

        // ✅ IMPORTANT: Backend returns user data + requiresRegistration flag
        state.user = action.payload.user;
        state.isGuest = false; // No longer a guest

        // ✅ Set requiresRegistration flag to trigger navigation to Registration
        state.requiresRegistration = action.payload.requiresRegistration || false;

        // ✅ Update tokens if provided
        if (action.payload.accessToken) {
          state.accessToken = action.payload.accessToken;
        }
        if (action.payload.refreshToken) {
          state.refreshToken = action.payload.refreshToken;
        }

        console.log('✅ Guest converted, requiresRegistration:', state.requiresRegistration);
      })
      .addCase(convertGuestToUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Conversion failed';
      });
    builder
      .addCase(deleteAccount.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        return { ...initialState }; // Reset to initial state
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to delete account';
      });
  },
});

export const { setUser, clearOTPSent, resetAuth, loginAsGuest, clearError, setAccountDeactivated } =
  authSlice.actions;
export default authSlice.reducer;
