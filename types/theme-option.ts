/**
 * Theme Option Types
 * Type definitions for theme selection options
 */

import type { ThemePreference } from '@/hooks/use-theme-context';

export interface ThemeOption {
  key: ThemePreference;
  title: string;
  description: string;
  icon: string;
  color: string;
}
