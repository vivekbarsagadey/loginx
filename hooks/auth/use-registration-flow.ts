/**
 * useRegistrationFlow Hook
 * Manages multi-step registration navigation with validation
 *
 * This hook supports two modes:
 * 1. **Default mode**: Uses project's diagnostic logger (LoginX)
 * 2. **Independent mode**: Pass custom logger via options (portable)
 */

import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import type { UseFormTrigger } from 'react-hook-form';
import { useAlert } from '../ui/use-alert';
import { useHapticNavigation } from '../ui/use-haptic-navigation';

interface Step {
  id: string;
  title: string;
  fields: string[];
}

interface UseRegistrationFlowProps<T extends Record<string, unknown>> {
  steps: Step[];
  trigger: UseFormTrigger<T>;
  onSubmit: () => void;
  /**
   * Optional logger for debugging state changes
   * If not provided, uses project's registration diagnostics (LoginX mode)
   */
  logger?: {
    logStateChange: (component: string, field: string, oldValue: unknown, newValue: unknown) => void;
  };
}

/**
 * Hook for managing registration flow navigation and validation
 * @param props Configuration including steps, validation trigger, and submission handler
 * @returns Registration flow state and navigation functions
 *
 * @example
 * ```tsx
 * // Default mode (uses project diagnostics)
 * const flow = useRegistrationFlow({
 *   steps: registrationSteps,
 *   trigger: form.trigger,
 *   onSubmit: handleSubmit,
 * });
 * ```
 *
 * @example
 * ```tsx
 * // Independent mode (custom logger)
 * const flow = useRegistrationFlow({
 *   steps: registrationSteps,
 *   trigger: form.trigger,
 *   onSubmit: handleSubmit,
 *   logger: {
 *     logStateChange: (component, field, oldVal, newVal) => {
 *       console.error(`[${component}] ${field}: ${oldVal} -> ${newVal}`);
 *     }
 *   }
 * });
 * ```
 */
export function useRegistrationFlow<T extends Record<string, unknown>>({ steps, trigger, onSubmit, logger }: UseRegistrationFlowProps<T>) {
  const { back } = useHapticNavigation();
  const router = useRouter();
  const alert = useAlert();
  const [currentStep, setCurrentStep] = useState(0);

  // Get logger function (dependency injection or default)
  const getLogger = () => {
    if (logger) {
      return logger.logStateChange;
    }

    // Default: Try to use project's diagnostics (LoginX mode)
    try {
      const { logStateChange } = require('@/utils/registration-diagnostics');
      return logStateChange;
    } catch (_error: unknown) {
      // If diagnostics not available, use no-op logger
      return () => {};
    }
  };

  const logStateChange = getLogger();

  // Log step changes for debugging
  useEffect(() => {
    logStateChange('RegistrationFlow', 'currentStep', currentStep - 1, currentStep);
  }, [currentStep, logStateChange]);

  // Update title in navigation
  useEffect(() => {
    router.setParams({ title: steps[currentStep].title });
  }, [currentStep, router, steps]);

  const goNext = async () => {
    const fields = steps[currentStep].fields;
    // Validate current step fields - cast to proper trigger parameter type
    const isValid = await trigger(fields as Parameters<UseFormTrigger<T>>[0]);

    if (isValid) {
      // Haptic feedback for successful validation
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        onSubmit();
      }
    } else {
      // Haptic feedback for validation error
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const goPrev = () => {
    if (currentStep > 0) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setCurrentStep(currentStep - 1);
    } else {
      // Confirm before leaving registration
      alert.show('Cancel Registration?', 'Are you sure you want to cancel? Your progress will be lost.', [
        {
          text: 'Continue Registering',
          style: 'cancel',
        },
        {
          text: 'Cancel Registration',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
            back();
          },
        },
      ]);
    }
  };

  const isFirstStep = useMemo(() => currentStep === 0, [currentStep]);
  const isLastStep = useMemo(() => currentStep === steps.length - 1, [currentStep, steps.length]);

  return {
    currentStep,
    setCurrentStep,
    goNext,
    goPrev,
    isFirstStep,
    isLastStep,
    currentStepTitle: steps[currentStep].title,
  };
}
