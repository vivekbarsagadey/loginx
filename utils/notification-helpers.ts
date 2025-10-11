/**
 * Notification Helper Utilities
 * Common functions for notification formatting and icon mapping
 */

import type { NotificationType } from '@/types/notification';

export interface NotificationIconConfig {
  name: string;
  colorKey: 'primary' | 'error' | 'success' | 'warning';
}

/**
 * Get icon configuration for a notification type
 * @param type - The notification type
 * @returns Icon name and color key for theming
 */
export function getNotificationIconConfig(type: NotificationType): NotificationIconConfig {
  switch (type) {
    case 'security':
      return { name: 'shield', colorKey: 'error' };
    case 'success':
      return { name: 'checkmark-circle', colorKey: 'success' };
    case 'warning':
      return { name: 'alert-circle', colorKey: 'warning' };
    case 'promotion':
      return { name: 'gift', colorKey: 'primary' };
    case 'info':
    default:
      return { name: 'information-circle', colorKey: 'primary' };
  }
}

/**
 * Format a timestamp into a human-readable relative time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted string like "Just now", "5m ago", "2h ago", "3d ago", or date
 * @example
 * formatTimestamp(Date.now()) // "Just now"
 * formatTimestamp(Date.now() - 1000 * 60 * 5) // "5m ago"
 * formatTimestamp(Date.now() - 1000 * 60 * 60 * 2) // "2h ago"
 * formatTimestamp(Date.now() - 1000 * 60 * 60 * 24 * 3) // "3d ago"
 * formatTimestamp(Date.now() - 1000 * 60 * 60 * 24 * 8) // "12/25/2024"
 */
export function formatTimestamp(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) {
    return 'Just now';
  }
  if (minutes < 60) {
    return `${minutes}m ago`;
  }
  if (hours < 24) {
    return `${hours}h ago`;
  }
  if (days < 7) {
    return `${days}d ago`;
  }

  return new Date(timestamp).toLocaleDateString();
}

/**
 * Format a timestamp into a full date and time string
 * @param timestamp - Unix timestamp in milliseconds
 * @returns Formatted date and time string
 * @example
 * formatFullTimestamp(1640000000000) // "12/20/2021, 12:00 PM"
 */
export function formatFullTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Check if a timestamp is today
 * @param timestamp - Unix timestamp in milliseconds
 * @returns True if the timestamp is today
 */
export function isToday(timestamp: number): boolean {
  const date = new Date(timestamp);
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

/**
 * Check if a timestamp is within the last N days
 * @param timestamp - Unix timestamp in milliseconds
 * @param days - Number of days to check
 * @returns True if the timestamp is within the last N days
 */
export function isWithinDays(timestamp: number, days: number): boolean {
  const now = Date.now();
  const diff = now - timestamp;
  const daysDiff = Math.floor(diff / 86400000);
  return daysDiff < days;
}
