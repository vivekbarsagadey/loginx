/**
 * Theme System
 * This file exports theme functionality and maintains backward compatibility
 *
 * Themes are now organized in separate files:
 * - themes/default.theme.ts - Default blue theme
 * - themes/ocean.theme.ts - Ocean/cyan theme
 * - themes/sunset.theme.ts - Sunset/orange theme
 * - themes/forest.theme.ts - Forest/green theme
 * - themes/purple.theme.ts - Purple/violet theme
 *
 * Each theme has both light and dark variants.
 */

// Re-export everything from themes
export { Colors, THEMES, THEME_NAMES, getAllThemes, getTheme, getThemeColors } from './themes';
export type { Theme, ThemeColors } from './themes';
