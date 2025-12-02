// // src/screens/auth/LoginScreen.js

// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   ScrollView,
//   KeyboardAvoidingView,
//   Platform,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import {
//   useGoogleAuth,
//   handleGoogleSignIn,
//   handleAppleSignIn,
//   getAvailableAuthMethods,
// } from '../../services/auth/socialAuthService';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   googleLogin,
//   appleLogin,
//   sendOTP,
//   verifyOTP,
//   clearError,
//   clearOTPSent,
//   guestLogin,
// } from '../../store/slices/authSlice';
// import { Ionicons } from '@expo/vector-icons';
// import { colors } from '../../styles/colors';
// import { Image } from 'react-native';
// import getDeviceId from '../../services/utils/getDeviceId';
// import authApi from '../../services/api/authApi';

// const LoginScreen = ({ navigation }) => {
//   const dispatch = useDispatch();
//   const { isLoading, error, otpSent, confirmationResult, requiresRegistration, isAuthenticated } =
//     useSelector((state) => state.auth);

//   const [mobile, setMobile] = useState('');
//   const [isGuestLoading, setIsGuestLoading] = useState(false);
//   const [otp, setOtp] = useState(['', '', '', '', '', '']);
//   const [rememberMe, setRememberMe] = useState(false);
//   const [recaptchaVerifier, setRecaptchaVerifier] = useState(null);
//   const [availableAuthMethods, setAvailableAuthMethods] = useState({
//     google: true,
//     apple: false,
//   });

//   const otpInputs = useRef([]);

//   // Google Auth Setup
//   const { request, response, promptAsync } = useGoogleAuth();

//   // Initialize reCAPTCHA on mount
//   useEffect(() => {
//     try {
//       const verifier = authApi.setupRecaptcha('recaptcha-container');
//       setRecaptchaVerifier(verifier);
//       console.log('✅ reCAPTCHA initialized');
//     } catch (error) {
//       console.error('❌ reCAPTCHA initialization error:', error);
//     }

//     return () => {
//       // Cleanup
//       if (recaptchaVerifier) {
//         recaptchaVerifier.clear();
//       }
//     };
//   }, []);

//   // Handle errors
//   useEffect(() => {
//     if (error) {
//       const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

//       Alert.alert('Error', errorMessage, [
//         {
//           text: 'OK',
//           onPress: () => dispatch(clearError()),
//         },
//       ]);
//     }
//   }, [error]);

//   // Handle navigation after authentication
//   useEffect(() => {
//     if (requiresRegistration === true) {
//       navigation.navigate('Registration');
//     } else if (isAuthenticated === true) {
//       navigation.navigate('NotificationPermission');
//     }
//   }, [requiresRegistration, isAuthenticated]);

//   // Handle Send OTP
//   const handleSendOTP = async () => {
//     if (mobile.length !== 10) {
//       Alert.alert('Error', 'Please enter a valid 10-digit mobile number');
//       return;
//     }

//     if (!recaptchaVerifier) {
//       Alert.alert('Error', 'reCAPTCHA not initialized. Please try again');
//       return;
//     }

//     console.log('📱 Sending OTP for mobile:', mobile);

//     try {
//       await dispatch(sendOTP({ mobile, recaptchaVerifier })).unwrap();
//       Alert.alert('Success', 'OTP sent successfully to your mobile number');
//     } catch (error) {
//       console.error('❌ Send OTP failed:', error);
//     }
//   };

//   // Handle OTP input change
//   const handleOTPChange = (value, index) => {
//     // Only allow numbers
//     if (value && !/^\d+$/.test(value)) return;

//     const newOTP = [...otp];
//     newOTP[index] = value;
//     setOtp(newOTP);

//     // Auto-focus next input
//     if (value && index < 5) {
//       otpInputs.current[index + 1]?.focus();
//     }
//   };

//   // Handle backspace
//   const handleKeyPress = (e, index) => {
//     if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
//       otpInputs.current[index - 1]?.focus();
//     }
//   };

//   // Handle Verify OTP and Login
//   const handleLogin = async () => {
//     const otpCode = otp.join('');

//     if (otpCode.length !== 6) {
//       Alert.alert('Error', 'Please enter complete OTP');
//       return;
//     }

//     if (!confirmationResult) {
//       Alert.alert('Error', 'Please request OTP first');
//       return;
//     }

//     console.log('🔐 Verifying OTP:', otpCode);

//     try {
//       await dispatch(
//         verifyOTP({
//           confirmationResult,
//           otp: otpCode,
//           rememberMe,
//         })
//       ).unwrap();
//     } catch (error) {
//       console.error('❌ Verify OTP failed:', error);
//       // Reset OTP inputs on error
//       setOtp(['', '', '', '', '', '']);
//       otpInputs.current[0]?.focus();
//     }
//   };

//   // Handle Resend OTP
//   const handleResendOTP = async () => {
//     if (!recaptchaVerifier) {
//       Alert.alert('Error', 'reCAPTCHA not initialized. Please refresh the app');
//       return;
//     }

//     // Clear previous OTP
//     setOtp(['', '', '', '', '', '']);
//     dispatch(clearOTPSent());

//     // Send new OTP
//     setTimeout(() => {
//       handleSendOTP();
//     }, 500);
//   };

//   // Handle Guest Login
//   const handleGuestLogin = async () => {
//     setIsGuestLoading(true);
//     try {
//       const deviceId = await getDeviceId();
//       await dispatch(guestLogin(deviceId)).unwrap();
//       navigation.replace('MainTabs');
//     } catch (error) {
//       Alert.alert('Error', error.message || 'Guest login failed');
//     } finally {
//       setIsGuestLoading(false);
//     }
//   };

//   // Check available auth methods
//   useEffect(() => {
//     const checkAuthMethods = async () => {
//       const methods = await getAvailableAuthMethods();
//       setAvailableAuthMethods(methods);
//     };
//     checkAuthMethods();
//   }, []);

//   // Handle Google Sign-In Response
//   useEffect(() => {
//     if (response?.type === 'success') {
//       handleGoogleResponse();
//     }
//   }, [response]);

//   const handleGoogleResponse = async () => {
//     try {
//       const result = await handleGoogleSignIn(promptAsync);

//       if (result.success) {
//         const { googleId, email, fullname, profilePicture } = result.user;

//         await dispatch(
//           googleLogin({
//             googleId,
//             email,
//             fullname,
//             profilePicture,
//           })
//         ).unwrap();

//         console.log('✅ Google Login Successful');
//       } else {
//         Alert.alert('Error', result.error);
//       }
//     } catch (error) {
//       console.error('❌ Google Login Error:', error);
//       Alert.alert('Error', error.message || 'Google Sign-In failed');
//     }
//   };

//   const handleGooglePress = async () => {
//     try {
//       console.log('🔐 Google Sign-In Button Pressed');

//       if (!request) {
//         Alert.alert('Error', 'Google Sign-In is not ready. Please try again.');
//         return;
//       }

//       const result = await promptAsync();

//       if (result?.type === 'success') {
//         await handleGoogleResponse();
//       }
//     } catch (error) {
//       console.error('❌ Google Sign-In Error:', error);
//       Alert.alert('Error', 'Failed to sign in with Google');
//     }
//   };

//   const handleApplePress = async () => {
//     try {
//       console.log('🍎 Apple Sign-In Button Pressed');

//       if (!availableAuthMethods.apple) {
//         Alert.alert('Not Available', 'Apple Sign-In is not available on this device');
//         return;
//       }

//       const result = await handleAppleSignIn();

//       if (result.success) {
//         const { appleId, email, fullname } = result.user;

//         await dispatch(
//           appleLogin({
//             appleId,
//             email: email || `${appleId}@privaterelay.appleid.com`,
//             fullname: fullname || 'Apple User',
//           })
//         ).unwrap();

//         console.log('✅ Apple Login Successful');
//       } else {
//         if (result.error !== 'Sign-in was cancelled') {
//           Alert.alert('Error', result.error);
//         }
//       }
//     } catch (error) {
//       console.error('❌ Apple Login Error:', error);
//       Alert.alert('Error', error.message || 'Apple Sign-In failed');
//     }
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       {/* Hidden reCAPTCHA container */}
//       <View id="recaptcha-container" style={{ display: 'none' }} />

//       <KeyboardAvoidingView
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         style={styles.keyboardView}>
//         <ScrollView
//           contentContainerStyle={styles.scrollContent}
//           keyboardShouldPersistTaps="handled"
//           showsVerticalScrollIndicator={false}>
//           {/* Logo/Header */}
//           <View style={styles.header}>
//             <Image
//               source={require('../../assets/images/logo.png')} // Add your logo
//               style={styles.logo}
//               resizeMode="contain"
//             />
//             <Text style={styles.title}>Welcome Back</Text>
//             <Text style={styles.subtitle}>
//               {otpSent ? 'Enter the OTP sent to your phone' : 'Sign in to continue'}
//             </Text>
//           </View>

//           {/* Phone Input or OTP Input */}
//           {!otpSent ? (
//             <View style={styles.inputContainer}>
//               <Text style={styles.label}>Mobile Number</Text>
//               <View style={styles.phoneInputWrapper}>
//                 <Text style={styles.countryCode}>+91</Text>
//                 <TextInput
//                   style={styles.phoneInput}
//                   placeholder="Enter 10-digit mobile number"
//                   keyboardType="phone-pad"
//                   maxLength={10}
//                   value={mobile}
//                   onChangeText={setMobile}
//                   editable={!isLoading}
//                 />
//               </View>

//               {/* Remember Me */}
//               <TouchableOpacity
//                 style={styles.rememberMeContainer}
//                 onPress={() => setRememberMe(!rememberMe)}
//                 activeOpacity={0.7}>
//                 <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
//                   {rememberMe && <Ionicons name="checkmark" size={16} color="white" />}
//                 </View>
//                 <Text style={styles.rememberMeText}>Remember me for 30 days</Text>
//               </TouchableOpacity>

//               {/* Send OTP Button */}
//               <TouchableOpacity
//                 style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
//                 onPress={handleSendOTP}
//                 disabled={isLoading}>
//                 {isLoading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text style={styles.primaryButtonText}>Send OTP</Text>
//                 )}
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.otpContainer}>
//               <Text style={styles.label}>Enter OTP</Text>
//               <Text style={styles.otpSentText}>OTP sent to +91 {mobile}</Text>

//               {/* OTP Input Boxes */}
//               <View style={styles.otpInputsWrapper}>
//                 {otp.map((digit, index) => (
//                   <TextInput
//                     key={index}
//                     ref={(ref) => (otpInputs.current[index] = ref)}
//                     style={styles.otpInput}
//                     value={digit}
//                     onChangeText={(value) => handleOTPChange(value, index)}
//                     onKeyPress={(e) => handleKeyPress(e, index)}
//                     keyboardType="number-pad"
//                     maxLength={1}
//                     selectTextOnFocus
//                     editable={!isLoading}
//                   />
//                 ))}
//               </View>

//               {/* Resend OTP */}
//               <TouchableOpacity
//                 style={styles.resendButton}
//                 onPress={handleResendOTP}
//                 disabled={isLoading}>
//                 <Text style={styles.resendButtonText}>Resend OTP</Text>
//               </TouchableOpacity>

//               {/* Verify Button */}
//               <TouchableOpacity
//                 style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
//                 onPress={handleLogin}
//                 disabled={isLoading}>
//                 {isLoading ? (
//                   <ActivityIndicator color="white" />
//                 ) : (
//                   <Text style={styles.primaryButtonText}>Verify & Login</Text>
//                 )}
//               </TouchableOpacity>

//               {/* Change Number */}
//               <TouchableOpacity
//                 style={styles.changeNumberButton}
//                 onPress={() => {
//                   dispatch(clearOTPSent());
//                   setOtp(['', '', '', '', '', '']);
//                 }}
//                 disabled={isLoading}>
//                 <Text style={styles.changeNumberText}>Change Mobile Number</Text>
//               </TouchableOpacity>
//             </View>
//           )}

//           {/* Divider */}
//           <View style={styles.divider}>
//             <View style={styles.dividerLine} />
//             <Text style={styles.dividerText}>OR</Text>
//             <View style={styles.dividerLine} />
//           </View>

//           {/* Social Login Buttons */}
//           <View style={styles.socialButtonsContainer}>
//             {/* Google Sign In */}
//             <TouchableOpacity
//               style={styles.socialButton}
//               onPress={handleGooglePress}
//               disabled={isLoading}>
//               <Ionicons name="logo-google" size={24} color="#DB4437" />
//               <Text style={styles.socialButtonText}>Continue with Google</Text>
//             </TouchableOpacity>

//             {/* Apple Sign In */}
//             {availableAuthMethods.apple && (
//               <TouchableOpacity
//                 style={[styles.socialButton, styles.appleButton]}
//                 onPress={handleApplePress}
//                 disabled={isLoading}>
//                 <Ionicons name="logo-apple" size={24} color="white" />
//                 <Text style={[styles.socialButtonText, styles.appleButtonText]}>
//                   Continue with Apple
//                 </Text>
//               </TouchableOpacity>
//             )}
//           </View>

//           {/* Guest Login */}
//           <TouchableOpacity
//             style={styles.guestButton}
//             onPress={handleGuestLogin}
//             disabled={isGuestLoading || isLoading}>
//             {isGuestLoading ? (
//               <ActivityIndicator color={colors.primary} />
//             ) : (
//               <>
//                 <Ionicons name="person-outline" size={20} color={colors.primary} />
//                 <Text style={styles.guestButtonText}>Continue as Guest</Text>
//               </>
//             )}
//           </TouchableOpacity>

//           {/* Terms and Privacy */}
//           <View style={styles.footer}>
//             <Text style={styles.footerText}>
//               By continuing, you agree to our <Text style={styles.link}>Terms of Service</Text> and{' '}
//               <Text style={styles.link}>Privacy Policy</Text>
//             </Text>
//           </View>
//         </ScrollView>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
//   keyboardView: {
//     flex: 1,
//   },
//   scrollContent: {
//     flexGrow: 1,
//     paddingHorizontal: 24,
//     paddingVertical: 20,
//   },
//   header: {
//     alignItems: 'center',
//     marginBottom: 40,
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 28,
//     fontWeight: 'bold',
//     color: colors.text,
//     marginBottom: 8,
//   },
//   subtitle: {
//     fontSize: 16,
//     color: colors.textSecondary,
//     textAlign: 'center',
//   },
//   inputContainer: {
//     marginBottom: 24,
//   },
//   label: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//     marginBottom: 8,
//   },
//   phoneInputWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     paddingHorizontal: 16,
//     backgroundColor: '#f8f9fa',
//   },
//   countryCode: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//     marginRight: 8,
//   },
//   phoneInput: {
//     flex: 1,
//     height: 56,
//     fontSize: 16,
//     color: colors.text,
//   },
//   rememberMeContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   checkbox: {
//     width: 24,
//     height: 24,
//     borderWidth: 2,
//     borderColor: colors.border,
//     borderRadius: 6,
//     marginRight: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   checkboxChecked: {
//     backgroundColor: colors.primary,
//     borderColor: colors.primary,
//   },
//   rememberMeText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   otpContainer: {
//     marginBottom: 24,
//   },
//   otpSentText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//     marginBottom: 20,
//     textAlign: 'center',
//   },
//   otpInputsWrapper: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     marginBottom: 16,
//   },
//   otpInput: {
//     width: 50,
//     height: 56,
//     borderWidth: 1,
//     borderColor: colors.border,
//     borderRadius: 12,
//     textAlign: 'center',
//     fontSize: 24,
//     fontWeight: '600',
//     color: colors.text,
//     backgroundColor: '#f8f9fa',
//   },
//   resendButton: {
//     alignSelf: 'center',
//     marginBottom: 20,
//   },
//   resendButtonText: {
//     fontSize: 14,
//     color: colors.primary,
//     fontWeight: '600',
//   },
//   changeNumberButton: {
//     alignSelf: 'center',
//     marginTop: 12,
//   },
//   changeNumberText: {
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   primaryButton: {
//     backgroundColor: colors.primary,
//     height: 56,
//     borderRadius: 12,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 16,
//   },
//   buttonDisabled: {
//     opacity: 0.6,
//   },
//   primaryButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: 'white',
//   },
//   divider: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 24,
//   },
//   dividerLine: {
//     flex: 1,
//     height: 1,
//     backgroundColor: colors.border,
//   },
//   dividerText: {
//     marginHorizontal: 16,
//     fontSize: 14,
//     color: colors.textSecondary,
//   },
//   socialButtonsContainer: {
//     marginBottom: 16,
//   },
//   socialButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 56,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.border,
//     backgroundColor: 'white',
//     marginBottom: 12,
//   },
//   appleButton: {
//     backgroundColor: '#000',
//     borderColor: '#000',
//   },
//   socialButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.text,
//     marginLeft: 12,
//   },
//   appleButtonText: {
//     color: 'white',
//   },
//   guestButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     justifyContent: 'center',
//     height: 56,
//     borderRadius: 12,
//     borderWidth: 1,
//     borderColor: colors.primary,
//     backgroundColor: 'white',
//     marginBottom: 24,
//   },
//   guestButtonText: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: colors.primary,
//     marginLeft: 8,
//   },
//   footer: {
//     alignItems: 'center',
//     paddingBottom: 20,
//   },
//   footerText: {
//     fontSize: 12,
//     color: colors.textSecondary,
//     textAlign: 'center',
//     lineHeight: 18,
//   },
//   link: {
//     color: colors.primary,
//     fontWeight: '600',
//   },
// });

// export default LoginScreen;

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
    apple: false,
  });
  const otpInputs = useRef([]);
  // Google Auth Setup
  const { request, response, promptAsync } = useGoogleAuth();
  useEffect(() => {
    if (error) {
      // Show detailed error message
      const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';

      Alert.alert('Error', errorMessage, [
        {
          text: 'OK',
          onPress: () => dispatch(clearError()),
        },
      ]);
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
      navigation.replace('MainTabs');
    } catch (error) {
      alert(error.message || 'Guest login failed');
    } finally {
      setIsGuestLoading(false);
    }
  };

  const handleSkip = () => {
    // Guest mode - navigate to dashboard without auth
    navigation.navigate('Home');
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
      handleGoogleResponse();
    }
  }, [response]);

  const handleGoogleResponse = async () => {
    try {
      const result = await handleGoogleSignIn(promptAsync);

      if (result.success) {
        const { googleId, email, fullname, profilePicture } = result.user;

        // Dispatch Google Login action
        await dispatch(
          googleLogin({
            googleId,
            email,
            fullname,
            profilePicture,
          })
        ).unwrap();

        console.log('✅ Google Login Successful');
      } else {
        Alert.alert('Error', result.error);
      }
    } catch (error) {
      console.error('❌ Google Login Error:', error);
      Alert.alert('Error', error.message || 'Google Sign-In failed');
    }
  };

  const handleGooglePress = async () => {
    try {
      console.log('🔐 Google Sign-In Button Pressed');

      if (!request) {
        Alert.alert('Error', 'Google Sign-In is not ready. Please try again.');
        return;
      }

      const result = await promptAsync();

      if (result?.type === 'success') {
        await handleGoogleResponse();
      }
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
      console.error('❌ Apple Login Error:', error);
      Alert.alert('Error', error.message || 'Apple Sign-In failed');
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
});

export default LoginScreen;
