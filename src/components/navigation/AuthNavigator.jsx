// FILE: src/components/navigation/AuthNavigator.jsx
// FIXED Auth Navigator - Removed TabNavigator reference
// ============================================================================

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../screens/auth/SplashScreen';
import OnboardingScreen from '../../screens/auth/OnboardingScreen';
import LanguageSelectionScreen from '../../screens/auth/LanguageSelectionScreen';
import LoginScreen from '../../screens/auth/LoginScreen';
import RegistrationScreen from '../../screens/auth/RegistrationScreen';
import NotificationPermissionScreen from '../../screens/auth/NotificationPermissionScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: '#FAFAFA' },
      }}
      initialRouteName="Splash">
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="LanguageSelection" component={LanguageSelectionScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Registration" component={RegistrationScreen} />
      <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
