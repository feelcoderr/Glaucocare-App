// FILE: src/components/navigation/TabNavigator.jsx
// UPDATED Bottom Tab Navigator
// ============================================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../../screens/home/DashboardScreen';
import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
import BlogListScreen from '../../screens/blog/BlogLIstScreen'; // ADD THIS
import { colors } from '../../styles/colors';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
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
          } else if (route.name === 'Community') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Blog') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 16,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins_500Medium',
        },
      })}>
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Doctor" component={DoctorListScreen} />
      <Tab.Screen name="Community" component={DashboardScreen} />
      <Tab.Screen name="Blog" component={BlogListScreen} />
      <Tab.Screen name="Profile" component={DashboardScreen} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
