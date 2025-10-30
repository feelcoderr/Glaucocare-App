// FILE: src/services/api/documentApi.js
// Document API Service
// ============================================================================

import apiClient from './apiClient';

export const documentApi = {
  // Upload document
  uploadDocument: async (formData) => {
    try {
      const response = await apiClient.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response;
    } catch (error) {
      console.error('❌ Upload Document Error:', error);
      throw error;
    }
  },

  // Get user documents
  getUserDocuments: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const response = await apiClient.get(`/documents?${queryParams}`);
      return response;
    } catch (error) {
      console.error('❌ Get Documents Error:', error);
      throw error;
    }
  },

  // Get document by ID
  getDocumentById: async (id) => {
    try {
      const response = await apiClient.get(`/documents/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Get Document Error:', error);
      throw error;
    }
  },

  // Update document
  updateDocument: async (id, updateData) => {
    try {
      const response = await apiClient.put(`/documents/${id}`, updateData);
      return response;
    } catch (error) {
      console.error('❌ Update Document Error:', error);
      throw error;
    }
  },

  // Delete document
  deleteDocument: async (id) => {
    try {
      const response = await apiClient.delete(`/documents/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Delete Document Error:', error);
      throw error;
    }
  },
};
