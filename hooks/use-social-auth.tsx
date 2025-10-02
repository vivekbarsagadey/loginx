import { createUserProfile } from '@/actions/user.action';
import { auth } from '@/firebase-config';
import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { GoogleAuthProvider, OAuthProvider, signInWithCredential } from 'firebase/auth';
import { useState } from 'react';
import { Platform } from 'react-native';

/**
 * Hook to handle social authentication (Google & Apple)
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

    setLoading(true);

    try {
      // Configure Google Sign-In (should be done once, but safe to call multiple times)
      await GoogleSignin.configure({
        // You need to get this from Firebase Console
        // https://console.firebase.google.com/ -> Project Settings -> General -> Your apps
        webClientId: process.env.GOOGLE_WEB_CLIENT_ID || '',
        offlineAccess: true,
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

  return {
    signInWithGoogle,
    signInWithApple,
    loading,
  };
}
