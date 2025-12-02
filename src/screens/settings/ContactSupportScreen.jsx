// FILE: src/screens/settings/ContactSupportScreen.jsx
// Contact Support Screen
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../styles/colors';

const ContactSupportScreen = ({ navigation }) => {
  const supportEmail = 'support@glaucocare.com';
  const supportPhone = '+91 9876543210';

  const handleSendEmail = () => {
    const subject = 'Support Request - GlaucoCare App';
    const body = 'Hello GlaucoCare Support Team,\n\nI need help with...\n\n';
    const mailtoUrl = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    Linking.canOpenURL(mailtoUrl)
      .then((supported) => {
        if (supported) {
          return Linking.openURL(mailtoUrl);
        } else {
          Alert.alert('Error', 'Email app is not available on this device');
        }
      })
      .catch((error) => {
        console.error('Email error:', error);
        Alert.alert('Error', 'Failed to open email app');
      });
  };

  const handleCallNow = () => {
    Alert.alert('Call Support', `Do you want to call ${supportPhone}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Call',
        onPress: () => {
          const phoneUrl = `tel:${supportPhone}`;
          Linking.canOpenURL(phoneUrl)
            .then((supported) => {
              if (supported) {
                return Linking.openURL(phoneUrl);
              } else {
                Alert.alert('Error', 'Phone app is not available on this device');
              }
            })
            .catch((error) => {
              console.error('Phone error:', error);
              Alert.alert('Error', 'Failed to open phone app');
            });
        },
      },
    ]);
  };

  const handleViewFAQs = () => {
    navigation.navigate('HelpFAQ');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Contact Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Contact Support</Text>
        <Text style={styles.subtitle}>We are here to help you with any issue or question.</Text>

        {/* Email Support Card */}
        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="mail" size={28} color={colors.primaryDark} />
            </View>
          </View>

          <Text style={styles.cardTitle}>Email Us</Text>
          <Text style={styles.cardDescription}>
            Send us your question and we will respond within 24 hours.
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleSendEmail}>
            <LinearGradient
              colors={[colors.primaryDark, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.actionButtonText}>Send Email</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Phone Support Card */}
        <View style={styles.supportCard}>
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="call" size={28} color={colors.primaryDark} />
            </View>
          </View>

          <Text style={styles.cardTitle}>Call Us</Text>
          <Text style={styles.cardDescription}>
            Reach our support team Monday–Saturday, 9AM–6PM.
          </Text>

          <TouchableOpacity style={styles.actionButton} onPress={handleCallNow}>
            <LinearGradient
              colors={[colors.primaryDark, colors.primaryLight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}>
              <Text style={styles.actionButtonText}>Call Now</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* View FAQs Link */}
        <TouchableOpacity style={styles.faqLink} onPress={handleViewFAQs}>
          <Text style={styles.faqLinkText}>View FAQs</Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryDark} />
        </TouchableOpacity>

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
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  supportCard: {
    backgroundColor: colors.white,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  actionButton: {
    width: '100%',
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  faqLink: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    paddingVertical: 16,
  },
  faqLinkText: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_600SemiBold',
    marginRight: 4,
  },
});

export default ContactSupportScreen;
