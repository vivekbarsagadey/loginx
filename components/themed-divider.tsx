/**
 * ThemedDivider Component
 * Separator component with optional text/icon label
 *
 * Features:
 * - Horizontal or vertical orientation
 * - Optional text or icon in the middle
 * - Spacing variants
 * - Theme-aware colors
 * - Customizable thickness
 *
 * @example
 * ```tsx
 * <ThemedDivider />
 * <ThemedDivider text="OR" />
 * <ThemedDivider icon="more-horizontal" />
 * <ThemedDivider spacing="lg" thickness={2} />
 * <ThemedDivider orientation="vertical" />
 * ```
 */

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import { memo } from 'react';
import { StyleSheet, View, type ViewProps } from 'react-native';

export interface ThemedDividerProps extends ViewProps {
  /**
   * Text to display in the middle of the divider
   */
  text?: string;

  /**
   * Icon to display in the middle of the divider
   * Uses Feather icon names
   */
  icon?: string;

  /**
   * Orientation of the divider
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';

  /**
   * Spacing around the divider
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg';

  /**
   * Thickness of the divider line
   * @default 1
   */
  thickness?: number;

  /**
   * Custom color for the divider
   * If not provided, uses theme border color
   */
  color?: string;
}

function ThemedDividerComponent({ text, icon, orientation = 'horizontal', spacing = 'md', thickness = 1, color, style, ...rest }: ThemedDividerProps) {
  const colors = useThemeColors();
  const dividerColor = color || colors.border;

  const spacingMap = {
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
  };

  const containerMargin = spacingMap[spacing];

  // Vertical divider
  if (orientation === 'vertical') {
    return (
      <View
        style={[
          styles.verticalContainer,
          {
            marginHorizontal: containerMargin,
            width: thickness,
            backgroundColor: dividerColor,
          },
          style,
        ]}
        accessible={false}
        {...rest}
      />
    );
  }

  // Horizontal divider without text/icon
  if (!text && !icon) {
    return (
      <View
        style={[
          styles.horizontalContainer,
          {
            marginVertical: containerMargin,
            height: thickness,
            backgroundColor: dividerColor,
          },
          style,
        ]}
        accessible={false}
        {...rest}
      />
    );
  }

  // Horizontal divider with text/icon
  return (
    <View style={[styles.horizontalWithContent, { marginVertical: containerMargin }, style]} accessible={false} {...rest}>
      <View style={[styles.line, { height: thickness, backgroundColor: dividerColor }]} />
      <View style={styles.labelContainer}>
        {icon && <Feather name={icon as keyof typeof Feather.glyphMap} size={16} color={colors['text-muted']} />}
        {text && (
          <ThemedText type="caption" style={[styles.labelText, { color: colors['text-muted'] }]}>
            {text}
          </ThemedText>
        )}
      </View>
      <View style={[styles.line, { height: thickness, backgroundColor: dividerColor }]} />
    </View>
  );
}

export const ThemedDivider = memo(ThemedDividerComponent);

const styles = StyleSheet.create({
  horizontalContainer: {
    width: '100%',
  },
  verticalContainer: {
    alignSelf: 'stretch',
  },
  horizontalWithContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  line: {
    flex: 1,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  labelText: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
});
