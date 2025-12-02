// FILE: src/screens/auth/RegistrationScreen.jsx
// Registration Screen (No Changes - Already Correct)
// ============================================================================

import React, { useState, useEffect } from 'react';
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { completeRegistration, clearError } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';

const RegistrationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    dateOfBirth: new Date(),
    gender: '',
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  useEffect(() => {
    if (error) {
      Alert.alert('Error', error);
      dispatch(clearError());
    }
  }, [error]);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.navigate('NotificationPermission');
    }
  }, [isAuthenticated]);

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData({ ...formData, dateOfBirth: selectedDate });
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleRegister = () => {
    if (!formData.firstName.trim()) {
      Alert.alert('Error', 'Please enter your first name');
      return;
    }
    if (!formData.lastName.trim()) {
      Alert.alert('Error', 'Please enter your last name');
      return;
    }
    if (!termsAccepted) {
      Alert.alert('Error', 'Please accept terms and conditions');
      return;
    }

    const fullname = `${formData.firstName.trim()} ${formData.lastName.trim()}`;
    dispatch(
      completeRegistration({
        fullname,
        email: formData.email.trim(),
        languagePreference: 'en',
        dateOfBirth: formData.dateOfBirth,
        gender: formData.gender,
      })
    );
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
            <Text style={styles.title}>Create Your</Text>
            <Text style={styles.title}>Glaucocare Account</Text>

            <View style={styles.form}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Loream"
                placeholderTextColor={colors.textSecondary}
                value={formData.firstName}
                onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              />

              <Text style={styles.label}>Last Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Loream"
                placeholderTextColor={colors.textSecondary}
                value={formData.lastName}
                onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              />

              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={[styles.input, styles.inputWithIcon]}
                  placeholder="demo@Example.Com"
                  placeholderTextColor={colors.textSecondary}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={formData.email}
                  onChangeText={(text) => setFormData({ ...formData, email: text })}
                />
                {formData.email && formData.email.includes('@') && (
                  <Ionicons
                    name="checkmark-circle"
                    size={24}
                    color="#10B981"
                    style={styles.inputIcon}
                  />
                )}
              </View>

              <Text style={styles.label}>Date of Birth</Text>
              <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
                <Text style={[styles.dateText, !formData.dateOfBirth && styles.placeholderText]}>
                  {formatDate(formData.dateOfBirth)}
                </Text>
                <Ionicons name="calendar-outline" size={24} color={colors.textSecondary} />
              </TouchableOpacity>

              {showDatePicker && (
                <DateTimePicker
                  value={formData.dateOfBirth}
                  mode="date"
                  display="default"
                  onChange={handleDateChange}
                  maximumDate={new Date()}
                />
              )}

              <Text style={styles.label}>Gender</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowGenderPicker(!showGenderPicker)}>
                <Text style={[styles.dateText, !formData.gender && styles.placeholderText]}>
                  {formData.gender || 'Select Gender'}
                </Text>
                <Ionicons
                  name={showGenderPicker ? 'chevron-up' : 'chevron-down'}
                  size={24}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>

              {showGenderPicker && (
                <View style={styles.genderPicker}>
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <TouchableOpacity
                      key={gender}
                      style={styles.genderOption}
                      onPress={() => {
                        setFormData({ ...formData, gender });
                        setShowGenderPicker(false);
                      }}>
                      <Text style={styles.genderOptionText}>{gender}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TouchableOpacity
                style={styles.termsContainer}
                onPress={() => setTermsAccepted(!termsAccepted)}>
                <View style={[styles.checkbox, termsAccepted && styles.checkboxChecked]}>
                  {termsAccepted && <Ionicons name="checkmark" size={16} color={colors.white} />}
                </View>
                <Text style={styles.termsText}>Terms & Conditions</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.registerButtonText}>Get Started</Text>
                )}
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
  },
  form: {
    flex: 1,
    marginTop: 32,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  inputContainer: {
    position: 'relative',
  },
  inputWithIcon: {
    paddingRight: 40,
  },
  inputIcon: {
    position: 'absolute',
    right: 0,
    bottom: 12,
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: colors.textSecondary,
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  genderPicker: {
    backgroundColor: colors.white,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  genderOption: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  genderOptionText: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    borderRadius: 4,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxChecked: {
    backgroundColor: colors.primaryDark,
  },
  termsText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  registerButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  registerButtonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default RegistrationScreen;
