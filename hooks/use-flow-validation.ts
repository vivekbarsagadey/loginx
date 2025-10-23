/**
 * Flow Validation Hook
 * 
 * Handles validation of steps and fields using Zod schemas and custom validators
 */

import { useCallback } from 'react';
import { type FlowConfig, type FlowState, type FormStepConfig, StepConfig } from '@/types/flow';

/**
 * Validate a single form field
 */
async function validateFormField(
  fieldName: string,
  value: any,
  step: FormStepConfig
): Promise<{ valid: boolean; error?: string }> {
  // Find field configuration
  const field = step.fields.find((f) => f.name === fieldName);
  if (!field) {
    return { valid: true };
  }

  // Check required
  if (field.required && (value === undefined || value === null || value === '')) {
    return { valid: false, error: `${field.label} is required` };
  }

  // Run field-level validation schema
  if (field.validation) {
    try {
      await field.validation.parseAsync(value);
    } catch (_error: any) {
      return { valid: false, error: _error.errors?.[0]?.message || 'Validation error' };
    }
  }

  // Run async validation
  if (field.asyncValidation) {
    try {
      await field.asyncValidation(value);
    } catch (_error: any) {
      return { valid: false, error: _error.message || 'Validation error' };
    }
  }

  return { valid: true };
}

/**
 * Validate all fields in a form step
 */
async function validateFormStep(
  step: FormStepConfig,
  data: Record<string, any>
): Promise<{ valid: boolean; errors: Record<string, string> }> {
  const errors: Record<string, string> = {};

  // Validate each field
  for (const field of step.fields) {
    // Check condition
    if (field.condition && !field.condition(data)) {
      continue;
    }

    const value = data[field.name];
    const result = await validateFormField(field.name, value, step);
    
    if (!result.valid && result.error) {
      errors[field.name] = result.error;
    }
  }

  // Run step-level validation schema
  if (step.validationSchema && Object.keys(errors).length === 0) {
    try {
      // Extract field values
      const fieldValues: Record<string, any> = {};
      for (const field of step.fields) {
        if (!field.condition || field.condition(data)) {
          fieldValues[field.name] = data[field.name];
        }
      }
      
      await step.validationSchema.parseAsync(fieldValues);
    } catch (_error: any) {
      // Add schema validation errors
      if (_error.errors) {
        for (const err of _error.errors) {
          const path = err.path.join('.');
          errors[path] = err.message;
        }
      }
    }
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Hook for flow validation
 */
export function useFlowValidation(
  config: FlowConfig,
  state: FlowState,
  updateState: (updates: Partial<FlowState>) => void
) {
  /**
   * Validate current or specific step
   */
  const validateStep = useCallback(
    async (stepId?: string): Promise<boolean> => {
      const stepToValidate = stepId
        ? config.steps.find((s) => s.id === stepId)
        : config.steps[state.currentStepIndex];

      if (!stepToValidate) {
        return true;
      }

      // For form steps, validate all fields
      if (stepToValidate.type === 'form') {
        const result = await validateFormStep(stepToValidate as FormStepConfig, state.data);
        
        if (!result.valid) {
          updateState({
            validationErrors: result.errors,
          });
          return false;
        }
      }

      // For selection steps, check if required selection is made
      if (stepToValidate.type === 'selection') {
        const selectionStep = stepToValidate as any;
        if (selectionStep.required) {
          const value = state.data[stepToValidate.id];
          if (!value || (Array.isArray(value) && value.length === 0)) {
            updateState({
              validationErrors: {
                [stepToValidate.id]: 'Please make a selection',
              },
            });
            return false;
          }

          // Check min/max selections for multiple selection
          if (selectionStep.multiple && Array.isArray(value)) {
            if (selectionStep.minSelections && value.length < selectionStep.minSelections) {
              updateState({
                validationErrors: {
                  [stepToValidate.id]: `Please select at least ${selectionStep.minSelections} options`,
                },
              });
              return false;
            }
            if (selectionStep.maxSelections && value.length > selectionStep.maxSelections) {
              updateState({
                validationErrors: {
                  [stepToValidate.id]: `Please select at most ${selectionStep.maxSelections} options`,
                },
              });
              return false;
            }
          }
        }
      }

      // Run custom step validation
      if (stepToValidate.validate) {
        try {
          const result = await stepToValidate.validate(state.data);
          if (!result.valid) {
            updateState({
              validationErrors: {
                [stepToValidate.id]: result.error || 'Validation error',
              },
            });
            return false;
          }
        } catch (_error: any) {
          updateState({
            validationErrors: {
              [stepToValidate.id]: _error.message || 'Validation error',
            },
          });
          return false;
        }
      }

      // Clear validation errors if all passed
      updateState({
        validationErrors: {},
      });

      return true;
    },
    [config.steps, state, updateState]
  );

  /**
   * Validate a single field
   */
  const validateField = useCallback(
    async (fieldName: string, value: any): Promise<boolean> => {
      const currentStep = config.steps[state.currentStepIndex];
      
      if (currentStep.type !== 'form') {
        return true;
      }

      const result = await validateFormField(fieldName, value, currentStep as FormStepConfig);
      
      if (!result.valid && result.error) {
        updateState({
          validationErrors: {
            ...state.validationErrors,
            [fieldName]: result.error,
          },
        });
        return false;
      }

      // Clear field error if valid
      const newErrors = { ...state.validationErrors };
      delete newErrors[fieldName];
      
      updateState({
        validationErrors: newErrors,
      });

      return true;
    },
    [config.steps, state, updateState]
  );

  /**
   * Clear all validation errors
   */
  const clearErrors = useCallback(() => {
    updateState({
      validationErrors: {},
      errors: {},
    });
  }, [updateState]);

  return {
    validateStep,
    validateField,
    clearErrors,
  };
}
