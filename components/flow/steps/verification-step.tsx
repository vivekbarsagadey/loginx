/**
 * Verification Step Component  
 * OTP/code verification
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { type VerificationStepConfig } from '@/types/flow';

interface VerificationStepProps {
  step: VerificationStepConfig;
  data: Record<string, any>;
  onUpdate: (data: Partial<Record<string, any>>) => void;
}

export function VerificationStep({ step, data, onUpdate }: VerificationStepProps) {
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
