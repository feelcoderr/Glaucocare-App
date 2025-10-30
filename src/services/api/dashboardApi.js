// FILE: src/services/api/dashboardApi.js
// Dashboard API Service
// ============================================================================

import apiClient from './apiClient';

export const dashboardApi = {
  // Get Dashboard Data
  getDashboardData: async () => {
    try {
      const response = await apiClient.get('/users/dashboard');
      return response;
    } catch (error) {
      console.error('❌ Dashboard Error:', error);
      throw error;
    }
  },

  // Get Next Medication Reminder
  getNextReminder: async () => {
    try {
      const response = await apiClient.get('/medications/reminders/next');
      return response;
    } catch (error) {
      console.error('❌ Next Reminder Error:', error);
      throw error;
    }
  },

  // Get Recent Doctors
  getRecentDoctors: async (limit = 3) => {
    try {
      const response = await apiClient.get(`/doctors/recent?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('❌ Recent Doctors Error:', error);
      throw error;
    }
  },
};
// // FILE: src/services/api/dashboardApi.js
// // Dashboard API Service
// // ============================================================================

// import apiClient from './apiClient';

// export const dashboardApi = {
//   // Get complete dashboard data
//   getDashboardData: async () => {
//     try {
//       const response = await apiClient.get('/users/dashboard');
//       return response;
//     } catch (error) {
//       console.error('❌ Get Dashboard Error:', error);
//       throw error;
//     }
//   },

//   // Get next medication reminder
//   getNextMedication: async () => {
//     try {
//       const response = await apiClient.get('/medications/reminders/next');
//       return response;
//     } catch (error) {
//       console.error('❌ Get Next Medication Error:', error);
//       throw error;
//     }
//   },

//   // Get recent doctors
//   getRecentDoctors: async (limit = 3) => {
//     try {
//       const response = await apiClient.get(`/doctors/recent?limit=${limit}`);
//       return response;
//     } catch (error) {
//       console.error('❌ Get Recent Doctors Error:', error);
//       throw error;
//     }
//   },
// };
