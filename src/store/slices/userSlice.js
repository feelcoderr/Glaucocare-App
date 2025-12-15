// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../services/api/userApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setUser as setAuthUser } from './authSlice';
// Thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const data = await userApi.updateProfile(payload);
      const updatedUser = data?.data ?? data;
      dispatch(setAuthUser(updatedUser));
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'user/updateProfilePicture',
  async (formData, { rejectWithValue, dispatch }) => {
    try {
      const data = await userApi.updateProfilePicture(formData);
      const updatedUser = data?.data ?? data;
      // update auth slice and AsyncStorage
      dispatch(setAuthUser(updatedUser));
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      return updatedUser;
    } catch (err) {
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

const initialState = {
  user: null, // keep user's current copy here; you probably also have auth slice
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserLocal: (state, action) => {
      state.user = action.payload;
    },
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // updateProfile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        // backend may return wrapped object or direct user — adjust if needed
        const newUser = action.payload?.data ?? action.payload;
        state.user = newUser;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error?.message;
      });

    // updateProfilePicture
    builder
      .addCase(updateProfilePicture.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfilePicture.fulfilled, (state, action) => {
        state.isLoading = false;
        const newUser = action.payload?.data ?? action.payload;
        state.user = newUser;
      })
      .addCase(updateProfilePicture.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || action.error?.message;
      });
  },
});

export const { setUserLocal, clearUserError } = userSlice.actions;
export default userSlice.reducer;
