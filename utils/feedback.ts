/**
 * Feedback Utilities
 * Consolidated haptic feedback and user notification patterns
 */

import * as Haptics from 'expo-haptics';
import { showError } from './error';
import { showSuccess } from './success';

/**
 * Feedback types for user actions
 */
export type FeedbackType = 'success' | 'error' | 'warning' | 'light' | 'medium' | 'heavy';

/**
 * Provide haptic feedback based on action type
 */
export const provideFeedback = async (type: FeedbackType): Promise<void> => {
  try {
    switch (type) {
      case 'success':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'error':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
      case 'warning':
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'light':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error: unknown) {
    // Silently fail - haptics not critical
    if (__DEV__) {
      if (error instanceof Error) {
        console.warn('[Feedback] Haptic feedback failed:', error.message);
      } else {
        console.warn('[Feedback] Haptic feedback failed:', error);
      }
    }
  }
};

/**
 * Provide success feedback (haptic + notification)
 */
export const provideSuccessFeedback = async (title: string, message: string, onOk?: () => void): Promise<void> => {
  await provideFeedback('success');
  showSuccess(title, message, onOk);
};

/**
 * Provide error feedback (haptic + notification)
 */
export const provideErrorFeedback = async (error: unknown): Promise<void> => {
  await provideFeedback('error');
  showError(error);
};

/**
 * Provide warning feedback (haptic only)
 */
export const provideWarningFeedback = async (): Promise<void> => {
  await provideFeedback('warning');
};

/**
 * Provide light tap feedback (for buttons, selections)
 */
export const provideLightFeedback = async (): Promise<void> => {
  await provideFeedback('light');
};

/**
 * Provide medium tap feedback (for toggles, switches)
 */
export const provideMediumFeedback = async (): Promise<void> => {
  await provideFeedback('medium');
};

/**
 * Provide heavy tap feedback (for destructive actions)
 */
export const provideHeavyFeedback = async (): Promise<void> => {
  await provideFeedback('heavy');
};

/**
 * Execute an async action with loading state, haptic feedback, and notifications
 *
 * This utility consolidates the common pattern of:
 * 1. Setting loading state
 * 2. Executing an async action
 * 3. Providing success feedback + navigation
 * 4. Providing error feedback on failure
 * 5. Cleaning up loading state
 *
 * @param action - Async function to execute
 * @param setLoading - State setter for loading state
 * @param successConfig - Success feedback configuration
 * @param errorConfig - Error feedback configuration (optional)
 * @returns Promise that resolves to the action result or undefined on error
 *
 * @example
 * const result = await executeWithFeedback(
 *   () => submitForm(data),
 *   setIsSubmitting,
 *   {
 *     title: 'Success',
 *     message: 'Form submitted successfully',
 *     onSuccess: () => router.back()
 *   }
 * );
 */
export const executeWithFeedback = async <T>(
  action: () => Promise<T>,
  setLoading: (loading: boolean) => void,
  successConfig: {
    title: string;
    message: string;
    onSuccess?: () => void;
  },
  errorConfig?: {
    customHandler?: (error: unknown) => void;
  }
): Promise<T | undefined> => {
  setLoading(true);

  try {
    const result = await action();

    // Success feedback
    await provideSuccessFeedback(successConfig.title, successConfig.message, successConfig.onSuccess);

    return result;
  } catch (error) {
    // Error feedback
    if (errorConfig?.customHandler) {
      errorConfig.customHandler(error);
    } else {
      await provideErrorFeedback(error);
    }
    return undefined;
  } finally {
    setLoading(false);
  }
};
