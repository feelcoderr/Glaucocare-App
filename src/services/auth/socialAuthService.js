// FILE: src/services/auth/socialAuthService.js
// Social Authentication Service (Google & Apple)
// ============================================================================

import * as AppleAuthentication from 'expo-apple-authentication';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

// ============================================================================
// GOOGLE SIGN-IN CONFIGURATION
// ============================================================================

// Replace these with your actual Google OAuth Client IDs
const GOOGLE_CONFIG = {
  expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
  iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',
  androidClientId: '675216428598-td6flc3gvqh85grosck62k48crqigqog.apps.googleusercontent.com',
  webClientId: '675216428598-tik4d5ms4f2c4k8qu63o5p6hmhbtkju0.apps.googleusercontent.com',
};

// ============================================================================
// GOOGLE SIGN-IN
// ============================================================================

export const useGoogleAuth = () => {
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: GOOGLE_CONFIG.expoClientId,
    iosClientId: GOOGLE_CONFIG.iosClientId,
    androidClientId: GOOGLE_CONFIG.androidClientId,
    webClientId: GOOGLE_CONFIG.webClientId,
  });

  return { request, response, promptAsync };
};

export const handleGoogleSignIn = async (promptAsync) => {
  try {
    console.log('🔐 Starting Google Sign-In...');

    const result = await promptAsync();

    console.log('📥 Google Sign-In Result:', result);

    if (result?.type === 'success') {
      const { authentication } = result;

      // Fetch user info from Google
      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${authentication.accessToken}` },
      });

      const userInfo = await userInfoResponse.json();
      console.log('✅ Google User Info:', userInfo);

      return {
        success: true,
        user: {
          googleId: userInfo.id,
          email: userInfo.email,
          fullname: userInfo.name,
          profilePicture: userInfo.picture,
        },
      };
    } else if (result?.type === 'cancel') {
      console.log('❌ Google Sign-In Cancelled');
      return {
        success: false,
        error: 'Sign-in was cancelled',
      };
    } else {
      console.log('❌ Google Sign-In Error:', result);
      return {
        success: false,
        error: result?.error?.message || 'Sign-in failed',
      };
    }
  } catch (error) {
    console.error('❌ Google Sign-In Exception:', error);
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    };
  }
};

// ============================================================================
// APPLE SIGN-IN
// ============================================================================

export const isAppleAuthAvailable = async () => {
  try {
    return await AppleAuthentication.isAvailableAsync();
  } catch (error) {
    console.error('❌ Apple Auth Availability Check Error:', error);
    return false;
  }
};

export const handleAppleSignIn = async () => {
  try {
    console.log('🍎 Starting Apple Sign-In...');

    // Check if Apple Authentication is available
    const isAvailable = await isAppleAuthAvailable();

    if (!isAvailable) {
      return {
        success: false,
        error: 'Apple Sign-In is not available on this device',
      };
    }

    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    console.log('✅ Apple Credential:', credential);

    // Extract user info
    const { user, email, fullName } = credential;

    return {
      success: true,
      user: {
        appleId: user,
        email: email,
        fullname: fullName
          ? `${fullName.givenName || ''} ${fullName.familyName || ''}`.trim()
          : null,
      },
    };
  } catch (error) {
    console.error('❌ Apple Sign-In Error:', error);

    if (error.code === 'ERR_CANCELED') {
      return {
        success: false,
        error: 'Sign-in was cancelled',
      };
    }

    return {
      success: false,
      error: error.message || 'Apple Sign-In failed',
    };
  }
};

// ============================================================================
// HELPER: Get Platform-Specific Auth Methods
// ============================================================================

export const getAvailableAuthMethods = async () => {
  const methods = {
    google: true, // Google is available on all platforms
    apple: Platform.OS === 'ios' && (await isAppleAuthAvailable()),
  };

  console.log('📱 Available Auth Methods:', methods);
  return methods;
};
