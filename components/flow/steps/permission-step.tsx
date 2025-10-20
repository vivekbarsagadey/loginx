/**
 * Permission Step Component
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type PermissionStepConfig } from '@/types/flow';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { FlowData } from '../flow-step-wrapper';

interface PermissionStepProps {
  step: PermissionStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function PermissionStep({ step, data: _data, onUpdate: _onUpdate }: PermissionStepProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{step.title}</ThemedText>
      <ThemedText>Permission step placeholder</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
