import { ThemedInput } from '@/components/themed-input';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

interface ReferralCodeInputProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
}

/**
 * Referral Code Input Component
 * Optional field for users to enter a referral code during registration
 */
export function ReferralCodeInput({ value, onChange, onBlur, error }: ReferralCodeInputProps) {
  const textColor = useThemeColor({}, 'text');
  const successColor = useThemeColor({}, 'success');
  const [isValid, setIsValid] = useState(false);

  const handleChange = (text: string) => {
    // Convert to uppercase and remove non-alphanumeric characters
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    onChange(cleaned);

    // Validate format: 6-12 alphanumeric characters
    const valid = cleaned.length >= 6 && cleaned.length <= 12;
    setIsValid(valid && !error);
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="caption" style={[styles.label, { color: textColor }]}>
        Referral Code (Optional)
      </ThemedText>

      <ThemedInput
        placeholder="Enter referral code"
        value={value}
        onChangeText={handleChange}
        onBlur={onBlur}
        errorMessage={error}
        autoCapitalize="characters"
        autoCorrect={false}
        maxLength={12}
        returnKeyType="done"
        accessibilityLabel="Referral code input"
        accessibilityHint="Optional: Enter a referral code if you have one"
      />

      {!error && value.length > 0 ? (
        <ThemedView style={styles.hint}>
          {isValid ? (
            <ThemedText style={[styles.hintText, { color: successColor }]}>✓ Valid referral code format</ThemedText>
          ) : (
            <ThemedText style={[styles.hintText, { color: textColor, opacity: 0.7 }]}>Referral code should be 6-12 characters</ThemedText>
          )}
        </ThemedView>
      ) : null}

      {!value ? (
        <ThemedText type="caption" style={[styles.helperText, { color: textColor }]}>
          Have a referral code? Enter it to get special benefits!
        </ThemedText>
      ) : null}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    marginBottom: 8,
    fontWeight: '600',
  },
  hint: {
    marginTop: 4,
  },
  hintText: {
    fontSize: 12,
  },
  helperText: {
    marginTop: 8,
    opacity: 0.6,
    fontSize: 12,
  },
});
