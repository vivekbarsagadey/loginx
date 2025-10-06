import { createUserProfile } from '@/actions/user.action';
import { auth } from '@/firebase-config';
import { Config } from '@/utils/config';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as AppleAuthentication from 'expo-apple-authentication';
import Constants from 'expo-constants';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';

// Check if running in Expo Go
const isExpoGo = Constants.appOwnership === 'expo';

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
  } catch {
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
  } catch {
    return false;
  }
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
      showError(
        new Error(
          'Google Sign-In is not available in Expo Go.\n\n' +
            'To use Google Sign-In:\n' +
            '1. Build a development client: expo install expo-dev-client\n' +
            '2. Run: npx expo prebuild\n' +
            '3. Build: eas build --profile development\n\n' +
            'Or continue with email/password authentication.'
        )
      );
      return;
    }

    setLoading(true);

    try {
      const GoogleSignin = getGoogleSignin();

      // Configure Google Sign-In (should be done once, but safe to call multiple times)
      await GoogleSignin.configure({
        webClientId: Config.social.googleWebClientId || '',
        iosClientId: Config.social.googleIosClientId,
        androidClientId: Config.social.googleAndroidClientId,
        offlineAccess: true,
        profileImageSize: 150,
      });

      // Check if device supports Google Play Services (Android)
      await GoogleSignin.hasPlayServices();

      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();

      // Get Google credential
      const googleCredential = GoogleAuthProvider.credential(userInfo.data?.idToken);

      // Sign in to Firebase with Google credential
      const { user } = await signInWithCredential(auth, googleCredential);

      // Check if this is a new user
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isNewUser) {
        // Create user profile for new users
        await createUserProfile(user.uid, {
          displayName: user.displayName || 'User',
          email: user.email || '',
          age: 0,
          photoURL: user.photoURL || '',
          pushEnabled: false,
          emailUpdates: false,
          marketingTips: false,
          address: '',
          city: '',
          state: '',
          zipCode: '',
        });
      }

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccess('Success', isNewUser ? 'Account created successfully!' : 'Signed in successfully!');

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error) {
      console.error('[SocialAuth] Google sign-in error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
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
        throw new Error('Apple Sign-In is only available on iOS devices');
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

      // Check if this is a new user
      const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

      if (isNewUser) {
        // Create user profile for new users
        const fullName = credential.fullName ? `${credential.fullName.givenName || ''} ${credential.fullName.familyName || ''}`.trim() : user.displayName || 'User';

        await createUserProfile(user.uid, {
          displayName: fullName,
          email: credential.email || user.email || '',
          age: 0,
          photoURL: user.photoURL || '',
          pushEnabled: false,
          emailUpdates: false,
          marketingTips: false,
          address: '',
          city: '',
          state: '',
          zipCode: '',
        });
      }

      // Success haptic
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showSuccess('Success', isNewUser ? 'Account created successfully!' : 'Signed in successfully!');

      // Navigate to home
      router.replace('/(tabs)');
    } catch (error: unknown) {
      // User cancelled - don't show error
      if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_REQUEST_CANCELED') {
        // Silently handle cancellation
        setLoading(false);
        return;
      }

      console.error('[SocialAuth] Apple sign-in error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle Facebook Sign-In
   */
  const signInWithFacebook = async () => {
    if (loading) {
      return;
    }

    // Check if Facebook Sign-in is available (not in Expo Go)
    if (!isFacebookSigninAvailable()) {
      showError(
        new Error(
          'Facebook Sign-In is not available in Expo Go.\n\n' +
            'To use Facebook Sign-In:\n' +
            '1. Build a development client: expo install expo-dev-client\n' +
            '2. Install expo-auth-session: expo install expo-auth-session\n' +
            '3. Build: eas build --profile development\n\n' +
            'Or continue with email/password authentication.'
        )
      );
      return;
    }

    setLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { useAuthRequest } = require('expo-auth-session/providers/facebook');

      // Note: This is a simplified implementation
      // In production, you'd use the full expo-auth-session flow
      // For now, we'll show a user-friendly error
      throw new Error(
        'Facebook Sign-In integration is pending.\n\n' +
          `To complete setup:\n` +
          `1. Configure Facebook App at developers.facebook.com\n` +
          `2. Add Facebook App ID to environment variables\n` +
          `3. Implement expo-auth-session flow\n\n` +
          `Facebook App ID: ${Config.services.facebookAppId || 'Not configured'}\n\n` +
          'Please use Google, Apple, or email authentication for now.'
      );

      // Production implementation would look like this:
      /*
      const [request, response, promptAsync] = useAuthRequest({
        clientId: Config.social.facebookAppId || '',
        responseType: ResponseType.Token,
        scopes: ['public_profile', 'email'],
      });

      if (response?.type === 'success') {
        const { access_token } = response.params;
        const credential = FacebookAuthProvider.credential(access_token);
        const { user } = await signInWithCredential(auth, credential);
        
        const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;
        if (isNewUser) {
          await createUserProfile(user.uid, {
            displayName: user.displayName || 'User',
            email: user.email || '',
            age: 0,
            photoURL: user.photoURL || '',
            pushEnabled: false,
            emailUpdates: false,
            marketingTips: false,
            address: '',
            city: '',
            state: '',
            zipCode: '',
          });
        }
        
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showSuccess('Success', isNewUser ? 'Account created successfully!' : 'Signed in successfully!');
        router.replace('/(tabs)');
      }
      */
    } catch (error) {
      console.error('[SocialAuth] Facebook sign-in error:', error);
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showError(error);
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
