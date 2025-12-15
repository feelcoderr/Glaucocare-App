// FILE: src/screens/settings/SettingsScreen.jsx
// Settings Screen
// ============================================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { logout, deleteAccount } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { resetToLogin } from '../../components/navigation/navigationRef';
import notificationService from '../../services/notifications/notificationService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SettingsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user: dashboardUser } = useSelector((state) => state.dashboard);
  const { user: authUser } = useSelector((state) => state.auth);

  // Prefer dashboard user (has presigned URL) but fallback to auth user
  const user = dashboardUser || authUser;
  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: () => {
          dispatch(logout());
        },
      },
    ]);
  };

  const handleDeleteAccount = () => {
    const isGuest = user?.isGuest || false;

    Alert.alert(
      'Delete Account',
      isGuest
        ? 'Are you sure you want to delete your guest account? All your data will be permanently deleted.'
        : 'Are you sure you want to delete your account? This action cannot be undone. Your account will be deleted and all your data will be permanently deleted.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🗑️ Starting account deletion...');

              // Cancel all notifications
              // await notificationService.cancelAllNotifications();

              // Delete account via API
              // await dispatch(deleteAccount()).unwrap();

              // Clear all local storage
              await AsyncStorage.clear();

              // console.log('✅ Account deleted successfully');
              Linking.openURL('https://www.glaucocare.in/deleteaccount').catch((err) =>
                console.error('Failed to open delete account:', err)
              );
              // Show success message
              // Alert.alert(
              //   'Account Deleted',
              //   isGuest
              //     ? 'Your guest account has been deleted successfully.'
              //     : 'Your account has been deactivated successfully.',
              //   [
              //     {
              //       text: 'OK',
              //       onPress: () => {
              //         // Navigation will automatically happen due to RootNavigator
              //         // No need for manual navigation reset
              //       },
              //     },
              //   ]
              // );
            } catch (error) {
              console.error('❌ Delete account error:', error);
              Alert.alert('Error', error.message || 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderSettingItem = (icon, title, onPress, showChevron = true, iconColor = null) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={20} color={iconColor || colors.primaryDark} />
        </View>
        <Text style={styles.settingItemText}>{title}</Text>
      </View>
      {showChevron && <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />}
    </TouchableOpacity>
  );

  const renderSectionHeader = (title) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
          style={styles.profileCard}
          onPress={() => navigation.navigate('EditProfile')}
          activeOpacity={0.7}>
          <Image
            source={{
              uri:
                user?.profilePicture ||
                'https://res.cloudinary.com/datgoelws/image/upload/v1761806946/profile-imgage_lgtgih.jpg',
            }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.fullname || 'Guest'}</Text>
            <Text style={styles.profileEmail}>{user?.email || ''}</Text>
          </View>
        </TouchableOpacity>

        {/* Account Settings */}
        {renderSectionHeader('Account Settings')}
        <View style={styles.settingSection}>
          {renderSettingItem('person-outline', 'Profile Information', () =>
            navigation.navigate('EditProfile')
          )}

          {renderSettingItem('notifications-outline', 'Notification Preferences', () =>
            navigation.navigate('NotificationPreferences')
          )}
          {/* {renderSettingItem('language-outline', 'Language & Region', () =>
            navigation.navigate('LanguageSettings')
          )} */}
        </View>

        {/* Medical Settings */}
        {renderSectionHeader('Medical Settings:')}
        <View style={styles.settingSection}>
          {renderSettingItem('time-outline', 'Glaucoma Guide', () =>
            navigation.navigate('GlaucomaGuide', { slug: 'glaucoma-guide' })
          )}
          {renderSettingItem('clipboard-outline', 'Eye Health Assessment', () =>
            navigation.navigate('EyeHealthAssessment')
          )}
          {renderSettingItem('document-text', 'My document', () =>
            navigation.navigate('DocumentDashboardScreen')
          )}
        </View>

        {/* Support */}
        {renderSectionHeader('Support:')}
        <View style={styles.settingSection}>
          {renderSettingItem('help-circle-outline', 'Help & FAQ', () =>
            navigation.navigate('HelpFAQ')
          )}
          {renderSettingItem('headset-outline', 'Contact Support', () =>
            navigation.navigate('ContactSupport')
          )}
          {renderSettingItem('document-text-outline', 'Terms & Privacy', () =>
            navigation.navigate('TermsPrivacy')
          )}
          {renderSettingItem('information-circle-outline', 'About App', () =>
            navigation.navigate('AboutApp')
          )}
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#EF4444" />
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
          <Ionicons name="trash-outline" size={20} color="#EF4444" />
          <Text style={styles.deleteButtonText}>Delete Account</Text>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E3F2FD',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  settingSection: {
    backgroundColor: colors.white,
    marginHorizontal: 16,
    borderRadius: 16,
    marginBottom: 24,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingItemText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    flex: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Poppins_600SemiBold',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEE2E2',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default SettingsScreen;
