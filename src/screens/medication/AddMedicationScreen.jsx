// FILE: src/screens/medication/AddMedicationScreen.jsx
// Add Medication Reminder Screen
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { createMedicationReminder } from '../../store/slices/medicationSlice';
import { colors } from '../../styles/colors';

const AddMedicationScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.medication);

  const [medicationName, setMedicationName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000));
  const [reminderTimes, setReminderTimes] = useState(['']);
  const [notes, setNotes] = useState('');
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [activeTimeIndex, setActiveTimeIndex] = useState(0);

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const handleStartDateChange = (event, selectedDate) => {
    setShowStartPicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
    }
  };

  const handleEndDateChange = (event, selectedDate) => {
    setShowEndPicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const newTimes = [...reminderTimes];
      newTimes[activeTimeIndex] = formatTime(selectedTime);
      setReminderTimes(newTimes);
    }
  };

  const addAnotherTime = () => {
    setReminderTimes([...reminderTimes, '']);
  };

  const removeTime = (index) => {
    if (reminderTimes.length > 1) {
      const newTimes = reminderTimes.filter((_, i) => i !== index);
      setReminderTimes(newTimes);
    }
  };

  const handleSubmit = () => {
    if (!medicationName.trim()) {
      Alert.alert('Error', 'Please enter medication name');
      return;
    }

    const validTimes = reminderTimes.filter((time) => time.trim() !== '');
    if (validTimes.length === 0) {
      Alert.alert('Error', 'Please add at least one reminder time');
      return;
    }

    const reminderData = {
      customMedicationName: medicationName.trim(),
      dosage: '1 dose',
      frequency: 'custom',
      reminderTimes: validTimes.map((time) => ({ time })),
      startDate: formatDate(startDate),
      endDate: formatDate(endDate),
      notes: notes.trim(),
      enableNotifications: true,
    };

    dispatch(createMedicationReminder(reminderData))
      .unwrap()
      .then(() => {
        Alert.alert('Success', 'Medication reminder created successfully');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Error', error.message || 'Failed to create reminder');
      });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Medication</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>Add New Medication</Text>

        {/* Medication Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter medication name"
            placeholderTextColor={colors.textSecondary}
            value={medicationName}
            onChangeText={setMedicationName}
          />
        </View>

        {/* Date Range */}
        <View style={styles.dateRow}>
          <View style={styles.dateGroup}>
            <Text style={styles.label}>Start Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
              <Text style={styles.dateInputText}>{formatDate(startDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <View style={styles.dateGroup}>
            <Text style={styles.label}>End Date</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
              <Text style={styles.dateInputText}>{formatDate(endDate)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Reminder Times */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Reminder Times</Text>
          {reminderTimes.map((time, index) => (
            <View key={index} style={styles.timeRow}>
              <TouchableOpacity
                style={styles.timeInput}
                onPress={() => {
                  setActiveTimeIndex(index);
                  setShowTimePicker(true);
                }}>
                <Text style={[styles.timeInputText, !time && styles.placeholder]}>
                  {time || 'Select time'}
                </Text>
              </TouchableOpacity>
              {reminderTimes.length > 1 && (
                <TouchableOpacity style={styles.removeButton} onPress={() => removeTime(index)}>
                  <Ionicons name="close-circle" size={24} color="#EF4444" />
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity style={styles.addTimeButton} onPress={addAnotherTime}>
            <Ionicons name="add" size={20} color={colors.primaryDark} />
            <Text style={styles.addTimeText}>Add Another Time</Text>
          </TouchableOpacity>
        </View>

        {/* Notes */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Note</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Add any additional notes..."
            placeholderTextColor={colors.textSecondary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, isLoading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.submitButtonText}>Add New Medication</Text>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Date/Time Pickers */}
      {showStartPicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
          minimumDate={new Date()}
        />
      )}
      {showEndPicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
          minimumDate={startDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          value={new Date()}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
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
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textPrimary,
    fontFamily: 'Poppins_500Medium',
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  dateGroup: {
    flex: 1,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dateInputText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  timeInput: {
    flex: 1,
    backgroundColor: colors.white,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  timeInputText: {
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  placeholder: {
    color: colors.textSecondary,
  },
  removeButton: {
    marginLeft: 12,
  },
  addTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  addTimeText: {
    fontSize: 14,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
    marginLeft: 8,
  },
  submitButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default AddMedicationScreen;
