// FILE: src/navigation/RootNavigator.jsx
// FIXED Root Navigator with auth check on mount
// ============================================================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { View, ActivityIndicator } from 'react-native';
import { navigationRef } from './navigationRef';
import { checkAuthStatus } from '../../store/slices/authSlice';
import { colors } from '../../styles/colors';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootStack = createStackNavigator();

export default function RootNavigator() {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading } = useSelector((state) => state.auth);
  // ✅ Check authentication status on app start
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);
  // ✅ Show loading screen while checking auth
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.background,
        }}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }
  return (
    <NavigationContainer ref={navigationRef}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <RootStack.Screen name="App" component={AppNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
