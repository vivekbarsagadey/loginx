import { Colors, type ThemeColors } from '@/constants/theme';
import { useThemeContext } from './use-theme-context';

/**
 * Hook to get theme-aware colors
 * Automatically uses the current theme's colors
 *
 * @param props - Optional color overrides per theme
 * @param colorName - The color token name from the theme
 * @returns The resolved color value
 *
 * @example
 * const primaryColor = useThemeColor({}, 'primary');
 * const customBg = useThemeColor({ light: '#fff', dark: '#000' }, 'bg');
 */
export function useThemeColor(
  props: Partial<Record<string, string>>,
  colorName: keyof ThemeColors
) {
  const { resolvedTheme } = useThemeContext();
  const colorFromProps = props[resolvedTheme];

  if (colorFromProps) {
    return colorFromProps;
  }
  
  return Colors[resolvedTheme][colorName];
}
