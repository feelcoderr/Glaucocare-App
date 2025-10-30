// FILE: src/store/slices/doctorSlice.js
// Doctor Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doctorApi } from '../../services/api/doctorApi';

// Async Thunks
export const fetchDoctors = createAsyncThunk(
  'doctor/fetchDoctors',
  async (params, { rejectWithValue }) => {
    try {
      const response = await doctorApi.getAllDoctors(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDoctorById = createAsyncThunk(
  'doctor/fetchDoctorById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await doctorApi.getDoctorById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchNearbyDoctors = createAsyncThunk(
  'doctor/fetchNearbyDoctors',
  async ({ latitude, longitude, maxDistance }, { rejectWithValue }) => {
    try {
      const response = await doctorApi.getNearbyDoctors(latitude, longitude, maxDistance);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  doctors: [],
  selectedDoctor: null,
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    specialty: '',
    city: '',
    search: '',
  },
};

const doctorSlice = createSlice({
  name: 'doctor',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedDoctor: (state) => {
      state.selectedDoctor = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Doctors
    builder
      .addCase(fetchDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload.doctors;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch doctors';
      });

    // Fetch Doctor by ID
    builder
      .addCase(fetchDoctorById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDoctorById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedDoctor = action.payload;
      })
      .addCase(fetchDoctorById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch doctor details';
      });

    // Fetch Nearby Doctors
    builder
      .addCase(fetchNearbyDoctors.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNearbyDoctors.fulfilled, (state, action) => {
        state.isLoading = false;
        state.doctors = action.payload;
      })
      .addCase(fetchNearbyDoctors.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch nearby doctors';
      });
  },
});

export const { clearError, setFilters, clearSelectedDoctor } = doctorSlice.actions;
export default doctorSlice.reducer;
