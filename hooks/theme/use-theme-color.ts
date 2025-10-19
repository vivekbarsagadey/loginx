import { Colors, type ThemeColors as ProjectThemeColors } from '@/constants/theme';
import { useThemeContext } from './use-theme-context';

/**
 * Theme colors interface for dependency injection
 * Defines the structure of color tokens available in the theme system
 * Re-exported from project constants for type compatibility
 */
export type ThemeColors = ProjectThemeColors;

/**
 * Configuration for theme color system
 * Pass this to make the hook work independently of project constants
 */
export interface UseThemeColorConfig {
  /** Theme colors mapped by theme name */
  themeColors: Record<string, ThemeColors>;
}

/**
 * Hook to get theme-aware colors
 * Automatically uses the current theme's colors
 *
 * This hook supports two modes:
 * 1. **Default mode**: Uses project's theme constants automatically (LoginX)
 * 2. **Independent mode**: Pass theme colors via config parameter (portable)
 *
 * For independent usage, provide your own color definitions via config parameter.
 * For LoginX usage, the hook uses project constants by default (backward compatible).
 *
 * @param props - Optional color overrides per theme
 * @param colorName - The color token name from the theme
 * @param config - Optional theme configuration (for independent/portable usage)
 * @returns The resolved color value
 *
 * @example
 * // Default mode (uses project constants automatically)
 * const primaryColor = useThemeColor({}, 'primary');
 * const customBg = useThemeColor({ light: '#fff', dark: '#000' }, 'bg');
 *
 * @example
 * // Independent mode (provide your own colors)
 * const myColors = {
 *   light: { primary: '#007AFF', text: '#000', bg: '#FFF', ... },
 *   dark: { primary: '#0A84FF', text: '#FFF', bg: '#000', ... }
 * };
 * const primaryColor = useThemeColor({}, 'primary', { themeColors: myColors });
 */
export function useThemeColor(
  props: Partial<Record<string, string>>,
  colorName: keyof ThemeColors,
  config?: UseThemeColorConfig
) {
  const { resolvedTheme } = useThemeContext();
  const colorFromProps = props[resolvedTheme];

  // First priority: Props override
  if (colorFromProps) {
    return colorFromProps;
  }

  // Second priority: Config colors (independent mode)
  if (config?.themeColors) {
    return config.themeColors[resolvedTheme][colorName];
  }

  // Third priority: Project constants (default/backward compatible)
  return Colors[resolvedTheme][colorName];
}
