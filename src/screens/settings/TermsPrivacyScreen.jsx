// FILE: src/screens/settings/TermsPrivacyScreen.jsx
// Terms & Privacy Screen
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
        <Text style={styles.lastUpdated}>Last updated: June 24, 2025</Text>

        <Text style={styles.introText}>
          At GlaucoCare, we are committed to protecting your personal data and ensuring transparency
          in how we collect, use, and safeguard your information.
        </Text>

        <Text style={styles.sectionTitle}>Terms of Use</Text>

        <Text style={styles.subSectionTitle}>1. App Usage</Text>
        <Text style={styles.bodyText}>
          GlaucoCare is a wellness platform for educational and tracking purposes. It does not
          replace professional medical advice.
        </Text>

        <Text style={styles.subSectionTitle}>2. User Responsibilities</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Keep your login information secure</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Do not share false or harmful content</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Use the app respectfully within the community</Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>3. Content Ownership</Text>
        <Text style={styles.bodyText}>
          Any stories or content you upload remain yours, but we may feature them (with your
          permission) in the community section.
        </Text>

        <Text style={styles.subSectionTitle}>4. Updates & Changes</Text>
        <Text style={styles.bodyText}>
          We may update our terms occasionally. You will be notified within the app when updates are
          published.
        </Text>

        <Text style={styles.sectionTitle}>Privacy Policy</Text>

        <Text style={styles.subSectionTitle}>1. Data Collection</Text>
        <Text style={styles.bodyText}>
          We collect personal information (name, email, phone), health data (medications,
          appointments), and usage data to improve your experience.
        </Text>

        <Text style={styles.subSectionTitle}>2. Data Usage</Text>
        <Text style={styles.bodyText}>
          Your data is used to provide personalized reminders, track health progress, and offer
          relevant educational content.
        </Text>

        <Text style={styles.subSectionTitle}>3. Data Security</Text>
        <Text style={styles.bodyText}>
          We use industry-standard encryption and secure servers to protect your information. We
          never sell your personal data to third parties.
        </Text>

        <Text style={styles.subSectionTitle}>4. Your Rights</Text>
        <View style={styles.bulletList}>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Access your data at any time</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Request data deletion</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Export your information</Text>
          </View>
          <View style={styles.bulletItem}>
            <Text style={styles.bullet}>•</Text>
            <Text style={styles.bulletText}>Opt-out of non-essential notifications</Text>
          </View>
        </View>

        <Text style={styles.subSectionTitle}>5. Cookies & Tracking</Text>
        <Text style={styles.bodyText}>
          We use minimal tracking for analytics to improve app performance. You can disable this in
          Settings.
        </Text>

        <Text style={styles.subSectionTitle}>6. Contact Us</Text>
        <Text style={styles.bodyText}>
          For privacy concerns or data requests, email us at privacy@glaucocare.com
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
