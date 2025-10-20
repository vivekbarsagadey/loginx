/**
 * Bar Progress Indicator
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '@/hooks/use-theme-colors';

interface BarProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function BarProgress({ currentStep, totalSteps }: BarProgressProps) {
  const colors = useThemeColors();
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={[styles.track, { backgroundColor: colors['bg-elevated'] }]}>
        <View
          style={[
            styles.fill,
            {
              width: `${progress}%`,
              backgroundColor: colors.primary,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
