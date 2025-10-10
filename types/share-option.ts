/**
 * Share Option Types
 * Type definitions for share/referral options
 */

export type ShareOptionId = 'whatsapp' | 'sms' | 'email' | 'more';

export interface ShareOption {
  id: ShareOptionId;
  icon: string;
  title: string;
  subtitle: string;
  onPress: () => Promise<void>;
  color: string;
}
