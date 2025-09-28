
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase-config';
import { UserProfile } from '@/types/setting';
import { showError } from '@/utils/error';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    showError(error);
    return null;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, data);
  } catch (error) {
    showError(error);
  }
};

export const createUserProfile = async (uid: string, data: UserProfile): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await setDoc(userDocRef, data);
    } catch (error) {
        showError(error);
    }
};

export const deleteUserAccount = async (uid: string): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await updateDoc(userDocRef, { deleted: true });
    } catch (error) {
        showError(error);
    }
};
