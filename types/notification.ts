/**
 * Notification types and interfaces
 */

export type NotificationType = 'security' | 'info' | 'success' | 'warning' | 'promotion';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
  icon?: string;
}

export interface NotificationHistory {
  notifications: NotificationItem[];
  lastFetch: number;
}
