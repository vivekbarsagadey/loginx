import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { ValidationConstants } from '@/constants/validation';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

interface PasswordStrengthIndicatorProps {
  password: string;
  /** Whether to show the indicator (only show when user is typing) */
  visible?: boolean;
}

type StrengthLevel = 'weak' | 'fair' | 'good' | 'strong';

interface StrengthResult {
  level: StrengthLevel;
  label: string;
  color: string;
  widthPercentage: number;
}

/**
 * Password Strength Indicator
 * Visual meter showing real-time password strength with color coding
 */
export function PasswordStrengthIndicator({ password, visible = true }: PasswordStrengthIndicatorProps) {
  const errorColor = useThemeColor({}, 'error');
  const warningColor = useThemeColor({}, 'warning');
  const successColor = useThemeColor({}, 'success');
  const primaryColor = useThemeColor({}, 'primary');
  const textColor = useThemeColor({}, 'text');

  const strength = useMemo((): StrengthResult => {
    if (!password) {
      return { level: 'weak', label: '', color: textColor, widthPercentage: 0 };
    }

    let score = 0;

    // Length check
    if (password.length >= ValidationConstants.PASSWORD_MIN_LENGTH) {
      score++;
    }
    if (password.length >= 12) {
      score++;
    }

    // Character type checks
    if (/[A-Z]/.test(password)) {
      score++;
    }
    if (/[a-z]/.test(password)) {
      score++;
    }
    if (/[0-9]/.test(password)) {
      score++;
    }
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score++;
    }

    // Determine strength level
    if (score <= 2) {
      return { level: 'weak', label: 'Weak', color: errorColor, widthPercentage: 25 };
    }
    if (score <= 4) {
      return { level: 'fair', label: 'Fair', color: warningColor, widthPercentage: 50 };
    }
    if (score <= 5) {
      return { level: 'good', label: 'Good', color: primaryColor, widthPercentage: 75 };
    }
    return { level: 'strong', label: 'Strong', color: successColor, widthPercentage: 100 };
  }, [password, errorColor, warningColor, successColor, primaryColor, textColor]);

  if (!visible || !password) {
    return null;
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.meterContainer}>
        <View style={styles.meterBackground}>
          <View style={[styles.meterFill, { width: `${strength.widthPercentage}%`, backgroundColor: strength.color }]} />
        </View>
      </View>
      <ThemedText style={[styles.label, { color: strength.color }]}>Password Strength: {strength.label}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  meterContainer: {
    marginBottom: Spacing.xs,
  },
  meterBackground: {
    height: 8,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterFill: {
    height: '100%',
    borderRadius: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
