import { ThemedInfoBox } from '@/components/themed-info-box';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';

interface SecurityWarningsProps {
  remainingAttempts: number;
  isAccountLocked: boolean;
  timeUntilUnlock: number;
}

export function SecurityWarnings({ remainingAttempts, isAccountLocked, timeUntilUnlock }: SecurityWarningsProps) {
  // Don't show anything if account is not locked and has plenty of attempts
  if (!isAccountLocked && remainingAttempts >= 5) {
    return null;
  }

  return (
    <>
      {/* Warning for low remaining attempts */}
      {remainingAttempts < 5 && remainingAttempts > 0 && !isAccountLocked && (
        <ThemedInfoBox variant="warning" style={{ marginTop: Spacing.md }}>
          <ThemedText>⚠️ {remainingAttempts} login attempts remaining</ThemedText>
        </ThemedInfoBox>
      )}

      {/* Account locked warning */}
      {isAccountLocked && (
        <ThemedInfoBox variant="error" style={{ marginTop: Spacing.md }}>
          <ThemedText>🔒 Account temporarily locked. Try again in {timeUntilUnlock} minutes.</ThemedText>
        </ThemedInfoBox>
      )}
    </>
  );
}
