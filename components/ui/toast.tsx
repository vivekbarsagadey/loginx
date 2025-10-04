import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { SlideInDown, SlideOutDown, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export interface ToastProps {
  /** Toast message */
  message: string;
  /** Toast type - affects icon and color */
  type?: 'success' | 'error' | 'warning' | 'info';
  /** Duration in milliseconds */
  duration?: number;
  /** Whether toast is visible */
  visible: boolean;
  /** Callback when toast should hide */
  onHide: () => void;
}

/**
 * Toast Component
 * Temporary notification that appears at the bottom of screen
 */
export function Toast({ message, type = 'info', duration = 3000, visible, onHide }: ToastProps) {
  const backgroundColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const iconColor = useThemeColor({}, type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'primary');

  const opacity = useSharedValue(1);

  useEffect(() => {
    if (visible) {
      // Haptic feedback based on type
      if (type === 'success') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (type === 'error') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      } else if (type === 'warning') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      // Auto hide after duration
      const timer = setTimeout(() => {
        opacity.value = withTiming(0, { duration: 200 }, () => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, type, duration, onHide, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'x-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
      default:
        return 'info';
    }
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        container: {
          position: 'absolute',
          bottom: Spacing.xl,
          left: Spacing.lg,
          right: Spacing.lg,
          zIndex: 9999,
        },
        toast: {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor,
          borderWidth: 1,
          borderColor,
          borderRadius: 12,
          padding: Spacing.md,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 8,
        },
        iconContainer: {
          marginRight: Spacing.sm,
        },
        message: {
          flex: 1,
          color: textColor,
        },
      }),
    [backgroundColor, borderColor, textColor]
  );

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.container} pointerEvents="none">
      <Animated.View style={[styles.toast, animatedStyle]} entering={SlideInDown.duration(250).springify()} exiting={SlideOutDown.duration(200)}>
        <View style={styles.iconContainer}>
          <Feather name={getIcon() as React.ComponentProps<typeof Feather>['name']} size={24} color={iconColor} />
        </View>
        <ThemedText type="body" style={styles.message} numberOfLines={3}>
          {message}
        </ThemedText>
      </Animated.View>
    </View>
  );
}

/**
 * Hook to manage toast state
 */
export function useToast() {
  const [toastConfig, setToastConfig] = React.useState<{
    message: string;
    type: 'success' | 'error' | 'warning' | 'info';
    visible: boolean;
  }>({
    message: '',
    type: 'info',
    visible: false,
  });

  const show = React.useCallback((message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info') => {
    setToastConfig({ message, type, visible: true });
  }, []);

  const hide = React.useCallback(() => {
    setToastConfig((prev) => ({ ...prev, visible: false }));
  }, []);

  const showSuccess = React.useCallback((message: string) => show(message, 'success'), [show]);

  const showError = React.useCallback((message: string) => show(message, 'error'), [show]);

  const showWarning = React.useCallback((message: string) => show(message, 'warning'), [show]);

  const showInfo = React.useCallback((message: string) => show(message, 'info'), [show]);

  return {
    toastConfig,
    show,
    hide,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
}
