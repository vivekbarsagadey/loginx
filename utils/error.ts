
import { Alert } from 'react-native';
import i18n from '@/i18n';

interface ErrorInfo {
  title: string;
  message: string;
}

const getFirebaseError = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-credential':
      return i18n.t('errors.firebase.invalid-credential');
    case 'auth/user-not-found':
      return i18n.t('errors.firebase.user-not-found');
    case 'auth/wrong-password':
      return i18n.t('errors.firebase.wrong-password');
    case 'auth/user-disabled':
      return i18n.t('errors.firebase.user-disabled');
    case 'auth/requires-recent-login':
      return i18n.t('errors.firebase.requires-recent-login');
    case 'auth/email-already-in-use':
      return i18n.t('errors.firebase.email-already-in-use');
    case 'auth/invalid-email':
      return i18n.t('errors.firebase.invalid-email');
    case 'auth/operation-not-allowed':
      return i18n.t('errors.firebase.operation-not-allowed');
    case 'auth/weak-password':
      return i18n.t('errors.firebase.weak-password');
    default:
      return i18n.t('errors.generic.message');
  }
};

export const getErrorInfo = (error: any): ErrorInfo => {
  if (error.isAxiosError && !error.response) {
    return {
      title: i18n.t('errors.network.title'),
      message: i18n.t('errors.network.message'),
    };
  }

  if (error.code && error.code.startsWith('auth/')) {
    return {
      title: i18n.t('errors.firebase.title'),
      message: getFirebaseError(error.code),
    };
  }
  
  return {
    title: i18n.t('errors.generic.title'),
    message: i18n.t('errors.generic.message'),
  };
};

export const showError = (error: any) => {
  const { title, message } = getErrorInfo(error);
  Alert.alert(title, message);
};
