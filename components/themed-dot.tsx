import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming } from 'react-native-reanimated';

export interface ThemedDotProps {
  /**
   * Size variant of the dot
   * @default 'sm'
   */
  size?: 'xs' | 'sm' | 'md' | 'lg';

  /**
   * Color variant
   * @default 'primary'
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info' | 'muted';

  /**
   * Custom color (overrides variant)
   */
  color?: string;

  /**
   * Enable pulsing animation
   * @default false
   */
  pulse?: boolean;

  /**
   * Custom styles
   */
  style?: ViewStyle;

  /**
   * Accessibility label
   */
  accessibilityLabel?: string;
}

/**
 * ThemedDot Component
 *
 * A small, themed circular indicator for status, presence, notifications, etc.
 * Supports multiple sizes, color variants, and optional pulsing animation.
 *
 * @example
 * // Unread notification dot
 * <ThemedDot size="xs" variant="primary" />
 *
 * @example
 * // Online status indicator with pulse
 * <ThemedDot size="sm" variant="success" pulse />
 *
 * @example
 * // Custom colored dot
 * <ThemedDot size="md" color="#FF6B6B" />
 */
export function ThemedDot({ size = 'sm', variant = 'primary', color, pulse = false, style, accessibilityLabel }: ThemedDotProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');
  const infoColor = useThemeColor({}, 'info');
  const mutedColor = useThemeColor({}, 'text-muted');

  const variantColors = {
    primary: primaryColor,
    success: successColor,
    warning: warningColor,
    _error: errorColor,
    info: infoColor,
    muted: mutedColor,
  };

  const sizeMap = {
    xs: 6,
    sm: 8,
    md: 12,
    lg: 16,
  };

  const dotColor = color || variantColors[variant];
  const dotSize = sizeMap[size];

  // Pulse animation
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (pulse) {
      scale.value = withRepeat(
        withSequence(withTiming(1.2, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1, // Infinite
        false
      );

      opacity.value = withRepeat(
        withSequence(withTiming(0.6, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1, // Infinite
        false
      );
    } else {
      scale.value = 1;
      opacity.value = 1;
    }
  }, [pulse, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (pulse) {
    return (
      <Animated.View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            borderRadius: dotSize / 2,
            backgroundColor: dotColor,
          },
          animatedStyle,
          style,
        ]}
        accessible={true}
        accessibilityRole="image"
        accessibilityLabel={accessibilityLabel || `${variant} indicator`}
      />
    );
  }

  return (
    <View
      style={[
        styles.dot,
        {
          width: dotSize,
          height: dotSize,
          borderRadius: dotSize / 2,
          backgroundColor: dotColor,
        },
        style,
      ]}
      accessible={true}
      accessibilityRole="image"
      accessibilityLabel={accessibilityLabel || `${variant} indicator`}
    />
  );
}

const styles = StyleSheet.create({
  dot: {
    // Base dot styles - size and color applied inline
  },
});
