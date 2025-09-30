
import { firestore } from '@/firebase-config';
import { UserProfile } from '@/types/user';
import * as cache from '@/utils/cache';
import { showError } from '@/utils/error';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const cachedProfile = cache.get(`user-profile-${uid}`);
    if (cachedProfile) {
      return cachedProfile as UserProfile;
    }

    const userDocRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userProfile = userDoc.data() as UserProfile;
      cache.set(`user-profile-${uid}`, userProfile);
      return userProfile;
    }
    return null;
  } catch (error) {
    showError(error);
    return null;
  }
};

export const updateUser = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, data);
    cache.set(`user-profile-${uid}`, data);
  } catch (error) {
    showError(error);
  }
};

export const createUserProfile = async (uid: string, data: UserProfile): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await setDoc(userDocRef, data);
        cache.set(`user-profile-${uid}`, data);
    } catch (error) {
        showError(error);
    }
};

export const deleteUserAccount = async (uid: string): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await updateDoc(userDocRef, { deleted: true });
        cache.set(`user-profile-${uid}`, null);
    } catch (error) {
        showError(error);
    }
};
