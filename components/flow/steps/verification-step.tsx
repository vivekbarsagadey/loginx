/**
 * Verification Step Component
 * OTP/code verification
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { type VerificationStepConfig } from '@/types/flow';
import React from 'react';
import { StyleSheet } from 'react-native';
import type { FlowData } from '../flow-step-wrapper';

interface VerificationStepProps {
  step: VerificationStepConfig;
  data: FlowData;
  onUpdate: (data: Partial<FlowData>) => void;
}

export function VerificationStep({ step, data: _data, onUpdate: _onUpdate }: VerificationStepProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">{step.title}</ThemedText>
      <ThemedText>Verification step placeholder</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
});
