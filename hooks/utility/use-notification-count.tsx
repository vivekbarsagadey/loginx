/**
 * Hook to track unread notification count
 * Updates in real-time when notifications change
 */

import { getUnreadCount } from '@/utils/notification-storage';
import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

/**
 * Custom hook to track unread notification count
 * @param refreshInterval - Optional interval in ms to refresh count (default: 30000 - 30 seconds)
 * @returns unreadCount - Number of unread notifications
 * @returns refreshCount - Function to manually refresh the count
 */
export function useNotificationCount(refreshInterval = 30000) {
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const refreshCount = useCallback(async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      return 0;
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshCount();
  }, [refreshCount]);

  // Periodic refresh
  useEffect(() => {
    const interval = setInterval(refreshCount, refreshInterval);
    return () => clearInterval(interval);
  }, [refreshCount, refreshInterval]);

  // Refresh when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (nextAppState === 'active') {
        refreshCount();
      }
    });

    return () => subscription.remove();
  }, [refreshCount]);

  return { unreadCount, refreshCount };
}
