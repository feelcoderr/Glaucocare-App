// FILE: src/services/notificationService.js
// UPDATED - Fixed notification listener removal
// ============================================================================

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.notificationListener = null;
    this.responseListener = null;
  }

  // Initialize notification permissions
  async requestPermissions() {
    try {
      if (!Device.isDevice) {
        console.log('Notifications only work on physical devices');
        return false;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push notification permissions');
        return false;
      }

      // Set up notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('medication_reminders', {
          name: 'Medication Reminders',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          sound: 'default',
          lightColor: '#FF231F7C',
        });
      }

      return true;
    } catch (error) {
      console.error('Notification permission error:', error);
      return false;
    }
  }

  // Schedule medication reminder notifications
  async scheduleMedicationReminders(reminderData) {
    try {
      const { reminderId, medicationName, dosage, reminderTimes, startDate, endDate } =
        reminderData;

      console.log('📅 Scheduling reminders for:', medicationName);

      const scheduledIds = [];

      // Calculate how many days to schedule
      const start = new Date(startDate);
      const end = endDate
        ? new Date(endDate)
        : new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000);
      const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      const daysToSchedule = Math.min(daysDiff + 1, 64); // iOS limit is 64 notifications

      // Schedule each reminder time for each day
      for (let day = 0; day < daysToSchedule; day++) {
        for (const timeObj of reminderTimes) {
          const [hours, minutes] = timeObj.time.split(':');

          const triggerDate = new Date(start);
          triggerDate.setDate(start.getDate() + day);
          triggerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

          // Only schedule future notifications
          if (triggerDate > new Date()) {
            const notificationId = await Notifications.scheduleNotificationAsync({
              content: {
                title: '💊 Medication Reminder',
                body: `Time to take ${medicationName} - ${dosage}`,
                data: {
                  reminderId,
                  medicationName,
                  dosage,
                  time: timeObj.time,
                  type: 'medication_reminder',
                },
                sound: 'default',
                priority: Notifications.AndroidNotificationPriority.HIGH,
                categoryIdentifier: 'medication',
              },
              trigger: triggerDate,
            });

            scheduledIds.push({
              notificationId,
              date: triggerDate.toISOString(),
              time: timeObj.time,
            });
          }
        }
      }

      console.log(`✅ Scheduled ${scheduledIds.length} notifications`);

      // Store notification IDs in AsyncStorage for later cancellation
      await this.storeNotificationIds(reminderId, scheduledIds);

      return scheduledIds;
    } catch (error) {
      console.error('Schedule notifications error:', error);
      throw error;
    }
  }

  // Cancel all notifications for a specific reminder
  async cancelMedicationReminders(reminderId) {
    try {
      const storedIds = await this.getStoredNotificationIds(reminderId);

      if (storedIds && storedIds.length > 0) {
        console.log(`🗑️ Cancelling ${storedIds.length} notifications for reminder: ${reminderId}`);

        for (const item of storedIds) {
          await Notifications.cancelScheduledNotificationAsync(item.notificationId);
        }

        // Remove from storage
        await this.removeStoredNotificationIds(reminderId);
      }

      console.log('✅ Notifications cancelled successfully');
    } catch (error) {
      console.error('Cancel notifications error:', error);
      throw error;
    }
  }

  // Update notifications (cancel old, schedule new)
  async updateMedicationReminders(reminderId, newReminderData) {
    try {
      await this.cancelMedicationReminders(reminderId);
      await this.scheduleMedicationReminders({ ...newReminderData, reminderId });
    } catch (error) {
      console.error('Update notifications error:', error);
      throw error;
    }
  }

  // Store notification IDs in AsyncStorage
  async storeNotificationIds(reminderId, notificationIds) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const key = `notification_ids_${reminderId}`;
      await AsyncStorage.setItem(key, JSON.stringify(notificationIds));
    } catch (error) {
      console.error('Store notification IDs error:', error);
    }
  }

  // Get stored notification IDs
  async getStoredNotificationIds(reminderId) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const key = `notification_ids_${reminderId}`;
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Get notification IDs error:', error);
      return [];
    }
  }

  // Remove stored notification IDs
  async removeStoredNotificationIds(reminderId) {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default;
      const key = `notification_ids_${reminderId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Remove notification IDs error:', error);
    }
  }

  // Get all scheduled notifications (for debugging)
  async getAllScheduledNotifications() {
    try {
      const notifications = await Notifications.getAllScheduledNotificationsAsync();
      console.log(`📋 Total scheduled notifications: ${notifications.length}`);
      return notifications;
    } catch (error) {
      console.error('Get scheduled notifications error:', error);
      return [];
    }
  }

  // Cancel all scheduled notifications
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('✅ All notifications cancelled');
    } catch (error) {
      console.error('Cancel all notifications error:', error);
    }
  }

  // Set up notification listeners
  setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
    // Listener for when notification is received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📬 Notification received:', notification);
      if (onNotificationReceived) {
        onNotificationReceived(notification);
      }
    });

    // Listener for when user interacts with notification
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('👆 Notification tapped:', response);
      if (onNotificationResponse) {
        onNotificationResponse(response);
      }
    });
  }

  // ✅ FIXED: Remove notification listeners
  removeNotificationListeners() {
    if (this.notificationListener) {
      // ✅ Use remove() instead of Notifications.removeNotificationSubscription()
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      // ✅ Use remove() instead of Notifications.removeNotificationSubscription()
      this.responseListener.remove();
    }
  }
}

export default new NotificationService();
// // FILE: src/services/notificationService.js
// // Local Notification Service for Medication Reminders
// // ============================================================================

// import * as Notifications from 'expo-notifications';
// import * as Device from 'expo-device';
// import { Platform } from 'react-native';

// // Configure notification behavior
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: true,
//     shouldSetBadge: true,
//   }),
// });

// class NotificationService {
//   constructor() {
//     this.notificationListener = null;
//     this.responseListener = null;
//   }

//   // Initialize notification permissions
//   async requestPermissions() {
//     try {
//       if (!Device.isDevice) {
//         console.log('Notifications only work on physical devices');
//         return false;
//       }

//       const { status: existingStatus } = await Notifications.getPermissionsAsync();
//       let finalStatus = existingStatus;

//       if (existingStatus !== 'granted') {
//         const { status } = await Notifications.requestPermissionsAsync();
//         finalStatus = status;
//       }

//       if (finalStatus !== 'granted') {
//         console.log('Failed to get push notification permissions');
//         return false;
//       }

//       // Set up notification channel for Android
//       if (Platform.OS === 'android') {
//         await Notifications.setNotificationChannelAsync('medication_reminders', {
//           name: 'Medication Reminders',
//           importance: Notifications.AndroidImportance.MAX,
//           vibrationPattern: [0, 250, 250, 250],
//           sound: 'default',
//           lightColor: '#FF231F7C',
//         });
//       }

//       return true;
//     } catch (error) {
//       console.error('Notification permission error:', error);
//       return false;
//     }
//   }

//   // Schedule medication reminder notifications
//   async scheduleMedicationReminders(reminderData) {
//     try {
//       const { reminderId, medicationName, dosage, reminderTimes, startDate, endDate } =
//         reminderData;

//       console.log('📅 Scheduling reminders for:', medicationName);

//       const scheduledIds = [];

//       // Calculate how many days to schedule
//       const start = new Date(startDate);
//       const end = endDate
//         ? new Date(endDate)
//         : new Date(start.getTime() + 365 * 24 * 60 * 60 * 1000); // 1 year default
//       const daysDiff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
//       const daysToSchedule = Math.min(daysDiff, 64); // iOS limit is 64 notifications

//       // Schedule each reminder time for each day
//       for (let day = 0; day < daysToSchedule; day++) {
//         for (const timeObj of reminderTimes) {
//           const [hours, minutes] = timeObj.time.split(':');

//           const triggerDate = new Date(start);
//           triggerDate.setDate(start.getDate() + day);
//           triggerDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

//           // Only schedule future notifications
//           if (triggerDate > new Date()) {
//             const notificationId = await Notifications.scheduleNotificationAsync({
//               content: {
//                 title: '💊 Medication Reminder',
//                 body: `Time to take ${medicationName} - ${dosage}`,
//                 data: {
//                   reminderId,
//                   medicationName,
//                   dosage,
//                   time: timeObj.time,
//                   type: 'medication_reminder',
//                 },
//                 sound: 'default',
//                 priority: Notifications.AndroidNotificationPriority.HIGH,
//                 categoryIdentifier: 'medication',
//               },
//               trigger: triggerDate,
//             });

//             scheduledIds.push({
//               notificationId,
//               date: triggerDate.toISOString(),
//               time: timeObj.time,
//             });
//           }
//         }
//       }

//       console.log(`✅ Scheduled ${scheduledIds.length} notifications`);

//       // Store notification IDs in AsyncStorage for later cancellation
//       await this.storeNotificationIds(reminderId, scheduledIds);

//       return scheduledIds;
//     } catch (error) {
//       console.error('Schedule notifications error:', error);
//       throw error;
//     }
//   }

//   // Cancel all notifications for a specific reminder
//   async cancelMedicationReminders(reminderId) {
//     try {
//       const storedIds = await this.getStoredNotificationIds(reminderId);

//       if (storedIds && storedIds.length > 0) {
//         console.log(`🗑️ Cancelling ${storedIds.length} notifications for reminder: ${reminderId}`);

//         for (const item of storedIds) {
//           await Notifications.cancelScheduledNotificationAsync(item.notificationId);
//         }

//         // Remove from storage
//         await this.removeStoredNotificationIds(reminderId);
//       }

//       console.log('✅ Notifications cancelled successfully');
//     } catch (error) {
//       console.error('Cancel notifications error:', error);
//       throw error;
//     }
//   }

//   // Update notifications (cancel old, schedule new)
//   async updateMedicationReminders(reminderId, newReminderData) {
//     try {
//       await this.cancelMedicationReminders(reminderId);
//       await this.scheduleMedicationReminders({ ...newReminderData, reminderId });
//     } catch (error) {
//       console.error('Update notifications error:', error);
//       throw error;
//     }
//   }

//   // Store notification IDs in AsyncStorage
//   async storeNotificationIds(reminderId, notificationIds) {
//     try {
//       const AsyncStorage = require('@react-native-async-storage/async-storage').default;
//       const key = `notification_ids_${reminderId}`;
//       await AsyncStorage.setItem(key, JSON.stringify(notificationIds));
//     } catch (error) {
//       console.error('Store notification IDs error:', error);
//     }
//   }

//   // Get stored notification IDs
//   async getStoredNotificationIds(reminderId) {
//     try {
//       const AsyncStorage = require('@react-native-async-storage/async-storage').default;
//       const key = `notification_ids_${reminderId}`;
//       const data = await AsyncStorage.getItem(key);
//       return data ? JSON.parse(data) : [];
//     } catch (error) {
//       console.error('Get notification IDs error:', error);
//       return [];
//     }
//   }

//   // Remove stored notification IDs
//   async removeStoredNotificationIds(reminderId) {
//     try {
//       const AsyncStorage = require('@react-native-async-storage/async-storage').default;
//       const key = `notification_ids_${reminderId}`;
//       await AsyncStorage.removeItem(key);
//     } catch (error) {
//       console.error('Remove notification IDs error:', error);
//     }
//   }

//   // Get all scheduled notifications (for debugging)
//   async getAllScheduledNotifications() {
//     try {
//       const notifications = await Notifications.getAllScheduledNotificationsAsync();
//       console.log(`📋 Total scheduled notifications: ${notifications.length}`);
//       return notifications;
//     } catch (error) {
//       console.error('Get scheduled notifications error:', error);
//       return [];
//     }
//   }

//   // Cancel all scheduled notifications
//   async cancelAllNotifications() {
//     try {
//       await Notifications.cancelAllScheduledNotificationsAsync();
//       console.log('✅ All notifications cancelled');
//     } catch (error) {
//       console.error('Cancel all notifications error:', error);
//     }
//   }

//   // Set up notification listeners
//   setupNotificationListeners(onNotificationReceived, onNotificationResponse) {
//     // Listener for when notification is received while app is foregrounded
//     this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
//       console.log('📬 Notification received:', notification);
//       if (onNotificationReceived) {
//         onNotificationReceived(notification);
//       }
//     });

//     // Listener for when user interacts with notification
//     this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
//       console.log('👆 Notification tapped:', response);
//       if (onNotificationResponse) {
//         onNotificationResponse(response);
//       }
//     });
//   }

//   // Remove notification listeners
//   removeNotificationListeners() {
//     if (this.notificationListener) {
//       Notifications.removeNotificationSubscription(this.notificationListener);
//     }
//     if (this.responseListener) {
//       Notifications.removeNotificationSubscription(this.responseListener);
//     }
//   }
// }

// export default new NotificationService();
