// FILE: src/screens/settings/EditProfileScreen.jsx
// Edit Profile Screen
// ============================================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '../../styles/colors';
import { updateProfile, updateProfilePicture } from '../../store/slices/userSlice';
import { setUser } from '../../store/slices/authSlice'; // adapt to your auth slice action if present

const EditProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const [firstName, setFirstName] = useState(user?.fullname?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.fullname?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [dateOfBirth, setDateOfBirth] = useState(
    user?.dateOfBirth ? new Date(user.dateOfBirth) : null
  );
  const [gender, setGender] = useState(user.gender || '');
  const [profileImage, setProfileImage] = useState(user?.profilePicture);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showGenderPicker, setShowGenderPicker] = useState(false);

  const genderOptions = ['Male', 'Female', 'Other', 'Prefer not to say'];

  const handleChangePhoto = async () => {
    Alert.alert('Change Photo', 'Choose an option', [
      {
        text: 'Take Photo',
        onPress: () => pickImage('camera'),
      },
      {
        text: 'Choose from Library',
        onPress: () => pickImage('library'),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ]);
  };

  const pickImage = async (source) => {
    try {
      const permissionResult =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        Alert.alert('Permission Required', 'Please grant permission to access photos');
        return;
      }

      const result =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            })
          : await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.Images,
              allowsEditing: true,
              aspect: [1, 1],
              quality: 0.8,
            });

      if (!result.canceled && result.assets[0]) {
        setProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
    }
  };

  const formatDate = (date) => {
    if (!date) return 'Not set'; // prevent crash

    const d = new Date(date); // safely convert string → Date
    if (isNaN(d)) return 'Invalid date';

    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // inside EditProfileScreen.jsx - make sure to import needed items:

  const handleSaveChanges = async () => {
    if (!firstName.trim()) {
      Alert.alert('Error', 'First name is required');
      return;
    }

    if (!email.trim() || !/^\S+@\S+\.\S+$/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email');
      return;
    }

    setIsLoading(true);

    try {
      // 1) Update text fields
      const payload = {
        fullname: `${firstName} ${lastName}`.trim(),
        email,
        ...(dateOfBirth ? { dateOfBirth: dateOfBirth.toISOString() } : {}),
        ...(gender ? { gender } : {}),
      };
      console.log('Updating profile with payload:', payload);
      // dispatch redux thunk to update profile (returns resolved promise)
      const res = await dispatch(updateProfile(payload)).unwrap();
      // res is the payload returned by thunk (apiClient response.data)
      const updatedUser = res?.data ?? res;

      // 2) If profileImage is a local URI (user changed it), upload separately
      // You might compare with initial user.profilePicture to avoid redundant upload
      const isLocalFile =
        profileImage &&
        (profileImage.startsWith('file://') || profileImage.startsWith('content://'));

      if (isLocalFile) {
        const form = new FormData();
        // Try to infer filename and mime type (use .jpg default)
        const uri = profileImage;
        const filename = uri.split('/').pop() || 'profile.jpg';
        const match = /\.(\w+)$/.exec(filename);
        const ext = match ? match[1] : 'jpg';
        const mimeType = ext === 'png' ? 'image/png' : 'image/jpeg';

        form.append('profilePicture', {
          uri,
          name: filename,
          type: mimeType,
        });

        const picRes = await dispatch(updateProfilePicture(form)).unwrap();
        const updatedUserAfterPic = picRes?.data ?? picRes;

        // Update store / local state with final user
        dispatch({ type: 'auth/setUser', payload: updatedUserAfterPic }); // adapt to your actual auth action
      } else {
        // No image upload; update store with profile update result
        dispatch({ type: 'auth/setUser', payload: updatedUser }); // adapt accordingly
      }

      Alert.alert('Success', 'Profile updated successfully', [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      console.error('Update profile error:', error);
      Alert.alert('Error', error?.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveChanges = async () => {
  //   if (!firstName.trim()) {
  //     Alert.alert('Error', 'First name is required');
  //     return;
  //   }

  //   if (!email.trim() || !email.match(/^\S+@\S+\.\S+$/)) {
  //     Alert.alert('Error', 'Please enter a valid email');
  //     return;
  //   }

  //   setIsLoading(true);

  //   try {
  //     // TODO: Implement API call to update profile
  //     const updatedData = {
  //       fullname: `${firstName} ${lastName}`.trim(),
  //       email,
  //       dateOfBirth: dateOfBirth.toISOString(),
  //       gender,
  //       profilePicture: profileImage,
  //     };

  //     console.log('Updating profile:', updatedData);

  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500));

  //     Alert.alert('Success', 'Profile updated successfully', [
  //       {
  //         text: 'OK',
  //         onPress: () => navigation.goBack(),
  //       },
  //     ]);
  //   } catch (error) {
  //     console.error('Update profile error:', error);
  //     Alert.alert('Error', 'Failed to update profile');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Profile Photo */}
        <View style={styles.photoSection}>
          <View style={styles.photoContainer}>
            <Image
              source={{
                uri:
                  profileImage ||
                  'https://res.cloudinary.com/datgoelws/image/upload/v1761806946/profile-imgage_lgtgih.jpg',
              }}
              style={styles.profilePhoto}
            />
            <TouchableOpacity style={styles.cameraButton} onPress={handleChangePhoto}>
              <Ionicons name="camera" size={18} color={colors.white} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={styles.changePhotoText}>Change Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
        <View style={styles.formContainer}>
          {/* First Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter first name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter last name"
              placeholderTextColor={colors.textSecondary}
            />
          </View>

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Date of Birth</Text>
            <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
              <Text style={styles.dateText}>{formatDate(dateOfBirth)}</Text>
              <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          {/* Gender */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Gender</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowGenderPicker(!showGenderPicker)}>
              <Text style={[styles.dateText, !gender && styles.placeholderText]}>
                {gender || 'Select gender'}
              </Text>
              <Ionicons
                name={showGenderPicker ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {showGenderPicker && (
            <View style={styles.genderPicker}>
              {genderOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={styles.genderOption}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}>
                  <Text style={styles.genderOptionText}>{option}</Text>
                  {gender === option && (
                    <Ionicons name="checkmark" size={20} color={colors.primaryDark} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSaveChanges}
          disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text style={styles.saveButtonText}>Save Changes</Text>
          )}
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
  photoSection: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  photoContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.white,
  },
  changePhotoText: {
    fontSize: 16,
    color: colors.primaryDark,
    fontFamily: 'Poppins_500Medium',
  },
  formContainer: {
    paddingHorizontal: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textPrimary,
    fontFamily: 'Poppins_600SemiBold',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  dateInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingVertical: 12,
  },
  dateText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  genderPicker: {
    backgroundColor: colors.white,
    borderRadius: 12,
    marginTop: -12,
    marginBottom: 24,
    overflow: 'hidden',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  genderOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  genderOptionText: {
    fontSize: 15,
    color: colors.textPrimary,
    fontFamily: 'Poppins_400Regular',
  },
  saveButton: {
    backgroundColor: colors.primaryDark,
    borderRadius: 12,
    paddingVertical: 16,
    marginHorizontal: 24,
    marginTop: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default EditProfileScreen;
