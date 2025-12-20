// FILE: src/screens/settings/TermsPrivacyScreen.jsx
// Terms & Privacy Screen (Health & Fitness – Non-Medical)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const TermsPrivacyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms & Privacy</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.lastUpdated}>Last updated: December 20, 2025</Text>

        <Text style={styles.introText}>
          GlaucoCare is a Health & Fitness application designed for education, awareness, and
          personal organization related to eye health. This app is NOT a medical application and
          does NOT provide diagnosis, treatment, or medical advice.
        </Text>

        {/* ================= TERMS ================= */}

        <Text style={styles.sectionTitle}>Terms & Conditions</Text>

        <Text style={styles.subSectionTitle}>1. App Purpose</Text>
        <Text style={styles.bodyText}>
          GlaucoCare provides educational content about glaucoma and eye health, personal
          organization tools, reminders, and general eye wellness activities. The app is intended
          for learning, awareness, and convenience only.
        </Text>

        <Text style={styles.subSectionTitle}>2. Medical Disclaimer</Text>
        <Text style={styles.bodyText}>
          GlaucoCare does NOT diagnose, treat, cure, or prevent any medical condition. The app does
          NOT replace professional medical advice. Always consult a qualified ophthalmologist or
          healthcare professional for medical decisions.
        </Text>

        <Text style={styles.subSectionTitle}>3. Eligibility</Text>
        <Text style={styles.bodyText}>
          You must be at least 18 years old to use this app. Use by minors is not permitted.
        </Text>

        <Text style={styles.subSectionTitle}>4. User Responsibilities</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Use the app only for educational and organizational purposes
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>
              Do not rely on the app for medical decisions or diagnosis
            </Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Keep your account credentials secure</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Do not upload false, illegal, or harmful content</Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>5. Content Ownership</Text>
        <Text style={styles.bodyText}>
          Any personal documents or information you upload remain your property. These are stored
          only for your personal organization and are accessible only to you.
        </Text>

        <Text style={styles.subSectionTitle}>6. Updates & Changes</Text>
        <Text style={styles.bodyText}>
          We may update these Terms from time to time. When material changes are made, we will
          notify you within the app. Continued use of the app indicates acceptance of the updated
          Terms.
        </Text>

        {/* ================= PRIVACY ================= */}

        <Text style={styles.sectionTitle}>Privacy Policy</Text>

        <Text style={styles.subSectionTitle}>1. Data We Collect</Text>
        <Text style={styles.bodyText}>
          We collect personal information such as name, email address, phone number, gender
          (optional), and date of birth(optional). We also store user-entered health- related data
          like medication reminders, uploaded documents, and educational questionnaire responses.
        </Text>

        <Text style={styles.subSectionTitle}>2. How We Use Data</Text>
        <Text style={styles.bodyText}>
          Your data is used only to provide app functionality including reminders, document storage,
          educational content, and to improve app performance. We do NOT use your data for medical
          diagnosis or health assessment.
        </Text>

        <Text style={styles.subSectionTitle}>3. Data Protection</Text>
        <Text style={styles.bodyText}>
          We use industry-standard security practices including encryption and secure authentication
          to protect your information. We do NOT sell your personal data to third parties.
        </Text>

        <Text style={styles.subSectionTitle}>4. Your Privacy Rights</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Access and update your personal information</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Request account and data deletion</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Export your personal data</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Control notification permissions</Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>5. Contact Us</Text>
        <Text style={styles.bodyText}>
          For privacy concerns, data requests, or account deletion, contact us at:
          {'\n'}heli.desai.glaucocare@gmail.com
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  lastUpdated: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginBottom: 16,
  },
  introText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginTop: 16,
    marginBottom: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 16,
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
    marginBottom: 12,
  },
  bulletList: {
    marginBottom: 12,
  },
  bulletItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 16,
    color: colors.textPrimary,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 22,
  },
});

export default TermsPrivacyScreen;
