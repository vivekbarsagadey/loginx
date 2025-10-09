import { updateSetting } from '@/actions/setting.action';
import { getUserProfile } from '@/actions/user.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { showError } from '@/utils/error';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';

interface NotificationSetting {
  key: 'pushEnabled' | 'emailUpdates' | 'marketingTips';
  icon: string;
  title: string;
  description: string;
}

export default function NotificationsScreen() {
  const user = auth.currentUser;
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'bg');
  const tintColor = useThemeColor({}, 'primary');
  const textMutedColor = useThemeColor({}, 'text-muted');

  const [settings, setSettings] = useState<Record<string, boolean>>({
    pushEnabled: false,
    emailUpdates: false,
    marketingTips: false,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);

  const notificationSettings: NotificationSetting[] = [
    {
      key: 'pushEnabled',
      icon: 'bell',
      title: i18n.t('screens.settings.notifications.items.pushEnabled.title'),
      description: i18n.t('screens.settings.notifications.items.pushEnabled.description'),
    },
    {
      key: 'emailUpdates',
      icon: 'mail',
      title: i18n.t('screens.settings.notifications.items.emailUpdates.title'),
      description: i18n.t('screens.settings.notifications.items.emailUpdates.description'),
    },
    {
      key: 'marketingTips',
      icon: 'trending-up',
      title: i18n.t('screens.settings.notifications.items.marketingTips.title'),
      description: i18n.t('screens.settings.notifications.items.marketingTips.description'),
    },
  ];

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          marginBottom: Spacing.lg,
        },
        settingsContainer: {
          borderRadius: BorderRadius.md,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: borderColor,
        },
        settingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: Spacing.md,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
          backgroundColor: backgroundColor,
        },
        settingRowLast: {
          borderBottomWidth: 0,
        },
        iconContainer: {
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: tintColor + '20',
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Spacing.md,
        },
        settingInfo: {
          flex: 1,
          marginRight: Spacing.md,
        },
        settingTitle: {
          fontWeight: Typography.bodyBold.fontWeight,
          marginBottom: Spacing.xs,
        },
        settingDescription: {
          color: textMutedColor,
        },
        loadingContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: Spacing.lg,
        },
        loadingText: {
          marginTop: Spacing.md,
        },
      }),
    [borderColor, backgroundColor, tintColor, textMutedColor]
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
        <ActivityIndicator size="large" color={tintColor} />
        <ThemedText style={styles.loadingText}>{i18n.t('screens.settings.notifications.loading')}</ThemedText>
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
          <View key={setting.key} style={[styles.settingRow, index === notificationSettings.length - 1 && styles.settingRowLast]}>
            <View style={styles.iconContainer}>
              <Feather name={setting.icon as React.ComponentProps<typeof Feather>['name']} size={20} color={tintColor} />
            </View>
            <View style={styles.settingInfo}>
              <ThemedText style={styles.settingTitle}>{setting.title}</ThemedText>
              <ThemedText type="caption" style={styles.settingDescription}>
                {setting.description}
              </ThemedText>
            </View>
            {loading[setting.key] ? (
              <ActivityIndicator />
            ) : (
              <Switch
                value={settings[setting.key]}
                onValueChange={(value) => handleToggle(setting.key, value)}
                trackColor={{
                  false: borderColor,
                  true: tintColor,
                }}
              />
            )}
          </View>
        ))}
      </View>
    </ScreenContainer>
  );
}
