/**
 * Action Step Component
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { type ActionStepConfig } from '@/types/flow';

interface ActionStepProps {
  step: ActionStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function ActionStep({ step, data, onUpdate }: ActionStepProps) {
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
