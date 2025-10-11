/**
 * Notifications Center Screen
 * Shows all past notifications with ability to mark as read and delete
 */

import { ListScreen } from '@/components/templates/list-screen';
import { ThemedPressable } from '@/components/themed-pressable';
import { ThemedText } from '@/components/themed-text';
import { NotificationItem } from '@/components/ui/notification-item';
import { Spacing } from '@/constants/layout';
import { useAlert } from '@/hooks/use-alert';
import { useLoadingState } from '@/hooks/use-loading-state';
import { useNotificationCount } from '@/hooks/use-notification-count';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { NotificationItem as NotificationItemType } from '@/types/notification';
import { clearAllNotifications, deleteNotification, getNotificationHistory, markAllNotificationsAsRead, markNotificationAsRead } from '@/utils/notification-storage';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

export default function NotificationsCenterScreen() {
  const alert = useAlert();
  const router = useRouter();
  const colors = useThemeColors();

  const [notifications, setNotifications] = useState<NotificationItemType[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Hook to track and refresh badge count
  const { refreshCount } = useNotificationCount();

  // Use loading state hook for initial load
  const { execute: executeLoad, loading } = useLoadingState({ showErrorAlert: false });

  const loadNotifications = useCallback(async () => {
    await executeLoad(async () => {
      const history = await getNotificationHistory();
      setNotifications(history);
      setRefreshing(false);
    });
  }, [executeLoad]);

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadNotifications();
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(
    async (id: string) => {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await markNotificationAsRead(id);
      await loadNotifications();
      refreshCount(); // Update badge count
    },
    [loadNotifications, refreshCount]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await markAllNotificationsAsRead();
    await loadNotifications();
    refreshCount(); // Update badge count
  }, [loadNotifications, refreshCount]);

  const handleDelete = useCallback(
    async (id: string) => {
      alert.show('Delete Notification', 'Are you sure you want to delete this notification?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await deleteNotification(id);
            await loadNotifications();
            refreshCount(); // Update badge count
          },
        },
      ]);
    },
    [alert, loadNotifications, refreshCount]
  );

  const handleClearAll = useCallback(async () => {
    alert.show('Clear All Notifications', 'This will permanently delete all notifications. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await clearAllNotifications();
          await loadNotifications();
          refreshCount(); // Update badge count
        },
      },
    ]);
  }, [alert, loadNotifications, refreshCount]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Custom list header with action buttons
  const ListHeader = () => {
    if (notifications.length === 0) {
      return null;
    }

    return (
      <View style={styles.headerActions}>
        {unreadCount > 0 && (
          <ThemedPressable style={styles.actionButton} onPress={handleMarkAllAsRead}>
            <ThemedText style={[styles.actionButtonText, { color: colors.primary }]}>{unreadCount} unread - Mark all read</ThemedText>
          </ThemedPressable>
        )}
        <ThemedPressable style={styles.actionButton} onPress={handleClearAll}>
          <ThemedText style={[styles.actionButtonText, { color: colors.error }]}>Clear all</ThemedText>
        </ThemedPressable>
      </View>
    );
  };

  return (
    <>
      <ListScreen
        title="Notifications"
        data={notifications}
        renderItem={({ item }) => <NotificationItem item={item} onMarkAsRead={() => handleMarkAsRead(item.id)} onDelete={() => handleDelete(item.id)} />}
        keyExtractor={(item) => item.id}
        loading={loading}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        isEmpty={notifications.length === 0}
        emptyStateContent={{
          icon: 'bell-off',
          title: 'No Notifications',
          description: "When you receive notifications, they'll appear here",
        }}
        headerAction={{
          icon: 'settings',
          onPress: () => router.push('/settings/notifications'),
          accessibilityLabel: 'Notification settings',
        }}
        listHeaderContent={<ListHeader />}
        contentContainerStyle={styles.listContent}
      />
      {alert.AlertComponent}
    </>
  );
}

const styles = StyleSheet.create({
  listContent: {
    padding: Spacing.md,
  },
  headerActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    borderWidth: 1,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
