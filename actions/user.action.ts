import { firestore } from "@/firebase-config";
import { UserProfile } from "@/types/user";
import * as cache from "@/utils/cache";
import { showError } from "@/utils/error";
import { sanitizeUserProfile } from "@/utils/sanitize";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

/**
 * Get user profile from Firestore with caching
 * @param uid - User ID
 * @returns User profile or null if not found
 */
export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    if (!uid) {
      console.error("[UserAction] getUserProfile called with empty uid");
      return null;
    }

    const cacheKey = `user-profile-${uid}`;
    const cachedProfile = cache.get(cacheKey);
    if (cachedProfile) {
      return cachedProfile as UserProfile;
    }

    const userDocRef = doc(firestore, "users", uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userProfile = userDoc.data() as UserProfile;
      cache.set(cacheKey, userProfile);
      return userProfile;
    }
    return null;
  } catch (error) {
    console.error("[UserAction] Error getting user profile:", error);
    showError(error);
    return null;
  }
};

/**
 * Update user profile in Firestore and invalidate cache
 * @param uid - User ID
 * @param data - Partial user profile data to update
 */
export const updateUser = async (
  uid: string,
  data: Partial<UserProfile>
): Promise<void> => {
  try {
    if (!uid) {
      console.error("[UserAction] updateUser called with empty uid");
      return;
    }

    // Sanitize user input before saving
    const sanitizedData = sanitizeUserProfile(data);

    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, sanitizedData);

    // Invalidate cache instead of setting partial data
    cache.invalidate(`user-profile-${uid}`);
  } catch (error) {
    console.error("[UserAction] Error updating user:", error);
    showError(error);
  }
};

/**
 * Create new user profile in Firestore
 * @param uid - User ID
 * @param data - Complete user profile data
 */
export const createUserProfile = async (
  uid: string,
  data: UserProfile
): Promise<void> => {
  try {
    if (!uid) {
      console.error("[UserAction] createUserProfile called with empty uid");
      return;
    }

    // Sanitize user input before saving
    const sanitizedData = sanitizeUserProfile(data);

    const userDocRef = doc(firestore, "users", uid);
    await setDoc(userDocRef, sanitizedData);
    cache.set(`user-profile-${uid}`, sanitizedData);
  } catch (error) {
    console.error("[UserAction] Error creating user profile:", error);
    showError(error);
  }
};

/**
 * Soft delete user account (mark as deleted)
 * @param uid - User ID
 */
export const deleteUserAccount = async (uid: string): Promise<void> => {
  try {
    if (!uid) {
      console.error("[UserAction] deleteUserAccount called with empty uid");
      return;
    }

    const userDocRef = doc(firestore, "users", uid);
    await updateDoc(userDocRef, {
      deleted: true,
      deletedAt: new Date().toISOString(),
    });

    // Invalidate cache
    cache.invalidate(`user-profile-${uid}`);
  } catch (error) {
    console.error("[UserAction] Error deleting user account:", error);
    showError(error);
  }
};
