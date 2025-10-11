import { deleteUserAccount } from '@/actions/user.action';
import { TabHeader } from '@/components/navigation/TabHeader';
import { type SettingsItemConfig, SettingsSection } from '@/components/organisms/settings-section';
import { UserProfileHeader } from '@/components/organisms/user-profile-header';
import { ScreenContainer } from '@/components/screen-container';
import { ConfirmationDialog } from '@/components/ui/dialog';
import { getSettingsSections } from '@/config/settings';
import { auth } from '@/firebase-config';
import { useConfirmation } from '@/hooks/use-dialog';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { useLanguage } from '@/hooks/use-language-provider';
import i18n from '@/i18n';
import { clear as clearCache } from '@/utils/cache';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { type Href } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import React, { useMemo } from 'react';

export default function SettingsScreen() {
  const { push } = useHapticNavigation();
  const user = auth.currentUser;
  const { language } = useLanguage();

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

  const handlePress = async (item: SettingsItemConfig) => {
    // Add haptic feedback for all interactions
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (item.type === 'link') {
      push(item.href as Href);
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

  return (
    <>
      <TabHeader title={i18n.t('navigation.titles.settings')} showBackButton={false} />
      <ScreenContainer scrollable noPadding={false} useSafeArea={false}>
        <UserProfileHeader avatarUrl={user?.photoURL ?? undefined} displayName={user?.displayName || 'User'} email={user?.email || ''} onEditPress={() => push('/profile/edit')} />

        {settingsSections.map((section, index) => (
          <SettingsSection key={`section-${index}`} title={section.title} items={section.items as SettingsItemConfig[]} onItemPress={handlePress} />
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
