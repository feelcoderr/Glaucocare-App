// FILE: App.js
// Main App Entry Point (UPDATE YOUR EXISTING App.js)
// ============================================================================

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import {
  useFonts,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import store from './src/store/store';
import AppNavigator from './src/components/navigation/AppNavigator';

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  React.useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

// import './global.css';
// import React from 'react';
// import { StatusBar } from 'expo-status-bar';
// import { Provider } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import store from './src/store/store';
// import AppNavigator from './src/components/navigation/AppNavigator';
// import { useFonts } from 'expo-font';
// import {
//   Poppins_300Light,
//   Poppins_400Regular,
//   Poppins_500Medium,
//   Poppins_600SemiBold,
//   Poppins_700Bold,
// } from '@expo-google-fonts/poppins';
// import * as SplashScreen from 'expo-splash-screen';

// // Prevent splash screen from auto-hiding
// SplashScreen.preventAutoHideAsync();

// export default function App() {
//   const [fontsLoaded] = useFonts({
//     Poppins_300Light,
//     Poppins_400Regular,
//     Poppins_500Medium,
//     Poppins_600SemiBold,
//     Poppins_700Bold,
//   });

//   React.useEffect(() => {
//     if (fontsLoaded) {
//       SplashScreen.hideAsync();
//     }
//   }, [fontsLoaded]);

//   if (!fontsLoaded) {
//     return null;
//   }

//   return (
//     <Provider store={store}>
//       <SafeAreaProvider>
//         <NavigationContainer>
//           <AppNavigator />
//           <StatusBar style="auto" />
//         </NavigationContainer>
//       </SafeAreaProvider>
//     </Provider>
//   );
// }
