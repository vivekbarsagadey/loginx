import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Platform, StyleSheet } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

// Notifications availability check
const isNotificationsAvailable = (): boolean => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-notifications');
    return true;
  } catch {
    return false;
  }
};

const getNotifications = () => {
  if (!isNotificationsAvailable()) {
    throw new Error('Push notifications require a development build. Please use expo-dev-client instead of Expo Go.');
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('expo-notifications');
};

interface NotificationSlideProps {
  width: number;
  onNext?: () => void;
  onSkip?: () => void;
}

export const NotificationSlide = ({ width, onNext, onSkip }: NotificationSlideProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const { setNotificationPermission, trackSlideSkip } = useOnboarding();

  const warningColor = useThemeColor({}, 'warning');
  const shadowColor = useThemeColor({}, 'text');

  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      if (!isNotificationsAvailable()) {
        console.warn('[Notifications] Notifications not available in Expo Go');
        setPermissionStatus('denied');
        setHasCheckedPermission(true);
        return;
      }

      const Notifications = getNotifications();
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      setHasCheckedPermission(true);
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      setHasCheckedPermission(true);
    }
  };
  const requestNotificationPermission = async () => {
    if (!Device.isDevice) {
      Alert.alert(i18n.t('onb.notifications.error.title'), i18n.t('onb.notifications.error.emulator'), [{ text: 'OK', onPress: onNext }]);
      return;
    }

    if (!isNotificationsAvailable()) {
      Alert.alert('Notifications Unavailable', 'Push notifications require a development build. Please use expo-dev-client instead of Expo Go.', [{ text: 'Skip', onPress: onSkip }]);
      return;
    }

    setIsLoading(true);
    try {
      const Notifications = getNotifications();

      // Configure notification channel for Android
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: theme.primary,
          enableLights: true,
          enableVibrate: true,
        });
      }

      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowDisplayInCarPlay: true,
          allowCriticalAlerts: false,
          provideAppNotificationSettings: true,
          allowProvisional: false,
        },
      });

      setPermissionStatus(status);

      if (status === 'granted') {
        // Track permission grant
        await setNotificationPermission(true);

        Alert.alert(i18n.t('onb.notifications.success.title'), i18n.t('onb.notifications.success.message'), [{ text: i18n.t('onb.cta.next'), onPress: onNext }]);
      } else {
        Alert.alert(i18n.t('onb.notifications.denied.title'), i18n.t('onb.notifications.denied.message'), [
          { text: i18n.t('onb.notifications.openSettings'), onPress: handleOpenSettings },
          { text: i18n.t('onb.notifications.skipButton'), onPress: onSkip, style: 'cancel' },
        ]);
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      Alert.alert(i18n.t('onb.notifications.error.title'), i18n.t('onb.notifications.error.message'), [{ text: 'OK' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = useCallback(() => {
    Alert.alert(i18n.t('onb.notifications.settings.title'), i18n.t('onb.notifications.settings.message'), [{ text: 'OK', onPress: onSkip }]);
  }, [onSkip]);

  const handleSkip = useCallback(() => {
    Alert.alert(i18n.t('onb.notifications.skipConfirm.title'), i18n.t('onb.notifications.skipConfirm.message'), [
      { text: i18n.t('onb.notifications.skipConfirm.cancel'), style: 'cancel' },
      {
        text: i18n.t('onb.notifications.skipConfirm.skip'),
        onPress: async () => {
          await setNotificationPermission(false);
          await trackSlideSkip('notifications');
          onSkip?.();
        },
        style: 'destructive',
      },
    ]);
  }, [onSkip, setNotificationPermission, trackSlideSkip]);

  const getStatusIcon = () => {
    switch (permissionStatus) {
      case 'granted':
        return 'notifications';
      case 'denied':
        return 'notifications-off';
      default:
        return 'notifications-outline';
    }
  };

  const getStatusColor = () => {
    switch (permissionStatus) {
      case 'granted':
        return theme.success;
      case 'denied':
        return theme.error;
      default:
        return theme.primary;
    }
  };

  const renderContent = () => {
    if (!hasCheckedPermission) {
      return (
        <ThemedText type="body" style={styles.description}>
          {i18n.t('onb.notifications.checking')}
        </ThemedText>
      );
    }

    if (permissionStatus === 'granted') {
      return (
        <>
          <ThemedText type="body" style={styles.description}>
            {i18n.t('onb.notifications.alreadyEnabled')}
          </ThemedText>
          <ThemedButton title={i18n.t('onb.cta.next')} onPress={onNext} style={styles.primaryButton} />
        </>
      );
    }

    return (
      <>
        <ThemedText type="body" style={styles.description}>
          {i18n.t('onb.notifications.description')}
        </ThemedText>

        <ThemedView style={styles.benefitsContainer}>
          <ThemedText type="h3" style={styles.benefitsTitle}>
            {i18n.t('onb.notifications.benefits.title')}
          </ThemedText>
          {(i18n.t('onb.notifications.benefits.items', { returnObjects: true }) as string[]).map((benefit, index) => (
            <ThemedView key={index} style={styles.benefitItem}>
              <Ionicons name="checkmark-circle" size={20} color={theme.success} />
              <ThemedText type="body" style={styles.benefitText}>
                {benefit}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>

        <ThemedView style={styles.buttonContainer}>
          <ThemedButton title={i18n.t('onb.notifications.enable')} onPress={requestNotificationPermission} disabled={isLoading} loading={isLoading} style={styles.primaryButton} />
          <ThemedButton title={i18n.t('onb.notifications.skipButton')} onPress={handleSkip} variant="secondary" style={styles.secondaryButton} />
        </ThemedView>
      </>
    );
  };

  return (
    <ThemedView style={[styles.container, { width }]}>
      <ThemedView style={styles.iconContainer}>
        <ThemedView style={[styles.iconCircle, { backgroundColor: getStatusColor(), shadowColor }]}>
          <Ionicons name={getStatusIcon() as keyof typeof Ionicons.glyphMap} size={64} color={theme.background} />
        </ThemedView>
      </ThemedView>

      <ThemedText type="h1" style={styles.title}>
        {i18n.t('onb.notifications.title')}
      </ThemedText>

      {renderContent()}

      {permissionStatus === 'denied' && (
        <ThemedView style={[styles.warningContainer, { backgroundColor: warningColor + '1A' }]}>
          <Ionicons name="warning" size={20} color={theme.warning} />
          <ThemedText type="caption" style={[styles.warningText, { color: theme.warning }]}>
            {i18n.t('onb.notifications.settingsNote')}
          </ThemedText>
        </ThemedView>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    fontWeight: '700',
  },
  description: {
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: 32,
  },
  benefitsTitle: {
    marginBottom: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  benefitText: {
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },
  warningText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
});
