import { updateSetting } from '@/actions/setting.action';
import { getUserProfile } from '@/actions/user.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedListItem } from '@/components/themed-list-item';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedText } from '@/components/themed-text';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { DEFAULT_NOTIFICATION_SETTINGS, getNotificationSettings } from '@/data';
import { auth } from '@/firebase-config';
import { useLanguage } from '@/hooks/use-language-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import type { NotificationSettings } from '@/types/notification-settings';
import { showError } from '@/utils/error';
import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

export default function NotificationsScreen() {
  const user = auth.currentUser;
  const { language } = useLanguage();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'primary');

  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_NOTIFICATION_SETTINGS);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);

  // Re-create notification settings when language changes to update translations
  const notificationSettings = useMemo(() => {
    // Force re-computation when language changes
    void language;
    return getNotificationSettings();
  }, [language]);

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          marginBottom: Spacing.lg,
        },
        settingsContainer: {
          borderWidth: 1,
          borderColor: borderColor,
          borderRadius: 12,
          overflow: 'hidden',
        },
      }),
    [borderColor]
  );

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setSettings({
              pushEnabled: userProfile.pushEnabled,
              emailUpdates: userProfile.emailUpdates,
              marketingTips: userProfile.marketingTips,
            });
          }
        } catch (error) {
          showError(error);
        } finally {
          setInitialLoading(false);
        }
      }
    };
    fetchSettings();
  }, [user]);

  const handleToggle = async (key: string, value: boolean) => {
    if (!user) {
      return;
    }

    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await updateSetting(user.uid, key, value);
      setSettings((prev) => ({ ...prev, [key]: value }));
    } catch (error) {
      showError(error);
      // Revert the change on error
      setSettings((prev) => ({ ...prev, [key]: !value }));
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  if (initialLoading) {
    return (
      <ScreenContainer centerContent useSafeArea={false}>
        <ThemedLoadingSpinner size="large" text={i18n.t('screens.settings.notifications.loading')} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer scrollable useSafeArea={false}>
      <View style={styles.header}>
        <ThemedText type="h2">{i18n.t('screens.settings.notifications.title')}</ThemedText>
        <ThemedText type="caption" style={CommonText.descriptionText}>
          {i18n.t('screens.settings.notifications.subtitle')}
        </ThemedText>
      </View>

      <View style={styles.settingsContainer}>
        {notificationSettings.map((setting, index) => (
          <ThemedListItem
            key={setting.key}
            icon={setting.icon}
            title={setting.title}
            description={setting.description}
            showChevron={false}
            rightElement={
              loading[setting.key] ? (
                <ThemedLoadingSpinner size="small" />
              ) : (
                <Switch
                  value={settings[setting.key]}
                  onValueChange={(value) => handleToggle(setting.key, value)}
                  trackColor={{
                    false: borderColor,
                    true: tintColor,
                  }}
                />
              )
            }
            showBorder={index < notificationSettings.length - 1}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
