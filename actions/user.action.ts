
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase-config';
import { UserProfile } from '@/types/setting';

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      return userDoc.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw error;
  }
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>): Promise<void> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, data);
  } catch (error) {
    console.error("Error updating user profile: ", error);
    throw error;
  }
};

export const createUserProfile = async (uid: string, data: UserProfile): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await setDoc(userDocRef, data);
    } catch (error) {
        console.error("Error creating user profile: ", error);
        throw error;
    }
};

export const deleteUserAccount = async (uid: string): Promise<void> => {
    try {
        const userDocRef = doc(firestore, 'users', uid);
        await updateDoc(userDocRef, { deleted: true });
    } catch (error) {
        console.error("Error deleting user account: ", error);
        throw error;
    }
};
