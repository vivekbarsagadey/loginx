/**
 * Unified Theme Context
 *
 * This context provides a complete theme system that:
 * 1. Loads user's theme preference from AsyncStorage
 * 2. Resolves 'system' preference to actual device theme
 * 3. Forces 'light' or 'dark' when explicitly selected by user
 * 4. Provides resolved theme to all components
 * 5. Updates when device theme changes (if preference is 'system')
 */

import { THEME_NAMES } from '@/constants/theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';

export type ThemePreference = 'system' | 'default' | 'ocean' | 'sunset' | 'forest' | 'purple';
export type ResolvedTheme = 'light' | 'dark' | 'default' | 'ocean' | 'ocean-dark' | 'sunset' | 'sunset-dark' | 'forest' | 'forest-dark' | 'purple' | 'purple-dark';

interface ThemeContextType {
  /**
   * User's theme preference (what they selected in settings)
   * - 'system': Follow device theme with default colors
   * - 'default': Default blue theme (respects light/dark mode)
   * - 'ocean': Ocean cyan theme (respects light/dark mode)
   * - 'sunset': Sunset orange theme (respects light/dark mode)
   * - 'forest': Forest green theme (respects light/dark mode)
   * - 'purple': Purple violet theme (respects light/dark mode)
   */
  themePreference: ThemePreference;

  /**
   * Update the theme preference and save to AsyncStorage
   */
  setThemePreference: (theme: ThemePreference) => Promise<void>;

  /**
   * Resolved theme (what should actually display)
   * - If preference is 'system', this will be 'light' or 'dark' based on device
   * - If preference is a theme name, this will be 'themeName' or 'themeName-dark'
   */
  resolvedTheme: ResolvedTheme;

  /**
   * Alias for resolvedTheme - for backward compatibility with code expecting `theme`
   * @deprecated Use resolvedTheme instead
   */
  theme: ResolvedTheme;

  /**
   * Whether the theme is currently loading from AsyncStorage
   */
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme';

export function ThemeProvider({ children }: PropsWithChildren) {
  const systemTheme = useRNColorScheme() ?? 'light';
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Resolve the theme based on preference and system theme
  const resolvedTheme: ResolvedTheme = (() => {
    if (themePreference === 'system' || themePreference === 'default') {
      // System and default preference use default theme with device appearance
      return systemTheme;
    }
    // All other themes append -dark when system is in dark mode
    return systemTheme === 'dark' ? `${themePreference}-dark` : themePreference;
  })() as ResolvedTheme;

  // Load saved theme preference on mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        const validThemes = ['system', ...THEME_NAMES];
        if (saved && validThemes.includes(saved)) {
          setThemePreferenceState(saved as ThemePreference);
        }
      } catch (_error: unknown) {
        // Fall back to default theme if loading fails
      } finally {
        setIsLoading(false);
      }
    };

    loadTheme();
  }, []);

  // Save preference and update state
  const setThemePreference = async (theme: ThemePreference) => {
    try {
      setThemePreferenceState(theme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch (_error: unknown) {
      console.error('Failed to save theme preference:', error);
      throw error;
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        themePreference,
        setThemePreference,
        resolvedTheme,
        theme: resolvedTheme, // Alias for backward compatibility
        isLoading,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context
 * Must be used within a ThemeProvider
 *
 * @returns Theme context with preference, setter, and resolved theme
 * @throws Error if used outside of ThemeProvider
 *
 * @example
 * const { themePreference, setThemePreference, resolvedTheme } = useThemeContext();
 *
 * // Get current user preference
 * console.error(themePreference); // 'system' | 'default' | 'ocean' | 'sunset' | 'forest' | 'purple'
 *
 * // Get resolved theme for rendering
 * console.error(resolvedTheme); // 'light' | 'dark' | 'ocean' | 'ocean-dark' | etc.
 *
 * // Change theme preference
 * await setThemePreference('ocean');
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeProvider');
  }
  return context;
}

// Alias for backward compatibility
export { useThemeContext as useTheme };
