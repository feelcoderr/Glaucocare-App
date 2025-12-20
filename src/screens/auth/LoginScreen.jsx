import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {
  useGoogleAuth,
  handleGoogleSignIn,
  handleAppleSignIn,
  getAvailableAuthMethods,
} from '../../services/auth/socialAuthService';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { googleLogin, appleLogin } from '../../store/slices/authSlice';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Ionicons } from '@expo/vector-icons';
import {
  sendOTP,
  verifyOTP,
  clearError,
  clearOTPSent,
  loginAsGuest,
  guestLogin,
  reactivateAccount,
  setAccountDeactivated,
} from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { Image } from 'react-native';
import getDeviceId from '../../services/utils/getDeviceId';
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error, otpSent, requiresRegistration, isAuthenticated } = useSelector(
    (state) => state.auth
  );
  const [mobile, setMobile] = useState('');
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [rememberMe, setRememberMe] = useState(false);
  const [availableAuthMethods, setAvailableAuthMethods] = useState({
    google: true,
    apple: true,
  });
  const otpInputs = useRef([]);
  // Google Auth Setup
  const { request, response, promptAsync } = useGoogleAuth();

  useEffect(() => {
    if (error) {
      const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';
      const statusCode = error.statusCode || error.status;

      // ✅ Check if it's a deactivation error
      if (
        statusCode === 403 ||
        errorMessage.toLowerCase().includes('deactivated') ||
        errorMessage.toLowerCase().includes('inactive')
      ) {
        dispatch(setAccountDeactivated(errorMessage));

        Alert.alert(
          'Account Deactivated',
          'Your account has been deactivated. Would you like to reactivate it?',
          [
            {
              text: 'Cancel',
              style: 'cancel',
              onPress: () => {
                dispatch(clearError());
              },
            },
            {
              text: 'Reactivate',
              onPress: () => handleReactivateAccount(),
            },
          ]
        );
      } else {
        console.log('❌ Regular error:', errorMessage);
        // Regular error handling
        Alert.alert('Error', errorMessage, [
          {
            text: 'OK',
            onPress: () => dispatch(clearError()),
          },
        ]);
      }
    }
  }, [error]);

  useEffect(() => {
    // Handle navigation after OTP verification
    if (requiresRegistration === true) {
      navigation.navigate('Registration');
    } else if (isAuthenticated === true) {
      navigation.navigate('NotificationPermission');
    }
  }, [requiresRegistration, isAuthenticated]);

  const handleReactivateAccount = async () => {
    const otpCode = otp.join('');

    // Check if OTP is already entered
    if (otpCode.length === 6) {
      try {
        console.log('🔄 Reactivating account with mobile:', mobile);
        await dispatch(reactivateAccount({ mobile, otp: otpCode })).unwrap();

        Alert.alert('Success', 'Your account has been reactivated successfully!', [
          {
            text: 'OK',
          },
        ]);
      } catch (error) {
        console.error('❌ Reactivation error:', error);
        Alert.alert('Error', error.message || 'Failed to reactivate account. Please try again.');
      }
    } else {
      // OTP not entered yet, prompt user to enter OTP
      Alert.alert(
        'Enter OTP',
        'Please enter the OTP sent to your mobile number to reactivate your account.',
        [
          {
            text: 'OK',
            onPress: () => {
              // Focus on first OTP input
              otpInputs.current[0]?.focus();
            },
          },
        ]
      );
    }
  };

  const handleSendOTP = () => {
    if (mobile.length !== 10) {
      Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
      return;
    }

    console.log('📱 Sending OTP for mobile:', mobile);
    dispatch(sendOTP(mobile));
  };

  const handleOTPChange = (value, index) => {
    const newOTP = [...otp];
    newOTP[index] = value;
    setOtp(newOTP);

    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const handleLogin = () => {
    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      Alert.alert('Error', 'Please enter complete OTP');
      return;
    }

    console.log('🔐 Verifying OTP:', otpCode);
    dispatch(verifyOTP({ mobile, otp: otpCode, rememberMe }));
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      // Get device ID (optional)
      const deviceId = await getDeviceId(); // You can use expo-device

      await dispatch(guestLogin(deviceId)).unwrap();

      // Navigate to main app
      navigation.replace('Main');
    } catch (error) {
      alert(error.message || 'Guest login failed');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSkip = () => {
    // Guest mode - navigate to dashboard without auth
    navigation.navigate('Main');
  };

  useEffect(() => {
    const checkAuthMethods = async () => {
      const methods = await getAvailableAuthMethods();
      setAvailableAuthMethods(methods);
    };
    checkAuthMethods();
  }, []);

  // Handle Google Sign-In Response
  useEffect(() => {
    if (response?.type === 'success') {
      processGoogleLogin(response);
    }

    if (response?.type === 'error') {
      Alert.alert('Google Sign-In Failed', response.error?.message);
    }
  }, [response]);

  const processGoogleLogin = async (response) => {
    try {
      const { accessToken } = response.authentication;

      const userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userInfo = await userInfoResponse.json();

      const { id, email, name, picture } = userInfo;

      await dispatch(
        googleLogin({
          googleId: id,
          email,
          fullname: name,
          profilePicture: picture,
        })
      ).unwrap();

      console.log('✅ Google Login Successful');
    } catch (error) {
      if (error.statusCode === 403 || error.message?.toLowerCase().includes('deactivated')) {
        Alert.alert(
          'Account Deactivated',
          'Your account has been deactivated. Please contact support.'
        );
      } else {
        Alert.alert('Error', error.message || 'Google Sign-In failed');
      }
    }
  };

  const handleGooglePress = async () => {
    try {
      console.log('🔐 Google Sign-In Button Pressed');

      if (!request) {
        Alert.alert('Error', 'Google Sign-In is not ready. Please try again.');
        return;
      }

      console.log('🔐 Opening Google Sign-In');
      await promptAsync();
    } catch (error) {
      console.error('❌ Google Sign-In Error:', error);
      Alert.alert('Error', 'Failed to sign in with Google');
    }
  };

  const handleApplePress = async () => {
    try {
      console.log('🍎 Apple Sign-In Button Pressed');

      if (!availableAuthMethods.apple) {
        Alert.alert('Not Available', 'Apple Sign-In is not available on this device');
        return;
      }

      const result = await handleAppleSignIn();

      if (result.success) {
        const { appleId, email, fullname } = result.user;

        // Dispatch Apple Login action
        await dispatch(
          appleLogin({
            appleId,
            email: email || `${appleId}@privaterelay.appleid.com`,
            fullname: fullname || 'Apple User',
          })
        ).unwrap();

        console.log('✅ Apple Login Successful');
      } else {
        if (result.error !== 'Sign-in was cancelled') {
          Alert.alert('Error', result.error);
        }
      }
    } catch (error) {
      // ✅ Check for deactivation error in Apple login
      if (error.statusCode === 403 || error.message?.toLowerCase().includes('deactivated')) {
        Alert.alert(
          'Account Deactivated',
          'Your account has been deactivated. Please contact support to reactivate your account.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', error.message || 'Apple Sign-In failed');
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          <View style={styles.content}>
            <Text style={styles.title}>Walcome to Glaucocare</Text>
            <Text style={styles.subtitle}>Good to see you! Lets get started.</Text>

            <View style={styles.form}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                style={styles.input}
                placeholder="9876543210"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                maxLength={10}
                value={mobile}
                onChangeText={setMobile}
                editable={!otpSent}
              />

              {otpSent && (
                <>
                  <Text style={styles.label}>Enter OTP</Text>
                  <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                      <TextInput
                        key={index}
                        ref={(ref) => (otpInputs.current[index] = ref)}
                        style={styles.otpInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        value={digit}
                        onChangeText={(value) => handleOTPChange(value, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                      />
                    ))}
                  </View>
                  <Text style={styles.otpHint}>Code sent to your mobile number</Text>
                </>
              )}

              {otpSent && (
                <TouchableOpacity
                  style={styles.rememberMeContainer}
                  onPress={() => setRememberMe(!rememberMe)}>
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Ionicons name="checkmark" size={16} color={colors.white} />}
                  </View>
                  <Text style={styles.rememberMeText}>Remember Me</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity
                style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                onPress={otpSent ? handleLogin : handleSendOTP}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.loginButtonText}>{otpSent ? 'Login' : 'Send OTP'}</Text>
                )}
              </TouchableOpacity>

              {/* {!otpSent && (
                <TouchableOpacity onPress={() => navigation.navigate('Registration')}>
                  <Text style={styles.createAccountText}>
                    New here? <Text style={styles.createAccountLink}>Create an account</Text>
                  </Text>
                </TouchableOpacity>
              )} */}

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                {/* Google Sign-In Button */}
                <TouchableOpacity
                  style={styles.socialButton}
                  onPress={handleGooglePress}
                  disabled={!request}>
                  <Image
                    style={{ width: 24, height: 24 }}
                    source={require('../../assets/images/google-logo.png')}
                  />
                </TouchableOpacity>

                {/* Apple Sign-In Button - Only show on iOS */}
                {availableAuthMethods.apple && (
                  <TouchableOpacity style={styles.socialButton} onPress={handleApplePress}>
                    <Image
                      style={{ width: 24, height: 24 }}
                      source={require('../../assets/images/apple-logo.png')}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <TouchableOpacity onPress={handleGuestLogin}>
                <Text style={styles.skipText}>Skip for now</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 16,
  },
  debugBox: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FFECB5',
  },
  debugText: {
    fontSize: 12,
    color: '#856404',
    fontFamily: 'Poppins_400Regular',
  },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  otpInput: {
    width: 50,
    height: 70,
    borderBottomWidth: 2,
    borderBottomColor: colors.textSecondary,
    textAlign: 'center',
    fontSize: 24,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  otpHint: {
    fontSize: 12,
    color: '#F59E0B',
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.textSecondary,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  rememberMeText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  loginButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  createAccountText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 24,
  },
  createAccountLink: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.textSecondary,
    opacity: 0.3,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    marginBottom: 24,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  skipText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    textDecorationLine: 'underline',
  },
  reactivateButton: {
    backgroundColor: colors.primaryDark,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 16,
    alignItems: 'center',
  },
  reactivateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  resendOTPButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  resendOTPText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default LoginScreen;
