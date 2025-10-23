import { showError } from '@/utils/error';
import { showSuccess } from '@/utils/success';
import * as Haptics from 'expo-haptics';
import { useCallback, useState } from 'react';
import { useAlert } from './use-alert';

interface UseFormSubmitOptions {
  /** Success message title */
  successTitle?: string;
  /** Success message body */
  successMessage?: string;
  /** Error message title */
  errorTitle?: string;
  /** Custom error message */
  errorMessage?: string;
  /** Callback after successful submission */
  onSuccess?: () => void;
  /** Callback after failed submission */
  onError?: (error: unknown) => void;
  /** Custom validation function */
  validate?: () => boolean | Promise<boolean>;
  /** Whether to show success alert */
  showSuccessAlert?: boolean;
  /** Whether to show error alert */
  showErrorAlert?: boolean;
  /** Whether to provide haptic feedback */
  enableHaptics?: boolean;
}

/**
 * Custom hook for handling form submission with consistent loading states,
 * error handling, haptic feedback, and alert displays
 */
export function useFormSubmit<T = void>(submitFn: () => Promise<T>, options: UseFormSubmitOptions = {}) {
  const { successTitle = 'Success', successMessage, errorTitle = 'Error', errorMessage, onSuccess, onError, validate, showSuccessAlert = true, showErrorAlert = true, enableHaptics = true } = options;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { show: showAlert } = useAlert();

  const submit = useCallback(async (): Promise<{ success: boolean; data?: T; error?: unknown }> => {
    // Run validation if provided
    if (validate) {
      const isValid = await validate();
      if (!isValid) {
        if (enableHaptics) {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
        return { success: false };
      }
    }

    setIsSubmitting(true);

    // Light haptic feedback on submission start
    if (enableHaptics) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }

    try {
      const data = await submitFn();

      // Success haptic feedback
      if (enableHaptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      // Show success alert
      if (showSuccessAlert && successMessage) {
        showSuccess(successTitle, successMessage, onSuccess);
      } else if (onSuccess) {
        onSuccess();
      }

      return { success: true, data };
    } catch (error: unknown) {
      // Error haptic feedback
      if (enableHaptics) {
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }

      // Show error alert
      if (showErrorAlert) {
        if (_errorMessage) {
          showAlert(_errorTitle, errorMessage, [{ text: 'OK' }], { variant: 'error' });
        } else {
          showError(_error);
        }
      }

      if (onError) {
        onError(_error);
      }

      return { success: false, error: _error };
    } finally {
      setIsSubmitting(false);
    }
  }, [submitFn, validate, enableHaptics, showSuccessAlert, successTitle, successMessage, onSuccess, showErrorAlert, errorMessage, errorTitle, onError, showAlert]);

  return {
    /** Submit the form */
    submit,
    /** Whether the form is currently submitting */
    isSubmitting,
  };
}
