/**
 * Flow State Management Hook
 *
 * Manages the runtime state of a flow including current step, data, history,
 * and validation errors.
 */

import { type FlowConfig, type FlowState } from '@/types/flow';
import { useCallback, useState } from 'react';

/**
 * Find the first visible step in the flow based on conditions
 */
function findFirstVisibleStep(config: FlowConfig, data: Record<string, unknown>): number {
  for (let i = 0; i < config.steps.length; i++) {
    const step = config.steps[i];
    // Step is visible if it has no condition or condition returns true
    if (!step.condition) {
      return i;
    }
    try {
      if (step.condition(data)) {
        return i;
      }
    } catch (_error: unknown) {
      console.error(`Error evaluating condition for step ${step.id}:`, _error);
      // If condition throws, treat step as visible (fail-safe)
      return i;
    }
  }

  // Critical: No visible steps found - this should be caught in flow validation
  // But as a fail-safe, return 0 and log error
  console.error('CRITICAL: No visible steps found in flow. All steps have false conditions.');
  return 0;
}

/**
 * Create initial flow state
 */
function createInitialState(config: FlowConfig, initialData: Record<string, unknown> = {}, resumeState?: FlowState): FlowState {
  if (resumeState) {
    return {
      ...resumeState,
      lastUpdatedAt: new Date(),
    };
  }

  // Find first visible step instead of blindly using index 0
  const initialStepIndex = findFirstVisibleStep(config, initialData);
  const initialStep = config.steps[initialStepIndex];

  if (!initialStep) {
    throw new Error('Flow configuration error: No steps defined');
  }

  return {
    currentStepIndex: initialStepIndex,
    currentStepId: initialStep.id,
    totalSteps: config.steps.length,
    progress: calculateProgress(initialStepIndex, config.steps.length),
    stepHistory: [],
    completedSteps: [],
    skippedSteps: [],
    data: initialData,
    loading: false,
    errors: {},
    validationErrors: {},
    flowId: config.id,
    flowVersion: config.version,
    startedAt: new Date(),
    lastUpdatedAt: new Date(),
  };
}

/**
 * Calculate progress percentage
 */
function calculateProgress(currentStepIndex: number, totalSteps: number): number {
  if (totalSteps === 0) {
    return 0;
  }
  return Math.round(((currentStepIndex + 1) / totalSteps) * 100);
}

/**
 * Hook for managing flow state
 */
export function useFlowState(config: FlowConfig, initialData: Record<string, unknown> = {}, resumeState?: FlowState) {
  const [state, setState] = useState<FlowState>(() => createInitialState(config, initialData, resumeState));

  /**
   * Update the entire state
   */
  const updateState = useCallback((updates: Partial<FlowState>) => {
    setState((prevState) => ({
      ...prevState,
      ...updates,
      lastUpdatedAt: new Date(),
      progress: updates.currentStepIndex !== undefined ? calculateProgress(updates.currentStepIndex, prevState.totalSteps) : prevState.progress,
    }));
  }, []);

  /**
   * Update flow data (user inputs)
   */
  const updateData = useCallback((newData: Partial<Record<string, unknown>>) => {
    setState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        ...newData,
      },
      lastUpdatedAt: new Date(),
    }));
  }, []);

  /**
   * Get a specific data value
   */
  const getData = useCallback(
    (key: string) => {
      return state.data[key];
    },
    [state.data]
  );

  /**
   * Set a specific data value
   */
  const setData = useCallback((key: string, value: unknown) => {
    setState((prevState) => ({
      ...prevState,
      data: {
        ...prevState.data,
        [key]: value,
      },
      lastUpdatedAt: new Date(),
    }));
  }, []);

  /**
   * Clear all data
   */
  const clearData = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      data: {},
      lastUpdatedAt: new Date(),
    }));
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading: boolean) => {
    setState((prevState) => ({
      ...prevState,
      loading,
    }));
  }, []);

  /**
   * Set errors
   */
  const setErrors = useCallback((errors: Record<string, string>) => {
    setState((prevState) => ({
      ...prevState,
      errors,
    }));
  }, []);

  /**
   * Set validation errors
   */
  const setValidationErrors = useCallback((validationErrors: Record<string, string>) => {
    setState((prevState) => ({
      ...prevState,
      validationErrors,
    }));
  }, []);

  /**
   * Clear all errors
   */
  const clearErrors = useCallback(() => {
    setState((prevState) => ({
      ...prevState,
      errors: {},
      validationErrors: {},
    }));
  }, []);

  /**
   * Add step to history
   */
  const addToHistory = useCallback((stepId: string) => {
    setState((prevState) => ({
      ...prevState,
      stepHistory: [...prevState.stepHistory, stepId],
    }));
  }, []);

  /**
   * Mark step as completed
   */
  const markStepCompleted = useCallback((stepId: string) => {
    setState((prevState) => {
      if (prevState.completedSteps.includes(stepId)) {
        return prevState;
      }
      return {
        ...prevState,
        completedSteps: [...prevState.completedSteps, stepId],
      };
    });
  }, []);

  /**
   * Mark step as skipped
   */
  const markStepSkipped = useCallback((stepId: string) => {
    setState((prevState) => {
      if (prevState.skippedSteps.includes(stepId)) {
        return prevState;
      }
      return {
        ...prevState,
        skippedSteps: [...prevState.skippedSteps, stepId],
      };
    });
  }, []);

  /**
   * Reset state to initial
   */
  const resetState = useCallback(() => {
    setState(createInitialState(config, initialData));
  }, [config, initialData]);

  return {
    state,
    updateState,
    updateData,
    getData,
    setData,
    clearData,
    setLoading,
    setErrors,
    setValidationErrors,
    clearErrors,
    addToHistory,
    markStepCompleted,
    markStepSkipped,
    resetState,
  };
}
