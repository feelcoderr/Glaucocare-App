import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId:
    '762154220704-q6cm8l53seatd93ahd66dq632f8p999q.apps.googleusercontent.com',
  offlineAccess: true,
});

export const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();

    const { idToken } = await GoogleSignin.getTokens();

    return {
      success: true,
      idToken,
      user: userInfo.user,
    };
  } catch (error) {
    console.log('Google Sign-In Error:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};
