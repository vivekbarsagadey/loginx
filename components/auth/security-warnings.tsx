import { ThemedText } from '@/components/themed-text';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { StyleSheet, View } from 'react-native';

interface SecurityWarningsProps {
  remainingAttempts: number;
  isAccountLocked: boolean;
  timeUntilUnlock: number;
}

export function SecurityWarnings({ remainingAttempts, isAccountLocked, timeUntilUnlock }: SecurityWarningsProps) {
  const warningColor = useThemeColor({}, 'warning');
  const errorColor = useThemeColor({}, 'error');

  // Don't show anything if account is not locked and has plenty of attempts
  if (!isAccountLocked && remainingAttempts >= 5) {
    return null;
  }

  return (
    <>
      {/* Warning for low remaining attempts */}
      {remainingAttempts < 5 && remainingAttempts > 0 && !isAccountLocked && (
        <View
          style={[
            styles.warningContainer,
            {
              backgroundColor: `${warningColor}1A`,
              borderColor: `${warningColor}4D`,
            },
          ]}
        >
          <ThemedText style={[styles.warningText, { color: warningColor }]}>⚠️ {remainingAttempts} login attempts remaining</ThemedText>
        </View>
      )}

      {/* Account locked warning */}
      {isAccountLocked && (
        <View
          style={[
            styles.lockoutContainer,
            {
              backgroundColor: `${errorColor}1A`,
              borderColor: `${errorColor}4D`,
            },
          ]}
        >
          <ThemedText style={[styles.lockoutText, { color: errorColor }]}>🔒 Account temporarily locked. Try again in {timeUntilUnlock} minutes.</ThemedText>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  warningContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  warningText: {
    textAlign: 'center',
    fontSize: Typography.caption.fontSize,
  },
  lockoutContainer: {
    marginTop: Spacing.md,
    padding: Spacing.md,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
  },
  lockoutText: {
    textAlign: 'center',
    fontSize: Typography.caption.fontSize,
  },
});
