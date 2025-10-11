/**
 * ThemedPressable Component
 * Themed wrapper around Pressable with automatic pressed states, haptic feedback, and loading support
 *
 * Features:
 * - Automatic pressed state styling (opacity/scale)
 * - Built-in haptic feedback
 * - Theme-aware colors
 * - Multiple variants for different use cases
 * - Loading state support
 * - Accessibility props included
 *
 * @example
 * ```tsx
 * <ThemedPressable variant="card" onPress={handlePress}>
 *   <ThemedText>Card content</ThemedText>
 * </ThemedPressable>
 *
 * <ThemedPressable variant="row" hapticFeedback="medium" loading={isLoading}>
 *   <ThemedText>Loading action...</ThemedText>
 * </ThemedPressable>
 * ```
 */

import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import * as Haptics from 'expo-haptics';
import { memo } from 'react';
import { ActivityIndicator, Pressable, type PressableProps, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface ThemedPressableProps extends PressableProps {
  /**
   * Visual variant of the pressable
   * - card: Card-like container with surface background
   * - row: List row with border
   * - button: Button-like styling
   * - minimal: No background, minimal styling
   * - none: No styling applied, only press behavior
   */
  variant?: 'card' | 'row' | 'button' | 'minimal' | 'none';

  /**
   * Opacity to apply when pressed
   * @default 0.7
   */
  pressedOpacity?: number;

  /**
   * Scale to apply when pressed
   * @default 0.98
   */
  pressedScale?: number;

  /**
   * Haptic feedback intensity
   * - light: Light impact (default)
   * - medium: Medium impact
   * - heavy: Heavy impact (for destructive actions)
   * - none: No haptic feedback
   * @default 'light'
   */
  hapticFeedback?: 'light' | 'medium' | 'heavy' | 'none';

  /**
   * Loading state - shows activity indicator
   * @default false
   */
  loading?: boolean;

  /**
   * Disabled state
   * @default false
   */
  disabled?: boolean;

  /**
   * Children content
   */
  children: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function ThemedPressableComponent({
  variant = 'none',
  pressedOpacity = 0.7,
  pressedScale = 0.98,
  hapticFeedback = 'light',
  loading = false,
  disabled = false,
  style,
  onPress,
  children,
  ...rest
}: ThemedPressableProps) {
  const colors = useThemeColors();
  const scale = useSharedValue(1);

  // Get variant styles
  const variantStyles: Record<string, ViewStyle> = {
    card: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.md,
      padding: Spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
    },
    row: {
      backgroundColor: colors.surface,
      borderRadius: BorderRadius.sm,
      padding: Spacing.md,
      borderBottomWidth: 1,
      borderColor: colors.border,
    },
    button: {
      backgroundColor: colors.primary,
      borderRadius: BorderRadius.md,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      alignItems: 'center',
      justifyContent: 'center',
    },
    minimal: {
      padding: Spacing.sm,
    },
    none: {},
  };

  const handlePress = async (event: Parameters<NonNullable<PressableProps['onPress']>>[0]) => {
    if (disabled || loading) {
      return;
    }

    // Trigger haptic feedback
    if (hapticFeedback !== 'none') {
      const hapticStyle = hapticFeedback === 'heavy' ? Haptics.ImpactFeedbackStyle.Heavy : hapticFeedback === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light;

      Haptics.impactAsync(hapticStyle).catch(() => {
        // Haptic not supported, silently continue
      });
    }

    // Animate scale
    scale.value = withSpring(pressedScale, {
      damping: 15,
      stiffness: 150,
    });

    setTimeout(() => {
      scale.value = withSpring(1);
    }, 100);

    onPress?.(event);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const disabledStyle: ViewStyle = disabled || loading ? { opacity: 0.5 } : {};

  return (
    <AnimatedPressable
      style={[variantStyles[variant], animatedStyle, disabledStyle, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...rest}
    >
      {({ pressed }) => (
        <>
          {loading ? (
            <ActivityIndicator color={variant === 'button' ? colors['on-primary'] : colors.primary} />
          ) : (
            <Animated.View
              style={[
                styles.content,
                {
                  opacity: pressed ? pressedOpacity : 1,
                },
              ]}
            >
              {children}
            </Animated.View>
          )}
        </>
      )}
    </AnimatedPressable>
  );
}

export const ThemedPressable = memo(ThemedPressableComponent);

const styles = StyleSheet.create({
  content: {
    // Allows children to control their own layout
  },
});
