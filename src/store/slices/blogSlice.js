// FILE: src/store/slices/blogSlice.js
// Blog Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { blogApi } from '../../services/api/blogApi';

// Async Thunks
export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async (params, { rejectWithValue }) => {
    try {
      const response = await blogApi.getAllBlogs(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBlogById = createAsyncThunk(
  'blog/fetchById',
  async (identifier, { rejectWithValue }) => {
    try {
      // blogApi.getBlogByIdOrSlug SHOULD return the blog object (response.data.data)
      const blog = await blogApi.getBlogByIdOrSlug(identifier);
      // return the blog object directly so action.payload === blog
      return blog;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFeaturedBlogs = createAsyncThunk(
  'blog/fetchFeatured',
  async (_, { rejectWithValue }) => {
    try {
      const response = await blogApi.getFeaturedBlogs();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchBlogsByCategory = createAsyncThunk(
  'blog/fetchByCategory',
  async ({ category, page, limit }, { rejectWithValue }) => {
    try {
      const response = await blogApi.getBlogsByCategory(category, page, limit);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  blogs: [],
  selectedBlog: null,
  featuredBlogs: [],
  pagination: null,
  isLoading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    category: '',
    tag: '',
    search: '',
    sortBy: 'recent',
  },
};

const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearSelectedBlog: (state) => {
      state.selectedBlog = null;
    },
    clearBlogs: (state) => {
      state.blogs = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Blogs
    builder
      .addCase(fetchBlogs.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.isLoading = false;
        state.blogs = action.payload.blogs;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch blogs';
      });

    // Fetch Blog By ID
    builder
      .addCase(fetchBlogById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch blog';
      });

    // Fetch Featured Blogs
    builder.addCase(fetchFeaturedBlogs.fulfilled, (state, action) => {
      state.featuredBlogs = action.payload;
    });

    // Fetch Blogs by Category
    builder.addCase(fetchBlogsByCategory.fulfilled, (state, action) => {
      state.isLoading = false;
      state.blogs = action.payload.blogs;
      state.pagination = action.payload.pagination;
    });
  },
});

export const { clearError, setFilters, clearSelectedBlog, clearBlogs } = blogSlice.actions;
export default blogSlice.reducer;
