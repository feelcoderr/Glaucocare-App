// FILE: src/store/slices/eventSlice.js
// Event Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { eventApi } from '../../services/api/eventApi';

// Async Thunks
export const fetchEvents = createAsyncThunk(
  'event/fetchEvents',
  async (params, { rejectWithValue }) => {
    try {
      const response = await eventApi.getAllEvents(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'event/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await eventApi.getEventById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUpcomingEvents = createAsyncThunk(
  'event/fetchUpcoming',
  async (limit, { rejectWithValue }) => {
    try {
      const response = await eventApi.getUpcomingEvents(limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNearbyEvents = createAsyncThunk(
  'event/fetchNearby',
  async ({ latitude, longitude, maxDistance }, { rejectWithValue }) => {
    try {
      const response = await eventApi.getNearbyEvents(latitude, longitude, maxDistance);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  events: [],
  selectedEvent: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    category: '',
    city: '',
    upcoming: true,
  },
};

const eventSlice = createSlice({
  name: 'event',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        category: null,
        city: null,
        upcoming: true,
        page: 1,
        limit: 10,
      };
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Events
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.isLoading = false;
        state.events = action.payload.events;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch events';
      });

    // Fetch Event By ID
    builder
      .addCase(fetchEventById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch event';
      });

    // Fetch Upcoming Events
    builder.addCase(fetchUpcomingEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });

    // Fetch Nearby Events
    builder.addCase(fetchNearbyEvents.fulfilled, (state, action) => {
      state.events = action.payload;
    });
  },
});

export const { clearError, setFilters, clearSelectedEvent } = eventSlice.actions;
export default eventSlice.reducer;
