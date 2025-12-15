// FILE: src/components/navigation/AppNavigator.jsx
// FIXED - Proper Navigation Hierarchy
// ============================================================================

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';
import RequireAuth from './RequireAuth';
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
import ConvertGuestScreen from '../../screens/auth/ConvertGuestScreen';
import RegistrationScreen from '../../screens/auth/RegistrationScreen';
import NotificationPermissionScreen from '../../screens/auth/NotificationPermissionScreen';
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
          <Stack.Screen name="Main">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <TabNavigator {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="Notifications">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <NotificationScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="MedicationList">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <MedicationListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="AddMedication">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <AddMedicationScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="DocumentDashboardScreen">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <DocumentDashboardScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="DocumentListScreen">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <DocumentListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="EditProfile">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <EditProfileScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="LanguageSettings">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <LanguageSettingsScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="EyeHealthAssessment">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <EyeHealthAssessmentScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="AssessmentResult">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <AssessmentResultScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="AssessmentHistory">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <AssessmentHistoryScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="NotificationPreferences">
            {(props) => (
              <RequireAuth allowGuest={false}>
                <NotificationPreferencesScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          {/* Guest Allowed Routes */}

          <Stack.Screen name="DoctorList">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <DoctorListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="DoctorDetail">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <DoctorDetailScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="Settings">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <SettingsScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="EducationalContentList">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <EducationalContentListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="Search">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <SearchScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="EventDetail">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <EventDetailScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="EventList">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <EventListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="BlogDetail">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <BlogDetailScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="BlogList">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <BlogListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="ExerciseList">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <ExerciseListScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="PeripheralPopScreen">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <PeripheralPopScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="LetterHuntScreen">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <LetterHuntScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="ClockSweepScreen">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <ClockSweepScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="GlaucomaGuide">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <GlaucomaGuideScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="ContactSupport">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <ContactSupportScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="HelpFAQ">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <HelpFAQScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="TermsPrivacy">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <TermsPrivacyScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="AboutApp">
            {(props) => (
              <RequireAuth allowGuest={true}>
                <AboutAppScreen {...props} />
              </RequireAuth>
            )}
          </Stack.Screen>

          <Stack.Screen name="ConvertGuest" component={ConvertGuestScreen} />
          <Stack.Screen name="Registration" component={RegistrationScreen} />
          <Stack.Screen name="App" component={AppNavigator} />
          <Stack.Screen name="NotificationPermission" component={NotificationPermissionScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
// // FILE: src/components/navigation/AppNavigator.jsx
// // FIXED - Proper Navigation Hierarchy
// // ============================================================================

// import React, { useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkAuthStatus } from '../../store/slices/authSlice';
// import AuthNavigator from './AuthNavigator';
// import TabNavigator from './TabNavigator';
// import RequireAuth from './RequireAuth';
// // Import screens that should be OUTSIDE tab navigation
// import SearchScreen from '../../screens/search/SearchScreen';
// import NotificationScreen from '../../screens/notification/NotificationScreen';
// import SettingsScreen from '../../screens/settings/SettingsScreen';
// import DoctorDetailScreen from '../../screens/doctor/DoctorDetailScreen';
// import MedicationListScreen from '../../screens/medication/MedicationListScreen';
// import AddMedicationScreen from '../../screens/medication/AddMedicationScreen';
// import EventDetailScreen from '../../screens/events/EventDetailScreen';
// import EventListScreen from '../../screens/events/EventListScreen';
// import BlogDetailScreen from '../../screens/blog/BlogDetailsScreen';
// import ExerciseListScreen from '../../screens/exercise/ExerciseListScreen';
// import EducationalContentListScreen from '../../screens/education/Educationalcontentlistscreen';
// import GlaucomaGuideScreen from '../../screens/education/GlaucomaGuideScreen';
// import DocumentDashboardScreen from '../../screens/documents/DocumentDashboardScreen';
// import DocumentListScreen from '../../screens/documents/DocumentListScreen';
// import BlogListScreen from '../../screens/blog/BlogLIstScreen';
// import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
// // Settings Screens
// import EditProfileScreen from '../../screens/settings/EditProfileScreen';
// import LanguageSettingsScreen from '../../screens/settings/LanguageSettingsScreen';
// import NotificationPreferencesScreen from '../../screens/settings/NotificationPreferencesScreen';
// import ContactSupportScreen from '../../screens/settings/ContactSupportScreen';
// import HelpFAQScreen from '../../screens/settings/HelpFAQScreen';
// import TermsPrivacyScreen from '../../screens/settings/TermsPrivacyScreen';
// import AboutAppScreen from '../../screens/settings/AboutAppScreen';
// import EyeHealthAssessmentScreen from '../../screens/assessment/EyeHealthAssessmentScreen';
// import AssessmentResultScreen from '../../screens/assessment/AssessmentResultScreen';
// import AssessmentHistoryScreen from '../../screens/assessment/AssessmentHistoryScreen';
// import PeripheralPopScreen from '../../screens/exercise/PeripheralPopScreen';
// import LetterHuntScreen from '../../screens/exercise/LetterHuntScreen';
// import ClockSweepScreen from '../../screens/exercise/ClockSweepScreen';
// import ConvertGuestScreen from '../../screens/auth/ConvertGuestScreen';
// const Stack = createStackNavigator();

// const AppNavigator = () => {
//   const dispatch = useDispatch();
//   const { isAuthenticated } = useSelector((state) => state.auth);

//   useEffect(() => {
//     dispatch(checkAuthStatus());
//   }, [dispatch]);

//   return (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//       {isAuthenticated ? (
//         <>
//           <Stack.Screen name="Main" component={TabNavigator} />

//           <Stack.Screen name="Notifications" component={NotificationScreen} />
//           <Stack.Screen name="MedicationList" component={MedicationListScreen} />
//           <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
//           <Stack.Screen name="DocumentDashboardScreen" component={DocumentDashboardScreen} />
//           <Stack.Screen name="DocumentListScreen" component={DocumentListScreen} />
//           <Stack.Screen name="EditProfile" component={EditProfileScreen} />
//           <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} />
//           <Stack.Screen name="EyeHealthAssessment" component={EyeHealthAssessmentScreen} />
//           <Stack.Screen name="AssessmentResult" component={AssessmentResultScreen} />
//           <Stack.Screen name="AssessmentHistory" component={AssessmentHistoryScreen} />
//           <Stack.Screen name="NotificationPreferences" component={NotificationPreferencesScreen} />

//           {/* Guest Allowed Routes */}
//           <Stack.Screen name="DoctorList" component={DoctorListScreen} />
//           <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
//           <Stack.Screen name="Settings" component={SettingsScreen} />
//           <Stack.Screen name="EducationalContentList" component={EducationalContentListScreen} />
//           <Stack.Screen name="Search" component={SearchScreen} />
//           <Stack.Screen name="EventDetail" component={EventDetailScreen} />
//           <Stack.Screen name="EventList" component={EventListScreen} />
//           <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
//           <Stack.Screen name="BlogList" component={BlogListScreen} />
//           <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
//           <Stack.Screen name="PeripheralPopScreen" component={PeripheralPopScreen} />
//           <Stack.Screen name="LetterHuntScreen" component={LetterHuntScreen} />
//           <Stack.Screen name="ClockSweepScreen" component={ClockSweepScreen} />
//           <Stack.Screen name="GlaucomaGuide" component={GlaucomaGuideScreen} />
//           <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
//           <Stack.Screen name="HelpFAQ" component={HelpFAQScreen} />
//           <Stack.Screen name="TermsPrivacy" component={TermsPrivacyScreen} />
//           <Stack.Screen name="AboutApp" component={AboutAppScreen} />
//           <Stack.Screen name="ConvertGuest" component={ConvertGuestScreen} />
//         </>
//       ) : (
//         <Stack.Screen name="Auth" component={AuthNavigator} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;
