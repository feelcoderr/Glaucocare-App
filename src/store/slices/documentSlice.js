// FILE: src/store/slices/documentSlice.js
// Document Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentApi } from '../../services/api/documentApi';

// Async Thunks
export const uploadDocument = createAsyncThunk(
  'document/upload',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await documentApi.uploadDocument(formData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserDocuments = createAsyncThunk(
  'document/fetchUserDocuments',
  async (params, { rejectWithValue }) => {
    try {
      const response = await documentApi.getUserDocuments(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDocumentById = createAsyncThunk(
  'document/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await documentApi.getDocumentById(id);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDocument = createAsyncThunk(
  'document/update',
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await documentApi.updateDocument(id, updateData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'document/delete',
  async (id, { rejectWithValue }) => {
    try {
      await documentApi.deleteDocument(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  documents: [],
  selectedDocument: null,
  pagination: null,
  isLoading: false,
  isUploading: false,
  error: null,
  documentsByType: {
    'Test Results': 0,
    Prescriptions: 0,
    'Medical Reports': 0,
    'Insurance Documents': 0,
    'X-rays/Images': 0,
    Other: 0,
  },
};

const documentSlice = createSlice({
  name: 'document',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSelectedDocument: (state) => {
      state.selectedDocument = null;
    },
  },
  extraReducers: (builder) => {
    // Upload Document
    builder
      .addCase(uploadDocument.pending, (state) => {
        state.isUploading = true;
        state.error = null;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.isUploading = false;
        state.documents.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.isUploading = false;
        state.error = action.payload?.message || 'Failed to upload document';
      });

    // Fetch Documents
    builder
      .addCase(fetchUserDocuments.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserDocuments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.documents = action.payload.documents;
        state.pagination = action.payload.pagination;

        // Count documents by type
        const counts = {
          'Test Results': 0,
          Prescriptions: 0,
          'Medical Reports': 0,
          'Insurance Documents': 0,
          'X-rays/Images': 0,
          Other: 0,
        };
        action.payload.documents.forEach((doc) => {
          if (counts[doc.documentType] !== undefined) {
            counts[doc.documentType]++;
          }
        });
        state.documentsByType = counts;
      })
      .addCase(fetchUserDocuments.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch documents';
      });

    // Fetch Document By ID
    builder.addCase(fetchDocumentById.fulfilled, (state, action) => {
      state.selectedDocument = action.payload;
    });

    // Update Document
    builder.addCase(updateDocument.fulfilled, (state, action) => {
      const index = state.documents.findIndex((d) => d._id === action.payload._id);
      if (index !== -1) {
        state.documents[index] = { ...state.documents[index], ...action.payload };
      }
    });

    // Delete Document
    builder.addCase(deleteDocument.fulfilled, (state, action) => {
      state.documents = state.documents.filter((d) => d._id !== action.payload);
    });
  },
});

export const { clearError, clearSelectedDocument } = documentSlice.actions;
export default documentSlice.reducer;
