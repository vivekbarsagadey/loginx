import { ThemedText } from '@/components/themed-text';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface StarRatingProps {
  /** Current rating value (0-5) */
  value: number;
  /** Called when rating changes */
  onChange?: (rating: number) => void;
  /** Number of stars to display */
  starCount?: number;
  /** Size of each star */
  starSize?: number;
  /** Whether the rating is read-only */
  readonly?: boolean;
  /** Show rating text label */
  showLabel?: boolean;
  /** Custom labels for each rating */
  labels?: string[];
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Allow half-star ratings */
  allowHalf?: boolean;
}

export function StarRating({
  value,
  onChange,
  starCount = 5,
  starSize = 32,
  readonly = false,
  showLabel = false,
  labels = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'],
  accessibilityLabel = 'Star rating',
  allowHalf = false,
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const activeColor = useThemeColor({}, 'primary');
  const inactiveColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');

  const displayRating = hoverRating !== null ? hoverRating : value;

  const handlePress = async (rating: number) => {
    if (readonly || !onChange) {
      return;
    }

    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onChange(rating);
  };

  const renderStar = (index: number) => {
    const rating = index + 1;
    const isFilled = displayRating >= rating;
    const isHalfFilled = allowHalf && displayRating >= rating - 0.5 && displayRating < rating;

    return (
      <Pressable
        key={index}
        onPress={() => handlePress(rating)}
        onPressIn={() => !readonly && setHoverRating(rating)}
        onPressOut={() => !readonly && setHoverRating(null)}
        disabled={readonly}
        style={styles.starButton}
        accessibilityRole="button"
        accessibilityLabel={`${rating} star${rating !== 1 ? 's' : ''}`}
        accessibilityState={{ selected: isFilled, disabled: readonly }}
      >
        <Feather
          name={isFilled ? 'star' : isHalfFilled ? 'star' : 'star'}
          size={starSize}
          color={isFilled || isHalfFilled ? activeColor : inactiveColor}
          style={
            isHalfFilled
              ? {
                  // Create half-filled effect with opacity mask
                  opacity: 0.5,
                }
              : undefined
          }
        />
      </Pressable>
    );
  };

  const ratingLabel = labels[Math.ceil(displayRating) - 1] || '';

  return (
    <View
      style={styles.container}
      accessibilityRole="adjustable"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{
        now: value,
        min: 0,
        max: starCount,
        text: `${value} out of ${starCount} stars`,
      }}
    >
      <View style={styles.starsContainer}>{Array.from({ length: starCount }, (_, i) => renderStar(i))}</View>

      {showLabel && displayRating > 0 && <ThemedText style={[styles.label, { color: textColor }]}>{ratingLabel}</ThemedText>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
  },
  starsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  starButton: {
    padding: 6,
    minHeight: 44,
    minWidth: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
});
