// FILE: src/store/slices/searchSlice.js
// Search Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { searchApi } from '../../services/api/searchApi';

// Async Thunks
export const performSearch = createAsyncThunk(
  'search/performSearch',
  async ({ query, category, limit }, { rejectWithValue }) => {
    try {
      const response = await searchApi.globalSearch(query, category, limit);
      // Save search query
      await searchApi.saveSearch(query);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchRecentSearches = createAsyncThunk(
  'search/fetchRecentSearches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await searchApi.getRecentSearches();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPopularSearches = createAsyncThunk(
  'search/fetchPopularSearches',
  async (_, { rejectWithValue }) => {
    try {
      const response = await searchApi.getPopularSearches();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearRecentSearches = createAsyncThunk(
  'search/clearRecentSearches',
  async (_, { rejectWithValue }) => {
    try {
      await searchApi.clearRecentSearches();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  query: '',
  results: {
    blogs: { count: 0, items: [] },
    events: { count: 0, items: [] },
  },
  recentSearches: [],
  popularSearches: [],
  isLoading: false,
  error: null,
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setQuery: (state, action) => {
      state.query = action.payload;
    },
    clearResults: (state) => {
      state.results = {
        blogs: { count: 0, items: [] },
        events: { count: 0, items: [] },
      };
      state.query = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Perform Search
    builder
      .addCase(performSearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isLoading = false;
        state.results = action.payload.results;
        state.query = action.payload.query;
      })
      .addCase(performSearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Search failed';
      });

    // Fetch Recent Searches
    builder.addCase(fetchRecentSearches.fulfilled, (state, action) => {
      state.recentSearches = action.payload;
    });

    // Fetch Popular Searches
    builder.addCase(fetchPopularSearches.fulfilled, (state, action) => {
      state.popularSearches = action.payload;
    });

    // Clear Recent Searches
    builder.addCase(clearRecentSearches.fulfilled, (state) => {
      state.recentSearches = [];
    });
  },
});

export const { setQuery, clearResults, clearError } = searchSlice.actions;
export default searchSlice.reducer;
