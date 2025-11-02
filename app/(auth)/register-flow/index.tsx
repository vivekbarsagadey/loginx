/**
 * Registration Screen - Flow System Implementation
 *
 * This is the new implementation using the unified flow system.
 * It replaces the custom registration implementation with FlowContainer.
 */

import { createUserProfile } from '@/actions/user.action';
import { FlowContainer } from '@/components/flow/flow-container';
import { registrationFlowConfig } from '@/config/registration-flow.config';
import { auth } from '@/firebase-config';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { createLogger } from '@/utils/debug';
import { showError } from '@/utils/error';
import { sanitizeEmail, sanitizeUserInput } from '@/utils/sanitize';
import * as Haptics from 'expo-haptics';
import { Stack } from 'expo-router';
import { createUserWithEmailAndPassword, deleteUser, sendEmailVerification } from 'firebase/auth';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

const logger = createLogger('Registration');

export default function RegisterScreen() {
  const { replace } = useHapticNavigation();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleComplete = async (data: Record<string, unknown>) => {
    if (isSubmitting) {
      return { success: false, error: 'Submission in progress' };
    }

    setIsSubmitting(true);

    try {
      // Sanitize all user inputs
      const sanitizedData = {
        firstName: sanitizeUserInput(String(data.firstName || ''), 50),
        lastName: sanitizeUserInput(String(data.lastName || ''), 50),
        photoURL: data.photoURL ? String(data.photoURL) : '',
        termsAccepted: Boolean(data.termsAccepted),
        termsAcceptedAt: new Date().toISOString(),
        referralCode: data.referralCode ? sanitizeUserInput(String(data.referralCode), 12) : '',
        email: sanitizeEmail(String(data.email || '')),
        password: String(data.password || ''),
        address: data.address ? sanitizeUserInput(String(data.address), 200) : '',
        city: data.city ? sanitizeUserInput(String(data.city), 100) : '',
        state: data.state ? sanitizeUserInput(String(data.state), 100) : '',
        zipCode: data.zipCode ? sanitizeUserInput(String(data.zipCode), 10) : '',
        phoneNumber: data.phoneNumber ? sanitizeUserInput(String(data.phoneNumber), 20) : '',
      };

      // Step 1: Create user account
      const { user } = await createUserWithEmailAndPassword(auth, sanitizedData.email, sanitizedData.password);

      // Step 2: Send email verification
      try {
        await sendEmailVerification(user);
      } catch (_verificationError) {
        // Continue even if email verification fails
        logger.warn('Email verification failed:', _verificationError);
      }

      // Step 3: Create user profile in Firestore
      try {
        await createUserProfile(user.uid, {
          displayName: `${sanitizedData.firstName} ${sanitizedData.lastName}`,
          email: sanitizedData.email,
          age: 0,
          photoURL: sanitizedData.photoURL,
          pushEnabled: false,
          emailUpdates: false,
          marketingTips: false,
          address: sanitizedData.address,
          city: sanitizedData.city,
          state: sanitizedData.state,
          zipCode: sanitizedData.zipCode,
          referralCode: sanitizedData.referralCode,
          termsAcceptedAt: sanitizedData.termsAcceptedAt,
        });
      } catch (profileError) {
        logger.error('Failed to create user profile:', profileError);
        // Rollback: Delete the Firebase user if profile creation fails
        try {
          await deleteUser(user);
          throw new Error('Failed to create user profile. Please try again.');
        } catch (deleteError) {
          logger.error('Failed to rollback user creation:', deleteError);
          throw new Error('Registration failed. Please contact support if you cannot log in.');
        }
      }

      // Success haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Navigate based on whether phone number was provided
      if (sanitizedData.phoneNumber && sanitizedData.phoneNumber.trim()) {
        try {
          replace({
            pathname: '/(auth)/verify-phone',
            params: { phoneNumber: sanitizedData.phoneNumber },
          });
        } catch (navError) {
          logger.error('Navigation to phone verification failed:', navError);
          try {
            replace({
              pathname: '/(auth)/verify-email',
              params: { email: sanitizedData.email },
            });
          } catch (fallbackError) {
            logger.error('Fallback navigation also failed:', fallbackError);
            showError(new Error('Registration complete! Please check your email for verification link.'));
          }
        }
      } else {
        try {
          replace({
            pathname: '/(auth)/verify-email',
            params: { email: sanitizedData.email },
          });
        } catch (navError) {
          logger.error('Navigation to email verification failed:', navError);
          showError(new Error('Registration complete! Please check your email for verification link and then log in.'));
        }
      }

      return { success: true };
    } catch (_error: unknown) {
      // Error haptic feedback
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      logger.error('Registration error:', _error);
      showError(_error);
      return { success: false, error: _error instanceof Error ? _error.message : 'Registration failed' };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAbandonment = async (data: Record<string, unknown>, currentStep: string) => {
    logger.info('Registration abandoned at step:', currentStep, 'with data:', Object.keys(data));
    // Track abandonment analytics here if needed
  };

  const handleError = async (error: Error, stepId?: string) => {
    logger.error('Registration error at step:', stepId, error);
    return { handled: true };
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Register',
          headerBackTitle: 'Cancel',
        }}
      />
      <FlowContainer
        flow={{
          ...registrationFlowConfig,
          onComplete: handleComplete,
          onAbandonment: handleAbandonment,
          onError: handleError,
        }}
        initialData={{}}
        containerStyle={styles.container}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
