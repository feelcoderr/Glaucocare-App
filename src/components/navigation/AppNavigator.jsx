// FILE: src/components/navigation/AppNavigator.jsx
// FIXED - Proper Navigation Hierarchy
// ============================================================================

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

// Import screens that should be OUTSIDE tab navigation
import SearchScreen from '../../screens/search/SearchScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import DoctorDetailScreen from '../../screens/doctor/DoctorDetailScreen';
import MedicationListScreen from '../../screens/medication/MedicationListScreen';
import AddMedicationScreen from '../../screens/medication/AddMedicationScreen';
import EventDetailScreen from '../../screens/events/EventDetailScreen';
import EventListScreen from '../../screens/events/EventListScreen';
import BlogDetailScreen from '../../screens/blog/BlogDetailsScreen';
import ExerciseListScreen from '../../screens/exercise/ExerciseListScreen';
import EducationalContentListScreen from '../../screens/education/Educationalcontentlistscreen';
import GlaucomaGuideScreen from '../../screens/education/GlaucomaGuideScreen';
import DocumentDashboardScreen from '../../screens/documents/DocumentDashboardScreen';
import DocumentListScreen from '../../screens/documents/DocumentListScreen';
import BlogListScreen from '../../screens/blog/BlogLIstScreen';
import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
// Settings Screens
import EditProfileScreen from '../../screens/settings/EditProfileScreen';
import LanguageSettingsScreen from '../../screens/settings/LanguageSettingsScreen';
import NotificationPreferencesScreen from '../../screens/settings/NotificationPreferencesScreen';
import ContactSupportScreen from '../../screens/settings/ContactSupportScreen';
import HelpFAQScreen from '../../screens/settings/HelpFAQScreen';
import TermsPrivacyScreen from '../../screens/settings/TermsPrivacyScreen';
import AboutAppScreen from '../../screens/settings/AboutAppScreen';
import EyeHealthAssessmentScreen from '../../screens/assessment/EyeHealthAssessmentScreen';
import AssessmentResultScreen from '../../screens/assessment/AssessmentResultScreen';
import AssessmentHistoryScreen from '../../screens/assessment/AssessmentHistoryScreen';
import PeripheralPopScreen from '../../screens/exercise/PeripheralPopScreen';
import LetterHuntScreen from '../../screens/exercise/LetterHuntScreen';
import ClockSweepScreen from '../../screens/exercise/ClockSweepScreen';
const Stack = createStackNavigator();

const AppNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          {/* FIXED: Main should be TabNavigator, not DashboardScreen */}
          <Stack.Screen name="Main" component={TabNavigator} />

          {/* Modal/Detail Screens - These appear OVER the tabs */}
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
          <Stack.Screen name="DoctorList" component={DoctorListScreen} />
          <Stack.Screen name="MedicationList" component={MedicationListScreen} />
          <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="EventList" component={EventListScreen} />
          <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
          <Stack.Screen name="BlogList" component={BlogListScreen} />
          <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
          <Stack.Screen name="PeripheralPopScreen" component={PeripheralPopScreen} />
          <Stack.Screen name="LetterHuntScreen" component={LetterHuntScreen} />
          <Stack.Screen name="ClockSweepScreen" component={ClockSweepScreen} />

          <Stack.Screen name="EducationalContentList" component={EducationalContentListScreen} />
          <Stack.Screen name="GlaucomaGuide" component={GlaucomaGuideScreen} />
          <Stack.Screen name="DocumentDashboardScreen" component={DocumentDashboardScreen} />
          <Stack.Screen name="DocumentListScreen" component={DocumentListScreen} />

          <Stack.Screen name="EditProfile" component={EditProfileScreen} />
          <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
          <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />
          <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
          <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
          <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
          <Stack.Screen name="AboutApp" component={AboutAppScreen} />
          <Stack.Screen name="EyeHealthAssessment" component={EyeHealthAssessmentScreen} />
          <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
          <Stack.Screen name="AssessmentHistory" component={AssessmentHistoryScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
