// FILE: src/screens/auth/NotificationPermissionScreen.jsx
// FIXED Notification Permission Screen (No Expo Push Token Errors)
// ============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const NotificationPermissionScreen = ({ navigation }) => {
  const handleAllowNotifications = async () => {
    // For now, just navigate to dashboard
    // Firebase notifications will be set up when you configure Firebase properly
    console.log('Notification permission requested');
    navigation.replace('App');
  };

  const handleMaybeLater = () => {
    navigation.replace('App');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <LinearGradient
          colors={['#2B3C8D', '#1672BC']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconCircle}>
          <Ionicons name="notifications" size={64} color={colors.white} />
        </LinearGradient>

        <Text style={styles.title}>Stay in the Loop</Text>
        <Text style={styles.subtitle}>Enable notifications to never miss important updates</Text>

        <View style={styles.featureList}>
          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="notifications-outline" size={24} color={colors.primaryDark} />
            </View>
            <Text style={styles.featureText}>Get instant updates on your activity</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="gift-outline" size={24} color={colors.primaryDark} />
            </View>
            <Text style={styles.featureText}>Stay informed about special offers</Text>
          </View>

          <View style={styles.featureItem}>
            <View style={styles.featureIconContainer}>
              <Ionicons name="alarm-outline" size={24} color={colors.primaryDark} />
            </View>
            <Text style={styles.featureText}>Receive important reminders</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.allowButton} onPress={handleAllowNotifications}>
            <Text style={styles.allowButtonText}>Allow Notifications</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleMaybeLater}>
            <Text style={styles.maybeLaterText}>May be Later</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
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
    textAlign: 'center',
    marginBottom: 48,
  },
  featureList: {
    width: '100%',
    gap: 24,
    marginBottom: 'auto',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  buttonContainer: {
    width: '100%',
    marginBottom: 32,
  },
  allowButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  allowButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  maybeLaterText: {
    textAlign: 'center',
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_400Regular',
  },
});

export default NotificationPermissionScreen;
