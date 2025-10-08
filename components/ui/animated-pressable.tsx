import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, PressableProps, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface AnimatedPressableProps extends PressableProps {
  /** Animation type on press */
  animationType?: 'scale' | 'opacity' | 'both' | 'none';
  /** Scale factor when pressed (default 0.95) */
  pressedScale?: number;
  /** Opacity when pressed (default 0.7) */
  pressedOpacity?: number;
  /** Use spring animation instead of timing */
  useSpring?: boolean;
  /** Children elements */
  children: React.ReactNode;
}

/**
 * Animated Pressable Component
 * Provides visual feedback with scale/opacity animations on press
 * 
 * @example
 * <AnimatedPressable onPress={handlePress} animationType="scale">
 *   <Text>Press me</Text>
 * </AnimatedPressable>
 */
export function AnimatedPressable({
  children,
  animationType = 'both',
  pressedScale = 0.95,
  pressedOpacity = 0.7,
  useSpring = true,
  style,
  disabled,
  ...props
}: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const transforms = [];
    
    if (animationType === 'scale' || animationType === 'both') {
      transforms.push({ scale: scale.value });
    }

    return {
      transform: transforms,
      opacity: (animationType === 'opacity' || animationType === 'both') 
        ? opacity.value 
        : 1,
    };
  });

  const handlePressIn = () => {
    if (animationType === 'scale' || animationType === 'both') {
      scale.value = useSpring 
        ? withSpring(pressedScale, { damping: 15, stiffness: 150 })
        : withTiming(pressedScale, { duration: 100 });
    }
    
    if (animationType === 'opacity' || animationType === 'both') {
      opacity.value = withTiming(pressedOpacity, { duration: 100 });
    }
  };

  const handlePressOut = () => {
    if (animationType === 'scale' || animationType === 'both') {
      scale.value = useSpring
        ? withSpring(1, { damping: 15, stiffness: 150 })
        : withTiming(1, { duration: 100 });
    }
    
    if (animationType === 'opacity' || animationType === 'both') {
      opacity.value = withTiming(1, { duration: 100 });
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={disabled ? styles.disabled : undefined}
      {...props}
    >
      <Animated.View style={[animatedStyle, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
});
