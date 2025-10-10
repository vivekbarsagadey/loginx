/**
 * Card component with elevation-based layered surfaces
 * Provides visual hierarchy through subtle background changes and shadows
 */

import { BorderRadius, type Shadow, Spacing } from '@/constants/layout';
import { getShadow } from '@/constants/style-utils';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { PropsWithChildren, ReactNode } from 'react';
import type { ViewProps, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

export type CardElevation = 0 | 1 | 2 | 3 | 4 | 5;

export type CardProps = PropsWithChildren<ViewProps> & {
  /**
   * Elevation level (0-5)
   * - 0: No elevation, flush with background
   * - 1: Subtle elevation (default cards)
   * - 2: Medium elevation (active/focused cards)
   * - 3: High elevation (modals, dialogs)
   * - 4: Very high elevation (tooltips)
   * - 5: Maximum elevation (popover menus)
   * @default 1
   */
  elevation?: CardElevation;

  /**
   * Surface variant to use for the card background
   * - 'surface': Standard card surface
   * - 'surface-variant': Alternative surface (nested content)
   * @default 'surface'
   */
  variant?: 'surface' | 'surface-variant';

  /**
   * Disable default padding
   * @default false
   */
  noPadding?: boolean;

  /**
   * Custom padding override
   */
  padding?: number;

  /**
   * Border radius override
   */
  borderRadius?: number;

  /**
   * Disable shadow (useful when you want elevation background without shadow)
   * @default false
   */
  noShadow?: boolean;

  /**
   * Header component (rendered at top with separator)
   */
  header?: ReactNode;

  /**
   * Footer component (rendered at bottom with separator)
   */
  footer?: ReactNode;

  /**
   * Show border
   * @default false
   */
  bordered?: boolean;

  /**
   * Custom border color
   */
  borderColor?: string;
};

const ELEVATION_SHADOW_MAP: Record<CardElevation, keyof typeof Shadow> = {
  0: 'none',
  1: 'sm',
  2: 'md',
  3: 'lg',
  4: 'xl',
  5: 'xl',
};

/**
 * Card component that implements layered surface design
 * Higher elevation = slightly brighter background in dark mode, with shadows
 */
export function Card({
  children,
  elevation = 1,
  variant = 'surface',
  noPadding = false,
  padding,
  borderRadius,
  noShadow = false,
  header,
  footer,
  bordered = false,
  borderColor: customBorderColor,
  style,
  ...rest
}: CardProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, variant);
  const borderColor = useThemeColor({}, 'border');

  // Get shadow based on elevation
  const shadowStyle = !noShadow && elevation > 0 ? getShadow(ELEVATION_SHADOW_MAP[elevation], colorScheme) : {};

  const cardPadding = noPadding ? 0 : (padding ?? Spacing.md);

  const cardStyle: ViewStyle = {
    backgroundColor,
    borderRadius: borderRadius ?? BorderRadius.md,
    padding: header || footer ? 0 : cardPadding,
    ...shadowStyle,
    ...(bordered && {
      borderWidth: 1,
      borderColor: customBorderColor ?? borderColor,
    }),
  };

  const contentStyle: ViewStyle = {
    padding: header || footer ? cardPadding : 0,
  };

  // If no header/footer, render simple card
  if (!header && !footer) {
    return (
      <View style={[styles.card, cardStyle, style]} {...rest}>
        {children}
      </View>
    );
  }

  // Render card with header/footer sections
  return (
    <View style={[styles.card, cardStyle, style]} {...rest}>
      {header && (
        <>
          <View style={[styles.header, { padding: cardPadding }]}>{header}</View>
          <View style={[styles.separator, { backgroundColor: borderColor }]} />
        </>
      )}

      <View style={contentStyle}>{children}</View>

      {footer && (
        <>
          <View style={[styles.separator, { backgroundColor: borderColor }]} />
          <View style={[styles.footer, { padding: cardPadding }]}>{footer}</View>
        </>
      )}
    </View>
  );
}

/**
 * Specialized card variants for common use cases
 */

/**
 * Elevated card - standard card with shadow
 */
export function ElevatedCard(props: Omit<CardProps, 'elevation'>) {
  return <Card elevation={1} {...props} />;
}

/**
 * Outlined card - no shadow, with border
 */
export function OutlinedCard(props: Omit<CardProps, 'elevation' | 'bordered' | 'noShadow'>) {
  return <Card elevation={0} bordered noShadow {...props} />;
}

/**
 * Filled card - no shadow, uses surface-variant background
 */
export function FilledCard(props: Omit<CardProps, 'variant' | 'elevation' | 'noShadow'>) {
  return <Card variant="surface-variant" elevation={0} noShadow {...props} />;
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  header: {
    // padding applied dynamically
  },
  footer: {
    // padding applied dynamically
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    opacity: 0.8,
  },
});
