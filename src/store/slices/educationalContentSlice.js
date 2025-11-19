// FILE: src/store/slices/educationalContentSlice.js
// Educational Content Redux Slice - FIXED VERSION
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { educationalContentApi } from '../../services/api/educationalContentApi';

// Async Thunks

// ✅ FIXED: Fetch all educational content (for list view)
export const getEducationalContent = createAsyncThunk(
  'educationalContent/getAll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await educationalContentApi.getEducationalContent(params);
      // API returns { status, message, data: [...] }
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch educational content list (with filters)
export const fetchEducationalContentList = createAsyncThunk(
  'educationalContent/fetchList',
  async (params, { rejectWithValue }) => {
    try {
      const response = await educationalContentApi.getEducationalContentList(params);
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ✅ FIXED: Fetch educational content by slug
export const fetchEducationalContentBySlug = createAsyncThunk(
  'educationalContent/fetchBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await educationalContentApi.getEducationalContentBySlug(slug);
      // API returns { status, message, data: {...single content object...} }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch educational content by category
export const fetchEducationalContentByCategory = createAsyncThunk(
  'educationalContent/fetchByCategory',
  async ({ category, params }, { rejectWithValue }) => {
    try {
      const response = await educationalContentApi.getEducationalContentByCategory(
        category,
        params
      );
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch categories
export const fetchCategories = createAsyncThunk(
  'educationalContent/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await educationalContentApi.getCategories();
      return response.data.data || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  // Content list
  contentList: [],
  contentPagination: null,

  // Single content (detail view)
  currentContent: null,

  // Categories
  categories: [],

  // Loading states
  isLoading: false,
  isListLoading: false,
  isDetailLoading: false,

  // Error states
  error: null,
  listError: null,
  detailError: null,
};

const educationalContentSlice = createSlice({
  name: 'educationalContent',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
      state.listError = null;
      state.detailError = null;
    },
    clearCurrentContent: (state) => {
      state.currentContent = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    // ✅ FIXED: Get All Educational Content
    builder
      .addCase(getEducationalContent.pending, (state) => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(getEducationalContent.fulfilled, (state, action) => {
        state.isListLoading = false;
        // Handle list data - should be an array
        state.contentList = Array.isArray(action.payload)
          ? action.payload
          : action.payload.contents || [];
        // ✅ FIXED: Don't set currentContent for list fetches
      })
      .addCase(getEducationalContent.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = action.payload?.message || 'Failed to fetch content';
      });

    // Fetch List
    builder
      .addCase(fetchEducationalContentList.pending, (state) => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(fetchEducationalContentList.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.contentList = action.payload.contents || action.payload || [];
        state.contentPagination = action.payload.pagination;
      })
      .addCase(fetchEducationalContentList.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = action.payload?.message || 'Failed to fetch content list';
      });

    // ✅ FIXED: Fetch by Slug
    builder
      .addCase(fetchEducationalContentBySlug.pending, (state) => {
        state.isDetailLoading = true;
        state.detailError = null;
        state.currentContent = null; // Clear previous content
      })
      .addCase(fetchEducationalContentBySlug.fulfilled, (state, action) => {
        state.isDetailLoading = false;
        state.currentContent = action.payload; // Single content object
      })
      .addCase(fetchEducationalContentBySlug.rejected, (state, action) => {
        state.isDetailLoading = false;
        state.detailError = action.payload?.message || 'Failed to fetch content';
      });

    // Fetch by Category
    builder
      .addCase(fetchEducationalContentByCategory.pending, (state) => {
        state.isListLoading = true;
        state.listError = null;
      })
      .addCase(fetchEducationalContentByCategory.fulfilled, (state, action) => {
        state.isListLoading = false;
        state.contentList = action.payload.contents || action.payload || [];
        state.contentPagination = action.payload.pagination;
      })
      .addCase(fetchEducationalContentByCategory.rejected, (state, action) => {
        state.isListLoading = false;
        state.listError = action.payload?.message || 'Failed to fetch category content';
      });

    // Fetch Categories
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch categories';
      });
  },
});

export const { clearError, clearCurrentContent } = educationalContentSlice.actions;
export default educationalContentSlice.reducer;

// // FILE: src/store/slices/educationalContentSlice.js
// // Educational Content Redux Slice - FIXED VERSION
// // ============================================================================

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { educationalContentApi } from '../../services/api/educationalContentApi';

// // Async Thunks

// // ✅ NEW: Fetch all educational content (for list view)
// export const getEducationalContent = createAsyncThunk(
//   'educationalContent/getAll',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContent(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch educational content list (with filters)
// export const fetchEducationalContentList = createAsyncThunk(
//   'educationalContent/fetchList',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentList(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch educational content by slug
// export const fetchEducationalContentBySlug = createAsyncThunk(
//   'educationalContent/fetchBySlug',
//   async (slug, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentBySlug(slug);

//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch educational content by category
// export const fetchEducationalContentByCategory = createAsyncThunk(
//   'educationalContent/fetchByCategory',
//   async ({ category, params }, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentByCategory(
//         category,
//         params
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch categories
// export const fetchCategories = createAsyncThunk(
//   'educationalContent/fetchCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getCategories();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   // Content list
//   contentList: [],
//   contentPagination: null,

//   // Single content (detail view)
//   currentContent: null,

//   // Categories
//   categories: [],

//   // Loading states
//   isLoading: false,
//   isListLoading: false,
//   isDetailLoading: false,

//   // Error states
//   error: null,
//   listError: null,
//   detailError: null,
// };

// const educationalContentSlice = createSlice({
//   name: 'educationalContent',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//       state.listError = null;
//       state.detailError = null;
//     },
//     clearCurrentContent: (state) => {
//       state.currentContent = null;
//       state.detailError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // ✅ Get All Educational Content
//     builder
//       .addCase(getEducationalContent.pending, (state) => {
//         state.isListLoading = true;
//         state.listError = null;
//       })
//       .addCase(getEducationalContent.fulfilled, (state, action) => {
//         state.isListLoading = false;
//         // If it's an array, use it directly; if it's an object with contents, use contents
//         state.contentList = Array.isArray(action.payload)
//           ? action.payload
//           : action.payload.contents || [];

//         state.currentContent = action.payload;
//       })
//       .addCase(getEducationalContent.rejected, (state, action) => {
//         state.isListLoading = false;
//         state.listError = action.payload?.message || 'Failed to fetch content';
//       });

//     // Fetch List
//     builder
//       .addCase(fetchEducationalContentList.pending, (state) => {
//         state.isListLoading = true;
//         state.listError = null;
//       })
//       .addCase(fetchEducationalContentList.fulfilled, (state, action) => {
//         state.isListLoading = false;
//         state.contentList = action.payload.contents || [];
//         state.contentPagination = action.payload.pagination;
//       })
//       .addCase(fetchEducationalContentList.rejected, (state, action) => {
//         state.isListLoading = false;
//         state.listError = action.payload?.message || 'Failed to fetch content list';
//       });

//     // Fetch by Slug
//     builder
//       .addCase(fetchEducationalContentBySlug.pending, (state) => {
//         state.isDetailLoading = true;
//         state.detailError = null;
//       })
//       .addCase(fetchEducationalContentBySlug.fulfilled, (state, action) => {
//         state.isDetailLoading = false;
//         state.currentContent = action.payload;
//       })
//       .addCase(fetchEducationalContentBySlug.rejected, (state, action) => {
//         state.isDetailLoading = false;
//         state.detailError = action.payload?.message || 'Failed to fetch content';
//       });

//     // Fetch by Category
//     builder
//       .addCase(fetchEducationalContentByCategory.pending, (state) => {
//         state.isListLoading = true;
//         state.listError = null;
//       })
//       .addCase(fetchEducationalContentByCategory.fulfilled, (state, action) => {
//         state.isListLoading = false;
//         state.contentList = action.payload.contents || [];
//         state.contentPagination = action.payload.pagination;
//       })
//       .addCase(fetchEducationalContentByCategory.rejected, (state, action) => {
//         state.isListLoading = false;
//         state.listError = action.payload?.message || 'Failed to fetch category content';
//       });

//     // Fetch Categories
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.categories = action.payload;
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to fetch categories';
//       });
//   },
// });

// export const { clearError, clearCurrentContent } = educationalContentSlice.actions;
// export default educationalContentSlice.reducer;

// // FILE: src/store/slices/educationalContentSlice.js
// // Educational Content Redux Slice
// // ============================================================================

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { educationalContentApi } from '../../services/api/educationalContentApi';

// // Async Thunks

// // Fetch educational content list
// export const fetchEducationalContentList = createAsyncThunk(
//   'educationalContent/fetchList',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentList(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch educational content by slug
// export const fetchEducationalContentBySlug = createAsyncThunk(
//   'educationalContent/fetchBySlug',
//   async (slug, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentBySlug(slug);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch educational content by category
// export const fetchEducationalContentByCategory = createAsyncThunk(
//   'educationalContent/fetchByCategory',
//   async ({ category, params }, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getEducationalContentByCategory(
//         category,
//         params
//       );
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// // Fetch categories
// export const fetchCategories = createAsyncThunk(
//   'educationalContent/fetchCategories',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await educationalContentApi.getCategories();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   // Content list
//   contentList: [],
//   contentPagination: null,

//   // Single content (detail view)
//   currentContent: null,

//   // Categories
//   categories: [],

//   // Loading states
//   isLoading: false,
//   isListLoading: false,
//   isDetailLoading: false,

//   // Error states
//   error: null,
//   listError: null,
//   detailError: null,
// };

// const educationalContentSlice = createSlice({
//   name: 'educationalContent',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//       state.listError = null;
//       state.detailError = null;
//     },
//     clearCurrentContent: (state) => {
//       state.currentContent = null;
//       state.detailError = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch List
//     builder
//       .addCase(fetchEducationalContentList.pending, (state) => {
//         state.isListLoading = true;
//         state.listError = null;
//       })
//       .addCase(fetchEducationalContentList.fulfilled, (state, action) => {
//         state.isListLoading = false;
//         state.contentList = action.payload.contents;
//         state.contentPagination = action.payload.pagination;
//       })
//       .addCase(fetchEducationalContentList.rejected, (state, action) => {
//         state.isListLoading = false;
//         state.listError = action.payload?.message || 'Failed to fetch content list';
//       });

//     // Fetch by Slug
//     builder
//       .addCase(fetchEducationalContentBySlug.pending, (state) => {
//         state.isDetailLoading = true;
//         state.detailError = null;
//       })
//       .addCase(fetchEducationalContentBySlug.fulfilled, (state, action) => {
//         state.isDetailLoading = false;
//         state.currentContent = action.payload;
//       })
//       .addCase(fetchEducationalContentBySlug.rejected, (state, action) => {
//         state.isDetailLoading = false;
//         state.detailError = action.payload?.message || 'Failed to fetch content';
//       });

//     // Fetch by Category
//     builder
//       .addCase(fetchEducationalContentByCategory.pending, (state) => {
//         state.isListLoading = true;
//         state.listError = null;
//       })
//       .addCase(fetchEducationalContentByCategory.fulfilled, (state, action) => {
//         state.isListLoading = false;
//         state.contentList = action.payload.contents;
//         state.contentPagination = action.payload.pagination;
//       })
//       .addCase(fetchEducationalContentByCategory.rejected, (state, action) => {
//         state.isListLoading = false;
//         state.listError = action.payload?.message || 'Failed to fetch category content';
//       });

//     // Fetch Categories
//     builder
//       .addCase(fetchCategories.pending, (state) => {
//         state.isLoading = true;
//       })
//       .addCase(fetchCategories.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.categories = action.payload;
//       })
//       .addCase(fetchCategories.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to fetch categories';
//       });
//   },
// });

// export const { clearError, clearCurrentContent } = educationalContentSlice.actions;
// export default educationalContentSlice.reducer;
