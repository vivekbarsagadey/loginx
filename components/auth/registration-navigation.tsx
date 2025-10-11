import { ThemedButton } from '@/components/themed-button';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { Platform, StyleSheet } from 'react-native';

interface RegistrationNavigationProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting: boolean;
  onNext: () => void;
  onPrevious: () => void;
}

export function RegistrationNavigation({ isFirstStep, isLastStep, isSubmitting, onNext, onPrevious }: RegistrationNavigationProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedButton
        title={isFirstStep ? 'Cancel' : 'Previous'}
        onPress={onPrevious}
        style={styles.button}
        variant="secondary"
        disabled={isSubmitting}
        accessibilityLabel={isFirstStep ? 'Cancel registration' : 'Go to previous step'}
        accessibilityHint={isFirstStep ? 'Returns to previous screen' : 'Returns to the previous registration step'}
      />
      <ThemedButton
        title={isLastStep ? 'Create Account' : 'Next'}
        onPress={onNext}
        style={styles.button}
        loading={isSubmitting}
        disabled={isSubmitting}
        accessibilityLabel={isLastStep ? 'Create account' : 'Go to next step'}
        accessibilityHint={isLastStep ? 'Creates your account with the provided information' : 'Proceeds to the next registration step'}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? Spacing.sm : Spacing.md,
    backgroundColor: 'transparent',
  },
  button: {
    flex: 1,
  },
});
