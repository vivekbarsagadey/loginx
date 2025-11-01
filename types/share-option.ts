/**
 * Share Option Types
 * Type definitions for share/referral options
 */

import type { Ionicons } from '@expo/vector-icons';

export type ShareOptionId = 'whatsapp' | 'sms' | 'email' | 'more';

export interface ShareOption {
  id: ShareOptionId;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  title: string;
  subtitle: string;
  onPress: () => Promise<void>;
  color: string;
}
