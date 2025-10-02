import { updateSetting } from '@/actions/setting.action';
import { getUserProfile } from '@/actions/user.action';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { Colors } from '@/constants/theme';
import { auth } from '@/firebase-config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { showError } from '@/utils/error';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Switch, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface NotificationSetting {
  key: 'pushEnabled' | 'emailUpdates' | 'marketingTips';
  icon: string;
  title: string;
  description: string;
}

const notificationSettings: NotificationSetting[] = [
  {
    key: 'pushEnabled',
    icon: 'bell',
    title: 'Push Notifications',
    description: 'Receive push notifications for important updates and alerts',
  },
  {
    key: 'emailUpdates',
    icon: 'mail',
    title: 'Email Updates',
    description: 'Get email updates about your account activity and new features',
  },
  {
    key: 'marketingTips',
    icon: 'trending-up',
    title: 'Tips & Recommendations',
    description: 'Receive helpful tips and personalized recommendations',
  },
];

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    pushEnabled: false,
    emailUpdates: false,
    marketingTips: false,
  });
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [initialLoading, setInitialLoading] = useState(true);
  const user = auth.currentUser;

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

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      padding: 16,
    },
    header: {
      marginBottom: 24,
    },
    settingsContainer: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? 'light'].border,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? 'light'].border,
      backgroundColor: Colors[colorScheme ?? 'light'].background,
    },
    settingRowLast: {
      borderBottomWidth: 0,
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: Colors[colorScheme ?? 'light'].tint + '20',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    settingInfo: {
      flex: 1,
      marginRight: 12,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
  });

  if (initialLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[colorScheme ?? 'light'].tint} />
          <ThemedText style={{ marginTop: 16 }}>Loading settings...</ThemedText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ThemedScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <ThemedText type="h2">Notification Preferences</ThemedText>
          <ThemedText type="caption" style={{ marginTop: 8, color: Colors[colorScheme ?? 'light']['text-muted'] }}>
            Choose what notifications you want to receive
          </ThemedText>
        </View>

        <View style={styles.settingsContainer}>
          {notificationSettings.map((setting, index) => (
            <View key={setting.key} style={[styles.settingRow, index === notificationSettings.length - 1 && styles.settingRowLast]}>
              <View style={styles.iconContainer}>
                <Feather name={setting.icon as React.ComponentProps<typeof Feather>['name']} size={20} color={Colors[colorScheme ?? 'light'].tint} />
              </View>
              <View style={styles.settingInfo}>
                <ThemedText style={{ fontWeight: '600', marginBottom: 4 }}>{setting.title}</ThemedText>
                <ThemedText type="caption" style={{ color: Colors[colorScheme ?? 'light']['text-muted'] }}>
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
                    false: Colors[colorScheme ?? 'light'].border,
                    true: Colors[colorScheme ?? 'light'].tint,
                  }}
                />
              )}
            </View>
          ))}
        </View>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
