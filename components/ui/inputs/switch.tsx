import { rounded } from '@/constants/style-utils';
import { useThemeColors } from '@/hooks/use-theme-colors';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface SwitchProps {
  /** Current value */
  value: boolean;
  /** Called when value changes */
  onValueChange: (value: boolean) => void;
  /** Disabled state */
  disabled?: boolean;
  /** Size variant */
  size?: 'small' | 'medium';
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Switch({ value, onValueChange, disabled = false, size = 'medium', accessibilityLabel }: SwitchProps) {
  const colors = useThemeColors();

  const translateX = useSharedValue(value ? 1 : 0);

  const sizes = {
    medium: { height: 24, thumbSize: 20, width: 44 },
    small: { height: 20, thumbSize: 16, width: 36 },
  };

  const { width, height, thumbSize } = sizes[size];
  const thumbOffset = width - thumbSize - 4;

  React.useEffect(() => {
    translateX.value = withSpring(value ? thumbOffset : 2, {
      damping: 15,
      stiffness: 150,
    });
  }, [value, thumbOffset, translateX]);

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const handlePress = async () => {
    if (!disabled) {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      onValueChange(!value);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      accessible={true}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={accessibilityLabel || (value ? 'On' : 'Off')}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: value ? colors.primary : colors.border,
          height,
          opacity: disabled ? 0.4 : pressed ? 0.8 : 1,
          width,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: colors.background,
            height: thumbSize,
            width: thumbSize,
          },
          thumbStyle,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    ...rounded.full,
    justifyContent: 'center',
  },
  thumb: {
    ...rounded.full,
  },
});
