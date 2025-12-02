// src/store/slices/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../services/api/userApi';

// Thunks
export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload, { rejectWithValue }) => {
    try {
      const data = await userApi.updateProfile(payload); // apiClient returns response.data
      return data; // expected shape: { data: updatedUser } or updatedUser depending on backend
    } catch (err) {
      // Normalize error object similar to other slices
      return rejectWithValue(err.response?.data || { message: err.message });
    }
  }
);

export const updateProfilePicture = createAsyncThunk(
  'user/updateProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await userApi.updateProfilePicture(formData);
      return data;
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
