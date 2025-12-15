// FILE: src/config/firebase.config.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyC26iibXEj6geb9pLG1PcbDdGbPj2sntN4',
  authDomain: 'glaucocare-app.firebaseapp.com',
  projectId: 'glaucocare-app',
  storageBucket: 'glaucocare-app.firebasestorage.app',
  messagingSenderId: '762154220704',
  // Platform-specific App IDs
  appId: Platform.select({
    android: '1:762154220704:android:85a34216c986f03816ddc5',
    ios: '1:762154220704:android:85a34216c986f03816ddc5', // Update when iOS is added
    web: '1:762154220704:web:10d560b33a86e25516ddc5', // Get from Firebase Console
    default: '1:762154220704:android:85a34216c986f03816ddc5',
  }),
};

// Initialize Firebase (only once)
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
  console.log('✅ Firebase initialized');
} else {
  app = getApps()[0];
  console.log('ℹ️ Firebase already initialized');
}

// Initialize Auth with persistence
let auth;
try {
  if (Platform.OS === 'web') {
    auth = getAuth(app);
  } else {
    // For React Native, use AsyncStorage for persistence
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  }
  console.log('✅ Auth initialized');
} catch (error) {
  // If already initialized, get existing instance
  auth = getAuth(app);
  console.log('ℹ️ Using existing Auth instance');
}

// Initialize Firestore
const db = getFirestore(app);
console.log('✅ Firestore initialized');

// Initialize Storage
const storage = getStorage(app);
console.log('✅ Storage initialized');

export { auth, db, storage };
export default app;

// // src/config/firebase.config.js

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// import { Platform } from 'react-native';
// // Your Firebase config from Firebase Console
// const firebaseConfig = {
//   apiKey: 'AIzaSyC26iibXEj6geb9pLG1PcbDdGbPj2sntN4',
//   authDomain: 'glaucocare-app.firebaseapp.com',
//   projectId: 'glaucocare-app',
//   storageBucket: 'glaucocare-app.firebasestorage.app',
//   messagingSenderId: '762154220704',
//   appId: Platform.select({
//     android: '1:762154220704:android:85a34216c986f03816ddc5',
//     ios: '1:762154220704:android:85a34216c986f03816ddc5', // Update when you add iOS
//     web: '1:762154220704:web:YOUR_WEB_APP_ID', // Get this from Firebase Web app config
//     default: '1:762154220704:android:85a34216c986f03816ddc5',
//   }),
//   measurementId: 'G-F8G9HTR1WC', // Optional
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Initialize Firebase Auth
// export const auth = getAuth(app);

// // Initialize Firebase Cloud Messaging (for push notifications)
// // Only available in web builds, not Expo Go
// let messaging = null;
// try {
//   if (typeof window !== 'undefined') {
//     messaging = getMessaging(app);
//   }
// } catch (error) {
//   console.log('FCM not available in this environment');
// }

// export { messaging, getToken, onMessage };
// export default app;
