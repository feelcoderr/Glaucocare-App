// src/config/firebase.config.js

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Your Firebase config from Firebase Console
const firebaseConfig = {
  apiKey: 'AIzaSyDLOO57q2KeKOONMXBwdItjqMr9fA5tSUg',
  authDomain: 'glaucocare-app.firebaseapp.com',
  projectId: 'glaucocare-app',
  storageBucket: 'glaucocare-app.firebasestorage.app',
  messagingSenderId: '762154220704',
  appId: '1:762154220704:web:10d560b33a86e25516ddc5',
  measurementId: 'G-F8G9HTR1WC', // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Cloud Messaging (for push notifications)
// Only available in web builds, not Expo Go
let messaging = null;
try {
  if (typeof window !== 'undefined') {
    messaging = getMessaging(app);
  }
} catch (error) {
  console.log('FCM not available in this environment');
}

export { messaging, getToken, onMessage };
export default app;
