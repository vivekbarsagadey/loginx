/**
 * About Information Types
 * Type definitions for about screen information
 */

import type { Feather } from '@expo/vector-icons';

export interface AppInfoItem {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
}

export interface ContactItem {
  icon: React.ComponentProps<typeof Feather>['name'];
  label: string;
  value: string;
  action: () => void;
}
