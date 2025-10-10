/**
 * Share Options Configuration
 * Centralized share/referral options data
 */

import i18n from '@/i18n';

/**
 * WhatsApp brand color
 */
export const WHATSAPP_COLOR = '#25D366';

/**
 * Generate referral link
 * @param referralCode - Unique user referral code
 * @param appUrl - Base app URL
 * @returns Complete referral link
 */
export function generateReferralLink(referralCode = 'LOGINX2025', appUrl = 'https://loginx.app'): string {
  return `${appUrl}/invite?ref=${referralCode}`;
}

/**
 * Get share message with referral link
 * @param referralLink - Complete referral link
 * @returns Formatted share message
 */
export function getShareMessage(referralLink: string): string {
  return i18n.t('shareApp.message', {
    link: referralLink,
    defaultValue: `Check out LoginX - the most secure authentication app! Join me and simplify your login experience.\n\n${referralLink}`,
  });
}

/**
 * Get email subject for sharing
 * @returns Email subject text
 */
export function getShareEmailSubject(): string {
  return i18n.t('shareApp.emailSubject', {
    defaultValue: 'Join me on LoginX!',
  });
}

/**
 * Benefits of sharing the app
 */
export const SHARE_BENEFITS = ['shareApp.benefits.secure', 'shareApp.benefits.simple', 'shareApp.benefits.privacy', 'shareApp.benefits.community'] as const;

/**
 * Get share benefit translations
 * @returns Array of translated benefit strings
 */
export function getShareBenefits(): string[] {
  return SHARE_BENEFITS.map((key) =>
    i18n.t(key, {
      defaultValue: key.split('.').pop() || '',
    })
  );
}
