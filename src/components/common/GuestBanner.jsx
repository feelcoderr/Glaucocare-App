// FILE: src/components/GuestBanner.jsx

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../styles/colors';

const GuestBanner = () => {
  const navigation = useNavigation();
  const { isGuest } = useSelector((state) => state.auth);

  if (!isGuest) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="information-circle" size={20} color={colors.primaryDark} />
        <Text style={styles.text}>You are using GlaucoCare as a guest</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ConvertGuest')}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#E3F2FD',
    padding: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  text: {
    fontSize: 14,
    color: colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  button: {
    backgroundColor: colors.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  buttonText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default GuestBanner;
