/**
 * Theme Registry
 * Central place to register and access all themes
 */

import type { Theme, ThemeColors } from './base-theme';
import { defaultTheme } from './default.theme';
import { forestTheme } from './forest.theme';
import { marinerTheme } from './mariner.theme';
import { oceanTheme } from './ocean.theme';
import { purpleTheme } from './purple.theme';
import { sunsetTheme } from './sunset.theme';

// Export types
export type { Theme, ThemeColors } from './base-theme';

// Theme registry - add new themes here
export const THEMES: Record<string, Theme> = {
  default: defaultTheme,
  ocean: oceanTheme,
  sunset: sunsetTheme,
  forest: forestTheme,
  purple: purpleTheme,
  mariner: marinerTheme,
};

// Available theme names for selection
export const THEME_NAMES = Object.keys(THEMES) as (keyof typeof THEMES)[];

/**
 * Get a theme by name
 * @param themeName - Name of the theme to retrieve
 * @returns Theme object
 */
export function getTheme(themeName: string): Theme {
  return THEMES[themeName] || THEMES.default;
}

/**
 * Get theme colors based on theme name and mode
 * @param themeName - Name of the theme
 * @param mode - 'light' or 'dark'
 * @returns Theme colors object
 */
export function getThemeColors(themeName: string, mode: 'light' | 'dark'): ThemeColors {
  const theme = getTheme(themeName);
  return theme[mode];
}

/**
 * Get all available themes for selection
 * @returns Array of theme objects with their metadata
 */
export function getAllThemes(): { name: string; displayName: string; icon: string }[] {
  return THEME_NAMES.map((name) => ({
    name,
    displayName: THEMES[name].displayName,
    icon: THEMES[name].icon,
  }));
}

// Legacy support - maintain backward compatibility with existing Colors export
export const Colors = {
  light: defaultTheme.light,
  dark: defaultTheme.dark,
  default: defaultTheme.light, // 'default' uses light variant
  ocean: oceanTheme.light,
  'ocean-dark': oceanTheme.dark,
  sunset: sunsetTheme.light,
  'sunset-dark': sunsetTheme.dark,
  forest: forestTheme.light,
  'forest-dark': forestTheme.dark,
  purple: purpleTheme.light,
  'purple-dark': purpleTheme.dark,
  mariner: marinerTheme.light,
  'mariner-dark': marinerTheme.dark,
};
