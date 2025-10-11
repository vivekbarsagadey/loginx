import { updateUser } from '@/actions/user.action';
import { CacheConstants } from '@/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { updateProfile, type User } from 'firebase/auth';

interface PendingProfileData {
  displayName: string;
  photoURL: string;
  completedAt: number;
}

const PENDING_PROFILE_KEY = 'pendingProfileData';

/**
 * Save profile data to AsyncStorage for later application after authentication
 */
export async function savePendingProfileData(data: PendingProfileData): Promise<void> {
  try {
    await AsyncStorage.setItem(PENDING_PROFILE_KEY, JSON.stringify(data));
  } catch (error) {
    throw error;
  }
}

/**
 * Retrieve pending profile data from AsyncStorage
 */
export async function getPendingProfileData(): Promise<PendingProfileData | null> {
  try {
    const data = await AsyncStorage.getItem(PENDING_PROFILE_KEY);
    if (data) {
      return JSON.parse(data) as PendingProfileData;
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Apply pending profile data to authenticated user and clear from storage
 */
export async function applyPendingProfileData(user: User): Promise<boolean> {
  try {
    const pendingData = await getPendingProfileData();

    if (!pendingData) {
      return false;
    }

    // Check if data is not too old (24 hours)
    const isDataFresh = Date.now() - pendingData.completedAt < CacheConstants.PERSISTENT_DURATION;

    if (!isDataFresh) {
      await clearPendingProfile();
      return false;
    }

    const updateData: { displayName?: string; photoURL?: string } = {};

    // Only apply non-empty values
    if (pendingData.displayName?.trim()) {
      updateData.displayName = pendingData.displayName.trim();
    }

    if (pendingData.photoURL?.trim()) {
      updateData.photoURL = pendingData.photoURL.trim();
    }

    // Apply to Firebase Auth if we have updates
    if (Object.keys(updateData).length > 0) {
      await updateProfile(user, updateData);
    }

    // Apply to Firestore user profile
    if (updateData.displayName || updateData.photoURL) {
      await updateUser(user.uid, updateData);
    }

    // Clear pending data after successful application
    await clearPendingProfile();

    return true;
  } catch (error) {
    console.error('Failed to apply pending profile data:', error);
    // Don't throw - this is a non-critical operation
    return false;
  }
}

/**
 * Clear pending profile data from storage
 */
export async function clearPendingProfile(): Promise<void> {
  try {
    await AsyncStorage.removeItem(PENDING_PROFILE_KEY);
  } catch (error) {
    // Silently fail - not critical
  }
}

/**
 * Check if there is pending profile data
 */
export async function hasPendingProfileData(): Promise<boolean> {
  try {
    const data = await getPendingProfileData();
    return data !== null;
  } catch (_error) {
    return false;
  }
}
