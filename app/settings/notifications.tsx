import { ScreenContainer } from '@/components/screen-container';
import { ThemedListItem } from '@/components/themed-list-item';
import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedText } from '@/components/themed-text';
import { CommonText } from '@/constants/common-styles';
import { Spacing } from '@/constants/layout';
import { getNotificationSettings } from '@/data';
import { useLanguage } from '@/hooks/use-language-provider';
import { useSettings } from '@/hooks/settings/use-settings-context';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import React, { useMemo } from 'react';
import { StyleSheet, Switch, View } from 'react-native';

export default function NotificationsScreen() {
  const { language } = useLanguage();
  const borderColor = useThemeColor({}, 'border');
  const tintColor = useThemeColor({}, 'primary');

  // Use SettingsContext for centralized state management
  const { notifications: settings, updateNotifications, isLoading } = useSettings();

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

  const handleToggle = async (key: keyof typeof settings, value: boolean) => {
    try {
      // Optimistic update happens in SettingsContext
      await updateNotifications({ [key]: value });
    } catch (_error) {
      showError(error);
      // Rollback happens automatically in SettingsContext
    }
  };

  if (isLoading) {
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
              <Switch
                value={settings[setting.key]}
                onValueChange={(value) => handleToggle(setting.key, value)}
                trackColor={{
                  false: borderColor,
                  true: tintColor,
                }}
                disabled={isLoading}
              />
            }
            showBorder={index < notificationSettings.length - 1}
          />
        ))}
      </View>
    </ScreenContainer>
  );
}
