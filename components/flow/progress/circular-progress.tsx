/**
 * Circular Progress Indicator
 */

import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { StyleSheet, View } from 'react-native';

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
