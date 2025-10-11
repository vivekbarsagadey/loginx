/**
 * ThemedSurface Component
 * Generic surface container combining ThemedView with Card features
 *
 * Features:
 * - Elevation system (0-5)
 * - Surface variants
 * - Optional borders
 * - Padding variants
 * - Border radius variants
 * - Automatic shadow handling
 * - Theme-aware
 *
 * @example
 * ```tsx
 * <ThemedSurface elevation={1} padding="md">
 *   <ThemedText>Card content</ThemedText>
 * </ThemedSurface>
 *
 * <ThemedSurface elevation={2} variant="surface-variant" bordered>
 *   <ThemedText>Elevated content</ThemedText>
 * </ThemedSurface>
 * ```
 */

import { BorderRadius, type Shadow, Spacing } from '@/constants/layout';
import { getShadow } from '@/constants/style-utils';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useThemeColor } from '@/hooks/use-theme-color';
import { memo, useMemo } from 'react';
import { StyleSheet, View, type ViewProps, type ViewStyle } from 'react-native';

export type SurfaceElevation = 0 | 1 | 2 | 3 | 4 | 5;

export interface ThemedSurfaceProps extends ViewProps {
  /**
   * Elevation level (0-5)
   * - 0: No elevation
   * - 1: Subtle elevation (default)
   * - 2: Medium elevation
   * - 3: High elevation
   * - 4: Very high elevation
   * - 5: Maximum elevation
   * @default 1
   */
  elevation?: SurfaceElevation;

  /**
   * Surface variant
   * @default 'surface'
   */
  variant?: 'surface' | 'surface-variant';

  /**
   * Padding size
   * @default 'md'
   */
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

  /**
   * Border radius size
   * @default 'md'
   */
  borderRadius?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';

  /**
   * Show border
   * @default false
   */
  bordered?: boolean;

  /**
   * Custom border color
   */
  borderColor?: string;

  /**
   * Children content
   */
  children: React.ReactNode;
}

const ELEVATION_SHADOW_MAP: Record<SurfaceElevation, keyof typeof Shadow> = {
  0: 'none',
  1: 'sm',
  2: 'md',
  3: 'lg',
  4: 'xl',
  5: 'xl',
};

// Padding map - outside component to avoid useMemo dependencies
const PADDING_MAP = {
  none: 0,
  xs: Spacing.xs,
  sm: Spacing.sm,
  md: Spacing.md,
  lg: Spacing.lg,
  xl: Spacing.xl,
} as const;

// Border radius map - outside component to avoid useMemo dependencies
const BORDER_RADIUS_MAP = {
  none: 0,
  xs: BorderRadius.xs,
  sm: BorderRadius.sm,
  md: BorderRadius.md,
  lg: BorderRadius.lg,
  xl: BorderRadius.xl,
} as const;

function ThemedSurfaceComponent({
  elevation = 1,
  variant = 'surface',
  padding = 'md',
  borderRadius = 'md',
  bordered = false,
  borderColor: customBorderColor,
  style,
  children,
  ...rest
}: ThemedSurfaceProps) {
  const colorScheme = useColorScheme();
  const backgroundColor = useThemeColor({}, variant);
  const borderColor = useThemeColor({}, 'border');

  // Memoize shadow style
  const shadowStyle = useMemo(() => (elevation > 0 ? getShadow(ELEVATION_SHADOW_MAP[elevation], colorScheme) : {}), [elevation, colorScheme]);

  // Memoize surface style
  const surfaceStyle: ViewStyle = useMemo(
    () => ({
      backgroundColor,
      padding: PADDING_MAP[padding],
      borderRadius: BORDER_RADIUS_MAP[borderRadius],
      ...shadowStyle,
      ...(bordered && {
        borderWidth: 1,
        borderColor: customBorderColor || borderColor,
      }),
    }),
    [backgroundColor, padding, borderRadius, shadowStyle, bordered, customBorderColor, borderColor]
  );

  return (
    <View style={[styles.surface, surfaceStyle, style]} accessible={true} {...rest}>
      {children}
    </View>
  );
}

export const ThemedSurface = memo(ThemedSurfaceComponent);

const styles = StyleSheet.create({
  surface: {
    overflow: 'hidden',
  },
});
