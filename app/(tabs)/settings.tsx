import { deleteUserAccount } from '@/actions/user.action';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { SettingsItem, settingsSections } from '@/config/settings';
import { Colors } from '@/constants/theme';
import { auth } from '@/firebase-config';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { clear as clearCache } from '@/utils/cache';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Href, useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Log Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              await auth.signOut();
            } catch (error) {
              showError(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleClearCache = async () => {
    Alert.alert(
      'Clear Cache',
      'This will clear all cached data. Your account data will remain safe. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              clearCache();
              showSuccess('Success', 'Cache cleared successfully');
            } catch (error) {
              showError(error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to permanently delete your account? This action cannot be undone and all your data will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (user) {
              try {
                await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                await deleteUserAccount(user.uid);
                await deleteUser(user);
              } catch (error: unknown) {
                showError(error);
              }
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handlePress = async (item: SettingsItem) => {
    // Add haptic feedback for all interactions
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (item.type === 'link' && item.href) {
      router.push(item.href as Href);
    } else if (item.type === 'action') {
      if (item.action === 'clearCache') {
        handleClearCache();
      }
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
      opacity: 0.5,
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
    settingRowLast: {
      borderBottomWidth: 0,
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

        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title || `section-${sectionIndex}`} style={styles.section}>
            {section.title && <ThemedText type="h2">{section.title}</ThemedText>}
            <View style={styles.sectionItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={`${sectionIndex}-${itemIndex}-${item.title}`}
                  style={[styles.settingRow, itemIndex === section.items.length - 1 && styles.settingRowLast]}
                  onPress={() => handlePress(item)}
                >
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
                  {(item.type === 'link' || item.type === 'action' || item.type === 'danger') && <Feather name="chevron-right" size={24} color={Colors[colorScheme ?? 'light']['text-muted']} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
