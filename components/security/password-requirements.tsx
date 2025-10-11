import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { FontWeight, Spacing } from '@/constants/layout';
import { ValidationConstants } from '@/constants/validation';
import { useThemeColor } from '@/hooks/use-theme-color';
import i18n from '@/i18n';
import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

interface PasswordRequirementsProps {
  /** Current password value to check against requirements */
  password?: string;
  /** Whether to show visual indicators for met requirements */
  showIndicators?: boolean;
}

interface Requirement {
  label: string;
  met: boolean;
}

/**
 * Password Requirements Component
 * Displays checklist of password requirements with optional visual indicators
 */
export function PasswordRequirements({ password = '', showIndicators = false }: PasswordRequirementsProps) {
  const successColor = useThemeColor({}, 'success');
  const textColor = useThemeColor({}, 'text');

  const requirements = i18n.t('screens.security.changePassword.requirements', { returnObjects: true }) as Record<string, string>;

  const checks = useMemo((): Requirement[] => {
    return [
      {
        label: requirements.minLength,
        met: password.length >= ValidationConstants.PASSWORD_MIN_LENGTH,
      },
      {
        label: requirements.uppercase,
        met: /[A-Z]/.test(password),
      },
      {
        label: requirements.lowercase,
        met: /[a-z]/.test(password),
      },
      {
        label: requirements.numbers,
        met: /[0-9]/.test(password),
      },
      {
        label: requirements.symbols,
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ];
  }, [password, requirements]);

  const getIndicator = (met: boolean) => {
    if (!showIndicators || !password) {
      return '•';
    }
    return met ? '✓' : '○';
  };

  const getColor = (met: boolean) => {
    if (!showIndicators || !password) {
      return textColor;
    }
    return met ? successColor : textColor;
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="h3" style={styles.title}>
        {requirements.title}
      </ThemedText>
      {checks.map((req, index) => (
        <ThemedText key={index} style={[styles.requirement, { color: getColor(req.met), opacity: showIndicators && !req.met ? 0.6 : 0.8 }]}>
          {getIndicator(req.met)} {req.label}
        </ThemedText>
      ))}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.lg,
    padding: Spacing.md,
    borderRadius: Spacing.sm,
  },
  title: {
    marginBottom: Spacing.md,
    fontWeight: FontWeight.bold,
  },
  requirement: {
    marginBottom: Spacing.xs,
    fontSize: 14,
  },
});
