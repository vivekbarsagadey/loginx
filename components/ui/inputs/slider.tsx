import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export interface SliderProps {
  /** Current value */
  value: number;
  /** Minimum value */
  min?: number;
  /** Maximum value */
  max?: number;
  /** Step increment */
  step?: number;
  /** Called when value changes */
  onValueChange: (value: number) => void;
  /** Show value label */
  showLabel?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function Slider({ value, min = 0, max = 100, step = 1, onValueChange, showLabel = false, disabled = false, accessibilityLabel }: SliderProps) {
  const primaryColor = useThemeColor({}, 'primary');
  const borderColor = useThemeColor({}, 'border');
  const backgroundColor = useThemeColor({}, 'background');

  const [sliderWidth, setSliderWidth] = useState(0);
  const translateX = useSharedValue(0);
  const isDragging = useSharedValue(false);

  // Calculate position based on value
  const valueToPosition = (val: number) => {
    const percentage = (val - min) / (max - min);
    return percentage * sliderWidth;
  };

  // Calculate value based on position
  const positionToValue = (pos: number) => {
    const percentage = Math.max(0, Math.min(1, pos / sliderWidth));
    const rawValue = percentage * (max - min) + min;
    return Math.round(rawValue / step) * step;
  };

  React.useEffect(() => {
    translateX.value = valueToPosition(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const pan = Gesture.Pan()
    .onBegin(() => {
      isDragging.value = true;
    })
    .onChange((event) => {
      const newPosition = Math.max(0, Math.min(sliderWidth, event.translationX + translateX.value));
      translateX.value = newPosition;
      const newValue = positionToValue(newPosition);
      runOnJS(onValueChange)(newValue);
    })
    .onEnd(() => {
      isDragging.value = false;
      translateX.value = withSpring(valueToPosition(value));
    });

  const thumbStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const fillStyle = useAnimatedStyle(() => ({
    width: translateX.value,
  }));

  return (
    <View style={styles.container}>
      <View
        style={styles.track}
        onLayout={(event) => {
          setSliderWidth(event.nativeEvent.layout.width);
          translateX.value = valueToPosition(value);
        }}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityValue={{ max, min, now: value }}
        accessibilityLabel={accessibilityLabel || `Slider: ${value}`}
      >
        <View style={[styles.trackBackground, { backgroundColor: borderColor }]} />
        <Animated.View
          style={[
            styles.trackFill,
            {
              backgroundColor: primaryColor,
            },
            fillStyle,
          ]}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles.thumb,
              {
                backgroundColor,
                borderColor: primaryColor,
                opacity: disabled ? 0.4 : 1,
              },
              thumbStyle,
            ]}
          />
        </GestureDetector>
      </View>

      {showLabel && (
        <ThemedText type="caption" style={styles.label}>
          {value}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
    width: '100%',
  },
  label: {
    textAlign: 'center',
  },
  thumb: {
    borderRadius: 999,
    borderWidth: 2,
    height: 24,
    left: -12,
    position: 'absolute',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    top: -8,
    width: 24,
  },
  track: {
    height: 8,
    position: 'relative',
    width: '100%',
  },
  trackBackground: {
    borderRadius: 4,
    height: 8,
    width: '100%',
  },
  trackFill: {
    borderRadius: 4,
    height: 8,
    left: 0,
    position: 'absolute',
    top: 0,
  },
});
