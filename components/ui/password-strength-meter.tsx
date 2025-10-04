import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export type PasswordStrength = 'none' | 'weak' | 'medium' | 'strong' | 'very-strong';

interface PasswordStrengthMeterProps {
  password: string;
  onStrengthChange?: (strength: PasswordStrength) => void;
}

/**
 * Calculate password strength based on various criteria
 * @param password - Password to evaluate
 * @returns Strength level: none, weak, medium, strong, very-strong
 */
export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return 'none';
  }

  let score = 0;

  // Length scoring
  if (password.length >= 8) {
    score += 1;
  }
  if (password.length >= 12) {
    score += 1;
  }
  if (password.length >= 16) {
    score += 1;
  }

  // Character variety scoring
  if (/[a-z]/.test(password)) {
    score += 1;
  } // lowercase
  if (/[A-Z]/.test(password)) {
    score += 1;
  } // uppercase
  if (/\d/.test(password)) {
    score += 1;
  } // numbers
  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } // special chars
  if (/[^A-Za-z\d@$!%*?&]/.test(password)) {
    score += 1;
  } // additional special chars

  // Penalize common patterns
  if (/(.)\1{2,}/.test(password)) {
    score -= 1;
  } // repeated characters
  if (/^[0-9]+$/.test(password)) {
    score -= 2;
  } // only numbers
  if (/^[a-zA-Z]+$/.test(password)) {
    score -= 1;
  } // only letters
  if (/^(12345|password|qwerty|abc123|111111)/i.test(password)) {
    score -= 3;
  } // common passwords

  // Map score to strength level
  if (score <= 2) {
    return 'weak';
  }
  if (score <= 4) {
    return 'medium';
  }
  if (score <= 6) {
    return 'strong';
  }
  return 'very-strong';
}

/**
 * Get color for password strength
 * Made as worklet for React Native Reanimated compatibility
 */
function getStrengthColor(strength: PasswordStrength, colors: { error: string; warning: string; success: string }): string {
  'worklet';
  switch (strength) {
    case 'weak':
      return colors.error;
    case 'medium':
      return colors.warning;
    case 'strong':
    case 'very-strong':
      return colors.success;
    default:
      return 'transparent';
  }
}

/**
 * Get width percentage for strength meter
 * Made as worklet for potential React Native Reanimated compatibility
 */
function getStrengthWidth(strength: PasswordStrength): number {
  'worklet';
  switch (strength) {
    case 'weak':
      return 25;
    case 'medium':
      return 50;
    case 'strong':
      return 75;
    case 'very-strong':
      return 100;
    default:
      return 0;
  }
}

/**
 * Get label for password strength
 * Made as worklet for potential React Native Reanimated compatibility
 */
function getStrengthLabel(strength: PasswordStrength): string {
  'worklet';
  switch (strength) {
    case 'weak':
      return 'Weak';
    case 'medium':
      return 'Medium';
    case 'strong':
      return 'Strong';
    case 'very-strong':
      return 'Very Strong';
    default:
      return '';
  }
}

/**
 * Password Strength Meter Component
 * Shows visual feedback for password strength with color-coded meter
 */
export function PasswordStrengthMeter({ password, onStrengthChange }: PasswordStrengthMeterProps) {
  const [strength, setStrength] = useState<PasswordStrength>('none');
  const width = useSharedValue(0);
  const strengthValue = useSharedValue<PasswordStrength>('none');

  const errorColor = useThemeColor({}, 'error');
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');
  const borderColor = useThemeColor({}, 'border');

  const errorColorShared = useSharedValue(errorColor);
  const warningColorShared = useSharedValue(warningColor);
  const successColorShared = useSharedValue(successColor);

  // Update shared values when theme colors change
  useEffect(() => {
    errorColorShared.value = errorColor;
    warningColorShared.value = warningColor;
    successColorShared.value = successColor;
  }, [errorColor, warningColor, successColor, errorColorShared, warningColorShared, successColorShared]);

  const colors = {
    error: errorColor,
    warning: warningColor,
    success: successColor,
  };

  useEffect(() => {
    const newStrength = calculatePasswordStrength(password);
    setStrength(newStrength);
    strengthValue.value = newStrength;
    width.value = withSpring(getStrengthWidth(newStrength), {
      damping: 15,
      stiffness: 150,
    });
    onStrengthChange?.(newStrength);
  }, [password, onStrengthChange, width, strengthValue]);

  const animatedStyle = useAnimatedStyle(() => {
    const colors = {
      error: errorColorShared.value,
      warning: warningColorShared.value,
      success: successColorShared.value,
    };
    return {
      width: `${width.value}%`,
      backgroundColor: getStrengthColor(strengthValue.value, colors),
    };
  });

  // Don't show meter if no password entered
  if (strength === 'none') {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.meterContainer}>
        <View style={[styles.meterTrack, { backgroundColor: borderColor }]}>
          <Animated.View style={[styles.meterFill, animatedStyle]} />
        </View>
      </View>
      <ThemedText type="caption" style={[styles.label, { color: getStrengthColor(strength, colors) }]}>
        Password strength: {getStrengthLabel(strength)}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 6,
  },
  meterContainer: {
    marginTop: 4,
  },
  meterTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 3,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
  },
});
