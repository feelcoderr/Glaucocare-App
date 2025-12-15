// FILE: src/screens/medication/MedicationListScreen.jsx
// Medication Reminder List Screen
// ============================================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import {
  fetchUserReminders,
  deleteMedicationReminder,
  markMedicationAsTaken,
} from '../../store/slices/medicationSlice';
import notificationService from '../../services/notifications/notificationService';
import { colors } from '../../styles/colors';
import { LinearGradient } from 'expo-linear-gradient';
const MedicationListScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { reminders, isLoading } = useSelector((state) => state.medication);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [refreshing, setRefreshing] = useState(false);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserReminders(true));
    }
  }, [isAuthenticated]);
  useEffect(() => {
    loadReminders();
  }, []);

  const loadReminders = async () => {
    try {
      await dispatch(fetchUserReminders(true)).unwrap();
    } catch (error) {
      console.error('Load reminders error:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadReminders();
    setRefreshing(false);
  };

  const handleDelete = (reminder) => {
    Alert.alert(
      'Delete Reminder',
      `Are you sure you want to delete ${reminder.customMedicationName || reminder.medication?.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              // CANCEL ALL NOTIFICATIONS FOR THIS REMINDER
              await notificationService.cancelMedicationReminders(reminder._id);

              // DELETE FROM BACKEND
              await dispatch(deleteMedicationReminder(reminder._id)).unwrap();

              Alert.alert('Success', 'Medication reminder deleted successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete reminder');
            }
          },
        },
      ]
    );
  };

  const handleMarkAsTaken = async (reminder, time) => {
    try {
      await dispatch(markMedicationAsTaken({ id: reminder._id, time })).unwrap();
      Alert.alert('Success', 'Medication marked as taken');
    } catch (error) {
      Alert.alert('Error', 'Failed to mark as taken');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderReminderCard = ({ item }) => (
    <View style={styles.reminderCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.medicationName}>
          {item.medication?.name || item.customMedicationName}
        </Text>
        <TouchableOpacity onPress={() => handleDelete(item)}>
          <Ionicons name="trash-outline" size={24} color="#EF4444" />
        </TouchableOpacity>
      </View>

      {/* Times */}
      <View style={styles.timesContainer}>
        {item.reminderTimes?.map((timeObj, index) => (
          <View key={index} style={styles.timeChip}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.timeText}>{timeObj.time}</Text>
          </View>
        ))}
      </View>

      {/* Date Range */}
      <View style={styles.dateContainer}>
        <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
        <Text style={styles.dateText}>
          {formatDate(item.startDate)} - {formatDate(item.endDate)}
        </Text>
      </View>

      {/* Notes */}
      {item.notes && <Text style={styles.notesText}>{item.notes}</Text>}
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Medication</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Please login to view medication reminders</Text>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Auth', { screen: 'Login' })}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Medication</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('AddMedication')}>
          <LinearGradient
            colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
            style={styles.addButton}>
            <Ionicons name="add" size={24} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Active Reminders Section */}
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Active Reminders</Text>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primaryDark} />
          </View>
        ) : reminders.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="medkit-outline" size={64} color={colors.textSecondary} />
            <Text style={styles.emptyText}>No active reminders</Text>
            <TouchableOpacity
              style={styles.addFirstButton}
              onPress={() => navigation.navigate('AddMedication')}>
              <LinearGradient
                colors={['#2B3C8D', '#1672BC']} // your primaryGradient colors
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }} // roughly matches a 89.65° angle (horizontal)
                style={styles.addFirstButton}>
                <Text style={styles.addFirstButtonText}>Add Reminder</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={reminders}
            renderItem={renderReminderCard}
            keyExtractor={(item) => item._id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
          />
        )}
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
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 16,
  },
  reminderCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    flex: 1,
  },
  timesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  timeText: {
    fontSize: 13,
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 4,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dateText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginLeft: 8,
  },
  notesText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: 'Poppins_400Regular',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  addFirstButton: {
    // backgroundColor: colors.primaryGradient,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  loginButton: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default MedicationListScreen;
