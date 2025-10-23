import { getUserProfile, updateUser } from '@/actions/user.action';
import { debugError, debugLog } from '@/utils/debug';
import { showError } from '@/utils/error';

/**
 * LOCAL-FIRST: Update user notification setting (saves locally first, syncs in background)
 * @param uid - User ID
 * @param key - Setting key (pushEnabled, emailUpdates, marketingTips)
 * @param value - Setting value
 */
export const updateSetting = async (uid: string, key: string, value: boolean): Promise<void> => {
  try {
    if (!uid) {
      debugLog('[SettingAction] updateSetting called with empty uid');
      return;
    }

    // Get current profile first
    const currentProfile = await getUserProfile(uid);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    // Update using LOCAL-FIRST approach via updateUser
    await updateUser(uid, { [key]: value });

    debugLog(`[SettingAction] ✅ LOCAL-FIRST: Setting ${key} updated to ${value}`);
  } catch (_error: unknown) {
    debugError('[SettingAction] Error updating setting', _error);
    showError(_error);
    throw _error; // Re-throw so UI can handle it
  }
};
