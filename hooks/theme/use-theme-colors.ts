/**
 * useThemeColors Hook
 * Centralized theme color access to reduce repetitive useThemeColor calls
 *
 * Instead of calling useThemeColor 5-10 times in every component:
 * ❌ const primaryColor = useThemeColor({}, 'primary');
 * ❌ const surfaceColor = useThemeColor({}, 'surface');
 * ❌ const textColor = useThemeColor({}, 'text');
 * ❌ ...and 5 more lines
 *
 * Use this hook once:
 * ✅ const colors = useThemeColors();
 *
 * This hook supports two modes:
 * 1. **Default mode**: Uses project's theme constants automatically (LoginX)
 * 2. **Independent mode**: Pass theme colors via config parameter (portable)
 *
 * @example
 * ```tsx
 * // Default mode (uses project constants)
 * function MyComponent() {
 *   const colors = useThemeColors();
 *
 *   return (
 *     <View style={{ backgroundColor: colors.surface, borderColor: colors.border }}>
 *       <Text style={{ color: colors.text }}>Hello</Text>
 *       <Button style={{ backgroundColor: colors.primary }}>
 *         <Text style={{ color: colors.onPrimary }}>Submit</Text>
 *       </Button>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * ```tsx
 * // Independent mode (provide your own colors)
 * const myColors = {
 *   light: { primary: '#007AFF', text: '#000', bg: '#FFF', ... },
 *   dark: { primary: '#0A84FF', text: '#FFF', bg: '#000', ... }
 * };
 *
 * function MyComponent() {
 *   const colors = useThemeColors({ themeColors: myColors });
 *   return <View style={{ backgroundColor: colors.surface }} />;
 * }
 * ```
 */

import { Colors } from '@/constants/theme';
import { useThemeContext } from './use-theme-context';
import type { ThemeColors } from './use-theme-color';

/**
 * Configuration for theme colors
 */
export interface UseThemeColorsConfig {
  /** Theme colors mapped by theme name (light/dark) */
  themeColors?: Record<'light' | 'dark', ThemeColors>;
}

/**
 * Returns all theme colors for the current theme
 * Eliminates the need for multiple useThemeColor calls
 *
 * @param config - Optional theme configuration (for independent usage)
 * @returns All theme colors for the current resolved theme
 */
export function useThemeColors(config?: UseThemeColorsConfig): ThemeColors {
  const { resolvedTheme } = useThemeContext();

  // If config provided, use injected colors (independent mode)
  if (config?.themeColors) {
    return config.themeColors[resolvedTheme];
  }

  // Default: Use project constants (backward compatible)
  return Colors[resolvedTheme];
}
