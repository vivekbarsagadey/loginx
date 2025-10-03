import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useEffect } from 'react';
import { DimensionValue, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

interface SkeletonLoaderProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonLoader = ({ width = '100%', height = 20, borderRadius = 4, style }: SkeletonLoaderProps) => {
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme || 'light'];
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.8, { duration: 1000 }),
      -1, // Infinite
      true // Reverse
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          backgroundColor: theme['border-strong'],
        },
        animatedStyle,
        style,
      ]}
    />
  );
};

// Skeleton presets for common UI elements
export const SkeletonText = ({ lines = 1 }: { lines?: number }) => (
  <View style={styles.textContainer}>
    {Array.from({ length: lines }).map((_, index) => (
      <SkeletonLoader key={index} height={16} width={index === lines - 1 ? '60%' : '100%'} style={{ marginBottom: index < lines - 1 ? 8 : 0 }} />
    ))}
  </View>
);

export const SkeletonAvatar = ({ size = 40 }: { size?: number }) => <SkeletonLoader width={size} height={size} borderRadius={size / 2} />;

export const SkeletonCard = () => (
  <View style={styles.cardContainer}>
    <View style={styles.cardHeader}>
      <SkeletonAvatar size={48} />
      <View style={styles.cardContent}>
        <SkeletonLoader height={16} width="70%" />
        <SkeletonLoader height={12} width="40%" style={{ marginTop: 4 }} />
      </View>
    </View>
    <SkeletonText lines={3} />
  </View>
);

export const SkeletonButton = () => <SkeletonLoader height={48} borderRadius={12} style={{ marginVertical: 8 }} />;

const styles = StyleSheet.create({
  skeleton: {
    // Base skeleton styles
  },
  textContainer: {
    // Text skeleton container
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
});
