/**
 * SuccessAnimation Component
 * Displays animated success feedback with checkmark, scale, and optional celebration effects
 *
 * @example
 * ```tsx
 * <SuccessAnimation
 *   visible={showSuccess}
 *   message="Profile updated successfully!"
 *   onComplete={() => setShowSuccess(false)}
 * />
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { AnimationDurations } from '@/constants/animation';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { Easing, FadeIn, FadeOut, useAnimatedStyle, useSharedValue, withDelay, withSequence, withSpring, withTiming } from 'react-native-reanimated';

export interface SuccessAnimationProps {
  /**
   * Whether the animation is visible
   */
  visible: boolean;

  /**
   * Success message to display
   */
  message: string;

  /**
   * Optional title (defaults to "Success!")
   */
  title?: string;

  /**
   * Duration to show animation before auto-hiding (ms)
   * @default 2500
   */
  duration?: number;

  /**
   * Callback when animation completes
   */
  onComplete?: () => void;

  /**
   * Show confetti/celebration effect
   * @default false
   */
  showConfetti?: boolean;

  /**
   * Icon to display (defaults to checkmark-circle)
   */
  icon?: keyof typeof Ionicons.glyphMap;

  /**
   * Custom icon color (defaults to theme success color)
   */
  iconColor?: string;
}

/**
 * SuccessAnimation Component
 * Animated success feedback with checkmark and optional celebration
 */
export function SuccessAnimation({ visible, message, title = 'Success!', duration = 2500, onComplete, showConfetti = false, icon = 'checkmark-circle', iconColor }: SuccessAnimationProps) {
  const successColor = useThemeColor({}, 'success');
  const backgroundColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const shadowColor = useThemeColor({}, 'shadow');

  // Animation values
  const scale = useSharedValue(0);
  const rotation = useSharedValue(-180);
  const iconOpacity = useSharedValue(0);
  const confettiScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      // Haptic feedback
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      // Icon entrance animation
      scale.value = withSequence(withSpring(1.2, { damping: 10, stiffness: 100 }), withSpring(1, { damping: 15, stiffness: 150 }));

      rotation.value = withTiming(0, {
        duration: AnimationDurations.MEDIUM,
        easing: Easing.out(Easing.cubic),
      });

      iconOpacity.value = withTiming(1, {
        duration: AnimationDurations.FAST,
      });

      // Confetti animation
      if (showConfetti) {
        confettiScale.value = withSequence(withDelay(100, withSpring(1, { damping: 12, stiffness: 120 })), withDelay(duration - 500, withTiming(0, { duration: AnimationDurations.MEDIUM })));
      }

      // Auto-hide after duration
      const timer = setTimeout(() => {
        scale.value = withTiming(0, { duration: AnimationDurations.FAST });
        iconOpacity.value = withTiming(0, { duration: AnimationDurations.FAST });
        rotation.value = withTiming(180, { duration: AnimationDurations.FAST });

        setTimeout(() => {
          onComplete?.();
        }, AnimationDurations.FAST);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      // Reset values
      scale.value = 0;
      rotation.value = -180;
      iconOpacity.value = 0;
      confettiScale.value = 0;
    }
  }, [visible, duration, onComplete, showConfetti, scale, rotation, iconOpacity, confettiScale]);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${rotation.value}deg` }],
    opacity: iconOpacity.value,
  }));

  const confettiAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: confettiScale.value }],
    opacity: confettiScale.value,
  }));

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.overlay} pointerEvents="none">
      <Animated.View style={[styles.container, { backgroundColor, shadowColor }]} entering={FadeIn.duration(AnimationDurations.FAST)} exiting={FadeOut.duration(AnimationDurations.FAST)}>
        {/* Confetti effect (if enabled) */}
        {showConfetti && (
          <Animated.View style={[styles.confettiContainer, confettiAnimatedStyle]}>
            {[...Array(12)].map((_, i) => (
              <ConfettiParticle key={i} index={i} color={i % 3 === 0 ? successColor : i % 3 === 1 ? iconColor || successColor : '#FFC107'} />
            ))}
          </Animated.View>
        )}

        {/* Success icon */}
        <Animated.View style={iconAnimatedStyle}>
          <Ionicons name={icon} size={80} color={iconColor || successColor} />
        </Animated.View>

        {/* Success message */}
        <ThemedView style={styles.textContainer}>
          <ThemedText type="h2" style={[styles.title, { color: textColor }]}>
            {title}
          </ThemedText>
          <ThemedText type="body" style={[styles.message, { color: textColor }]}>
            {message}
          </ThemedText>
        </ThemedView>
      </Animated.View>
    </View>
  );
}

/**
 * Individual confetti particle component
 */
function ConfettiParticle({ index, color }: { index: number; color: string }) {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    const angle = (index * 30) % 360;
    const distance = 80 + Math.random() * 40;

    translateX.value = withSpring(Math.cos((angle * Math.PI) / 180) * distance, { damping: 15 });

    translateY.value = withSpring(Math.sin((angle * Math.PI) / 180) * distance, { damping: 15 });

    rotate.value = withTiming(360 + Math.random() * 360, {
      duration: 1000 + Math.random() * 500,
    });

    opacity.value = withDelay(800, withTiming(0, { duration: 500 }));
  }, [index, translateX, translateY, rotate, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }, { translateY: translateY.value }, { rotate: `${rotate.value}deg` }],
    opacity: opacity.value,
  }));

  return <Animated.View style={[styles.confetti, { backgroundColor: color }, animatedStyle]} />;
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  container: {
    padding: Spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
    maxWidth: 320,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 2,
  },
  textContainer: {
    marginTop: Spacing.md,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  title: {
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
  },
});
