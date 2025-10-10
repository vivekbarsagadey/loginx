import { ThemedButton } from '@/components/themed-button';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Image, type ImageSourcePropType, StyleSheet, View } from 'react-native';

export type EmptyStateTemplate = 'no-data' | 'error' | 'search' | 'custom';

export interface EmptyStateProps {
  /** Template type for predefined states */
  template?: EmptyStateTemplate;
  /** Custom illustration/image */
  illustration?: ImageSourcePropType;
  /** Illustration as React component */
  illustrationComponent?: React.ReactNode;
  /** Main title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button label */
  actionLabel?: string;
  /** Called when action button is pressed */
  onAction?: () => void;
  /** Secondary action button label */
  secondaryActionLabel?: string;
  /** Called when secondary action button is pressed */
  onSecondaryAction?: () => void;
  /** Accessibility label */
  accessibilityLabel?: string;
}

export function EmptyState({
  template = 'custom',
  illustration,
  illustrationComponent,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  accessibilityLabel,
}: EmptyStateProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'text-muted');

  // Template-based defaults
  const getTemplateDefaults = () => {
    switch (template) {
      case 'no-data':
        return {
          defaultTitle: 'No Data Available',
          defaultDescription: 'There is nothing to display at the moment.',
          emoji: '📭',
        };
      case 'error':
        return {
          defaultTitle: 'Something Went Wrong',
          defaultDescription: 'We encountered an error. Please try again.',
          emoji: '⚠️',
        };
      case 'search':
        return {
          defaultTitle: 'No Results Found',
          defaultDescription: 'Try adjusting your search or filters.',
          emoji: '🔍',
        };
      default:
        return {
          defaultTitle: '',
          defaultDescription: '',
          emoji: '📄',
        };
    }
  };

  const { defaultTitle, defaultDescription, emoji } = getTemplateDefaults();
  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;

  return (
    <View style={styles.container} accessible={true} accessibilityLabel={accessibilityLabel || displayTitle}>
      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        {illustrationComponent ? (
          illustrationComponent
        ) : illustration ? (
          <Image source={illustration} style={styles.illustration} resizeMode="contain" />
        ) : (
          <ThemedText style={styles.emoji}>{emoji}</ThemedText>
        )}
      </View>

      {/* Title */}
      <ThemedText type="h3" style={[styles.title, { color: textColor }]}>
        {displayTitle}
      </ThemedText>

      {/* Description */}
      {displayDescription && (
        <ThemedText type="body" style={[styles.description, { color: secondaryTextColor }]}>
          {displayDescription}
        </ThemedText>
      )}

      {/* Actions */}
      {(actionLabel || secondaryActionLabel) && (
        <View style={styles.actions}>
          {actionLabel && onAction && <ThemedButton title={actionLabel} onPress={onAction} variant="primary" accessibilityLabel={actionLabel} />}
          {secondaryActionLabel && onSecondaryAction && <ThemedButton title={secondaryActionLabel} onPress={onSecondaryAction} variant="secondary" accessibilityLabel={secondaryActionLabel} />}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xl,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  description: {
    marginTop: Spacing.md,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: Spacing.sm,
  },
  emoji: {
    fontSize: 72,
  },
  illustration: {
    height: 200,
    width: 200,
  },
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
});
