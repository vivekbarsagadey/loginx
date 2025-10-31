/**
 * Flow Configuration Validator
 *
 * Validates flow configurations at runtime to catch configuration errors early
 * and provide helpful developer warnings.
 */

import { type FlowConfig } from '@/types/flow';

export interface FlowValidationError {
  type: 'error' | 'warning';
  message: string;
  stepId?: string;
}

/**
 * Validate a flow configuration and return unknown errors or warnings
 */
export function validateFlowConfig(config: FlowConfig, initialData: Record<string, unknown> = {}): FlowValidationError[] {
  const errors: FlowValidationError[] = [];

  // Validate basic requirements
  if (!config.steps || config.steps.length === 0) {
    errors.push({
      type: 'error',
      message: 'Flow must have at least one step',
    });
    return errors; // Can't continue validation without steps
  }

  // Validate step IDs are unique
  const stepIds = new Set<string>();
  for (const step of config.steps) {
    if (stepIds.has(step.id)) {
      errors.push({
        type: 'error',
        message: `Duplicate step ID found: ${step.id}`,
        stepId: step.id,
      });
    }
    stepIds.add(step.id);
  }

  // Check if at least one step is visible with initial data
  let hasVisibleStep = false;
  for (const step of config.steps) {
    if (!step.condition) {
      hasVisibleStep = true;
      break;
    }
    try {
      if (step.condition(initialData)) {
        hasVisibleStep = true;
        break;
      }
    } catch (error: unknown) {
      errors.push({
        type: 'warning',
        message: `Step condition threw error during validation: ${error instanceof Error ? error.message : 'Unknown error'}`,
        stepId: step.id,
      });
      // Treat as visible since we can't evaluate
      hasVisibleStep = true;
    }
  }

  if (!hasVisibleStep) {
    errors.push({
      type: 'error',
      message: 'No visible steps found with initial data. All steps have conditions that evaluate to false. At least one step must be visible.',
    });
  }

  // Validate form steps have fields
  for (const step of config.steps) {
    if (step.type === 'form') {
      if (!step.fields || step.fields.length === 0) {
        errors.push({
          type: 'warning',
          message: 'Form step has no fields defined',
          stepId: step.id,
        });
      }

      // Check for duplicate field names
      const fieldNames = new Set<string>();
      for (const field of step.fields || []) {
        if (fieldNames.has(field.name)) {
          errors.push({
            type: 'error',
            message: `Duplicate field name in form step: ${field.name}`,
            stepId: step.id,
          });
        }
        fieldNames.add(field.name);
      }
    }
  }

  // Validate selection steps have options
  for (const step of config.steps) {
    if (step.type === 'selection') {
      if (!step.options || (Array.isArray(step.options) && step.options.length === 0)) {
        errors.push({
          type: 'warning',
          message: 'Selection step has no options defined',
          stepId: step.id,
        });
      }
    }
  }

  // Validate verification steps have required config
  for (const step of config.steps) {
    if (step.type === 'verification') {
      if (!step.onVerify) {
        errors.push({
          type: 'error',
          message: 'Verification step missing onVerify handler',
          stepId: step.id,
        });
      }
      if (step.codeLength < 1) {
        errors.push({
          type: 'error',
          message: 'Verification step codeLength must be at least 1',
          stepId: step.id,
        });
      }
    }
  }

  // Validate action steps have action handler
  for (const step of config.steps) {
    if (step.type === 'action') {
      if (!step.action) {
        errors.push({
          type: 'error',
          message: 'Action step missing action handler',
          stepId: step.id,
        });
      }
    }
  }

  // Validate custom steps have component
  for (const step of config.steps) {
    if (step.type === 'custom') {
      if (!step.component) {
        errors.push({
          type: 'error',
          message: 'Custom step missing component',
          stepId: step.id,
        });
      }
    }
  }

  return errors;
}

/**
 * Validate and log errors/warnings for a flow configuration
 * @returns true if validation passed (no errors), false if there are errors
 */
export function validateAndLogFlowConfig(config: FlowConfig, initialData: Record<string, unknown> = {}): boolean {
  const validationErrors = validateFlowConfig(config, initialData);

  if (validationErrors.length === 0) {
    return true;
  }

  const errors = validationErrors.filter((e) => e.type === 'error');
  const warnings = validationErrors.filter((e) => e.type === 'warning');

  if (warnings.length > 0) {
    console.warn(`Flow configuration has ${warnings.length} warning(s):`);
    warnings.forEach((warning) => {
      console.warn(`  - ${warning.message}${warning.stepId ? ` (Step: ${warning.stepId})` : ''}`);
    });
  }

  if (errors.length > 0) {
    console.error(`Flow configuration has ${errors.length} error(s):`);
    errors.forEach((error) => {
      console.error(`  - ${error.message}${error.stepId ? ` (Step: ${error.stepId})` : ''}`);
    });
    return false;
  }

  return true;
}
