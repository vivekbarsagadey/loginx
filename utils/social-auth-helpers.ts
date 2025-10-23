/**
 * Social Authentication Helper Functions
 * Consolidates common patterns in social auth flows
 */

import { createUserProfile } from '@/actions/user.action';
import { Routes } from '@/constants/routes';
import type { Router } from 'expo-router';
import type { User as FirebaseUser } from 'firebase/auth';
import { provideErrorFeedback, provideSuccessFeedback } from './feedback';

/**
 * Default user profile data structure
 */
const getDefaultUserProfile = () => ({
  age: 0,
  pushEnabled: false,
  emailUpdates: false,
  marketingTips: false,
  address: '',
  city: '',
  state: '',
  zipCode: '',
});

/**
 * Handle successful social authentication
 * Creates user profile if new user, provides feedback, and navigates to home
 */
export const handleSocialAuthSuccess = async (user: FirebaseUser, displayNameOverride?: string, emailOverride?: string, router?: Router): Promise<void> => {
  // Check if this is a new user
  const isNewUser = user.metadata.creationTime === user.metadata.lastSignInTime;

  if (isNewUser) {
    // Create user profile for new users
    await createUserProfile(user.uid, {
      displayName: displayNameOverride || user.displayName || 'User',
      email: emailOverride || user.email || '',
      photoURL: user.photoURL || '',
      ...getDefaultUserProfile(),
    });
  }

  // Provide success feedback
  await provideSuccessFeedback('Success', isNewUser ? 'Account created successfully!' : 'Signed in successfully!');

  // Navigate to home if router is provided
  if (router) {
    router.replace(Routes.TABS.HOME);
  }
};

/**
 * Handle social authentication error
 * Provides error feedback with haptics
 */
export const handleSocialAuthError = async (error: unknown, context?: string): Promise<void> => {
  // Silent error handling - logging delegated to monitoring service
  await provideErrorFeedback(_error);
};

/**
 * Check if user cancelled authentication
 * Returns true if error is a cancellation (should be handled silently)
 */
export const isAuthCancellation = (_error: unknown): boolean => {
  if (_error && typeof error === 'object' && 'code' in error) {
    const code = (_error as { code: string }).code;
    return code === 'ERR_REQUEST_CANCELED' || code === 'ERR_CANCELED';
  }
  return false;
};

/**
 * Extract full name from Apple credential
 */
export const getAppleFullName = (givenName: string | null | undefined, familyName: string | null | undefined, fallback = 'User'): string => {
  if (givenName || familyName) {
    return `${givenName || ''} ${familyName || ''}`.trim() || fallback;
  }
  return fallback;
};
