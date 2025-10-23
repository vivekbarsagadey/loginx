/**
 * Universal Multi-Step Flow Engine Hook
 *
 * Main orchestrator hook that manages flow state, navigation, validation,
 * and provides context for all flow components.
 *
 * @see types/flow.ts for type definitions
 * @see plan/feature-unified-flow-system-1.md for specification
 */

import { type FlowConfig, type FlowContextValue, type FlowState, type StepConfig } from '@/types/flow';
import { useCallback, useEffect, useMemo } from 'react';
import { useFlowNavigation } from './use-flow-navigation';
import { useFlowPersistence } from './use-flow-persistence';
import { useFlowState } from './use-flow-state';
import { useFlowValidation } from './use-flow-validation';

/**
 * Options for the flow engine
 */
export interface UseFlowEngineOptions {
  /** Initial data to populate the flow */
  initialData?: Record<string, any>;

  /** Resume from a saved state */
  resumeState?: FlowState;

  /** Enable analytics tracking */
  enableAnalytics?: boolean;

  /** Enable state persistence */
  enablePersistence?: boolean;

  /** Auto-save interval in milliseconds */
  autoSaveInterval?: number;

  /** Callbacks */
  onComplete?: (data: Record<string, any>) => void | Promise<void>;
  onSkip?: (data: Record<string, any>) => void | Promise<void>;
  onAbandonment?: (data: Record<string, any>, currentStep: string) => void | Promise<void>;
  onError?: (error: Error, stepId?: string) => void | Promise<void>;
}

/**
 * Main flow engine hook
 *
 * Orchestrates all aspects of a multi-step flow including state management,
 * navigation, validation, persistence, and analytics.
 *
 * @example
 * ```tsx
 * const { state, currentStep, next, previous, updateData } = useFlowEngine(myFlow);
 *
 * return (
 *   <View>
 *     <StepRenderer step={currentStep} data={state.data} onUpdate={updateData} />
 *     <Button onPress={next}>Next</Button>
 *   </View>
 * );
 * ```
 */
export function useFlowEngine(config: FlowConfig, options: UseFlowEngineOptions = {}): FlowContextValue {
  const {
    initialData = {},
    resumeState,
    enableAnalytics = config.analytics !== undefined,
    enablePersistence = config.persistState ?? false,
    autoSaveInterval = typeof config.autoSave === 'object' ? config.autoSave.interval : 30000,
    onComplete,
    onSkip,
    onAbandonment,
    onError,
  } = options;

  // Initialize state management
  const { state, updateState, updateData, getData, setData, clearData, resetState } = useFlowState(config, initialData, resumeState);

  // Initialize navigation
  const { next, previous, skip, jumpTo, complete, canGoBack, canGoNext, canSkip } = useFlowNavigation(config, state, updateState);

  // Initialize validation
  const { validateStep, validateField, clearErrors } = useFlowValidation(config, state, updateState);

  // Initialize persistence
  const { saveState, loadState, clearState } = useFlowPersistence(config, state, enablePersistence);

  // Get current step configuration
  const currentStep = useMemo<StepConfig>(() => {
    return config.steps[state.currentStepIndex] || config.steps[0];
  }, [config.steps, state.currentStepIndex]);

  // Calculate derived state
  const isFirstStep = useMemo(() => state.currentStepIndex === 0, [state.currentStepIndex]);
  const isLastStep = useMemo(() => state.currentStepIndex === config.steps.length - 1, [state.currentStepIndex, config.steps.length]);

  // Track step views for analytics
  useEffect(() => {
    if (enableAnalytics && config.analytics?.trackStepView) {
      config.onStepView?.(currentStep.id, state.data);
    }
  }, [currentStep.id, enableAnalytics, config.analytics?.trackStepView, config.onStepView, state.data]);

  // Auto-save state periodically
  useEffect(() => {
    if (!enablePersistence || !config.autoSave) {
      return;
    }

    const interval = setInterval(() => {
      saveState().catch((_error) => {
        console._error('Failed to auto-save flow state:', _error);
        onError?.(_error as Error, currentStep.id);
      });
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [enablePersistence, config.autoSave, autoSaveInterval, saveState, currentStep.id, onError]);

  // Wrap navigation methods with analytics and callbacks
  const handleNext = useCallback(async () => {
    try {
      // Validate current step before proceeding
      const isValid = await validateStep();
      if (!isValid) {
        return;
      }

      // Track field interactions for analytics
      if (enableAnalytics && config.analytics?.trackFieldInteraction) {
        // Analytics would be tracked here
      }

      // Call the navigation next
      await next();

      // Save state after navigation
      if (enablePersistence) {
        await saveState();
      }
    } catch (error: unknown) {
      console.error('Error navigating to next step:', _error);
      onError?.(_error as Error, currentStep.id);
    }
  }, [validateStep, next, saveState, enableAnalytics, enablePersistence, config.analytics, currentStep.id, onError]);

  const handlePrevious = useCallback(() => {
    try {
      previous();

      // Clear validation errors when going back
      clearErrors();

      // Save state after navigation
      if (enablePersistence) {
        saveState().catch((_error) => {
          console._error('Failed to save state after going back:', _error);
        });
      }
    } catch (error: unknown) {
      console.error('Error navigating to previous step:', _error);
      onError?.(_error as Error, currentStep.id);
    }
  }, [previous, clearErrors, saveState, enablePersistence, currentStep.id, onError]);

  const handleSkip = useCallback(async () => {
    try {
      // Track skip for analytics
      if (enableAnalytics && config.analytics?.trackSkips) {
        // Analytics would be tracked here
      }

      await skip();

      // Call skip callback
      if (onSkip) {
        await onSkip(state.data);
      }

      // Save state after skipping
      if (enablePersistence) {
        await saveState();
      }
    } catch (error: unknown) {
      console.error('Error skipping step:', _error);
      onError?.(_error as Error, currentStep.id);
    }
  }, [skip, onSkip, saveState, enableAnalytics, enablePersistence, config.analytics, state.data, currentStep.id, onError]);

  const handleJumpTo = useCallback(
    (stepId: string) => {
      try {
        jumpTo(stepId);

        // Clear validation errors when jumping
        clearErrors();

        // Save state after jumping
        if (enablePersistence) {
          saveState().catch((_error) => {
            console._error('Failed to save state after jumping:', _error);
          });
        }
      } catch (error: unknown) {
        console.error('Error jumping to step:', _error);
        onError?.(_error as Error, currentStep.id);
      }
    },
    [jumpTo, clearErrors, saveState, enablePersistence, currentStep.id, onError]
  );

  const handleComplete = useCallback(async () => {
    try {
      // Validate final step
      const isValid = await validateStep();
      if (!isValid) {
        return;
      }

      // Track completion for analytics
      if (enableAnalytics && config.analytics?.trackCompletion) {
        // Analytics would be tracked here
      }

      // Execute flow completion handler
      if (config.onComplete) {
        await config.onComplete(state.data);
      }

      // Call completion callback
      if (onComplete) {
        await onComplete(state.data);
      }

      // Clear persisted state after completion
      if (enablePersistence) {
        await clearState();
      }

      // Mark flow as completed
      await complete();
    } catch (error: unknown) {
      console.error('Error completing flow:', _error);
      onError?.(_error as Error, currentStep.id);
      throw _error;
    }
  }, [validateStep, complete, clearState, enableAnalytics, enablePersistence, config.analytics, config.onComplete, onComplete, state.data, currentStep.id, onError]);

  // Create context value
  const contextValue: FlowContextValue = useMemo(
    () => ({
      // State
      state,
      config,
      currentStep,

      // Navigation
      next: handleNext,
      previous: handlePrevious,
      skip: handleSkip,
      jumpTo: handleJumpTo,
      complete: handleComplete,

      // Data management
      updateData,
      getData,
      setData,
      clearData,

      // Validation
      validateStep,
      validateField,

      // State persistence
      saveState,
      loadState,
      clearState,

      // Utilities
      canGoBack,
      canGoNext,
      canSkip,
      isFirstStep,
      isLastStep,
    }),
    [
      state,
      config,
      currentStep,
      handleNext,
      handlePrevious,
      handleSkip,
      handleJumpTo,
      handleComplete,
      updateData,
      getData,
      setData,
      clearData,
      validateStep,
      validateField,
      saveState,
      loadState,
      clearState,
      canGoBack,
      canGoNext,
      canSkip,
      isFirstStep,
      isLastStep,
    ]
  );

  // Track abandonment on unmount (if user leaves without completing)
  useEffect(() => {
    return () => {
      if (!state.completedAt && enableAnalytics && config.analytics?.trackAbandonment) {
        onAbandonment?.(state.data, currentStep.id);
      }
    };
  }, [state.completedAt, state.data, currentStep.id, enableAnalytics, config.analytics, onAbandonment]);

  return contextValue;
}

/**
 * Hook to access flow context in child components
 */
export { useFlowContext } from './use-flow-context';
