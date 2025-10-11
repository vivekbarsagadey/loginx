import { useAlert } from '@/hooks/use-alert';
import { useHapticNavigation } from '@/hooks/use-haptic-navigation';
import { logStateChange } from '@/utils/registration-diagnostics';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import type { UseFormTrigger } from 'react-hook-form';

interface Step {
  id: string;
  title: string;
  fields: string[];
}

interface UseRegistrationFlowProps<T extends Record<string, unknown>> {
  steps: Step[];
  trigger: UseFormTrigger<T>;
  onSubmit: () => void;
}

export function useRegistrationFlow<T extends Record<string, unknown>>({ steps, trigger, onSubmit }: UseRegistrationFlowProps<T>) {
  const { back } = useHapticNavigation();
  const router = useRouter();
  const alert = useAlert();
  const [currentStep, setCurrentStep] = useState(0);

  // Log step changes for debugging
  useEffect(() => {
    logStateChange('RegistrationFlow', 'currentStep', currentStep - 1, currentStep);
  }, [currentStep]);

  // Update title in navigation
  useEffect(() => {
    router.setParams({ title: steps[currentStep].title });
  }, [currentStep, router, steps]);

  const goNext = async () => {
    const fields = steps[currentStep].fields;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isValid = await trigger(fields as any);

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
