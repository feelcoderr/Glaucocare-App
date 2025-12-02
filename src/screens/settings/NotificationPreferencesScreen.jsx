// FILE: src/screens/settings/NotificationPreferencesScreen.jsx
// Notification Preferences Screen
// ============================================================================

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../styles/colors';

const NotificationPreferencesScreen = ({ navigation }) => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [notificationSettings, setNotificationSettings] = useState({
    // Medical Notifications
    medicationReminders: true,
    eyeCheckupAlerts: true,
    labReportUpdates: true,
    // App & System
    appUpdates: true,
    promotionalOffers: false,
    feedbackRequests: true,
    // Educational & Awareness
    newBlogPosts: false,
    glaucomaTips: true,
    expertAdvice: true,
  });

  const toggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const toggleSwitch = (key) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleTurnAllOff = () => {
    Alert.alert('Turn All Off', 'Are you sure you want to turn off all notifications?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Turn Off',
        style: 'destructive',
        onPress: () => {
          const allOff = Object.keys(notificationSettings).reduce(
            (acc, key) => ({ ...acc, [key]: false }),
            {}
          );
          setNotificationSettings(allOff);
        },
      },
    ]);
  };

  const renderNotificationItem = (icon, label, settingKey) => (
    <View style={styles.notificationItem}>
      <View style={styles.notificationItemLeft}>
        <Ionicons name={icon} size={20} color={colors.textPrimary} />
        <Text style={styles.notificationItemText}>{label}</Text>
      </View>
      <Switch
        value={notificationSettings[settingKey]}
        onValueChange={() => toggleSwitch(settingKey)}
        trackColor={{ false: '#D1D5DB', true: colors.primaryDark }}
        thumbColor={colors.white}
        ios_backgroundColor="#D1D5DB"
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
        { icon: 'document-text-outline', label: 'Lab Report Updates', key: 'labReportUpdates' },
      ],
    },
    {
      title: 'App & System',
      key: 'system',
      items: [
        { icon: 'download-outline', label: 'App Updates', key: 'appUpdates' },
        { icon: 'gift-outline', label: 'Promotional Offers', key: 'promotionalOffers' },
        { icon: 'mail-outline', label: 'Feedback Requests', key: 'feedbackRequests' },
      ],
    },
    {
      title: 'Educational & Awareness',
      key: 'education',
      items: [
        { icon: 'newspaper-outline', label: 'New Blog Posts', key: 'newBlogPosts' },
        { icon: 'bulb-outline', label: 'Glaucoma Tips & Info', key: 'glaucomaTips' },
        { icon: 'play-circle-outline', label: 'Expert Advice & Videos', key: 'expertAdvice' },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification Preferences</Text>
        <TouchableOpacity onPress={handleTurnAllOff}>
          <Text style={styles.turnOffText}>Turn All Off</Text>
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
    marginLeft: -70,
  },
  turnOffText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.white,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  sectionContent: {
    backgroundColor: colors.white,
    paddingHorizontal: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  notificationItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 16,
  },
  notificationItemText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 12,
    flex: 1,
  },
});

export default NotificationPreferencesScreen;
