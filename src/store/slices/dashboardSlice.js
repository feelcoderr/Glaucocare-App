// FILE: src/store/slices/dashboardSlice.js
// Dashboard Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { dashboardApi } from '../../services/api/dashboardApi';

// Async Thunks
export const fetchDashboard = createAsyncThunk(
  'dashboard/fetchDashboard',
  async (_, { rejectWithValue }) => {
    try {
      const response = await dashboardApi.getDashboardData();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  user: null,
  nextMedicationReminder: null,
  statistics: {
    activeMedications: 0,
    totalDocuments: 0,
    upcomingEvents: 0,
    unreadNotifications: 0,
  },
  recentDoctors: [],
  upcomingEvents: [],
  featuredBlogs: [],
  infoCard: null,
  isLoading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    dismissInfoCard: (state) => {
      state.infoCard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.nextMedicationReminder = action.payload.nextMedicationReminder;
        state.statistics = action.payload.statistics;
        state.recentDoctors = action.payload.recentDoctors;
        state.upcomingEvents = action.payload.upcomingEvents;
        state.featuredBlogs = action.payload.featuredBlogs;
        state.infoCard = action.payload.infoCard;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch dashboard';
      });
  },
});

export const { clearError, dismissInfoCard } = dashboardSlice.actions;
export default dashboardSlice.reducer;
// // FILE: src/store/slices/dashboardSlice.js
// // Dashboard Redux Slice
// // ============================================================================

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { dashboardApi } from '../../services/api/dashboardApi';

// // Async Thunks
// export const fetchDashboardData = createAsyncThunk(
//   'dashboard/fetchData',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await dashboardApi.getDashboardData();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   user: null,
//   nextMedication: null,
//   statistics: {
//     activeMedications: 0,
//     totalDocuments: 0,
//     upcomingEvents: 0,
//     unreadNotifications: 0,
//   },
//   recentDoctors: [],
//   upcomingEvents: [],
//   featuredBlogs: [],
//   infoCard: null,
//   isLoading: false,
//   error: null,
// };

// const dashboardSlice = createSlice({
//   name: 'dashboard',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchDashboardData.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchDashboardData.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.user = action.payload.user;
//         state.nextMedication = action.payload.nextMedicationReminder;
//         state.statistics = action.payload.statistics;
//         state.recentDoctors = action.payload.recentDoctors;
//         state.upcomingEvents = action.payload.upcomingEvents;
//         state.featuredBlogs = action.payload.featuredBlogs;
//         state.infoCard = action.payload.infoCard;
//       })
//       .addCase(fetchDashboardData.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to load dashboard';
//       });
//   },
// });

// export const { clearError } = dashboardSlice.actions;
// export default dashboardSlice.reducer;
