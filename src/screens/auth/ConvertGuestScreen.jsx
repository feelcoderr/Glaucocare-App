// FILE: src/screens/auth/ConvertGuestScreen.jsx
// UPDATED VERSION - Flows to RegistrationScreen after OTP verification
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { convertGuestToUser, sendOTP } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';

const ConvertGuestScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { isLoading, requiresRegistration } = useSelector((state) => state.auth);

  // Get the screen user was trying to access (if redirected)
  const { returnTo } = route?.params || {};

  const [step, setStep] = useState(1); // 1: Mobile, 2: OTP
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');

  // Listen for requiresRegistration flag
  useEffect(() => {
    if (requiresRegistration === true) {
      console.log('✅ Profile incomplete - redirecting to registration');
      navigation.replace('Registration');
    } else if (requiresRegistration === false) {
      console.log('✅ Profile complete - redirecting to main');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Main' }],
      });
    }
  }, [requiresRegistration, navigation]);

  const handleSendOtp = async () => {
    if (mobile.length !== 10) {
      Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit mobile number');
      return;
    }

    try {
      console.log('📱 Sending OTP to:', `+91${mobile}`);
      await dispatch(sendOTP(mobile)).unwrap();
      setStep(2);
    } catch (error) {
      console.error('❌ Send OTP error:', error);
      Alert.alert('Error', error.message || 'Failed to send OTP');
    }
  };

  const handleVerifyAndConvert = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP');
      return;
    }

    try {
      console.log('🔐 Verifying OTP and converting guest...');

      // This will verify OTP and convert guest to user
      const result = await dispatch(
        convertGuestToUser({
          mobile,
          otp,
        })
      ).unwrap();

      console.log('✅ Convert result:', result);

      // Backend should return requiresRegistration: true
      // This will trigger the useEffect above to navigate to Registration
    } catch (error) {
      console.error('❌ Verification error:', error);
      Alert.alert('Verification Failed', error.message || 'Invalid OTP. Please try again.');
    }
  };

  const handleSkip = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }],
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Account</Text>
        <View style={{ width: 24 }} />
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.iconContainer}>
              <Ionicons name="person-add" size={64} color={colors.primaryDark} />
            </View>
            <Text style={styles.title}>Unlock All Features</Text>
            <Text style={styles.subtitle}>
              Create an account to save reminders, upload documents.
            </Text>
            {/* ✅ UPDATED: Show benefits
        <View style={styles.benefitsContainer}>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.benefitText}>Save & sync your health data</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.benefitText}>Set medication reminders</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.benefitText}>Upload & manage documents</Text>
          </View>
          <View style={styles.benefitItem}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.benefitText}>Track your health progress</Text>
          </View>
        </View> */}
            {step === 1 ? (
              // Step 1: Mobile Number
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Mobile Number</Text>
                  <View style={styles.inputWrapper}>
                    <Text style={styles.countryCode}>+91</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Enter mobile number"
                      placeholderTextColor={colors.textSecondary}
                      keyboardType="phone-pad"
                      value={mobile}
                      onChangeText={setMobile}
                      maxLength={10}
                      autoFocus
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (isLoading || mobile.length !== 10) && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleSendOtp}
                  disabled={isLoading || mobile.length !== 10}>
                  {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Send OTP</Text>
                  )}
                </TouchableOpacity>
              </>
            ) : (
              // Step 2: OTP Verification
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Enter OTP</Text>
                  <Text style={styles.sublabel}>Sent to +91{mobile}</Text>
                  <TextInput
                    style={styles.otpInput}
                    placeholder="000000"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="number-pad"
                    value={otp}
                    onChangeText={setOtp}
                    maxLength={6}
                    autoFocus
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (isLoading || otp.length !== 6) && styles.primaryButtonDisabled,
                  ]}
                  onPress={handleVerifyAndConvert}
                  disabled={isLoading || otp.length !== 6}>
                  {isLoading ? (
                    <ActivityIndicator color={colors.white} />
                  ) : (
                    <Text style={styles.primaryButtonText}>Verify & Continue</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={() => {
                    setStep(1);
                    setOtp('');
                  }}>
                  <Text style={styles.secondaryButtonText}>Change Number</Text>
                </TouchableOpacity>
              </>
            )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  iconContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  scrollView: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  benefitsContainer: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    flex: 1,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  sublabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  countryCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 56,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  otpInput: {
    height: 56,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    letterSpacing: 8,
    backgroundColor: colors.white,
    fontFamily: 'Poppins_600SemiBold',
  },
  primaryButton: {
    backgroundColor: colors.primaryDark,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: colors.primaryDark,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  resendButtonText: {
    color: colors.primaryDark,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
  skipButton: {
    marginTop: 24,
    alignItems: 'center',
  },
  skipButtonText: {
    color: colors.textSecondary,
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
  },
});

export default ConvertGuestScreen;
