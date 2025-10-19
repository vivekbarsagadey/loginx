/**
 * Custom Step Component
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { CustomStepConfig } from '@/types/flow';

interface CustomStepProps {
  step: CustomStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function CustomStep({ step, data, onUpdate }: CustomStepProps) {
  const Component = step.component;
  return <Component {...step.props} data={data} onUpdate={onUpdate} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
