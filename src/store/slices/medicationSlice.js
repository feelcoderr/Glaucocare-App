// FILE: src/store/slices/medicationSlice.js
// Medication Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { medicationApi } from '../../services/api/medicationApi';

// Async Thunks
export const fetchMedicationLibrary = createAsyncThunk(
  'medication/fetchLibrary',
  async (_, { rejectWithValue }) => {
    try {
      const response = await medicationApi.getMedicationLibrary();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const searchMedications = createAsyncThunk(
  'medication/search',
  async (searchQuery, { rejectWithValue }) => {
    try {
      const response = await medicationApi.searchMedications(searchQuery);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createMedicationReminder = createAsyncThunk(
  'medication/createReminder',
  async (reminderData, { rejectWithValue }) => {
    try {
      const response = await medicationApi.createReminder(reminderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserReminders = createAsyncThunk(
  'medication/fetchReminders',
  async (isActive = true, { rejectWithValue }) => {
    try {
      const response = await medicationApi.getUserReminders(isActive);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateMedicationReminder = createAsyncThunk(
  'medication/updateReminder',
  async ({ id, reminderData }, { rejectWithValue }) => {
    try {
      const response = await medicationApi.updateReminder(id, reminderData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markMedicationAsTaken = createAsyncThunk(
  'medication/markAsTaken',
  async ({ id, time }, { rejectWithValue }) => {
    try {
      const response = await medicationApi.markAsTaken(id, time);
      return { id, data: response.data };
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteMedicationReminder = createAsyncThunk(
  'medication/deleteReminder',
  async (id, { rejectWithValue }) => {
    try {
      await medicationApi.deleteReminder(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  library: [],
  searchResults: [],
  reminders: [],
  isLoading: false,
  error: null,
};

const medicationSlice = createSlice({
  name: 'medication',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    // Fetch Library
    builder
      .addCase(fetchMedicationLibrary.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMedicationLibrary.fulfilled, (state, action) => {
        state.isLoading = false;
        state.library = action.payload;
      })
      .addCase(fetchMedicationLibrary.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch medication library';
      });

    // Search Medications
    builder
      .addCase(searchMedications.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(searchMedications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMedications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Search failed';
      });

    // Create Reminder
    builder
      .addCase(createMedicationReminder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createMedicationReminder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reminders.unshift(action.payload);
      })
      .addCase(createMedicationReminder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to create reminder';
      });

    // Fetch Reminders
    builder
      .addCase(fetchUserReminders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReminders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reminders = action.payload;
      })
      .addCase(fetchUserReminders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch reminders';
      });

    // Update Reminder
    builder.addCase(updateMedicationReminder.fulfilled, (state, action) => {
      const index = state.reminders.findIndex((r) => r._id === action.payload._id);
      if (index !== -1) {
        state.reminders[index] = action.payload;
      }
    });

    // Mark as Taken
    builder.addCase(markMedicationAsTaken.fulfilled, (state, action) => {
      const { id, data } = action.payload;
      const index = state.reminders.findIndex((r) => r._id === id);
      if (index !== -1) {
        state.reminders[index] = { ...state.reminders[index], ...data };
      }
    });

    // Delete Reminder
    builder.addCase(deleteMedicationReminder.fulfilled, (state, action) => {
      state.reminders = state.reminders.filter((r) => r._id !== action.payload);
    });
  },
});

export const { clearError, clearSearchResults } = medicationSlice.actions;
export default medicationSlice.reducer;
