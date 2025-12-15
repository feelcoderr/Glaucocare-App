// FILE: src/screens/auth/SplashScreen.jsx
// Updated Splash Screen with Proper Flow Logic
// ============================================================================

import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { checkAuthStatus } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import { Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    // Animate logo
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Check auth and navigation flow
    checkNavigationFlow();
  }, []);

  const checkNavigationFlow = async () => {
    try {
      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Check if user has seen onboarding
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      // Check if user is authenticated
      const accessToken = await AsyncStorage.getItem('accessToken');
      const user = await AsyncStorage.getItem('user');

      if (accessToken && user) {
        // User is logged in - go to dashboard
        dispatch(checkAuthStatus());
        navigation.replace('Main');
        // navigation.replace('Onboarding');
      } else if (hasSeenOnboarding === 'true') {
        // User has seen onboarding - go to language selection
        navigation.replace('Login');
      } else {
        // First time user - show onboarding
        navigation.replace('Onboarding');
      }
    } catch (error) {
      console.error('Navigation flow error:', error);
      navigation.replace('Onboarding');
    }
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={{ width: 150, height: 150 }}
          resizeMode="contain"
        />
        {/* <LinearGradient
          colors={[colors.primaryLight, colors.primaryDark]} */}
        <Text style={styles.logoText}>GlaucoCare</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  logoCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  eyeIcon: {
    fontSize: 80,
    color: colors.white,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '700',
    color: colors.primaryDark,
    fontFamily: 'Poppins_700Bold',
  },
});

export default SplashScreen;
