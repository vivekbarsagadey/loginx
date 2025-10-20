/**
 * Flow Step Wrapper Component
 * 
 * Wraps step content with animations and theming
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { type StepConfig } from '@/types/flow';
import { ThemedView } from '@/components/themed-view';
import { DisplayStep } from './steps/display-step';
import { FormStep } from './steps/form-step';
import { SelectionStep } from './steps/selection-step';
import { VerificationStep } from './steps/verification-step';
import { ActionStep } from './steps/action-step';
import { PermissionStep } from './steps/permission-step';
import { CustomStep } from './steps/custom-step';

// Import ThemedText for error message
import { ThemedText } from '@/components/themed-text';

interface FlowStepWrapperProps {
  step: StepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
  theme?: string;
  userPreferences?: Record<string, any>;
  brandId?: string;
}

export function FlowStepWrapper({
  step,
  data,
  onUpdate,
  theme,
  userPreferences,
  brandId,
}: FlowStepWrapperProps) {
  // TODO: Apply theme and animations based on step configuration

  const renderStep = () => {
    switch (step.type) {
      case 'display':
        return <DisplayStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'form':
        return <FormStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'selection':
        return <SelectionStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'verification':
        return <VerificationStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'action':
        return <ActionStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'permission':
        return <PermissionStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      case 'custom':
        return <CustomStep step={step as any} data={data} onUpdate={onUpdate} />;
      
      default:
        return (
          <ThemedView style={styles.error}>
            <ThemedText>Unknown step type: {step.type}</ThemedText>
          </ThemedView>
        );
    }
  };

  return (
    <ThemedView style={styles.container}>
      {renderStep()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  error: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
