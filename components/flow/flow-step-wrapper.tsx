/**
 * Flow Step Wrapper Component
 *
 * Wraps step content with animations and theming
 */

import { ThemedView } from '@/components/themed-view';
import type { StepConfig } from '@/types/flow';
import React from 'react';
import { StyleSheet } from 'react-native';
import { ActionStep } from './steps/action-step';
import { CustomStep } from './steps/custom-step';
import { DisplayStep } from './steps/display-step';
import { FormStep } from './steps/form-step';
import { PermissionStep } from './steps/permission-step';
import { SelectionStep } from './steps/selection-step';
import { VerificationStep } from './steps/verification-step';

// Import ThemedText for error message
import { ThemedText } from '@/components/themed-text';

/**
 * Flow data type - supports strings, numbers, booleans, and null values
 */
export type FlowData = Record<string, string | number | boolean | null | undefined>;

/**
 * User preferences type for theme customization
 */
export type UserPreferences = Record<string, string | number | boolean>;

interface FlowStepWrapperProps {
  step: StepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
  theme?: string;
  userPreferences?: UserPreferences;
  brandId?: string;
}

export function FlowStepWrapper({ step, data, onUpdate, theme: _theme, userPreferences: _userPreferences, brandId: _brandId }: FlowStepWrapperProps) {
  // TODO: Apply theme and animations based on step configuration

  /**
   * Render the appropriate step component based on step.type
   * TypeScript automatically narrows the step type in each case branch using discriminated unions
   */
  const renderStep = () => {
    switch (step.type) {
      case 'display':
        // TypeScript knows step is DisplayStepConfig here
        return <DisplayStep step={step} data={data} onUpdate={onUpdate} />;

      case 'form':
        // TypeScript knows step is FormStepConfig here
        // Convert FlowData (with null/undefined) to FormStep's stricter type
        const formData: Record<string, string | number | boolean> = {};
        for (const [key, value] of Object.entries(data)) {
          if (value !== null && value !== undefined) {
            formData[key] = value;
          }
        }
        const handleFormUpdate = (updates: Partial<Record<string, string | number | boolean>>) => {
          onUpdate(updates);
        };
        return <FormStep step={step} data={formData} onUpdate={handleFormUpdate} />;

      case 'selection':
        // TypeScript knows step is SelectionStepConfig here
        return <SelectionStep step={step} data={data} onUpdate={onUpdate} />;

      case 'verification':
        // TypeScript knows step is VerificationStepConfig here
        return <VerificationStep step={step} data={data} onUpdate={onUpdate} />;

      case 'action':
        // TypeScript knows step is ActionStepConfig here
        return <ActionStep step={step} data={data} onUpdate={onUpdate} />;

      case 'permission':
        // TypeScript knows step is PermissionStepConfig here
        return <PermissionStep step={step} data={data} onUpdate={onUpdate} />;

      case 'custom':
        // TypeScript knows step is CustomStepConfig here
        return <CustomStep step={step} data={data} onUpdate={onUpdate} />;

      default:
        return (
          <ThemedView style={styles.error}>
            <ThemedText>Unknown step type: {step.type}</ThemedText>
          </ThemedView>
        );
    }
  };

  return <ThemedView style={styles.container}>{renderStep()}</ThemedView>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  _error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
