// FILE: src/store/slices/notificationSlice.js
// Notification Redux Slice
// ============================================================================

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationApi } from '../../services/api/notificationApi';

// Async Thunks
export const fetchNotifications = createAsyncThunk(
  'notification/fetchNotifications',
  async ({ page = 1, limit = 20, isRead = null }, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getAllNotifications(page, limit, isRead);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUnreadCount = createAsyncThunk(
  'notification/fetchUnreadCount',
  async (_, { rejectWithValue }) => {
    try {
      const response = await notificationApi.getUnreadCount();
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  'notification/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationApi.markAsRead(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  'notification/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.markAllAsRead();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteNotification = createAsyncThunk(
  'notification/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await notificationApi.deleteNotification(notificationId);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const clearAllNotifications = createAsyncThunk(
  'notification/clearAll',
  async (_, { rejectWithValue }) => {
    try {
      await notificationApi.clearAll();
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const initialState = {
  notifications: [],
  unreadCount: 0,
  pagination: null,
  isLoading: false,
  error: null,
  activeTab: 'all', // 'all' or 'unread'
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Failed to fetch notifications';
      });

    // Fetch Unread Count
    builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
      state.unreadCount = action.payload.count;
    });

    // Mark as Read
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find((n) => n._id === action.payload);
      if (notification) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // Mark All as Read
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications.forEach((notification) => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    });

    // Delete Notification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      state.notifications = state.notifications.filter((n) => n._id !== action.payload);
    });

    // Clear All
    builder.addCase(clearAllNotifications.fulfilled, (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    });
  },
});

export const { setActiveTab, clearError } = notificationSlice.actions;
export default notificationSlice.reducer;
// // FILE: src/store/slices/notificationSlice.js
// // Notification Redux Slice
// // ============================================================================

// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { notificationApi } from '../../services/api/notificationApi';

// // Async Thunks
// export const fetchNotifications = createAsyncThunk(
//   'notification/fetch',
//   async (params, { rejectWithValue }) => {
//     try {
//       const response = await notificationApi.getNotifications(params);
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const fetchUnreadCount = createAsyncThunk(
//   'notification/fetchUnreadCount',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await notificationApi.getUnreadCount();
//       return response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const markNotificationAsRead = createAsyncThunk(
//   'notification/markAsRead',
//   async (id, { rejectWithValue }) => {
//     try {
//       await notificationApi.markAsRead(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const markAllNotificationsAsRead = createAsyncThunk(
//   'notification/markAllAsRead',
//   async (_, { rejectWithValue }) => {
//     try {
//       await notificationApi.markAllAsRead();
//       return null;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const deleteNotification = createAsyncThunk(
//   'notification/delete',
//   async (id, { rejectWithValue }) => {
//     try {
//       await notificationApi.deleteNotification(id);
//       return id;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// export const clearAllNotifications = createAsyncThunk(
//   'notification/clearAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       await notificationApi.clearAll();
//       return null;
//     } catch (error) {
//       return rejectWithValue(error.response?.data || error.message);
//     }
//   }
// );

// const initialState = {
//   notifications: [],
//   unreadCount: 0,
//   pagination: null,
//   isLoading: false,
//   error: null,
// };

// const notificationSlice = createSlice({
//   name: 'notification',
//   initialState,
//   reducers: {
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     // Fetch Notifications
//     builder
//       .addCase(fetchNotifications.pending, (state) => {
//         state.isLoading = true;
//         state.error = null;
//       })
//       .addCase(fetchNotifications.fulfilled, (state, action) => {
//         state.isLoading = false;
//         state.notifications = action.payload.notifications;
//         state.pagination = action.payload.pagination;
//       })
//       .addCase(fetchNotifications.rejected, (state, action) => {
//         state.isLoading = false;
//         state.error = action.payload?.message || 'Failed to load notifications';
//       });

//     // Fetch Unread Count
//     builder.addCase(fetchUnreadCount.fulfilled, (state, action) => {
//       state.unreadCount = action.payload.count;
//     });

//     // Mark as Read
//     builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
//       const index = state.notifications.findIndex((n) => n._id === action.payload);
//       if (index !== -1) {
//         state.notifications[index].isRead = true;
//         state.unreadCount = Math.max(0, state.unreadCount - 1);
//       }
//     });

//     // Mark All as Read
//     builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
//       state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
//       state.unreadCount = 0;
//     });

//     // Delete Notification
//     builder.addCase(deleteNotification.fulfilled, (state, action) => {
//       state.notifications = state.notifications.filter((n) => n._id !== action.payload);
//     });

//     // Clear All
//     builder.addCase(clearAllNotifications.fulfilled, (state) => {
//       state.notifications = [];
//       state.unreadCount = 0;
//     });
//   },
// });

// export const { clearError } = notificationSlice.actions;
// export default notificationSlice.reducer;
