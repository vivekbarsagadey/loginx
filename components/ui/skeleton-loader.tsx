import { AnimationDurations, Colors } from '@/constants';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { Easing, interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

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

export const SkeletonLoader = ({ 
  width = '100%', 
  height = 20, 
  borderRadius = 4, 
  style,
  shimmer = false 
}: SkeletonLoaderProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const opacity = useSharedValue(0.3);
  const shimmerValue = useSharedValue(0);

  useEffect(() => {
    if (shimmer) {
      // Shimmer effect - sliding gradient
      shimmerValue.value = withRepeat(
        withTiming(1, { 
          duration: AnimationDurations.SKELETON_SHIMMER,
          easing: Easing.linear 
        }),
        -1,
        false
      );
    } else {
      // Pulse effect - opacity animation
      opacity.value = withRepeat(
        withTiming(0.8, { duration: AnimationDurations.SKELETON_SHIMMER / 1.5 }),
        -1,
        true
      );
    }
  }, [opacity, shimmerValue, shimmer]);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const shimmerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      shimmerValue.value,
      [0, 1],
      [-300, 300]
    );
    
    return {
      transform: [{ translateX }],
    };
  });

  const baseStyle = {
    width,
    height,
    borderRadius,
    backgroundColor: theme['border-strong'],
  };

  if (shimmer) {
    const shimmerColor = colorScheme === 'dark' 
      ? 'rgba(255,255,255,0.1)' 
      : 'rgba(255,255,255,0.7)';

    return (
      <View style={[styles.skeleton, baseStyle, style]}>
        <Animated.View 
          style={[
            styles.shimmerOverlay,
            shimmerStyle,
            { backgroundColor: shimmerColor }
          ]}
        />
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.skeleton,
        baseStyle,
        pulseStyle,
        style,
      ]}
    />
  );
};

// Skeleton presets for common UI elements
export const SkeletonText = ({ lines = 1, shimmer = false }: { lines?: number; shimmer?: boolean }) => (
  <View style={styles.textContainer}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader 
        key={index} 
        height={16} 
        width={index === lines - 1 ? '60%' : '100%'} 
        style={index < lines - 1 ? styles.textLine : undefined}
        shimmer={shimmer}
      />
    ))}
  </View>
);

export const SkeletonAvatar = ({ size = 40, shimmer = false }: { size?: number; shimmer?: boolean }) => (
  <SkeletonLoader width={size} height={size} borderRadius={size / 2} shimmer={shimmer} />
);

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

export const SkeletonButton = ({ shimmer = false }: { shimmer?: boolean }) => (
  <SkeletonLoader height={48} borderRadius={12} style={styles.button} shimmer={shimmer} />
);

export const SkeletonImage = ({ 
  width = '100%', 
  height = 200,
  shimmer = false 
}: { 
  width?: DimensionValue; 
  height?: number;
  shimmer?: boolean;
}) => (
  <SkeletonLoader width={width} height={height} borderRadius={8} shimmer={shimmer} />
);

export const SkeletonListItem = ({ shimmer = false }: { shimmer?: boolean }) => (
  <View style={styles.listItem}>
    <SkeletonAvatar size={40} shimmer={shimmer} />
    <View style={styles.listItemContent}>
      <SkeletonLoader height={14} width="80%" shimmer={shimmer} />
      <SkeletonLoader height={12} width="60%" style={styles.listItemSubtext} shimmer={shimmer} />
    </View>
  </View>
);

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
