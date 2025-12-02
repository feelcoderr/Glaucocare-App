// FILE: src/services/api/assessmentApi.js
// Assessment API Service
// ============================================================================

import apiClient from './apiClient';

export const assessmentApi = {
  // Submit completed assessment
  submitAssessment: async (answers) => {
    try {
      const response = await apiClient.post('/assessments/submit', {
        answers,
        completedAt: new Date().toISOString(),
      });
      return response;
    } catch (error) {
      console.error('❌ Submit Assessment Error:', error);
      throw error;
    }
  },

  // Save draft assessment
  saveDraft: async (answers, currentQuestion) => {
    try {
      const response = await apiClient.post('/assessments/draft', {
        answers,
        currentQuestion,
      });
      return response;
    } catch (error) {
      console.error('❌ Save Draft Error:', error);
      throw error;
    }
  },

  // Get latest assessment
  getLatestAssessment: async () => {
    try {
      const response = await apiClient.get('/assessments/latest');
      return response;
    } catch (error) {
      console.error('❌ Get Latest Assessment Error:', error);
      throw error;
    }
  },

  // Get draft assessment
  getDraftAssessment: async () => {
    try {
      const response = await apiClient.get('/assessments/draft');
      return response;
    } catch (error) {
      console.error('❌ Get Draft Error:', error);
      throw error;
    }
  },

  // Get user assessments history
  getUserAssessments: async (page = 1, limit = 10) => {
    try {
      const response = await apiClient.get(`/assessments?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      console.error('❌ Get Assessments Error:', error);
      throw error;
    }
  },
};
