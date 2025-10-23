import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { getShadow } from '@/constants/style-utils';
import { useAlert } from '@/hooks/use-alert';
import { useOnboarding } from '@/hooks/use-onboarding-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { logger } from '@/utils/logger';
import { Ionicons } from '@expo/vector-icons';
import * as Device from 'expo-device';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

// Notifications availability check
const isNotificationsAvailable = (): boolean => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-notifications');
    return true;
  } catch (_error: unknown) {
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
  const primaryColor = useThemeColor({}, 'primary');
  const backgroundColor = useThemeColor({}, 'bg');
  const successColor = useThemeColor({}, 'success');
  const errorColor = useThemeColor({}, 'error');
  const warningColor = useThemeColor({}, 'warning');
  const shadowColor = useThemeColor({}, 'text');
  const { setNotificationPermission, trackSlideSkip } = useOnboarding();
  const { show: showAlert, AlertComponent } = useAlert();

  const [permissionStatus, setPermissionStatus] = useState<'undetermined' | 'granted' | 'denied'>('undetermined');
  const [isLoading, setIsLoading] = useState(false);
  const [hasCheckedPermission, setHasCheckedPermission] = useState(false);

  useEffect(() => {
    checkNotificationPermission();
  }, []);

  const checkNotificationPermission = async () => {
    try {
      if (!isNotificationsAvailable()) {
        setPermissionStatus('denied');
        setHasCheckedPermission(true);
        return;
      }

      const Notifications = getNotifications();
      const { status } = await Notifications.getPermissionsAsync();
      setPermissionStatus(status);
      setHasCheckedPermission(true);
    } catch (_error: unknown) {
      setHasCheckedPermission(true);
    }
  };
  const requestNotificationPermission = async () => {
    if (!Device.isDevice) {
      showAlert(i18n.t('onb.notifications.error.title'), i18n.t('onb.notifications.error.emulator'), [{ text: 'OK', onPress: onNext }], { variant: 'error' });
      return;
    }

    if (!isNotificationsAvailable()) {
      showAlert('Notifications Unavailable', 'Push notifications require a development build. Please use expo-dev-client instead of Expo Go.', [{ text: 'Skip', onPress: onSkip }], {
        variant: 'warning',
      });
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
          lightColor: primaryColor,
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

        showAlert(i18n.t('onb.notifications.success.title'), i18n.t('onb.notifications.success.message'), [{ text: i18n.t('onb.cta.next'), onPress: onNext }], { variant: 'success' });
      } else {
        showAlert(
          i18n.t('onb.notifications.denied.title'),
          i18n.t('onb.notifications.denied.message'),
          [
            { text: i18n.t('onb.notifications.openSettings'), onPress: handleOpenSettings },
            { text: i18n.t('onb.notifications.skipButton'), onPress: onSkip, style: 'cancel' },
          ],
          { variant: 'warning' }
        );
      }
    } catch (_error: unknown) {
      logger.error('Error requesting notification permissions:', _error);
      showAlert(i18n.t('onb.notifications._error.title'), i18n.t('onb.notifications._error.message'), [{ text: 'OK' }], { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSettings = useCallback(() => {
    showAlert(i18n.t('onb.notifications.settings.title'), i18n.t('onb.notifications.settings.message'), [{ text: 'OK', onPress: onSkip }]);
  }, [onSkip, showAlert]);

  const handleSkip = useCallback(() => {
    showAlert(i18n.t('onb.notifications.skipConfirm.title'), i18n.t('onb.notifications.skipConfirm.message'), [
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
  }, [onSkip, setNotificationPermission, trackSlideSkip, showAlert]);

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
        return successColor;
      case 'denied':
        return errorColor;
      default:
        return primaryColor;
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
              <Ionicons name="checkmark-circle" size={20} color={successColor} />
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
      <ThemedView style={styles.content}>
        <ThemedView style={styles.iconContainer}>
          <ThemedView style={[styles.iconCircle, { backgroundColor: getStatusColor(), shadowColor }, getShadow('md')]}>
            <Ionicons name={getStatusIcon() as keyof typeof Ionicons.glyphMap} size={64} color={backgroundColor} />
          </ThemedView>
        </ThemedView>

        <ThemedText type="h1" style={styles.title}>
          {i18n.t('onb.notifications.title')}
        </ThemedText>

        {renderContent()}

        {permissionStatus === 'denied' && (
          <ThemedView style={[styles.warningContainer, { backgroundColor: warningColor + '1A' }]}>
            <Ionicons name="warning" size={20} color={warningColor} />
            <ThemedText type="caption" style={[styles.warningText, { color: warningColor }]}>
              {i18n.t('onb.notifications.settingsNote')}
            </ThemedText>
          </ThemedView>
        )}
      </ThemedView>
      {AlertComponent}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 600,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow added dynamically via getShadow()
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
    fontWeight: Typography.h1.fontWeight,
  },
  description: {
    marginBottom: Spacing.xl,
    textAlign: 'center',
    lineHeight: Typography.body.lineHeight,
  },
  benefitsContainer: {
    width: '100%',
    marginBottom: Spacing.xl,
  },
  benefitsTitle: {
    marginBottom: Spacing.md,
    fontWeight: Typography.h3.fontWeight,
    textAlign: 'center',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  benefitText: {
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: Typography.caption.lineHeight,
    flexShrink: 1,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.sm,
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
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.sm,
  },
  warningText: {
    marginLeft: Spacing.sm,
    flex: 1,
    fontSize: Typography.caption.fontSize,
    textAlign: 'center',
  },
});
