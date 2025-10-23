import { Colors } from '@/constants/theme';
import { firestore } from '@/firebase-config';
import { Config } from '@/utils/config';
import { addNotification } from '@/utils/notification-storage';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { type Subscription } from 'expo-notifications';
import { doc, updateDoc } from 'firebase/firestore';
import { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';

// Configure the notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

/**
 * Check if push notifications are available in the current environment
 * Returns false in Expo Go or if feature is disabled
 */
function isPushNotificationsAvailable(): boolean {
  // Check if push notifications feature is enabled via environment variable
  if (!Config.features.pushNotifications) {
    return false;
  }

  // Check if running in Expo Go (push notifications don't work reliably in Expo Go)
  const isExpoGo = Constants.appOwnership === 'expo';
  if (isExpoGo) {
    return false;
  }

  // Check if it's a physical device
  if (!Device.isDevice) {
    return false;
  }

  return true;
}

async function registerForPushNotificationsAsync() {
  // Check if push notifications are available
  if (!isPushNotificationsAvailable()) {
    return undefined;
  }

  let token;

  try {
    if (Platform.OS === 'android') {
      // Use theme error color for notification LED light
      // Note: Android requires hex format with alpha channel (ARGB)
      // Converting theme error color to ARGB format with ~49% opacity (7C in hex)
      const notificationLightColor = Colors.light.error + '7C'; // e.g., '#DC26267C'

      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: notificationLightColor,
      });
    }

    // Request permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return undefined;
    }

    // Get the Expo push token
    const projectId = Constants.expoConfig?.extra?.projectId;
    if (!projectId) {
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    token = pushToken.data;
  } catch (error: unknown) {
    console.error('[Push Notifications] Error registering:', error);
    return undefined;
  }

  return token;
}

/**
 * Hook for managing push notifications
 * @param uid - User ID to associate the push token with
 * @returns Object containing expoPushToken and latest notification
 *
 * Note: Push notifications are automatically disabled in:
 * - Expo Go (use development build instead)
 * - Simulators/Emulators (use physical device)
 * - When ENABLE_PUSH_NOTIFICATIONS env variable is set to 'false'
 */
export const usePushNotifications = (uid?: string) => {
  // Initialize useState hooks with undefined
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>(undefined);
  const [notification, setNotification] = useState<Notifications.Notification | undefined>(undefined);
  const [isEnabled, setIsEnabled] = useState<boolean>(false);

  // Initialize useRef hooks with undefined
  const notificationListener = useRef<Subscription | undefined>(undefined);
  const responseListener = useRef<Subscription | undefined>(undefined);

  useEffect(() => {
    // Check if push notifications are available
    const available = isPushNotificationsAvailable();
    setIsEnabled(available);

    if (!available) {
      // Push notifications not available, skip initialization
      return;
    }

    // Register for push notifications
    registerForPushNotificationsAsync()
      .then((token) => {
        if (token) {
          setExpoPushToken(token);
        }

        // Update user document with push token
        if (token && uid) {
          const userDocRef = doc(firestore, 'users', uid);
          updateDoc(userDocRef, { expoPushToken: token }).catch((_error) => {
            console._error('[Push Notifications] Error updating user token:', _error);
          });
        }
      })
      .catch((_error) => {
        console._error('[Push Notifications] Error in registration:', _error);
      });

    // Set up notification listeners
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      setNotification(notification);

      // Save notification to history
      const { title, body } = notification.request.content;
      if (title && body) {
        addNotification({
          type: 'info',
          title: title,
          message: body,
        }).catch((_error) => {
          console._error('[Push Notifications] Error saving notification:', _error);
        });
      }
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener((_response) => {
      // Notification response received
    });

    // Cleanup listeners
    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [uid]);

  return { expoPushToken, notification, isEnabled };
};
