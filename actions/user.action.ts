import { FirebaseCollections } from '@/constants';
import { type UserProfile } from '@/types/user';
import { debugError, debugLog } from '@/utils/debug';
import { showError } from '@/utils/error';
import { getData, setData } from '@/utils/local-first';
import { sanitizeUserProfile } from '@/utils/sanitize';

/**
 * LOCAL-FIRST: Get user profile (local first, remote fallback)
 * @param uid - User ID
 * @returns User profile or null if not found
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    if (!uid) {
      debugLog('[UserAction] getUserProfile called with empty uid');
      return null;
    }

    // Use LOCAL-FIRST approach
    const userProfile = await getData<UserProfile>({
      collection: FirebaseCollections.USERS,
      id: uid,
      syncEnabled: true,
    });

    return userProfile;
  } catch (error) {
    debugError('[UserAction] Error getting user profile', error);
    showError(error);
    return null;
  }
};

/**
 * LOCAL-FIRST: Update user profile (saves locally first, syncs in background)
 * @param uid - User ID
 * @param data - Partial user profile data to update
 */
export const updateUser = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    if (!uid) {
      debugLog('[UserAction] updateUser called with empty uid');
      return;
    }

    // Get current profile first
    const currentProfile = await getUserProfile(uid);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    // Merge with existing data and sanitize
    const updatedProfile = { ...currentProfile, ...data };
    const sanitizedData = sanitizeUserProfile(updatedProfile);

    // Use LOCAL-FIRST approach - saves locally immediately, syncs in background
    await setData({
      collection: FirebaseCollections.USERS,
      id: uid,
      data: sanitizedData,
      syncEnabled: true,
    });

    debugLog('[UserAction] ✅ LOCAL-FIRST: User profile updated locally');
  } catch (error) {
    debugError('[UserAction] Error updating user', error);
    showError(error);
  }
};

/**
 * LOCAL-FIRST: Create new user profile (saves locally first, syncs in background)
 * @param uid - User ID
 * @param data - Complete user profile data
 */
export const createUserProfile = async (uid: string, data: UserProfile): Promise<void> => {
  try {
    if (!uid) {
      debugLog('[UserAction] createUserProfile called with empty uid');
      return;
    }

    // Sanitize user input before saving
    const sanitizedData = sanitizeUserProfile(data);

    // Use LOCAL-FIRST approach
    await setData({
      collection: FirebaseCollections.USERS,
      id: uid,
      data: sanitizedData,
      syncEnabled: true,
    });

    debugLog('[UserAction] ✅ LOCAL-FIRST: User profile created locally');
  } catch (error) {
    debugError('[UserAction] Error creating user profile', error);
    showError(error);
  }
};

/**
 * LOCAL-FIRST: Soft delete user account (saves locally first, syncs in background)
 * @param uid - User ID
 */
export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
    if (!uid) {
      debugLog('[UserAction] deleteUserAccount called with empty uid');
      return;
    }

    // Get current profile first
    const currentProfile = await getUserProfile(uid);
    if (!currentProfile) {
      throw new Error('User profile not found');
    }

    // Mark as deleted
    const deletedProfile = {
      ...currentProfile,
      deleted: true,
      deletedAt: new Date().toISOString(),
    };

    // Use LOCAL-FIRST approach
    await setData({
      collection: FirebaseCollections.USERS,
      id: uid,
      data: deletedProfile,
      syncEnabled: true,
    });

    debugLog('[UserAction] ✅ LOCAL-FIRST: User account marked as deleted locally');
  } catch (error) {
    debugError('[UserAction] Error deleting user account', error);
    showError(error);
  }
};
