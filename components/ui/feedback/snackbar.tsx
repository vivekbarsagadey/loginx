import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface SnackbarProps {
  /** Message to display */
  message: string;
  /** Severity variant */
  variant?: 'info' | 'success' | 'warning' | 'error';
  /** Position on screen */
  position?: 'top' | 'bottom';
  /** Visibility state */
  visible: boolean;
  /** Auto-hide duration in milliseconds (0 for no auto-hide) */
  duration?: number;
  /** Action button label */
  actionLabel?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Called when snackbar is dismissed */
  onDismiss: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Snackbar({ message, variant = 'info', position = 'bottom', visible, duration = 4000, actionLabel, onAction, onDismiss, accessibilityLabel }: SnackbarProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const shadowColor = useThemeColor({}, 'shadow');

  const translateY = useSharedValue(position === 'bottom' ? 100 : -100);
  const opacity = useSharedValue(0);

  const variantColors = {
    error: errorColor,
    info: primaryColor,
    success: successColor,
    warning: warningColor,
  };

  const dynamicStyles = React.useMemo(
    () =>
      StyleSheet.create({
        contentDynamic: {
          backgroundColor: surfaceColor,
          shadowColor,
        },
      }),
    [surfaceColor, shadowColor]
  );

  useEffect(() => {
    if (visible) {
      // Show animation
      translateY.value = withTiming(0, { duration: 300 });
      opacity.value = withTiming(1, { duration: 300 });

      // Auto-hide after duration
      if (duration > 0) {
        setTimeout(() => {
          onDismiss();
        }, duration);
      }
    } else {
      // Hide animation
      translateY.value = withTiming(position === 'bottom' ? 100 : -100, {
        duration: 200,
      });
      opacity.value = withTiming(0, { duration: 200 });
    }
  }, [visible, duration, onDismiss, position, translateY, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[styles.container, position === 'bottom' ? styles.bottom : styles.top, animatedStyle]}
      accessible={true}
      accessibilityRole="alert"
      accessibilityLabel={accessibilityLabel || message}
      accessibilityLiveRegion="polite"
    >
      <View
        style={[
          styles.content,
          dynamicStyles.contentDynamic,
          {
            borderLeftColor: variantColors[variant],
          },
        ]}
      >
        <ThemedText style={[styles.message, { color: textColor }]} numberOfLines={2}>
          {message}
        </ThemedText>

        {actionLabel && onAction && (
          <Pressable onPress={onAction} style={styles.action} accessible={true} accessibilityRole="button" accessibilityLabel={actionLabel}>
            <ThemedText style={[styles.actionText, { color: variantColors[variant] }]}>{actionLabel}</ThemedText>
          </Pressable>
        )}

        <Pressable onPress={onDismiss} style={styles.dismiss} accessible={true} accessibilityRole="button" accessibilityLabel="Dismiss" hitSlop={{ bottom: 8, left: 8, right: 8, top: 8 }}>
          <ThemedText style={[styles.dismissText, { color: textColor }]}>✕</ThemedText>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  action: {
    paddingHorizontal: Spacing.md,
  },
  actionText: {
    fontWeight: '600',
  },
  bottom: {
    bottom: Spacing.lg,
  },
  container: {
    left: Spacing.md,
    position: 'absolute',
    right: Spacing.md,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    borderLeftWidth: 4,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  dismiss: {
    padding: Spacing.xs,
  },
  dismissText: {
    fontSize: 18,
    lineHeight: 18,
  },
  message: {
    flex: 1,
  },
  top: {
    top: Spacing.lg,
  },
});
