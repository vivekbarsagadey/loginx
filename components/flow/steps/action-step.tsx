/**
 * Action Step Component
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type ActionStepConfig } from '@/types/flow';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { FlowData } from '../flow-step-wrapper';

interface ActionStepProps {
  step: ActionStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function ActionStep({ step, data: _data, onUpdate: _onUpdate }: ActionStepProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{step.title}</ThemedText>
      <ThemedText>Action step placeholder</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
