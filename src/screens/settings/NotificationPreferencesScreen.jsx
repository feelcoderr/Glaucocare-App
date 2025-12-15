// FILE: src/screens/settings/NotificationPreferencesScreen.jsx
// UPDATED - With Redux integration
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchPreferences,
  updatePreferences,
  turnOffAll,
  togglePreference,
} from '../../store/slices/notificationPreferencesSlice';
import { colors } from '../../styles/colors';

const NotificationPreferencesScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { preferences, isLoading, isSaving } = useSelector(
    (state) => state.notificationPreferences
  );

  const [expandedSection, setExpandedSection] = useState(null);

  useEffect(() => {
    // Fetch preferences on mount
    dispatch(fetchPreferences());
  }, []);

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggleSwitch = async (key) => {
    // Optimistic update
    dispatch(togglePreference(key));

    // Save to backend
    try {
      await dispatch(
        updatePreferences({
          [key]: !preferences[key],
        })
      ).unwrap();
    } catch (error) {
      // If fails, toggle back
      dispatch(togglePreference(key));
      Alert.alert('Error', 'Failed to update preference. Please try again.');
    }
  };

  const handleTurnAllOff = () => {
    Alert.alert('Turn All Off', 'Are you sure you want to turn off all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Turn Off',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(turnOffAll()).unwrap();
            Alert.alert('Success', 'All notifications turned off');
          } catch (error) {
            Alert.alert('Error', 'Failed to turn off notifications');
          }
        },
      },
    ]);
  };

  const renderNotificationItem = (icon, label, settingKey) => (
    <View style={styles.notificationItem} key={settingKey}>
      <View style={styles.notificationItemLeft}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
        <Text style={styles.notificationItemText}>{label}</Text>
      </View>
      <Switch
        value={preferences[settingKey]}
        onValueChange={() => handleToggleSwitch(settingKey)}
        trackColor={{ false: '#D1D5DB', true: colors.primaryDark }}
        thumbColor={colors.white}
        ios_backgroundColor="#D1D5DB"
        disabled={isSaving}
      />
    </View>
  );

  const sections = [
    {
      title: 'Medical Notifications',
      key: 'medical',
      items: [
        { icon: 'time-outline', label: 'Medication Reminders', key: 'medicationReminders' },
        { icon: 'eye-outline', label: 'Eye Checkup Alerts', key: 'eyeCheckupAlerts' },
      ],
    },
    {
      title: 'App & System',
      key: 'system',
      items: [
        { icon: 'download-outline', label: 'App Updates', key: 'appUpdates' },
        { icon: 'mail-outline', label: 'Feedback Requests', key: 'feedbackRequests' },
      ],
    },
    {
      title: 'Educational & Awareness',
      key: 'education',
      items: [
        { icon: 'newspaper-outline', label: 'New Blog Posts', key: 'newBlogPosts' },
        { icon: 'bulb-outline', label: 'Glaucoma Tips & Info', key: 'glaucomaTips' },
      ],
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notification Preferences</Text>
          <View style={{ width: 80 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primaryDark} />
          <Text style={styles.loadingText}>Loading preferences...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <TouchableOpacity onPress={handleTurnAllOff} disabled={isSaving}>
          <Text style={[styles.turnOffText, isSaving && styles.turnOffTextDisabled]}>
            Turn All Off
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {sections.map((section) => (
          <View key={section.key} style={styles.section}>
            <TouchableOpacity
              style={styles.sectionHeader}
              onPress={() => toggleSection(section.key)}
              activeOpacity={0.7}>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <Ionicons
                name={expandedSection === section.key ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            {expandedSection === section.key && (
              <View style={styles.sectionContent}>
                {section.items.map((item) =>
                  renderNotificationItem(item.icon, item.label, item.key)
                )}
              </View>
            )}
          </View>
        ))}
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Saving Indicator */}
      {isSaving && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color={colors.white} />
          <Text style={styles.savingText}>Saving...</Text>
        </View>
      )}
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  turnOffText: {
    fontSize: 14,
    color: '#EF4444',
    fontFamily: 'Poppins_500Medium',
  },
  turnOffTextDisabled: {
    opacity: 0.5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
  },
  scrollView: {
    flex: 1,
  },
  infoBanner: {
    flexDirection: 'row',
    backgroundColor: colors.primaryLight,
    margin: 16,
    padding: 12,
    borderRadius: 8,
    gap: 12,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 13,
    color: colors.primaryDark,
    fontFamily: 'Poppins_400Regular',
    lineHeight: 18,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionContent: {
    paddingVertical: 8,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  notificationItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    flex: 1,
  },
  savingIndicator: {
    position: 'absolute',
    bottom: 20,
    left: '50%',
    marginLeft: -50,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  savingText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: 'Poppins_500Medium',
  },
});

export default NotificationPreferencesScreen;
