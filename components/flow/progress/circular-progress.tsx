/**
 * Circular Progress Indicator
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';

interface CircularProgressProps {
  progress: number;
}

export function CircularProgress({ progress }: CircularProgressProps) {
  const percentage = Math.round(progress * 100);

  return (
    <View style={styles.container}>
      <ThemedText type="caption">{percentage}%</ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 12,
  },
});
