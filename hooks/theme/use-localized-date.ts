import { useCallback, useMemo } from 'react';
import { useLanguage } from './use-language';

/**
 * Date format styles
 */
export type DateStyle = 'full' | 'long' | 'medium' | 'short';

/**
 * Time format styles
 */
export type TimeStyle = 'full' | 'long' | 'medium' | 'short';

/**
 * Custom date format options
 */
export interface DateFormatOptions extends Intl.DateTimeFormatOptions {
  /** Preset date style */
  dateStyle?: DateStyle;
  /** Preset time style */
  timeStyle?: TimeStyle;
}

/**
 * Relative time units
 */
export type RelativeTimeUnit = 'year' | 'month' | 'week' | 'day' | 'hour' | 'minute' | 'second';

/**
 * Hook for date formatting with internationalization
 *
 * @example
 * ```typescript
 * const { formatDate, formatTime, formatDateTime, formatRelative } = useLocalizedDate();
 *
 * // Format date only
 * const date = formatDate(new Date(), { dateStyle: 'long' });
 * // Output (en): "December 15, 2024"
 * // Output (es): "15 de diciembre de 2024"
 *
 * // Format time only
 * const time = formatTime(new Date(), { timeStyle: 'short' });
 * // Output (en): "2:30 PM"
 * // Output (es): "14:30"
 *
 * // Format date and time
 * const dateTime = formatDateTime(new Date(), {
 *   dateStyle: 'medium',
 *   timeStyle: 'short',
 * });
 * // Output (en): "Dec 15, 2024, 2:30 PM"
 *
 * // Relative time formatting
 * const relative = formatRelative(new Date(Date.now() - 1000 * 60 * 60));
 * // Output (en): "1 hour ago"
 * // Output (es): "hace 1 hora"
 *
 * // Custom format
 * const custom = formatDate(new Date(), {
 *   weekday: 'long',
 *   year: 'numeric',
 *   month: 'long',
 *   day: 'numeric',
 * });
 * // Output (en): "Monday, December 15, 2024"
 * ```
 *
 * @returns Object with date formatting functions
 */
export function useLocalizedDate() {
  const { language } = useLanguage();

  // Get the locale code (e.g., 'en', 'es', 'fr')
  const locale = useMemo(() => {
    // Map language to locale if needed
    const localeMap: Record<string, string> = {
      en: 'en-US',
      es: 'es-ES',
      fr: 'fr-FR',
      de: 'de-DE',
      pt: 'pt-BR',
      ja: 'ja-JP',
      zh: 'zh-CN',
    };
    return language ? localeMap[language] || language : 'en-US';
  }, [language]);

  /**
   * Format a date with the current locale
   */
  const formatDate = useCallback(
    (date: Date | string | number, options: DateFormatOptions = {}): string => {
      try {
        const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
          return 'Invalid Date';
        }

        const formatter = new Intl.DateTimeFormat(locale, {
          ...options,
          dateStyle: options.dateStyle || 'medium',
        });

        return formatter.format(dateObj);
      } catch (_error: unknown) {
        console.error('Error formatting date:', _error);
        return 'Invalid Date';
      }
    },
    [locale]
  );

  /**
   * Format a time with the current locale
   */
  const formatTime = useCallback(
    (date: Date | string | number, options: DateFormatOptions = {}): string => {
      try {
        const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
          return 'Invalid Time';
        }

        const formatter = new Intl.DateTimeFormat(locale, {
          ...options,
          timeStyle: options.timeStyle || 'short',
        });

        return formatter.format(dateObj);
      } catch (_error: unknown) {
        console.error('Error formatting time:', _error);
        return 'Invalid Time';
      }
    },
    [locale]
  );

  /**
   * Format both date and time with the current locale
   */
  const formatDateTime = useCallback(
    (date: Date | string | number, options: DateFormatOptions = {}): string => {
      try {
        const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
          return 'Invalid Date/Time';
        }

        const formatter = new Intl.DateTimeFormat(locale, {
          ...options,
          dateStyle: options.dateStyle || 'medium',
          timeStyle: options.timeStyle || 'short',
        });

        return formatter.format(dateObj);
      } catch (_error: unknown) {
        console.error('Error formatting date/time:', _error);
        return 'Invalid Date/Time';
      }
    },
    [locale]
  );

  /**
   * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
   */
  const formatRelative = useCallback(
    (date: Date | string | number): string => {
      try {
        const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

        if (isNaN(dateObj.getTime())) {
          return 'Invalid Date';
        }

        const now = Date.now();
        const diffMs = dateObj.getTime() - now;
        const absDiff = Math.abs(diffMs);

        // Determine the unit and value
        let value: number;
        let unit: Intl.RelativeTimeFormatUnit;

        if (absDiff < 60000) {
          // Less than 1 minute
          value = Math.round(diffMs / 1000);
          unit = 'second';
        } else if (absDiff < 3600000) {
          // Less than 1 hour
          value = Math.round(diffMs / 60000);
          unit = 'minute';
        } else if (absDiff < 86400000) {
          // Less than 1 day
          value = Math.round(diffMs / 3600000);
          unit = 'hour';
        } else if (absDiff < 604800000) {
          // Less than 1 week
          value = Math.round(diffMs / 86400000);
          unit = 'day';
        } else if (absDiff < 2629800000) {
          // Less than ~1 month
          value = Math.round(diffMs / 604800000);
          unit = 'week';
        } else if (absDiff < 31557600000) {
          // Less than 1 year
          value = Math.round(diffMs / 2629800000);
          unit = 'month';
        } else {
          value = Math.round(diffMs / 31557600000);
          unit = 'year';
        }

        const formatter = new Intl.RelativeTimeFormat(locale, {
          numeric: 'auto',
          style: 'long',
        });

        return formatter.format(value, unit);
      } catch (_error: unknown) {
        console.error('Error formatting relative time:', _error);
        return 'Invalid Date';
      }
    },
    [locale]
  );

  /**
   * Format a date range with the current locale
   */
  const formatDateRange = useCallback(
    (startDate: Date | string | number, endDate: Date | string | number, options: DateFormatOptions = {}): string => {
      try {
        const startObj = typeof startDate === 'string' || typeof startDate === 'number' ? new Date(startDate) : startDate;
        const endObj = typeof endDate === 'string' || typeof endDate === 'number' ? new Date(endDate) : endDate;

        if (isNaN(startObj.getTime()) || isNaN(endObj.getTime())) {
          return 'Invalid Date Range';
        }

        const formatter = new Intl.DateTimeFormat(locale, {
          ...options,
          dateStyle: options.dateStyle || 'medium',
        });

        return formatter.formatRange(startObj, endObj);
      } catch (_error: unknown) {
        console.error('Error formatting date range:', _error);
        return 'Invalid Date Range';
      }
    },
    [locale]
  );

  /**
   * Check if a date is today
   */
  const isToday = useCallback((date: Date | string | number): boolean => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const today = new Date();
    return dateObj.getDate() === today.getDate() && dateObj.getMonth() === today.getMonth() && dateObj.getFullYear() === today.getFullYear();
  }, []);

  /**
   * Check if a date is yesterday
   */
  const isYesterday = useCallback((date: Date | string | number): boolean => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateObj.getDate() === yesterday.getDate() && dateObj.getMonth() === yesterday.getMonth() && dateObj.getFullYear() === yesterday.getFullYear();
  }, []);

  /**
   * Check if a date is tomorrow
   */
  const isTomorrow = useCallback((date: Date | string | number): boolean => {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return dateObj.getDate() === tomorrow.getDate() && dateObj.getMonth() === tomorrow.getMonth() && dateObj.getFullYear() === tomorrow.getFullYear();
  }, []);

  return {
    formatDate,
    formatTime,
    formatDateTime,
    formatRelative,
    formatDateRange,
    isToday,
    isYesterday,
    isTomorrow,
    locale,
  };
}
