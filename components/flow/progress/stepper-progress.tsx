/**
 * Stepper Progress Indicator
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { type StepConfig } from '@/types/flow';

interface StepperProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: StepConfig[];
}

export function StepperProgress({ currentStep, totalSteps, steps }: StepperProgressProps) {
  return (
    <View style={styles.container}>
      <ThemedText type="caption">
        Step {currentStep + 1} of {totalSteps}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
