/**
 * Local-first notification storage
 * Stores notification history locally with AsyncStorage
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { NotificationHistory, NotificationItem } from '@/types/notification';

const NOTIFICATION_STORAGE_KEY = 'notification_history';
const MAX_NOTIFICATIONS = 100; // Keep last 100 notifications

/**
 * Get all stored notifications
 */
export async function getNotificationHistory(): Promise<NotificationItem[]> {
  try {
    const data = await AsyncStorage.getItem(NOTIFICATION_STORAGE_KEY);
    if (!data) {
      return [];
    }
    
    const history: NotificationHistory = JSON.parse(data);
    return history.notifications || [];
  } catch (error) {
    console.error('Error reading notification history:', error);
    return [];
  }
}

/**
 * Add a new notification to history
 */
export async function addNotification(notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>): Promise<void> {
  try {
    const history = await getNotificationHistory();
    
    const newNotification: NotificationItem = {
      ...notification,
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      read: false,
    };
    
    // Add to beginning of array (newest first)
    const updatedHistory = [newNotification, ...history];
    
    // Keep only MAX_NOTIFICATIONS
    const trimmedHistory = updatedHistory.slice(0, MAX_NOTIFICATIONS);
    
    const historyData: NotificationHistory = {
      notifications: trimmedHistory,
      lastFetch: Date.now(),
    };
    
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(historyData));
  } catch (error) {
    console.error('Error adding notification:', error);
  }
}

/**
 * Mark notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
  try {
    const history = await getNotificationHistory();
    const updated = history.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    
    const historyData: NotificationHistory = {
      notifications: updated,
      lastFetch: Date.now(),
    };
    
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(historyData));
  } catch (error) {
    console.error('Error marking notification as read:', error);
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<void> {
  try {
    const history = await getNotificationHistory();
    const updated = history.map(n => ({ ...n, read: true }));
    
    const historyData: NotificationHistory = {
      notifications: updated,
      lastFetch: Date.now(),
    };
    
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(historyData));
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
  }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
  try {
    const history = await getNotificationHistory();
    const filtered = history.filter(n => n.id !== notificationId);
    
    const historyData: NotificationHistory = {
      notifications: filtered,
      lastFetch: Date.now(),
    };
    
    await AsyncStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(historyData));
  } catch (error) {
    console.error('Error deleting notification:', error);
  }
}

/**
 * Clear all notifications
 */
export async function clearAllNotifications(): Promise<void> {
  try {
    await AsyncStorage.removeItem(NOTIFICATION_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing notifications:', error);
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(): Promise<number> {
  try {
    const history = await getNotificationHistory();
    return history.filter(n => !n.read).length;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}
