// FILE: src/screens/auth/LanguageSelectionScreen.jsx
// Updated Language Selection (Remove back button for first time users)
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
const languages = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
  { code: 'gu', label: 'Gujrati' },
];

const LanguageSelectionScreen = ({ navigation }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleConfirm = async () => {
    await AsyncStorage.setItem('selectedLanguage', selectedLanguage);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.header}>
        <View style={{ width: 40 }} />
        <Text style={styles.headerTitle}>Select Language</Text>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Choose Your Language</Text>
        <Text style={styles.subtitle}>Please select your preferred language</Text>

        <View style={styles.languageList}>
          {languages.map((language) => (
            <TouchableOpacity
              key={language.code}
              style={[
                styles.languageCard,
                selectedLanguage === language.code && styles.languageCardSelected,
              ]}
              onPress={() => setSelectedLanguage(language.code)}>
              <Text
                style={[
                  styles.languageText,
                  selectedLanguage === language.code && styles.languageTextSelected,
                ]}>
                {language.label}
              </Text>
              {selectedLanguage === language.code && (
                <Ionicons name="checkmark-circle" size={24} color={colors.primaryDark} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
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
    marginBottom: 32,
  },
  languageList: {
    gap: 16,
  },
  languageCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: colors.primaryDark,
  },
  languageText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
  },
  languageTextSelected: {
    color: colors.primaryDark,
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 32,
  },
  confirmButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default LanguageSelectionScreen;
