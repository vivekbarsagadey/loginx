/**
 * Text Size Options Configuration
 * Centralized text size preferences data
 */

import i18n from '@/i18n';
import type { TextSize, TextSizeOption } from '@/types/text-size';

/**
 * Get text size options
 * @returns Array of text size options with current translations
 */
export function getTextSizeOptions(): TextSize[] {
  return [
    {
      key: 'small' as TextSizeOption,
      title: i18n.t('screens.settings.textSize.options.small'),
      multiplier: 0.85,
    },
    {
      key: 'default' as TextSizeOption,
      title: i18n.t('screens.settings.textSize.options.default'),
      multiplier: 1.0,
    },
    {
      key: 'large' as TextSizeOption,
      title: i18n.t('screens.settings.textSize.options.large'),
      multiplier: 1.15,
    },
    {
      key: 'extraLarge' as TextSizeOption,
      title: i18n.t('screens.settings.textSize.options.extraLarge'),
      multiplier: 1.3,
    },
  ];
}

/**
 * Get text size multiplier by option key
 * @param option - Text size option key
 * @returns Multiplier value for the given option
 */
export function getTextSizeMultiplier(option: TextSizeOption): number {
  const sizes = getTextSizeOptions();
  return sizes.find((size) => size.key === option)?.multiplier ?? 1.0;
}

/**
 * Default text size option
 */
export const DEFAULT_TEXT_SIZE: TextSizeOption = 'default';
