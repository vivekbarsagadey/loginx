import { useCallback, useState } from 'react';

export interface UseMultiStepFlowOptions {
  /** Total number of steps in the flow */
  totalSteps: number;
  /** Initial step index (0-based) */
  initialStep?: number;
  /** Callback when flow is completed */
  onComplete?: () => void;
  /** Callback when step changes */
  onStepChange?: (step: number) => void;
}

export interface UseMultiStepFlowReturn {
  /** Current step index (0-based) */
  currentStep: number;
  /** Total number of steps */
  totalSteps: number;
  /** Whether on first step */
  isFirstStep: boolean;
  /** Whether on last step */
  isLastStep: boolean;
  /** Progress percentage (0-100) */
  progress: number;
  /** Go to next step */
  goNext: () => void;
  /** Go to previous step */
  goBack: () => void;
  /** Go to specific step */
  goToStep: (step: number) => void;
  /** Reset to first step */
  reset: () => void;
}

/**
 * Simple hook for managing multi-step flows
 *
 * @example
 * ```tsx
 * function OnboardingFlow() {
 *   const { currentStep, goNext, goBack, isLastStep, progress } = useMultiStepFlow({
 *     totalSteps: 5,
 *     onComplete: () => router.push('/home')
 *   });
 *
 *   return (
 *     <View>
 *       <ProgressBar progress={progress} />
 *       {currentStep === 0 && <WelcomeStep />}
 *       {currentStep === 1 && <FeaturesStep />}
 *       <Button onPress={goBack}>Back</Button>
 *       <Button onPress={goNext}>{isLastStep ? 'Finish' : 'Next'}</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useMultiStepFlow({ totalSteps, initialStep = 0, onComplete, onStepChange }: UseMultiStepFlowOptions): UseMultiStepFlowReturn {
  const [currentStep, setCurrentStep] = useState(initialStep);

  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  const goNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.();
    } else {
      const nextStep = Math.min(currentStep + 1, totalSteps - 1);
      setCurrentStep(nextStep);
      onStepChange?.(nextStep);
    }
  }, [currentStep, totalSteps, isLastStep, onComplete, onStepChange]);

  const goBack = useCallback(() => {
    const prevStep = Math.max(currentStep - 1, 0);
    setCurrentStep(prevStep);
    onStepChange?.(prevStep);
  }, [currentStep, onStepChange]);

  const goToStep = useCallback(
    (step: number) => {
      const validStep = Math.max(0, Math.min(step, totalSteps - 1));
      setCurrentStep(validStep);
      onStepChange?.(validStep);
    },
    [totalSteps, onStepChange]
  );

  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    onStepChange?.(initialStep);
  }, [initialStep, onStepChange]);

  return {
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    progress,
    goNext,
    goBack,
    goToStep,
    reset,
  };
}
