import { updateSetting } from '@/actions/setting.action';
import { deleteUserAccount, getUserProfile } from '@/actions/user.action';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { SettingsItem, settingsSections } from '@/config/settings';
import { Colors } from '@/constants/theme';
import { auth } from '@/firebase-config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { showError } from '@/utils/error';
import { Feather } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, StyleSheet, Switch, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const [pushEnabled, setPushEnabled] = useState(false);
  const [emailUpdates, setEmailUpdates] = useState(false);
  const [marketingTips, setMarketingTips] = useState(false);
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchSettings = async () => {
      if (user) {
        try {
          const userProfile = await getUserProfile(user.uid);
          if (userProfile) {
            setPushEnabled(userProfile.pushEnabled);
            setEmailUpdates(userProfile.emailUpdates);
            setMarketingTips(userProfile.marketingTips);
          }
        } catch (error) {
          showError(error);
        }
      }
    };
    fetchSettings();
  }, [user]);

  const handleToggle = async (key: string, value: boolean) => {
    if (user) {
      setLoading((prev) => ({ ...prev, [key]: true }));
      try {
        await updateSetting(user.uid, key, value);

        if (key === 'pushEnabled') {
          setPushEnabled(value);
        }
        if (key === 'emailUpdates') {
          setEmailUpdates(value);
        }
        if (key === 'marketingTips') {
          setMarketingTips(value);
        }
      } catch (error) {
        showError(error);
      } finally {
        setLoading((prev) => ({ ...prev, [key]: false }));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      showError(error);
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert('Delete Account', 'Are you sure you want to permanently delete your account? This action is irreversible.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (user) {
            try {
              await deleteUserAccount(user.uid);
              await deleteUser(user);
            } catch (error: unknown) {
              showError(error);
            }
          }
        },
      },
    ]);
  };

  const handlePress = (item: SettingsItem) => {
    if (item.type === 'link' && item.href) {
      router.push(item.href as Href);
    } else if (item.type === 'danger') {
      if (item.action === 'logout') {
        handleLogout();
      } else if (item.action === 'deleteAccount') {
        handleDeleteAccount();
      }
    }
  };

  const styles = StyleSheet.create({
    container: {
      padding: 16,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 24,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginRight: 16,
      backgroundColor: '#ccc',
    },
    section: {
      marginBottom: 24,
    },
    sectionItems: {
      borderRadius: 12,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: Colors[colorScheme ?? 'light'].border,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      minHeight: 56,
      borderBottomWidth: 1,
      borderBottomColor: Colors[colorScheme ?? 'light'].border,
    },
    settingInfo: {
      flex: 1,
      marginLeft: 16,
    },
  });

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image source={{ uri: user?.photoURL ?? 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
          <View>
            <ThemedText type="h2">{user?.displayName}</ThemedText>
            <ThemedText style={{ color: Colors[colorScheme ?? 'light']['text-muted'] }}>{user?.email}</ThemedText>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <ThemedText style={{ color: Colors[colorScheme ?? 'light'].tint }}>Edit profile ›</ThemedText>
            </TouchableOpacity>
          </View>
        </View>

        {settingsSections.map((section) => (
          <View key={section.title} style={styles.section}>
            {section.title && <ThemedText type="h2">{section.title}</ThemedText>}
            <View style={styles.sectionItems}>
              {section.items.map((item) => (
                <TouchableOpacity key={item.title} style={styles.settingRow} onPress={() => handlePress(item)} disabled={item.type === 'toggle' || item.type === 'label'}>
                  <Feather
                    name={item.icon as unknown as React.ComponentProps<typeof Feather>['name']}
                    size={20}
                    color={item.type === 'danger' ? Colors[colorScheme ?? 'light'].error : Colors[colorScheme ?? 'light'].text}
                  />
                  <View style={styles.settingInfo}>
                    <ThemedText style={{ color: item.type === 'danger' ? Colors[colorScheme ?? 'light'].error : Colors[colorScheme ?? 'light'].text }}>{item.title}</ThemedText>
                    {item.subtitle && (
                      <ThemedText type="caption" style={{ color: Colors[colorScheme ?? 'light']['text-muted'] }}>
                        {item.subtitle}
                      </ThemedText>
                    )}
                  </View>
                  {item.type === 'toggle' &&
                    (loading[item.key] ? (
                      <ActivityIndicator />
                    ) : (
                      <Switch value={item.key === 'pushEnabled' ? pushEnabled : item.key === 'emailUpdates' ? emailUpdates : marketingTips} onValueChange={(value) => handleToggle(item.key, value)} />
                    ))}
                  {item.type === 'label' && (
                    <ThemedText type="caption" style={{ color: Colors[colorScheme ?? 'light']['text-muted'] }}>
                      {item.value}
                    </ThemedText>
                  )}
                  {(item.type === 'link' || item.type === 'danger') && <Feather name="chevron-right" size={24} color={Colors[colorScheme ?? 'light']['text-muted']} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
