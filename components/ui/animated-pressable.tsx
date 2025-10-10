import React from 'react';
import { Pressable, type PressableProps, type StyleProp, StyleSheet, type ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

interface AnimatedPressableProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  animationType?: 'scale' | 'opacity' | 'both';
  pressedScale?: number;
  pressedOpacity?: number;
  duration?: number;
  useSpring?: boolean;
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
export function AnimatedPressable({ children, animationType = 'both', pressedScale = 0.95, pressedOpacity = 0.7, useSpring = true, style, disabled, ...props }: AnimatedPressableProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    const transforms = [];

    if (animationType === 'scale' || animationType === 'both') {
      transforms.push({ scale: scale.value });
    }

    return {
      transform: transforms,
      opacity: animationType === 'opacity' || animationType === 'both' ? opacity.value : 1,
    };
  });

  const handlePressIn = () => {
    if (animationType === 'scale' || animationType === 'both') {
      scale.value = useSpring ? withSpring(pressedScale, { damping: 20, stiffness: 200 }) : withTiming(pressedScale, { duration: 150 });
    }

    if (animationType === 'opacity' || animationType === 'both') {
      opacity.value = withTiming(pressedOpacity, { duration: 150 });
    }
  };

  const handlePressOut = () => {
    if (animationType === 'scale' || animationType === 'both') {
      scale.value = useSpring ? withSpring(1, { damping: 20, stiffness: 200 }) : withTiming(1, { duration: 150 });
    }

    if (animationType === 'opacity' || animationType === 'both') {
      opacity.value = withTiming(1, { duration: 150 });
    }
  };

  return (
    <Pressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={disabled ? styles.disabled : undefined}
      accessible={true}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || false }}
      {...props}
    >
      <Animated.View style={[animatedStyle, style]}>{children}</Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  disabled: {
    opacity: 0.4,
  },
});
