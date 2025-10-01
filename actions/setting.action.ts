import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase-config';
import { showError } from '@/utils/error';

export const updateSetting = async (uid: string, key: string, value: boolean): Promise<void> => {
  try {
    const userDocRef = doc(firestore, 'users', uid);
    await updateDoc(userDocRef, { [key]: value });
  } catch (error) {
    showError(error);
  }
};
