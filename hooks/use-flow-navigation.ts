/**
 * Flow Navigation Hook
 *
 * Handles navigation logic including next, previous, skip, and jump operations
 */

import { type FlowConfig, type FlowState, type StepConfig } from '@/types/flow';
import { useCallback } from 'react';

/**
 * Check if a step should be shown based on its condition
 */
function shouldShowStep(step: StepConfig, data: Record<string, any>): boolean {
  if (!step.condition) {
    return true;
  }
  try {
    return step.condition(data);
  } catch (error: unknown) {
    console.error('Error evaluating step condition:', _error);
    return false;
  }
}

/**
 * Find the next visible step index
 */
function findNextVisibleStep(steps: StepConfig[], currentIndex: number, data: Record<string, any>): number {
  for (let i = currentIndex + 1; i < steps.length; i++) {
    if (shouldShowStep(steps[i], data)) {
      return i;
    }
  }
  return currentIndex; // No next step found
}

/**
 * Find the previous visible step index
 */
function findPreviousVisibleStep(steps: StepConfig[], currentIndex: number, data: Record<string, any>): number {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (shouldShowStep(steps[i], data)) {
      return i;
    }
  }
  return currentIndex; // No previous step found
}

/**
 * Hook for flow navigation
 */
export function useFlowNavigation(config: FlowConfig, state: FlowState, updateState: (updates: Partial<FlowState>) => void) {
  /**
   * Navigate to next step
   */
  const next = useCallback(async () => {
    const nextIndex = findNextVisibleStep(config.steps, state.currentStepIndex, state.data);

    if (nextIndex === state.currentStepIndex) {
      // No next step, might be last step
      return;
    }

    const nextStep = config.steps[nextIndex];

    updateState({
      currentStepIndex: nextIndex,
      currentStepId: nextStep.id,
      stepHistory: [...state.stepHistory, state.currentStepId],
      completedSteps: state.completedSteps.includes(state.currentStepId) ? state.completedSteps : [...state.completedSteps, state.currentStepId],
    });
  }, [config.steps, state, updateState]);

  /**
   * Navigate to previous step
   */
  const previous = useCallback(() => {
    const prevIndex = findPreviousVisibleStep(config.steps, state.currentStepIndex, state.data);

    if (prevIndex === state.currentStepIndex) {
      // No previous step
      return;
    }

    const prevStep = config.steps[prevIndex];

    updateState({
      currentStepIndex: prevIndex,
      currentStepId: prevStep.id,
    });
  }, [config.steps, state, updateState]);

  /**
   * Skip current step
   */
  const skip = useCallback(async () => {
    const currentStep = config.steps[state.currentStepIndex];

    // Check if step is skippable
    if (!currentStep.skippable && !config.showSkip) {
      return;
    }

    // Mark as skipped
    const skippedSteps = state.skippedSteps.includes(currentStep.id) ? state.skippedSteps : [...state.skippedSteps, currentStep.id];

    // Find next step
    const nextIndex = findNextVisibleStep(config.steps, state.currentStepIndex, state.data);

    if (nextIndex === state.currentStepIndex) {
      // No next step
      return;
    }

    const nextStep = config.steps[nextIndex];

    updateState({
      currentStepIndex: nextIndex,
      currentStepId: nextStep.id,
      skippedSteps,
      stepHistory: [...state.stepHistory, currentStep.id],
    });
  }, [config, state, updateState]);

  /**
   * Jump to specific step by ID
   */
  const jumpTo = useCallback(
    (stepId: string) => {
      const stepIndex = config.steps.findIndex((step) => step.id === stepId);

      if (stepIndex === -1) {
        console.warn(`Step with id "${stepId}" not found`);
        return;
      }

      const targetStep = config.steps[stepIndex];

      // Check if step should be shown
      if (!shouldShowStep(targetStep, state.data)) {
        console.warn(`Step "${stepId}" is conditionally hidden`);
        return;
      }

      updateState({
        currentStepIndex: stepIndex,
        currentStepId: stepId,
        stepHistory: [...state.stepHistory, state.currentStepId],
      });
    },
    [config.steps, state, updateState]
  );

  /**
   * Mark flow as complete
   */
  const complete = useCallback(async () => {
    updateState({
      completedAt: new Date(),
      completedSteps: state.completedSteps.includes(state.currentStepId) ? state.completedSteps : [...state.completedSteps, state.currentStepId],
    });
  }, [state, updateState]);

  /**
   * Check if can go back
   */
  const canGoBack = useCallback(() => {
    const currentStep = config.steps[state.currentStepIndex];

    // Check flow-level navigation rules
    if (config.navigation?.allowBack === false) {
      return false;
    }

    // Check step-level navigation rules
    if (currentStep.allowBack === false) {
      return false;
    }

    // Check if there's a previous visible step
    const prevIndex = findPreviousVisibleStep(config.steps, state.currentStepIndex, state.data);

    return prevIndex !== state.currentStepIndex;
  }, [config, state]);

  /**
   * Check if can go next
   */
  const canGoNext = useCallback(() => {
    // Check if there's a next visible step
    const nextIndex = findNextVisibleStep(config.steps, state.currentStepIndex, state.data);

    return nextIndex !== state.currentStepIndex;
  }, [config.steps, state]);

  /**
   * Check if can skip
   */
  const canSkip = useCallback(() => {
    const currentStep = config.steps[state.currentStepIndex];

    // Check flow-level skip setting
    if (config.showSkip === false) {
      return false;
    }

    // Check step-level skip setting
    return currentStep.skippable ?? false;
  }, [config, state]);

  return {
    next,
    previous,
    skip,
    jumpTo,
    complete,
    canGoBack: canGoBack(),
    canGoNext: canGoNext(),
    canSkip: canSkip(),
  };
}
