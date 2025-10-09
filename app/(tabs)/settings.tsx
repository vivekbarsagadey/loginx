import { deleteUserAccount } from '@/actions/user.action';
import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { Card } from '@/components/ui/card';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { getSettingsSections, SettingsItem } from '@/config/settings';
import { CommonText } from '@/constants/common-styles';
import { Spacing, TouchTarget } from '@/constants/layout';
import { auth } from '@/firebase-config';
import { useConfirmation } from '@/hooks/use-dialog';
import { useLanguage } from '@/hooks/use-language-provider';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { clear as clearCache } from '@/utils/cache';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Href, useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import React, { useMemo } from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const { language } = useLanguage();
  const borderColor = useThemeColor({}, 'border');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const tintColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const textColor = useThemeColor({}, 'text');

  // Get settings sections with current language
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const settingsSections = useMemo(() => getSettingsSections(), [language]);

  // Dialog states
  const logoutDialog = useConfirmation();
  const clearCacheDialog = useConfirmation();
  const deleteAccountDialog = useConfirmation();
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleLogout = async () => {
    logoutDialog.show({
      title: i18n.t('dialogs.settings.logout.title'),
      message: i18n.t('dialogs.settings.logout.message'),
      destructive: false,
      onConfirm: async () => {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          await auth.signOut();
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleClearCache = async () => {
    clearCacheDialog.show({
      title: i18n.t('dialogs.settings.clearCache.title'),
      message: i18n.t('dialogs.settings.clearCache.message'),
      destructive: false,
      onConfirm: async () => {
        try {
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          clearCache();
          showSuccess('Success', 'Cache cleared successfully');
        } catch (error) {
          showError(error);
        }
      },
    });
  };

  const handleDeleteAccount = async () => {
    deleteAccountDialog.show({
      title: i18n.t('dialogs.settings.deleteAccount.title'),
      message: i18n.t('dialogs.settings.deleteAccount.message'),
      destructive: true,
      onConfirm: async () => {
        if (user) {
          try {
            setIsDeleting(true);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            await deleteUserAccount(user.uid);
            await deleteUser(user);
          } catch (error: unknown) {
            showError(error);
          } finally {
            setIsDeleting(false);
          }
        }
      },
    });
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
    <>
      <TabHeader title={i18n.t('navigation.titles.settings')} showBackButton={false} />
      <ScreenContainer scrollable noPadding={false} useSafeArea={false}>
        <Card elevation={1} style={styles.profileCard}>
          <View style={styles.header}>
            <Image source={{ uri: user?.photoURL ?? 'https://www.gravatar.com/avatar/?d=mp' }} style={styles.avatar} />
            <View style={styles.userDetails}>
              <ThemedText type="h2">{user?.displayName}</ThemedText>
              <ThemedText style={styles.userInfo}>{user?.email}</ThemedText>
              <TouchableOpacity onPress={() => router.push('/profile/edit')}>
                <ThemedText style={styles.editProfile}>{i18n.t('settings.editProfile')} ›</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {settingsSections.map((section, sectionIndex) => (
          <View key={section.title || `section-${sectionIndex}`} style={styles.section}>
            {section.title && (
              <ThemedText type="h3" style={CommonText.sectionTitle}>
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

        {/* Confirmation Dialogs */}
        {logoutDialog.config && (
          <ConfirmationDialog
            visible={logoutDialog.visible}
            onClose={logoutDialog.hide}
            title={logoutDialog.config.title}
            message={logoutDialog.config.message}
            confirmText={i18n.t('dialogs.buttons.logOut')}
            cancelText={i18n.t('dialogs.buttons.cancel')}
            onConfirm={logoutDialog.config.onConfirm}
            destructive={logoutDialog.config.destructive}
          />
        )}

        {clearCacheDialog.config && (
          <ConfirmationDialog
            visible={clearCacheDialog.visible}
            onClose={clearCacheDialog.hide}
            title={clearCacheDialog.config.title}
            message={clearCacheDialog.config.message}
            confirmText={i18n.t('dialogs.buttons.clear')}
            cancelText={i18n.t('dialogs.buttons.cancel')}
            onConfirm={clearCacheDialog.config.onConfirm}
            destructive={clearCacheDialog.config.destructive}
          />
        )}

        {deleteAccountDialog.config && (
          <ConfirmationDialog
            visible={deleteAccountDialog.visible}
            onClose={deleteAccountDialog.hide}
            title={deleteAccountDialog.config.title}
            message={deleteAccountDialog.config.message}
            confirmText={i18n.t('dialogs.buttons.delete')}
            cancelText={i18n.t('dialogs.buttons.cancel')}
            onConfirm={deleteAccountDialog.config.onConfirm}
            destructive={deleteAccountDialog.config.destructive}
            loading={isDeleting}
          />
        )}
      </ScreenContainer>
    </>
  );
}
