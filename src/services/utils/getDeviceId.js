import * as Application from 'expo-application';
import { Platform } from 'react-native';
const getDeviceId = async () => {
  // On Android: returns the Android ID
  // On iOS: returns the identifierForVendor
  const deviceId =
    Platform.OS === 'android'
      ? Application.getAndroidId
      : await Application.getIosIdForVendorAsync();

  return deviceId;
};
export default getDeviceId;
