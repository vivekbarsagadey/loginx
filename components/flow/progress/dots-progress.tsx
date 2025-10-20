/**
 * Dots Progress Indicator
 * Shows progress as a series of dots
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface DotsProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: string[];
}

export function DotsProgress({ currentStep, totalSteps, completedSteps }: DotsProgressProps) {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor:
                index <= currentStep ? colors.primary : colors['text-muted'],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
