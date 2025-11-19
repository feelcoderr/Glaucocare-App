// FILE: src/components/navigation/GuestTabNavigator.jsx
// This is a new file for guest users

import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../store/slices/authSlice';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../../screens/home/DashboardScreen';
import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
import BlogListScreen from '../../screens/blog/BlogLIstScreen';
import { colors } from '../../styles/colors';

const Tab = createBottomTabNavigator();

// A dummy component that just triggers navigation
const LoginRedirectScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();

  React.useEffect(() => {
    // Add a listener to reset auth state when this tab is focused
    const unsubscribe = navigation.addListener('focus', () => {
      // This will reset isGuest to false, and AppNavigator
      // will automatically show the Auth stack.
      dispatch(resetAuth());
    });
    return unsubscribe;
  }, [navigation, dispatch]);

  return null; // This screen will never actually render
};

const GuestTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Doctor') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        // tabBarStyle: {
        //   height: 60,
        //   paddingBottom: 8,
        //   paddingTop: 16,
        // },
        // tabBarLabelStyle: {
        //   fontSize: 12,
        //   fontFamily: 'Poppins_500Medium',
        // },
      })}>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Doctor" component={DoctorListScreen} />
      <Tab.Screen name="Blog" component={BlogListScreen} />
      <Tab.Screen name="Profile" component={DashboardScreen} />
    </Tab.Navigator>
  );
};

export default GuestTabNavigator;
