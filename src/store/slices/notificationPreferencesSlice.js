// FILE: src/store/slices/notificationPreferencesSlice.js
// Notification Preferences Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationPreferencesApi } from '../../services/api/notificationPreferencesApi';

// Fetch Preferences
export const fetchPreferences = createAsyncThunk(
  'notificationPreferences/fetchPreferences',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationPreferencesApi.getPreferences();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update Preferences
export const updatePreferences = createAsyncThunk(
  'notificationPreferences/updatePreferences',
  async (preferences, { rejectWithValue }) => {
    try {
      const response = await notificationPreferencesApi.updatePreferences(preferences);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Turn Off All
export const turnOffAll = createAsyncThunk(
  'notificationPreferences/turnOffAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationPreferencesApi.turnOffAll();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reset to Defaults
export const resetToDefaults = createAsyncThunk(
  'notificationPreferences/resetToDefaults',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationPreferencesApi.resetToDefaults();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  preferences: {
    // Medical Notifications
    medicationReminders: true,
    eyeCheckupAlerts: true,
    labReportUpdates: true,
    // App & System
    appUpdates: true,
    promotionalOffers: false,
    feedbackRequests: true,
    // Educational & Awareness
    newBlogPosts: false,
    glaucomaTips: true,
    expertAdvice: true,
  },
  isLoading: false,
  isSaving: false,
  error: null,
};

const notificationPreferencesSlice = createSlice({
  name: 'notificationPreferences',
  initialState,
  reducers: {
    // Local toggle (optimistic update)
    togglePreference: (state, action) => {
      const key = action.payload;
      if (state.preferences.hasOwnProperty(key)) {
        state.preferences[key] = !state.preferences[key];
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Preferences
    builder
      .addCase(fetchPreferences.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPreferences.fulfilled, (state, action) => {
        state.isLoading = false;
        state.preferences = {
          medicationReminders: action.payload.medicationReminders,
          eyeCheckupAlerts: action.payload.eyeCheckupAlerts,
          labReportUpdates: action.payload.labReportUpdates,
          appUpdates: action.payload.appUpdates,
          promotionalOffers: action.payload.promotionalOffers,
          feedbackRequests: action.payload.feedbackRequests,
          newBlogPosts: action.payload.newBlogPosts,
          glaucomaTips: action.payload.glaucomaTips,
          expertAdvice: action.payload.expertAdvice,
        };
      })
      .addCase(fetchPreferences.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch preferences';
      });

    // Update Preferences
    builder
      .addCase(updatePreferences.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isSaving = false;
        state.preferences = {
          medicationReminders: action.payload.medicationReminders,
          eyeCheckupAlerts: action.payload.eyeCheckupAlerts,
          labReportUpdates: action.payload.labReportUpdates,
          appUpdates: action.payload.appUpdates,
          promotionalOffers: action.payload.promotionalOffers,
          feedbackRequests: action.payload.feedbackRequests,
          newBlogPosts: action.payload.newBlogPosts,
          glaucomaTips: action.payload.glaucomaTips,
          expertAdvice: action.payload.expertAdvice,
        };
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message || 'Failed to update preferences';
      });

    // Turn Off All
    builder
      .addCase(turnOffAll.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(turnOffAll.fulfilled, (state, action) => {
        state.isSaving = false;
        state.preferences = {
          medicationReminders: false,
          eyeCheckupAlerts: false,
          labReportUpdates: false,
          appUpdates: false,
          promotionalOffers: false,
          feedbackRequests: false,
          newBlogPosts: false,
          glaucomaTips: false,
          expertAdvice: false,
        };
      })
      .addCase(turnOffAll.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message || 'Failed to turn off all';
      });

    // Reset to Defaults
    builder
      .addCase(resetToDefaults.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(resetToDefaults.fulfilled, (state, action) => {
        state.isSaving = false;
        state.preferences = {
          medicationReminders: action.payload.medicationReminders,
          eyeCheckupAlerts: action.payload.eyeCheckupAlerts,
          labReportUpdates: action.payload.labReportUpdates,
          appUpdates: action.payload.appUpdates,
          promotionalOffers: action.payload.promotionalOffers,
          feedbackRequests: action.payload.feedbackRequests,
          newBlogPosts: action.payload.newBlogPosts,
          glaucomaTips: action.payload.glaucomaTips,
          expertAdvice: action.payload.expertAdvice,
        };
      })
      .addCase(resetToDefaults.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload?.message || 'Failed to reset';
      });
  },
});

export const { togglePreference, clearError } = notificationPreferencesSlice.actions;

export default notificationPreferencesSlice.reducer;
