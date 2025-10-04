import { deleteUserAccount } from '@/actions/user.action';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { SettingsItem, settingsSections } from '@/config/settings';
import { Spacing, TouchTarget } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useThemeColor } from '@/hooks/use-theme-color';
import { clear as clearCache } from '@/utils/cache';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Href, useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import React from 'react';
import { Alert, Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const borderColor = useThemeColor({}, 'border');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const tintColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const textColor = useThemeColor({}, 'text');

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

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        profileCard: {
          marginBottom: Spacing.lg,
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        avatar: {
          width: 64,
          height: 64,
          borderRadius: 32,
          marginRight: Spacing.md,
          opacity: 0.5,
        },
        userDetails: {
          flex: 1,
        },
        userInfo: {
          color: textMutedColor,
          marginTop: Spacing.xs,
        },
        editProfile: {
          color: tintColor,
          marginTop: Spacing.sm,
        },
        section: {
          marginBottom: Spacing.lg,
        },
        sectionTitle: {
          marginBottom: Spacing.sm,
        },
        settingRow: {
          flexDirection: 'row',
          alignItems: 'center',
          padding: Spacing.md,
          minHeight: TouchTarget.large,
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        },
        settingRowLast: {
          borderBottomWidth: 0,
        },
        settingInfo: {
          flex: 1,
          marginLeft: Spacing.md,
        },
        settingTitle: {
          color: textColor,
        },
        settingTitleDanger: {
          color: errorColor,
        },
        settingSubtitle: {
          color: textMutedColor,
        },
      }),
    [borderColor, textMutedColor, tintColor, textColor, errorColor]
  );

  return (
    <ScreenContainer scrollable noPadding={false}>
      <Card elevation={1} style={styles.profileCard}>
        <View style={styles.header}>
          <Image source={{ uri: user?.photoURL ?? 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <ThemedText type="h2">{user?.displayName}</ThemedText>
            <ThemedText style={styles.userInfo}>{user?.email}</ThemedText>
            <TouchableOpacity onPress={() => router.push('/profile/edit')}>
              <ThemedText style={styles.editProfile}>Edit profile ›</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Card>

      {settingsSections.map((section, sectionIndex) => (
        <View key={section.title || `section-${sectionIndex}`} style={styles.section}>
          {section.title && (
            <ThemedText type="h2" style={styles.sectionTitle}>
              {section.title}
            </ThemedText>
          )}
          <Card elevation={1} noPadding>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={`${sectionIndex}-${itemIndex}-${item.title}`}
                style={[styles.settingRow, itemIndex === section.items.length - 1 && styles.settingRowLast]}
                onPress={() => handlePress(item)}
              >
                <Feather name={item.icon as React.ComponentProps<typeof Feather>['name']} size={24} color={item.type === 'danger' ? errorColor : textColor} />
                <View style={styles.settingInfo}>
                  <ThemedText style={item.type === 'danger' ? styles.settingTitleDanger : styles.settingTitle}>{item.title}</ThemedText>
                  {item.subtitle && (
                    <ThemedText type="caption" style={styles.settingSubtitle}>
                      {item.subtitle}
                    </ThemedText>
                  )}
                </View>
                {(item.type === 'link' || item.type === 'action' || item.type === 'danger') && <Feather name="chevron-right" size={24} color={textMutedColor} />}
              </TouchableOpacity>
            ))}
          </Card>
        </View>
      ))}
    </ScreenContainer>
  );
}
