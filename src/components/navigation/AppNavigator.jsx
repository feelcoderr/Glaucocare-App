// // FILE: src/components/navigation/AppNavigator.jsx
// // UPDATED Main App Navigator with Stack Navigation
// // ============================================================================

// import React, { useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkAuthStatus } from '../../store/slices/authSlice';
// import AuthNavigator from './AuthNavigator';
// import TabNavigator from './TabNavigator';
// import DoctorDetailScreen from '../../screens/doctor/DoctorDetailScreen';
// import MedicationListScreen from '../../screens/medication/MedicationListScreen';
// import AddMedicationScreen from '../../screens/medication/AddMedicationScreen';
// import HomeScreen from '../../screens/home/DashboardScreen';

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
//           <Stack.Screen name="Home" component={TabNavigator} />
//           <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
//           <Stack.Screen name="MedicationList" component={MedicationListScreen} />
//           <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
//           {/* <Stack.Screen name="Dashboard" component={HomeScreen} /> */}
//         </>
//       ) : (
//         <Stack.Screen name="Auth" component={AuthNavigator} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;

// FILE: src/components/navigation/AppNavigator.jsx
// UPDATED Main App Navigator
// ============================================================================

// import React, { useEffect } from 'react';
// import { createStackNavigator } from '@react-navigation/stack';
// import { useDispatch, useSelector } from 'react-redux';
// import { checkAuthStatus } from '../../store/slices/authSlice';
// import AuthNavigator from './AuthNavigator';
// import TabNavigator from './TabNavigator';

// // Import new screens
// import SearchScreen from '../../screens/search/SearchScreen';
// import NotificationScreen from '../../screens/notification/NotificationScreen';
// import SettingsScreen from '../../screens/settings/SettingsScreen';
// import DoctorDetailScreen from '../../screens/doctor/DoctorDetailScreen';
// import MedicationListScreen from '../../screens/medication/MedicationListScreen';
// import AddMedicationScreen from '../../screens/medication/AddMedicationScreen';
// import EventDetailScreen from '../../screens/events/EventDetailScreen';

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
//           <Stack.Screen name="Search" component={SearchScreen} />
//           <Stack.Screen name="Notifications" component={NotificationScreen} />
//           <Stack.Screen name="Settings" component={SettingsScreen} />
//           <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
//           <Stack.Screen name="MedicationList" component={MedicationListScreen} />
//           <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
//           <Stack.Screen name="EventDetail" component={EventDetailScreen} />
//         </>
//       ) : (
//         <Stack.Screen name="Auth" component={AuthNavigator} />
//       )}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigator;

// FILE: src/components/navigation/AppNavigator.jsx
// UPDATED Main App Navigator
// ============================================================================

import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '../../store/slices/authSlice';
import AuthNavigator from './AuthNavigator';
import TabNavigator from './TabNavigator';

// Import screens
import SearchScreen from '../../screens/search/SearchScreen';
import NotificationScreen from '../../screens/notification/NotificationScreen';
import SettingsScreen from '../../screens/settings/SettingsScreen';
import DoctorDetailScreen from '../../screens/doctor/DoctorDetailScreen';
import DoctorListScreen from '../../screens/doctor/DoctorListScreen';
import MedicationListScreen from '../../screens/medication/MedicationListScreen';
import AddMedicationScreen from '../../screens/medication/AddMedicationScreen';
import EventDetailScreen from '../../screens/events/EventDetailScreen';
import EventListScreen from '../../screens/events/EventListScreen';
import BlogListScreen from '../../screens/blog/BlogLIstScreen'; // ADD THIS
import BlogDetailScreen from '../../screens/blog/BlogDetailsScreen'; // ADD THIS
import ExerciseListScreen from '../../screens/exercise/ExerciseListScreen'; // ADD THIS
import DashboardScreen from '../../screens/home/DashboardScreen'; // UPDATED
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
          <Stack.Screen name="Main" component={DashboardScreen} />
          <Stack.Screen name="Search" component={SearchScreen} />
          <Stack.Screen name="Notifications" component={NotificationScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="DoctorList" component={DoctorListScreen} />
          <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
          <Stack.Screen name="MedicationList" component={MedicationListScreen} />
          <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
          <Stack.Screen name="EventDetail" component={EventDetailScreen} />
          <Stack.Screen name="EventList" component={EventListScreen} />
          <Stack.Screen name="BlogList" component={BlogListScreen} />
          <Stack.Screen name="BlogDetail" component={BlogDetailScreen} />
          <Stack.Screen name="ExerciseList" component={ExerciseListScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
