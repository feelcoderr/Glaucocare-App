// FILE: src/services/api/questionApi.js
// Question API Service
// ============================================================================

import apiClient from './apiClient';

export const questionApi = {
  // Get all active questions (for users)
  getActiveQuestions: async () => {
    try {
      const response = await apiClient.get('/questions');
      return response;
    } catch (error) {
      console.error('❌ Get Questions Error:', error);
      throw error;
    }
  },

  // Get single question by number
  getQuestionByNumber: async (number) => {
    try {
      const response = await apiClient.get(`/questions/${number}`);
      return response;
    } catch (error) {
      console.error('❌ Get Question Error:', error);
      throw error;
    }
  },

  // Get questions count
  getQuestionsCount: async () => {
    try {
      const response = await apiClient.get('/questions/count');
      return response;
    } catch (error) {
      console.error('❌ Get Count Error:', error);
      throw error;
    }
  },

  // =============================================
  // ADMIN ENDPOINTS
  // =============================================

  // Get all questions (admin)
  getAllQuestionsAdmin: async (params = {}) => {
    try {
      const { page = 1, limit = 50, isActive, category } = params;
      let url = `/admin/questions?page=${page}&limit=${limit}`;
      if (isActive !== undefined) url += `&isActive=${isActive}`;
      if (category) url += `&category=${category}`;

      const response = await apiClient.get(url);
      return response;
    } catch (error) {
      console.error('❌ Admin Get Questions Error:', error);
      throw error;
    }
  },

  // Get question by ID (admin)
  getQuestionByIdAdmin: async (id) => {
    try {
      const response = await apiClient.get(`/admin/questions/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Admin Get Question Error:', error);
      throw error;
    }
  },

  // Create question (admin)
  createQuestion: async (questionData) => {
    try {
      const response = await apiClient.post('/admin/questions', questionData);
      return response;
    } catch (error) {
      console.error('❌ Create Question Error:', error);
      throw error;
    }
  },

  // Update question (admin)
  updateQuestion: async (id, questionData) => {
    try {
      const response = await apiClient.put(`/admin/questions/${id}`, questionData);
      return response;
    } catch (error) {
      console.error('❌ Update Question Error:', error);
      throw error;
    }
  },

  // Delete question (admin)
  deleteQuestion: async (id) => {
    try {
      const response = await apiClient.delete(`/admin/questions/${id}`);
      return response;
    } catch (error) {
      console.error('❌ Delete Question Error:', error);
      throw error;
    }
  },

  // Toggle question status (admin)
  toggleQuestionStatus: async (id) => {
    try {
      const response = await apiClient.patch(`/admin/questions/${id}/toggle-status`);
      return response;
    } catch (error) {
      console.error('❌ Toggle Status Error:', error);
      throw error;
    }
  },

  // Reorder questions (admin)
  reorderQuestions: async (questionOrders) => {
    try {
      const response = await apiClient.post('/admin/questions/reorder', {
        questionOrders,
      });
      return response;
    } catch (error) {
      console.error('❌ Reorder Questions Error:', error);
      throw error;
    }
  },

  // Bulk create questions (admin)
  bulkCreateQuestions: async (questions) => {
    try {
      const response = await apiClient.post('/admin/questions/bulk-create', {
        questions,
      });
      return response;
    } catch (error) {
      console.error('❌ Bulk Create Error:', error);
      throw error;
    }
  },
};
