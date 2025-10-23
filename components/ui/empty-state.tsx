import { AccessibilityRoles } from '@/constants/accessibility';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { logEmptyStateCTAClick, logEmptyStateView } from '@/utils/analytics';
import { Ionicons } from '@expo/vector-icons';
import { memo, type ReactNode, useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import { ThemedButton } from '../themed-button';
import { ThemedText } from '../themed-text';
import { ThemedView } from '../themed-view';

export type EmptyStateProps = {
  /**
   * Icon to display (Ionicons name)
   */
  icon?: keyof typeof Ionicons.glyphMap;
  /**
   * Custom illustration component (takes precedence over icon)
   */
  illustration?: ReactNode;
  /**
   * Main title text
   */
  title: string;
  /**
   * Supporting description text
   */
  description?: string;
  /**
   * Call-to-action button text
   */
  actionLabel?: string;
  /**
   * CTA button press handler
   */
  onActionPress?: () => void;
  /**
   * Secondary action button text
   */
  secondaryActionLabel?: string;
  /**
   * Secondary action button press handler
   */
  onSecondaryActionPress?: () => void;
  /**
   * Container style override
   */
  style?: ViewStyle;
  /**
   * Accessibility label for the empty state container
   */
  accessibilityLabel?: string;
  /**
   * Screen name for analytics tracking
   */
  screenName?: string;
  /**
   * Empty state type for analytics (e.g., 'items', 'notifications', 'search')
   */
  emptyStateType?: string;
};

/**
 * EmptyState Component
 *
 * Displays a user-friendly empty state with optional illustration, title, description, and CTA buttons.
 * Used when a screen or section has no content to display.
 *
 * @example
 * ```tsx
 * <EmptyState
 *   icon="cube-outline"
 *   title="No items yet"
 *   description="When you add items, they'll appear here."
 *   actionLabel="Add Your First Item"
 *   onActionPress={handleAddItem}
 * />
 * ```
 *
 * @example With custom illustration
 * ```tsx
 * <EmptyState
 *   illustration={<CustomSVG />}
 *   title="No notifications"
 *   description="We'll notify you when something important happens."
 * />
 * ```
 */
function EmptyStateComponent({
  icon,
  illustration,
  title,
  description,
  actionLabel,
  onActionPress,
  secondaryActionLabel,
  onSecondaryActionPress,
  style,
  accessibilityLabel,
  screenName,
  emptyStateType,
}: EmptyStateProps) {
  const colors = useThemeColors();

  // Track empty state view
  useEffect(() => {
    if (screenName && emptyStateType) {
      logEmptyStateView(screenName, emptyStateType);
    }
  }, [screenName, emptyStateType]);

  // Track primary action click
  const handlePrimaryAction = () => {
    if (screenName && emptyStateType && actionLabel) {
      logEmptyStateCTAClick(screenName, emptyStateType, actionLabel);
    }
    onActionPress?.();
  };

  // Track secondary action click
  const handleSecondaryAction = () => {
    if (screenName && emptyStateType && secondaryActionLabel) {
      logEmptyStateCTAClick(screenName, emptyStateType, secondaryActionLabel);
    }
    onSecondaryActionPress?.();
  };

  return (
    <ThemedView style={[styles.container, style]} accessible={true} accessibilityRole={AccessibilityRoles.TEXT} accessibilityLabel={accessibilityLabel || `${title}. ${description || ''}`}>
      {/* Illustration or Icon */}
      {illustration ? (
        <View style={styles.illustrationContainer}>{illustration}</View>
      ) : icon ? (
        <View style={styles.iconContainer}>
          <Ionicons name={icon} size={80} color={colors['text-muted']} style={styles.icon} />
        </View>
      ) : null}

      {/* Title */}
      <ThemedText type="heading" style={[styles.title, { textAlign: 'center' }]}>
        {title}
      </ThemedText>

      {/* Description */}
      {description && (
        <ThemedText type="body" style={[styles.description, { color: colors['text-muted'], textAlign: 'center' }]}>
          {description}
        </ThemedText>
      )}

      {/* Action Buttons */}
      {(actionLabel || secondaryActionLabel) && (
        <View style={styles.actionsContainer}>
          {actionLabel && onActionPress && (
            <ThemedButton
              title={actionLabel}
              onPress={handlePrimaryAction}
              variant="primary"
              size="comfortable"
              style={styles.primaryButton}
              accessibilityLabel={actionLabel}
              accessibilityHint="Activates the primary action for this empty state"
            />
          )}
          {secondaryActionLabel && onSecondaryActionPress && (
            <ThemedButton
              title={secondaryActionLabel}
              onPress={handleSecondaryAction}
              variant="secondary"
              size="comfortable"
              style={styles.secondaryButton}
              accessibilityLabel={secondaryActionLabel}
              accessibilityHint="Activates the secondary action for this empty state"
            />
          )}
        </View>
      )}
    </ThemedView>
  );
}

export const EmptyState = memo(EmptyStateComponent);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  illustrationContainer: {
    marginBottom: Spacing.xl,
  },
  iconContainer: {
    marginBottom: Spacing.xl,
  },
  icon: {
    opacity: 0.6,
  },
  title: {
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  description: {
    marginBottom: Spacing.xl,
    textAlign: 'center',
    maxWidth: 320,
  },
  actionsContainer: {
    width: '100%',
    maxWidth: 320,
    gap: Spacing.sm,
  },
  primaryButton: {
    width: '100%',
  },
  secondaryButton: {
    width: '100%',
  },
});
