import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

export interface LinearProgressProps {
  /** Progress value from 0 to 100 (undefined for indeterminate) */
  value?: number;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Height of the progress bar */
  height?: number;
  /** Show percentage label */
  showLabel?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function LinearProgress({ value, variant = 'primary', height = 4, showLabel = false, accessibilityLabel }: LinearProgressProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');
  const borderColor = useThemeColor({}, 'border');

  const progress = useSharedValue(0);
  const indeterminatePosition = useSharedValue(-100);

  const variantColors = {
    error: errorColor,
    primary: primaryColor,
    success: successColor,
    warning: warningColor,
  };

  const isIndeterminate = value === undefined;

  useEffect(() => {
    if (isIndeterminate) {
      indeterminatePosition.value = withRepeat(withTiming(100, { duration: 1500, easing: Easing.linear }), -1, false);
    } else {
      progress.value = withTiming(Math.min(100, Math.max(0, value)), {
        duration: 300,
      });
    }
  }, [value, isIndeterminate, indeterminatePosition, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  const indeterminateStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indeterminatePosition.value }],
  }));

  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || (isIndeterminate ? 'Loading' : `Progress: ${Math.round(value)}%`)}
      accessibilityValue={isIndeterminate ? undefined : { max: 100, min: 0, now: value }}
    >
      <View
        style={[
          styles.track,
          {
            backgroundColor: borderColor,
            height,
          },
        ]}
      >
        {isIndeterminate ? (
          <Animated.View
            style={[
              styles.indeterminateBar,
              {
                backgroundColor: variantColors[variant],
                height,
              },
              indeterminateStyle,
            ]}
          />
        ) : (
          <Animated.View
            style={[
              styles.bar,
              {
                backgroundColor: variantColors[variant],
                height,
              },
              progressStyle,
            ]}
          />
        )}
      </View>

      {showLabel && !isIndeterminate && (
        <ThemedText type="caption" style={styles.label}>
          {Math.round(value)}%
        </ThemedText>
      )}
    </View>
  );
}

export interface CircularProgressProps {
  /** Progress value from 0 to 100 (undefined for indeterminate) */
  value?: number;
  /** Size of the circular progress */
  size?: number;
  /** Color variant */
  variant?: 'primary' | 'success' | 'warning' | 'error';
  /** Show percentage label in center */
  showLabel?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function CircularProgress({ value, size = 40, variant = 'primary', showLabel = false, accessibilityLabel }: CircularProgressProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  const variantColors = {
    error: errorColor,
    primary: primaryColor,
    success: successColor,
    warning: warningColor,
  };

  const isIndeterminate = value === undefined;

  if (isIndeterminate) {
    return (
      <View style={[styles.circularContainer, { height: size, width: size }]} accessible={true} accessibilityRole="progressbar" accessibilityLabel={accessibilityLabel || 'Loading'}>
        <ActivityIndicator size={size > 30 ? 'large' : 'small'} color={variantColors[variant]} />
      </View>
    );
  }

  const percentage = Math.min(100, Math.max(0, value));

  return (
    <View
      style={[styles.circularContainer, { height: size, width: size }]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel || `Progress: ${Math.round(percentage)}%`}
      accessibilityValue={{ max: 100, min: 0, now: percentage }}
    >
      <ActivityIndicator size={size > 30 ? 'large' : 'small'} color={variantColors[variant]} />
      {showLabel && (
        <View style={styles.circularLabelContainer}>
          <ThemedText type="caption" style={styles.circularLabel}>
            {Math.round(percentage)}%
          </ThemedText>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 2,
  },
  circularContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  circularLabel: {
    fontWeight: '600',
  },
  circularLabelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  },
  container: {
    gap: 8,
    width: '100%',
  },
  indeterminateBar: {
    borderRadius: 2,
    position: 'absolute',
    width: '50%',
  },
  label: {
    textAlign: 'right',
  },
  track: {
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
});
