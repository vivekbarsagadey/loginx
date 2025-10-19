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
 * @example
 * ```tsx
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
 */

import { Colors } from '@/constants/theme';
import { useThemeContext } from './use-theme-context';

/**
 * Returns all theme colors for the current theme
 * Eliminates the need for multiple useThemeColor calls
 */
export function useThemeColors() {
  const { resolvedTheme } = useThemeContext();
  return Colors[resolvedTheme];
}

/**
 * Type-safe access to specific theme colors
 * Use when you only need a subset of colors
 *
 * @example
 * ```tsx
 * const { primary, text, surface } = useThemeColors();
 * ```
 */
export type ThemeColors = ReturnType<typeof useThemeColors>;
