/**
 * ThemedStack Component
 * Layout component for stacking children with consistent spacing
 *
 * Features:
 * - Row or column direction
 * - Consistent spacing from design system
 * - Alignment and justification options
 * - Wrap support
 * - Theme-aware
 *
 * @example
 * ```tsx
 * <ThemedStack direction="row" spacing="md" align="center">
 *   <Icon name="check" />
 *   <ThemedText>Completed</ThemedText>
 * </ThemedStack>
 *
 * <ThemedStack direction="column" spacing="lg" justify="space-between">
 *   <Card />
 *   <Card />
 *   <Card />
 * </ThemedStack>
 * ```
 */

import { Spacing } from '@/constants/layout';
import { memo } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';

export interface ThemedStackProps extends ViewProps {
  /**
   * Direction of the stack
   * @default 'column'
   */
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';

  /**
   * Spacing between children
   * Uses spacing constants from design system
   * @default 'md'
   */
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';

  /**
   * Alignment of children along cross axis
   * @default 'stretch'
   */
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';

  /**
   * Justification of children along main axis
   * @default 'flex-start'
   */
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';

  /**
   * Whether to wrap children
   * @default false
   */
  wrap?: boolean;

  /**
   * Children to render
   */
  children: React.ReactNode;
}

function ThemedStackComponent({ direction = 'column', spacing = 'md', align = 'stretch', justify = 'flex-start', wrap = false, style, children, ...rest }: ThemedStackProps) {
  const spacingMap = {
    none: 0,
    xs: Spacing.xs,
    sm: Spacing.sm,
    md: Spacing.md,
    lg: Spacing.lg,
    xl: Spacing.xl,
    xxl: Spacing.xxl,
  };

  const containerStyle: ViewStyle = {
    flexDirection: direction,
    alignItems: align,
    justifyContent: justify,
    gap: spacingMap[spacing],
    flexWrap: wrap ? 'wrap' : 'nowrap',
  };

  return (
    <View style={[containerStyle, style]} {...rest}>
      {children}
    </View>
  );
}

export const ThemedStack = memo(ThemedStackComponent);

/**
 * Horizontal Stack - Row direction
 */
export const HStack = memo((props: Omit<ThemedStackProps, 'direction'>) => <ThemedStack direction="row" {...props} />);
HStack.displayName = 'HStack';

/**
 * Vertical Stack - Column direction
 */
export const VStack = memo((props: Omit<ThemedStackProps, 'direction'>) => <ThemedStack direction="column" {...props} />);
VStack.displayName = 'VStack';
