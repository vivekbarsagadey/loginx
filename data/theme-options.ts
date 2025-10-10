/**
 * Theme Options Configuration
 * Centralized theme selection data
 */

import { getAllThemes, getTheme } from '@/constants/theme';
import type { ThemePreference } from '@/hooks/use-theme-context';
import i18n from '@/i18n';
import type { ThemeOption } from '@/types/theme-option';

/**
 * Get theme options for selection
 * @param textColor - Current text color for system option
 * @returns Array of theme options with current translations
 */
export function getThemeOptions(textColor: string): ThemeOption[] {
  const availableThemes = getAllThemes();

  return [
    {
      key: 'system' as ThemePreference,
      title: i18n.t('screens.settings.theme.options.system.title'),
      description: i18n.t('screens.settings.theme.options.system.description'),
      icon: '📱',
      color: textColor,
    },
    ...availableThemes.map((themeInfo) => {
      const theme = getTheme(themeInfo.name);
      return {
        key: themeInfo.name as ThemePreference,
        title: themeInfo.displayName,
        description: `${themeInfo.displayName} color theme with light and dark modes`,
        icon: themeInfo.icon,
        color: theme.light.primary,
      };
    }),
  ];
}
