import { AnimationDurations } from '@/constants';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Opacity } from '@/utils/color';
import { useEffect } from 'react';
import { type DimensionValue, StyleSheet, View, type ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useReducedMotion, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

/**
 * Skeleton loader component for displaying loading states
 * Supports both pulse and shimmer animation effects
 * Respects user's reduced motion preferences for accessibility
 * @example
 * // Basic usage
 * <SkeletonLoader height={40} />
 *
 * // With shimmer effect
 * <SkeletonLoader height={40} shimmer />
 *
 * // Using presets
 * <SkeletonText lines={3} />
 * <SkeletonCard />
 * <SkeletonListItem />
 */
interface SkeletonLoaderProps {
  /** Width of the skeleton */
  width?: DimensionValue;
  /** Height of the skeleton */
  height?: number;
  /** Border radius */
  borderRadius?: number;
  /** Custom style */
  style?: ViewStyle;
  /** Use shimmer effect instead of pulse */
  shimmer?: boolean;
}

export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 4, style, shimmer = false }: SkeletonLoaderProps) => {
  const borderStrongColor = useThemeColor({}, 'border-strong');
  const reducedMotion = useReducedMotion();
  const opacity = useSharedValue(0.3);
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    // Respect user's reduced motion preference
    if (reducedMotion) {
      opacity.value = 0.5;
      return;
    }

    if (shimmer) {
      // Shimmer effect - sliding gradient
      shimmerValue.value = withRepeat(
        withTiming(1, {
          duration: AnimationDurations.SKELETON_SHIMMER,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
        }),
        -1,
        false
      );
    } else {
      // Pulse effect - opacity animation
      opacity.value = withRepeat(
        withTiming(0.8, {
          duration: AnimationDurations.SKELETON_SHIMMER / 1.5,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
        }),
        -1,
        true
      );
    }
  }, [opacity, shimmerValue, shimmer, reducedMotion]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(shimmerValue.value, [0, 1], [-300, 300]);

    return {
      transform: [{ translateX }],
    };
  });

  const baseStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: borderStrongColor,
  };

  if (shimmer) {
    const shimmerColor = `rgba(255, 255, 255, ${Opacity.subtle})`;

    return (
      <View style={[styles.skeleton, baseStyle, style]} accessibilityRole="none" accessibilityLabel="Loading content" accessible={true}>
        <Animated.View style={[styles.shimmerOverlay, shimmerStyle, { backgroundColor: shimmerColor }]} />
      </View>
    );
  }

  return <Animated.View style={[styles.skeleton, baseStyle, pulseStyle, style]} accessibilityRole="none" accessibilityLabel="Loading content" accessible={true} />;
};

// Skeleton presets for common UI elements

/**
 * Text skeleton with multiple lines
 * @param lines - Number of text lines to display (default: 1)
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonText = ({ lines = 1, shimmer = false }: { lines?: number; shimmer?: boolean }) => (
  <View style={styles.textContainer}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader key={index} height={16} width={index === lines - 1 ? '60%' : '100%'} style={index < lines - 1 ? styles.textLine : undefined} shimmer={shimmer} />
    ))}
  </View>
);

/**
 * Circular avatar skeleton
 * @param size - Diameter of the avatar (default: 40)
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonAvatar = ({ size = 40, shimmer = false }: { size?: number; shimmer?: boolean }) => <SkeletonLoader width={size} height={size} borderRadius={size / 2} shimmer={shimmer} />;

/**
 * Card skeleton with avatar, header, and content
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonCard = ({ shimmer = false }: { shimmer?: boolean }) => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <SkeletonAvatar size={48} shimmer={shimmer} />
      <View style={styles.cardContent}>
        <SkeletonLoader height={16} width="70%" shimmer={shimmer} />
        <SkeletonLoader height={12} width="40%" style={styles.cardSubtitle} shimmer={shimmer} />
      </View>
    </View>
    <SkeletonText lines={3} shimmer={shimmer} />
  </View>
);

/**
 * Button skeleton
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonButton = ({ shimmer = false }: { shimmer?: boolean }) => <SkeletonLoader height={48} borderRadius={12} style={styles.button} shimmer={shimmer} />;

/**
 * Image placeholder skeleton
 * @param width - Width of the image (default: '100%')
 * @param height - Height of the image (default: 200)
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonImage = ({ width = '100%', height = 200, shimmer = false }: { width?: DimensionValue; height?: number; shimmer?: boolean }) => (
  <SkeletonLoader width={width} height={height} borderRadius={8} shimmer={shimmer} />
);

/**
 * List item skeleton with avatar and text
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonListItem = ({ shimmer = false }: { shimmer?: boolean }) => (
  <View style={styles.listItem}>
    <SkeletonAvatar size={40} shimmer={shimmer} />
    <View style={styles.listItemContent}>
      <SkeletonLoader height={14} width="80%" shimmer={shimmer} />
      <SkeletonLoader height={12} width="60%" style={styles.listItemSubtext} shimmer={shimmer} />
    </View>
  </View>
);

/**
 * Form skeleton with labels, inputs, and button
 * @param shimmer - Use shimmer effect instead of pulse (default: false)
 */
export const SkeletonForm = ({ shimmer = false }: { shimmer?: boolean }) => (
  <View>
    <SkeletonLoader height={16} width="30%" style={styles.formLabel} shimmer={shimmer} />
    <SkeletonLoader height={48} borderRadius={8} style={styles.formInput} shimmer={shimmer} />
    <SkeletonLoader height={16} width="30%" style={styles.formLabel} shimmer={shimmer} />
    <SkeletonLoader height={48} borderRadius={8} style={styles.formInput} shimmer={shimmer} />
    <SkeletonButton shimmer={shimmer} />
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    overflow: 'hidden',
  },
  shimmerOverlay: {
    position: 'absolute',
    top: 0,
    left: -50,
    width: 100,
    height: '100%',
    opacity: 0.5,
  },
  textContainer: {
    width: '100%',
  },
  textLine: {
    marginBottom: 8,
  },
  cardContainer: {
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    marginLeft: 12,
  },
  cardSubtitle: {
    marginTop: 4,
  },
  button: {
    marginVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  listItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  listItemSubtext: {
    marginTop: 4,
  },
  formLabel: {
    marginBottom: 8,
  },
  formInput: {
    marginBottom: 16,
  },
});
