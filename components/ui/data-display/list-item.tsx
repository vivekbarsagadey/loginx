import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

export interface ListItemProps {
  /** Primary text content */
  title: string;
  /** Secondary text (subtitle) */
  subtitle?: string;
  /** Tertiary text (caption) */
  caption?: string;
  /** Leading content (icon, avatar, etc.) */
  leading?: React.ReactNode;
  /** Trailing content (icon, switch, etc.) */
  trailing?: React.ReactNode;
  /** Called when item is pressed */
  onPress?: () => void;
  /** Show divider below item */
  showDivider?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Accessibility label */
  accessibilityLabel?: string;
  /** Accessibility hint */
  accessibilityHint?: string;
}

export function ListItem({ title, subtitle, caption, leading, trailing, onPress, showDivider = false, disabled = false, accessibilityLabel, accessibilityHint }: ListItemProps) {
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const surfaceColor = useThemeColor({}, 'surface');

  const hasMultipleLines = Boolean(subtitle || caption);

  return (
    <View>
      <Pressable
        style={({ pressed }) => [styles.container, { backgroundColor: surfaceColor }, pressed && !disabled && styles.pressed, disabled && styles.disabled]}
        onPress={onPress}
        disabled={disabled || !onPress}
        accessible={true}
        accessibilityRole={onPress ? 'button' : 'text'}
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled }}
      >
        {/* Leading content */}
        {leading && <View style={styles.leading}>{leading}</View>}

        {/* Content area */}
        <View style={[styles.content, hasMultipleLines && styles.contentMultiLine]}>
          <ThemedText type="body" style={[styles.title, { color: textColor }]} numberOfLines={1}>
            {title}
          </ThemedText>

          {subtitle && (
            <ThemedText type="caption" style={[styles.subtitle, { color: secondaryTextColor }]} numberOfLines={1}>
              {subtitle}
            </ThemedText>
          )}

          {caption && (
            <ThemedText type="caption" style={[styles.caption, { color: secondaryTextColor }]} numberOfLines={1}>
              {caption}
            </ThemedText>
          )}
        </View>

        {/* Trailing content */}
        {trailing && <View style={styles.trailing}>{trailing}</View>}
      </Pressable>

      {/* Divider */}
      {showDivider && <View style={[styles.divider, { backgroundColor: borderColor }]} />}
    </View>
  );
}

const styles = StyleSheet.create({
  caption: {
    marginTop: 2,
    opacity: 0.7,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    minHeight: 56,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  contentMultiLine: {
    paddingVertical: Spacing.xs,
  },
  disabled: {
    opacity: 0.4,
  },
  divider: {
    height: 1,
    marginLeft: Spacing.md,
  },
  leading: {
    marginRight: Spacing.md,
  },
  pressed: {
    opacity: 0.7,
  },
  subtitle: {
    marginTop: 2,
  },
  title: {
    fontWeight: '500',
  },
  trailing: {
    marginLeft: Spacing.md,
  },
});
