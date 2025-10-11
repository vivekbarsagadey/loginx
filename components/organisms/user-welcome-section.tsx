import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import i18n from '@/i18n';
import { StyleSheet, View, type ViewStyle } from 'react-native';

interface UserWelcomeSectionProps {
  /**
   * User's display name
   */
  displayName: string;
  /**
   * User's email address
   */
  email: string;
  /**
   * User's age (optional)
   */
  age?: number;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
}

/**
 * UserWelcomeSection component for displaying a personalized welcome message.
 * Shows the user's name, email, and optionally their age.
 *
 * @example
 * <UserWelcomeSection
 *   displayName="John Doe"
 *   email="john@example.com"
 *   age={25}
 * />
 */
export function UserWelcomeSection({ displayName, email, age, style }: UserWelcomeSectionProps) {
  return (
    <View style={[styles.container, style]}>
      <ThemedText type="h1">
        {i18n.t('screens.home.welcome', {
          name: displayName,
        })}
      </ThemedText>
      <ThemedText type="body" style={styles.email}>
        {email}
      </ThemedText>
      {age && age > 0 && (
        <ThemedText type="body" style={styles.age}>
          {i18n.t('screens.home.age', { age })}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  email: {
    marginTop: Spacing.sm,
    opacity: 0.8,
  },
  age: {
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
});
