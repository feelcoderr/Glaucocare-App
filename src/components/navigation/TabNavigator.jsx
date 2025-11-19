// FILE: src/components/navigation/TabNavigator.jsx
// FIXED Bottom Tab Navigator
// ============================================================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import DashboardScreen from '../../screens/home/DashboardScreen';
import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
import BlogListScreen from '../../screens/blog/BlogLIstScreen';
import DocumentDashboardScreen from '../../screens/documents/DocumentDashboardScreen';
import SettingScreen from '../../screens/settings/SettingsScreen';
import { colors } from '../../styles/colors';
import GlaucomaGuideScreen from '../../screens/education/GlaucomaGuideScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'DoctorTab') {
            iconName = focused ? 'medical' : 'medical-outline';
          } else if (route.name === 'GuideTab') {
            iconName = focused ? 'eye' : 'eye-outline';
          } else if (route.name === 'BlogTab') {
            iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'ProfileTab') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primaryDark,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          backgroundColor: colors.white,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Poppins_500Medium',
        },
      })}>
      {/* FIXED: Added 'Tab' suffix to avoid conflicts with Stack screens */}
      <Tab.Screen name="HomeTab" component={DashboardScreen} options={{ tabBarLabel: 'Home' }} />
      <Tab.Screen
        name="DoctorTab"
        component={DoctorListScreen}
        options={{ tabBarLabel: 'Doctor' }}
      />
      <Tab.Screen
        name="GuideTab"
        component={GlaucomaGuideScreen}
        options={{ tabBarLabel: 'Guide' }}
      />
      <Tab.Screen name="BlogTab" component={BlogListScreen} options={{ tabBarLabel: 'Blog' }} />
      <Tab.Screen
        name="ProfileTab"
        component={SettingScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
