import { ThemedText } from '@/components/themed-text';
import { Spacing, Typography } from '@/constants/layout';
import { StyleSheet } from 'react-native';

interface CharacterCounterProps {
  /** Current text length */
  count: number;
  /** Maximum allowed characters */
  maxLength: number;
  /** Custom style */
  style?: object;
}

/**
 * Reusable CharacterCounter component
 * Displays current character count vs maximum
 * Used across form inputs in feedback, rating, and issue reporting screens
 */
export function CharacterCounter({ count, maxLength, style }: CharacterCounterProps) {
  return (
    <ThemedText style={[styles.charCount, style]} accessibilityLabel={`${count} of ${maxLength} characters used`}>
      {count}/{maxLength}
    </ThemedText>
  );
}

const styles = StyleSheet.create({
  charCount: {
    fontSize: Typography.caption.fontSize,
    textAlign: 'right',
    marginTop: Spacing.xs,
    opacity: 0.6,
  },
});
