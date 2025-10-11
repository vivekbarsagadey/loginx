import { ThemedDivider } from '@/components/themed-divider';
import { Spacing } from '@/constants/layout';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { SectionHeader } from '../molecules/section-header';

interface ProfileFormSectionProps {
  /**
   * Section title
   */
  title?: string;
  /**
   * Section subtitle
   */
  subtitle?: string;
  /**
   * Children components (form fields)
   */
  children: React.ReactNode;
  /**
   * Optional style overrides
   */
  style?: ViewStyle;
  /**
   * Whether to show a divider after this section
   * @default false
   */
  showDivider?: boolean;
}

/**
 * ProfileFormSection component for grouping related form fields with an optional header.
 * Provides consistent spacing and layout for profile editing forms.
 *
 * @example
 * <ProfileFormSection title="Personal Information">
 *   <ThemedInput label="First Name" value={firstName} onChangeText={setFirstName} />
 *   <ThemedInput label="Last Name" value={lastName} onChangeText={setLastName} />
 * </ProfileFormSection>
 */
export function ProfileFormSection({ title, subtitle, children, style, showDivider = false }: ProfileFormSectionProps) {
  return (
    <View style={[styles.container, style]}>
      {(title || subtitle) && <SectionHeader title={title || ''} subtitle={subtitle} />}
      <View style={styles.content}>{children}</View>
      {showDivider && <ThemedDivider spacing="lg" />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  content: {
    gap: Spacing.md,
  },
});
