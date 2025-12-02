// // src/api/authApi.js

// import apiClient from './apiClient';
// import { getAuth, signInWithPhoneNumber, RecaptchaVerifier } from 'firebase/auth';
// import { auth } from '../config/firebase.config'; // Import your Firebase config

// export const authApi = {
//   /**
//    * Firebase Phone Authentication for Expo
//    */

//   // Step 1: Setup reCAPTCHA verifier (call once per session)
//   setupRecaptcha: (containerId = 'recaptcha-container') => {
//     try {
//       const recaptchaVerifier = new RecaptchaVerifier(
//         containerId,
//         {
//           size: 'invisible',
//           callback: (response) => {
//             console.log('✅ reCAPTCHA verified');
//           },
//           'expired-callback': () => {
//             console.log('⚠️ reCAPTCHA expired');
//           },
//         },
//         auth
//       );
//       return recaptchaVerifier;
//     } catch (error) {
//       console.error('❌ reCAPTCHA setup error:', error);
//       throw error;
//     }
//   },

//   // Step 2: Send OTP via Firebase
//   sendFirebaseOTP: async (phoneNumber, recaptchaVerifier) => {
//     try {
//       console.log('🔐 Sending OTP via Firebase to:', phoneNumber);

//       // Format: +911234567890
//       const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

//       // Send OTP via Firebase
//       const confirmationResult = await signInWithPhoneNumber(
//         auth,
//         formattedPhone,
//         recaptchaVerifier
//       );

//       console.log('✅ OTP sent via Firebase');
//       return { success: true, confirmationResult };
//     } catch (error) {
//       console.error('❌ Firebase Send OTP Error:', error);

//       // Handle specific Firebase errors
//       let errorMessage = 'Failed to send OTP';

//       if (error.code === 'auth/invalid-phone-number') {
//         errorMessage = 'Invalid phone number format';
//       } else if (error.code === 'auth/too-many-requests') {
//         errorMessage = 'Too many attempts. Please try again later';
//       } else if (error.code === 'auth/quota-exceeded') {
//         errorMessage = 'SMS quota exceeded. Please try again later';
//       }

//       throw new Error(errorMessage);
//     }
//   },

//   // Step 3: Verify OTP and get ID token
//   verifyFirebaseOTP: async (confirmationResult, otp) => {
//     try {
//       console.log('🔐 Verifying OTP with Firebase');

//       // Verify OTP with Firebase
//       const userCredential = await confirmationResult.confirm(otp);

//       // Get ID token
//       const idToken = await userCredential.user.getIdToken();

//       console.log('✅ OTP verified, got ID token');
//       return {
//         success: true,
//         idToken,
//         user: userCredential.user,
//         phoneNumber: userCredential.user.phoneNumber,
//       };
//     } catch (error) {
//       console.error('❌ Firebase Verify OTP Error:', error);

//       // Handle specific Firebase errors
//       let errorMessage = 'Invalid OTP';

//       if (error.code === 'auth/invalid-verification-code') {
//         errorMessage = 'Invalid OTP code';
//       } else if (error.code === 'auth/code-expired') {
//         errorMessage = 'OTP has expired. Please request a new one';
//       }

//       throw new Error(errorMessage);
//     }
//   },

//   // Step 4: Authenticate with backend
//   verifyPhoneWithBackend: async (idToken, rememberMe = false) => {
//     try {
//       console.log('🔐 Verifying with backend');
//       const response = await apiClient.post('/auth/verify-phone', {
//         idToken,
//         rememberMe,
//       });
//       console.log('✅ Backend verification successful:', response);
//       return response;
//     } catch (error) {
//       console.error('❌ Backend Verification Error:', error);
//       throw error;
//     }
//   },

//   // Complete Registration
//   completeRegistration: async (fullname, email, languagePreference) => {
//     try {
//       console.log('📝 Completing registration:', { fullname, email, languagePreference });
//       const response = await apiClient.post('/auth/complete-registration', {
//         fullname,
//         email,
//         languagePreference,
//       });
//       console.log('✅ Registration completed:', response);
//       return response;
//     } catch (error) {
//       console.error('❌ Registration Error:', error);
//       throw error;
//     }
//   },

//   // Google Login
//   googleLogin: async (googleId, email, fullname, profilePicture) => {
//     try {
//       console.log('🔐 Google Login:', { googleId, email, fullname });
//       const response = await apiClient.post('/auth/google-login', {
//         googleId,
//         email,
//         fullname,
//         profilePicture,
//       });
//       console.log('✅ Google login successful:', response);
//       return response;
//     } catch (error) {
//       console.error('❌ Google Login Error:', error);
//       throw error;
//     }
//   },

//   // Apple Login
//   appleLogin: async (appleId, email, fullname) => {
//     try {
//       console.log('🔐 Apple Login:', { appleId, email, fullname });
//       const response = await apiClient.post('/auth/apple-login', {
//         appleId,
//         email,
//         fullname,
//         profilePicture: null,
//       });
//       console.log('✅ Apple login successful:', response);
//       return response;
//     } catch (error) {
//       console.error('❌ Apple Login Error:', error);
//       throw error;
//     }
//   },

//   // Get Current User
//   getCurrentUser: async () => {
//     try {
//       const response = await apiClient.get('/auth/me');
//       return response;
//     } catch (error) {
//       console.error('❌ Get User Error:', error);
//       throw error;
//     }
//   },

//   // Logout
//   logout: async () => {
//     try {
//       const response = await apiClient.post('/auth/logout');

//       // Also sign out from Firebase
//       await auth.signOut();

//       return response;
//     } catch (error) {
//       console.error('❌ Logout Error:', error);
//       throw error;
//     }
//   },

//   // Update FCM Token
//   updateFCMToken: async (fcmToken) => {
//     try {
//       const response = await apiClient.put('/users/fcm-token', { fcmToken });
//       return response;
//     } catch (error) {
//       console.error('❌ Update FCM Token Error:', error);
//       throw error;
//     }
//   },
// };

import apiClient from './apiClient';

export const authApi = {
  // Send OTP
  sendOTP: async (mobile) => {
    try {
      console.log('🔐 Sending OTP to:', mobile);
      const response = await apiClient.post('/auth/send-otp', { mobile });
      console.log('✅ OTP sent successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Send OTP Error:', error);
      throw error;
    }
  },

  // Verify OTP
  verifyOTP: async (mobile, otp, rememberMe = false) => {
    try {
      console.log('🔐 Verifying OTP:', { mobile, otp, rememberMe });
      const response = await apiClient.post('/auth/verify-otp', { mobile, otp, rememberMe });
      console.log('✅ OTP verified successfully:', response);
      return response;
    } catch (error) {
      console.error('❌ Verify OTP Error:', error);
      throw error;
    }
  },

  // Complete Registration
  completeRegistration: async (fullname, email, languagePreference, dateOfBirth, gender) => {
    try {
      console.log('📝 Completing registration:', { fullname, email, languagePreference });
      const response = await apiClient.post('/auth/complete-registration', {
        fullname,
        email,
        languagePreference,
        dateOfBirth,
        gender,
      });
      console.log('✅ Registration completed:', response);
      return response;
    } catch (error) {
      console.error('❌ Registration Error:', error);
      throw error;
    }
  },

  // Google Login
  googleLogin: async (googleId, email, fullname, profilePicture) => {
    try {
      console.log('🔐 Google Login:', { googleId, email, fullname });
      const response = await apiClient.post('/auth/google-login', {
        googleId,
        email,
        fullname,
        profilePicture,
      });
      console.log('✅ Google login successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Google Login Error:', error);
      throw error;
    }
  },

  // Apple Login
  appleLogin: async (appleId, email, fullname) => {
    try {
      console.log('🔐 Apple Login:', { appleId, email, fullname });
      const response = await apiClient.post('/auth/apple-login', {
        appleId,
        email,
        fullname,
        profilePicture: null,
      });
      console.log('✅ Apple login successful:', response);
      return response;
    } catch (error) {
      console.error('❌ Apple Login Error:', error);
      throw error;
    }
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response;
    } catch (error) {
      console.error('❌ Get User Error:', error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await apiClient.post('/auth/logout');
      return response;
    } catch (error) {
      console.error('❌ Logout Error:', error);
      throw error;
    }
  },

  // Update FCM Token
  updateFCMToken: async (fcmToken) => {
    try {
      const response = await apiClient.put('/users/fcm-token', { fcmToken });
      return response;
    } catch (error) {
      console.error('❌ Update FCM Token Error:', error);
      throw error;
    }
  },
};
