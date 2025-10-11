import { ThemedButton } from '@/components/themed-button';
import { ThemedScrollView } from '@/components/themed-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface FormScreenProps {
  /**
   * Form title
   */
  title?: string;
  /**
   * Form description/instructions
   */
  description?: string;
  /**
   * Form content (input fields, sections, etc.)
   */
  children: ReactNode;
  /**
   * Primary action button label
   */
  primaryActionLabel: string;
  /**
   * Primary action button handler
   */
  onPrimaryAction: () => void;
  /**
   * Whether primary action is disabled
   * @default false
   */
  primaryActionDisabled?: boolean;
  /**
   * Whether primary action is loading
   * @default false
   */
  primaryActionLoading?: boolean;
  /**
   * Optional secondary action button label
   */
  secondaryActionLabel?: string;
  /**
   * Optional secondary action button handler
   */
  onSecondaryAction?: () => void;
  /**
   * Whether secondary action is disabled
   * @default false
   */
  secondaryActionDisabled?: boolean;
  /**
   * Background color variant
   * @default 'bg'
   */
  backgroundVariant?: 'bg' | 'bg-elevated' | 'surface';
  /**
   * Optional footer content (terms, links, etc.)
   */
  footer?: ReactNode;
}

/**
 * FormScreen template provides consistent layout for form-based screens.
 * Handles keyboard avoidance, scrolling, and action buttons.
 *
 * @example
 * <FormScreen
 *   title="Create Account"
 *   description="Fill in your details to get started"
 *   primaryActionLabel="Sign Up"
 *   onPrimaryAction={handleSignUp}
 *   primaryActionDisabled={!isValid}
 *   secondaryActionLabel="Cancel"
 *   onSecondaryAction={handleCancel}
 * >
 *   <ThemedInput label="Email" value={email} onChangeText={setEmail} />
 *   <ThemedInput label="Password" value={password} onChangeText={setPassword} />
 * </FormScreen>
 */
export function FormScreen({
  title,
  description,
  children,
  primaryActionLabel,
  onPrimaryAction,
  primaryActionDisabled = false,
  primaryActionLoading = false,
  secondaryActionLabel,
  onSecondaryAction,
  secondaryActionDisabled = false,
  backgroundVariant = 'bg',
  footer,
}: FormScreenProps) {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, backgroundVariant);
  const textMutedColor = useThemeColor({}, 'text-muted');

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView} keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
        <ThemedScrollView
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + Spacing.md,
              paddingBottom: insets.bottom + Spacing.md,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          {(title || description) && (
            <View style={styles.header}>
              {title && (
                <ThemedText type="display" style={styles.title}>
                  {title}
                </ThemedText>
              )}
              {description && (
                <ThemedText type="body" style={[styles.description, { color: textMutedColor }]}>
                  {description}
                </ThemedText>
              )}
            </View>
          )}

          {/* Form Content */}
          <View style={styles.formContent}>{children}</View>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <ThemedButton
              title={primaryActionLabel}
              onPress={onPrimaryAction}
              disabled={primaryActionDisabled}
              loading={primaryActionLoading}
              variant="primary"
              size="large"
              accessibilityLabel={primaryActionLabel}
            />
            {secondaryActionLabel && onSecondaryAction && (
              <ThemedButton title={secondaryActionLabel} onPress={onSecondaryAction} disabled={secondaryActionDisabled} variant="secondary" size="large" accessibilityLabel={secondaryActionLabel} />
            )}
          </View>

          {/* Footer Content */}
          {footer && <View style={styles.footer}>{footer}</View>}
        </ThemedScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  title: {
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 22,
  },
  formContent: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  actions: {
    gap: Spacing.md,
  },
  footer: {
    marginTop: Spacing.xl,
    alignItems: 'center',
  },
});
