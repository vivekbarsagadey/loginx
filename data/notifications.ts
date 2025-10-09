/**
 * Sample Notifications Data
 * This file contains sample notification items that can be used for:
 * - Testing the notifications system
 * - Seeding the notification history
 * - Demonstrating notification types
 */

import type { NotificationItem } from '@/types/notification';

/**
 * Sample notification items covering all notification types
 */
export const sampleNotifications: Omit<NotificationItem, 'id' | 'timestamp'>[] = [
  {
    type: 'security',
    title: 'Security Alert',
    message: "A new login was detected from a different device. If this wasn't you, please secure your account immediately.",
    read: false,
    icon: 'shield',
  },
  {
    type: 'success',
    title: 'Profile Updated',
    message: 'Your profile information has been successfully updated.',
    read: false,
    icon: 'checkmark-circle',
  },
  {
    type: 'info',
    title: 'Welcome to LoginX',
    message: 'Thank you for joining us! Explore the app to discover all features.',
    read: true,
    icon: 'information-circle',
  },
  {
    type: 'warning',
    title: 'Password Expiry',
    message: 'Your password will expire in 7 days. Please update it to maintain account security.',
    read: false,
    icon: 'alert-circle',
  },
  {
    type: 'promotion',
    title: 'New Feature Available',
    message: 'Try our new biometric authentication for faster and more secure login!',
    read: false,
    icon: 'gift',
  },
  {
    type: 'security',
    title: '2FA Enabled',
    message: 'Two-factor authentication has been enabled on your account. Your account is now more secure.',
    read: true,
    icon: 'shield',
  },
  {
    type: 'info',
    title: 'App Update',
    message: 'A new version of LoginX is available. Update now to get the latest features and improvements.',
    read: true,
    icon: 'information-circle',
  },
  {
    type: 'success',
    title: 'Email Verified',
    message: 'Your email address has been successfully verified. You now have full access to all features.',
    read: true,
    icon: 'checkmark-circle',
  },
];

/**
 * Generate a notification with current timestamp and unique ID
 * @param notification - Notification data without id and timestamp
 * @returns Complete notification item
 */
export function createNotification(notification: Omit<NotificationItem, 'id' | 'timestamp'>): NotificationItem {
  return {
    ...notification,
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    timestamp: Date.now(),
  };
}

/**
 * Get sample notifications with timestamps
 * Creates notifications with realistic time offsets
 */
export function getSampleNotifications(): NotificationItem[] {
  const now = Date.now();
  const timeOffsets = [
    5 * 60 * 1000, // 5 minutes ago
    30 * 60 * 1000, // 30 minutes ago
    2 * 60 * 60 * 1000, // 2 hours ago
    24 * 60 * 60 * 1000, // 1 day ago
    2 * 24 * 60 * 60 * 1000, // 2 days ago
    5 * 24 * 60 * 60 * 1000, // 5 days ago
    7 * 24 * 60 * 60 * 1000, // 1 week ago
    14 * 24 * 60 * 60 * 1000, // 2 weeks ago
  ];

  return sampleNotifications.map((notification, index) => ({
    ...notification,
    id: `sample_${index + 1}`,
    timestamp: now - (timeOffsets[index] || 0),
  }));
}
