import { ThemedInfoBox } from '@/components/themed-info-box';
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
        <ThemedInfoBox variant="warning" message={`⚠️ ${remainingAttempts} login attempts remaining`} style={{ marginTop: Spacing.md }} />
      )}

      {/* Account locked warning */}
      {isAccountLocked && <ThemedInfoBox variant="error" message={`🔒 Account temporarily locked. Try again in ${timeUntilUnlock} minutes.`} style={{ marginTop: Spacing.md }} />}
    </>
  );
}
