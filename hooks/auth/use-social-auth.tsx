import { auth } from '@/firebase-config';
import { Config } from '@/utils/config';
import { showError } from '@/utils/error';
import { provideErrorFeedback } from '@/utils/feedback';
import { getAppleFullName, handleSocialAuthError, handleSocialAuthSuccess, isAuthCancellation } from '@/utils/social-auth-helpers';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

// Error messages as constants for maintainability
const ERROR_MESSAGES = {
  GOOGLE_NOT_AVAILABLE:
    'Google Sign-In is not available in Expo Go.\n\n' +
    'To use Google Sign-In:\n' +
    '1. Build a development client: expo install expo-dev-client\n' +
    '2. Run: npx expo prebuild\n' +
    '3. Build: eas build --profile development\n\n' +
    'Or continue with email/password authentication.',
  APPLE_IOS_ONLY: 'Apple Sign-In is only available on iOS devices',
  FACEBOOK_NOT_AVAILABLE:
    'Facebook Sign-In is not available in Expo Go.\n\n' +
    'To use Facebook Sign-In:\n' +
    '1. Build a development client: expo install expo-dev-client\n' +
    '2. Install expo-auth-session: expo install expo-auth-session\n' +
    '3. Build: eas build --profile development\n\n' +
    'Or continue with email/password authentication.',
  FACEBOOK_PENDING:
    'Facebook Sign-In integration is pending.\n\n' +
    'To complete setup:\n' +
    '1. Configure Facebook App at developers.facebook.com\n' +
    '2. Add Facebook App ID to environment variables\n' +
    '3. See docs/FACEBOOK_AUTH_IMPLEMENTATION.md for full implementation\n\n' +
    'Facebook App ID: {appId}\n\n' +
    'Please use Google, Apple, or email authentication for now.',
} as const;

// Google Sign-in availability check - returns false in Expo Go
const isGoogleSigninAvailable = (): boolean => {
  // Always return false in Expo Go to prevent module loading
  if (isExpoGo) {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@react-native-google-signin/google-signin');
    return true;
  } catch (_error: unknown) {
    return false;
  }
};

const getGoogleSignin = () => {
  if (!isGoogleSigninAvailable()) {
    throw new Error('Google Sign-in requires a development build. Please use "expo-dev-client" instead of Expo Go.');
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('@react-native-google-signin/google-signin').GoogleSignin;
};

// Facebook Sign-in availability check - returns false in Expo Go
const isFacebookSigninAvailable = (): boolean => {
  // Always return false in Expo Go to prevent module loading
  if (isExpoGo) {
    return false;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('expo-auth-session/providers/facebook');
    return true;
  } catch (_error: unknown) {
    return false;
  }
};

/**
 * Configure Google Sign-In SDK
 * Separated for testability and clarity
 */
interface GoogleSignInModule {
  configure: (config: { webClientId?: string; iosClientId?: string; offlineAccess?: boolean; profileImageSize?: number }) => Promise<void>;
  hasPlayServices: () => Promise<boolean>;
  signIn: () => Promise<{ data?: { idToken?: string } }>;
}

const configureGoogleSignIn = async (GoogleSigninInstance: GoogleSignInModule) => {
  await GoogleSigninInstance.configure({
    webClientId: Config.social.googleWebClientId || '',
    iosClientId: Config.social.googleIosClientId,
    offlineAccess: true,
    profileImageSize: 150,
  });
};

/**
 * Hook to handle social authentication (Google, Apple & Facebook)
 */
export function useSocialAuth() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  /**
   * Handle Google Sign-In
   */
  const signInWithGoogle = async () => {
    if (loading) {
      return;
    }

    // Check if Google Sign-in is available (not in Expo Go)
    if (!isGoogleSigninAvailable()) {
      showError(new Error(ERROR_MESSAGES.GOOGLE_NOT_AVAILABLE));
      return;
    }

    setLoading(true);

    try {
      const GoogleSignin = getGoogleSignin();

      // Configure Google Sign-In
      await configureGoogleSignIn(GoogleSignin);

      // Check if device supports Google Play Services (Android)
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      // Get Google credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);

      // Sign in to Firebase with Google credential
      const { user } = await signInWithCredential(auth, googleCredential);

      // Handle successful authentication (creates profile, feedback, navigation)
      await handleSocialAuthSuccess(user, undefined, undefined, router);
    } catch (_error: unknown) {
      await handleSocialAuthError(_error, 'Google sign-in error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Apple Sign-In
   */
  const signInWithApple = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (Platform.OS !== 'ios') {
        // Apple Sign-In is only supported on iOS in this implementation
        // For web/Android, you'd need to implement OAuth flow
        throw new Error(ERROR_MESSAGES.APPLE_IOS_ONLY);
      }

      // Perform Apple authentication
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [AppleAuthentication.AppleAuthenticationScope.FULL_NAME, AppleAuthentication.AppleAuthenticationScope.EMAIL],
      });

      // Create OAuth credential for Firebase
      const provider = new OAuthProvider('apple.com');
      const oauthCredential = provider.credential({
        idToken: credential.identityToken || '',
        rawNonce: credential.fullName?.givenName || undefined,
      });

      // Sign in to Firebase with Apple credential
      const { user } = await signInWithCredential(auth, oauthCredential);

      // Extract full name from Apple credential
      const fullName = getAppleFullName(credential.fullName?.givenName, credential.fullName?.familyName, user.displayName || 'User');

      // Handle successful authentication (creates profile, feedback, navigation)
      await handleSocialAuthSuccess(user, fullName, credential.email || user.email || '', router);
    } catch (_error: unknown) {
      // User cancelled - don't show error
      if (isAuthCancellation(_error)) {
        setLoading(false);
        return;
      }

      await handleSocialAuthError(_error, 'Apple sign-in error');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Facebook Sign-In
   * Full implementation available in docs/FACEBOOK_AUTH_IMPLEMENTATION.md
   */
  const signInWithFacebook = async () => {
    if (loading) {
      return;
    }

    // Check if Facebook Sign-in is available (not in Expo Go)
    if (!isFacebookSigninAvailable()) {
      showError(new Error(ERROR_MESSAGES.FACEBOOK_NOT_AVAILABLE));
      return;
    }

    setLoading(true);

    try {
      // Note: Facebook authentication integration is pending
      // See docs/FACEBOOK_AUTH_IMPLEMENTATION.md for complete implementation guide
      const errorMessage = ERROR_MESSAGES.FACEBOOK_PENDING.replace('{appId}', Config.services.facebookAppId || 'Not configured');
      throw new Error(errorMessage);
    } catch (_error: unknown) {
      await provideErrorFeedback(_error);
    } finally {
      setLoading(false);
    }
  };

  return {
    signInWithGoogle,
    signInWithApple,
    signInWithFacebook,
    loading,
  };
}
