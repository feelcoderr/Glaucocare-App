// FILE: src/store/store.js
// UPDATED Redux Store
// ============================================================================

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import doctorReducer from './slices/doctorSlice';
import medicationReducer from './slices/medicationSlice';
import documentReducer from './slices/documentSlice';
import eventReducer from './slices/eventSlice';
import dashboardReducer from './slices/dashboardSlice';
import searchReducer from './slices/searchSlice';
import notificationReducer from './slices/notificationSlice';
import blogReducer from './slices/blogSlice'; // ADD THIS
import educationalContentReducer from './slices/educationalContentSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    doctor: doctorReducer,
    medication: medicationReducer,
    document: documentReducer,
    event: eventReducer,
    dashboard: dashboardReducer,
    search: searchReducer,
    notification: notificationReducer,
    blog: blogReducer, // ADD THIS
    educationalContent: educationalContentReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
// // FILE: src/store/store.js
// // UPDATED Redux Store
// // ============================================================================

// import { configureStore } from '@reduxjs/toolkit';
// import authReducer from './slices/authSlice';
// import doctorReducer from './slices/doctorSlice';
// import medicationReducer from './slices/medicationSlice';
// import documentReducer from './slices/documentSlice';
// import eventReducer from './slices/eventSlice';
// import dashboardReducer from './slices/dashboardSlice';
// import searchReducer from './slices/searchSlice';
// import notificationReducer from './slices/notificationSlice';

// const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     doctor: doctorReducer,
//     medication: medicationReducer,
//     document: documentReducer,
//     event: eventReducer,
//     dashboard: dashboardReducer,
//     search: searchReducer,
//     notification: notificationReducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export default store;
