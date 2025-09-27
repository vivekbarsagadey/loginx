
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase-config';

export const updateSetting = async (uid: string, key: string, value: boolean): Promise<void> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, { [key]: value });
  } catch (error) {
    console.error(`Error updating setting ${key}: `, error);
    throw error;
  }
};
