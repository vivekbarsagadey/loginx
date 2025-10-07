/**
 * Notifications Center Screen
 * Shows all past notifications with ability to mark as read and delete
 */

import { TabHeader } from '@/components/navigation/TabHeader';
import { ScreenContainer } from '@/components/screen-container';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CommonText } from '@/constants/common-styles';
import { BorderRadius, Spacing, Typography } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import type { NotificationItem, NotificationType } from '@/types/notification';
import { clearAllNotifications, deleteNotification, getNotificationHistory, markAllNotificationsAsRead, markNotificationAsRead } from '@/utils/notification-storage';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';

export default function NotificationsCenterScreen() {
  const surfaceColor = useThemeColor({}, 'surface');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const primaryColor = useThemeColor({}, 'primary');
  const errorColor = useThemeColor({}, 'error');
  const successColor = useThemeColor({}, 'success');
  const warningColor = useThemeColor({}, 'warning');

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadNotifications = useCallback(async () => {
    try {
      const history = await getNotificationHistory();
      setNotifications(history);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

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
    },
    [loadNotifications]
  );

  const handleMarkAllAsRead = useCallback(async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await markAllNotificationsAsRead();
    await loadNotifications();
  }, [loadNotifications]);

  const handleDelete = useCallback(
    async (id: string) => {
      Alert.alert('Delete Notification', 'Are you sure you want to delete this notification?', [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            await deleteNotification(id);
            await loadNotifications();
          },
        },
      ]);
    },
    [loadNotifications]
  );

  const handleClearAll = useCallback(async () => {
    Alert.alert('Clear All Notifications', 'This will permanently delete all notifications. This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Clear All',
        style: 'destructive',
        onPress: async () => {
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          await clearAllNotifications();
          await loadNotifications();
        },
      },
    ]);
  }, [loadNotifications]);

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case 'security':
        return { name: 'shield', color: errorColor };
      case 'success':
        return { name: 'checkmark-circle', color: successColor };
      case 'warning':
        return { name: 'alert-circle', color: warningColor };
      case 'promotion':
        return { name: 'gift', color: primaryColor };
      case 'info':
      default:
        return { name: 'information-circle', color: primaryColor };
    }
  };

  const formatTimestamp = (timestamp: number) => {
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
  };

  const styles = React.useMemo(
    () =>
      StyleSheet.create({
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: Spacing.lg,
        },
        headerActions: {
          flexDirection: 'row',
          gap: Spacing.sm,
        },
        actionButton: {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          borderRadius: BorderRadius.sm,
          borderWidth: 1,
          borderColor: borderColor,
        },
        actionButtonText: {
          fontSize: 13,
          color: primaryColor,
          fontWeight: '600',
        },
        emptyContainer: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: Spacing.xxl * 2,
        },
        emptyIcon: {
          marginBottom: Spacing.lg,
        },
        emptyTitle: {
          fontSize: Typography.h3.fontSize,
          fontWeight: '600' as const,
          marginBottom: Spacing.sm,
          textAlign: 'center' as const,
        },
        emptyDescription: {
          color: textMutedColor,
          textAlign: 'center',
          paddingHorizontal: Spacing.xl,
        },
        notificationCard: {
          backgroundColor: surfaceColor,
          borderRadius: BorderRadius.md,
          borderWidth: 1,
          borderColor: borderColor,
          marginBottom: Spacing.md,
          overflow: 'hidden',
        },
        notificationContent: {
          flexDirection: 'row',
          padding: Spacing.md,
        },
        iconContainer: {
          width: 40,
          height: 40,
          borderRadius: BorderRadius.full,
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: Spacing.md,
        },
        notificationBody: {
          flex: 1,
        },
        notificationHeader: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: Spacing.xs,
        },
        notificationTitle: {
          flex: 1,
          fontSize: Typography.body.fontSize,
          fontWeight: '600' as const,
          marginRight: Spacing.sm,
          color: textColor,
        },
        timestamp: {
          fontSize: 12,
          color: textMutedColor,
        },
        notificationMessage: {
          fontSize: 14,
          lineHeight: 20,
          color: textMutedColor,
          marginBottom: Spacing.sm,
        },
        unreadIndicator: {
          position: 'absolute',
          top: Spacing.md,
          right: Spacing.md,
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: primaryColor,
        },
        notificationActions: {
          flexDirection: 'row',
          justifyContent: 'flex-end',
          borderTopWidth: 1,
          borderTopColor: borderColor,
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
        },
        notificationAction: {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          marginLeft: Spacing.sm,
        },
        actionText: {
          fontSize: 13,
          fontWeight: '600',
        },
        markReadText: {
          color: primaryColor,
        },
        deleteText: {
          color: errorColor,
        },
      }),
    [surfaceColor, borderColor, textColor, textMutedColor, primaryColor, errorColor]
  );

  if (loading) {
    return (
      <ScreenContainer centerContent>
        <ActivityIndicator size="large" color={primaryColor} />
        <ThemedText style={{ marginTop: Spacing.md }}>Loading notifications...</ThemedText>
      </ScreenContainer>
    );
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <>
      <TabHeader title="Notifications" showBackButton={true} />
      <ScreenContainer useSafeArea={false}>
        <ScrollView showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={primaryColor} />}>
          <View style={styles.header}>
            <ThemedView>
              <ThemedText type="h2">Notifications</ThemedText>
              {unreadCount > 0 && (
                <ThemedText type="caption" style={CommonText.descriptionText}>
                  {unreadCount} unread
                </ThemedText>
              )}
            </ThemedView>
            {notifications.length > 0 && (
              <View style={styles.headerActions}>
                {unreadCount > 0 && (
                  <Pressable style={styles.actionButton} onPress={handleMarkAllAsRead}>
                    <ThemedText style={styles.actionButtonText}>Mark all read</ThemedText>
                  </Pressable>
                )}
                <Pressable style={styles.actionButton} onPress={handleClearAll}>
                  <ThemedText style={[styles.actionButtonText, { color: errorColor }]}>Clear all</ThemedText>
                </Pressable>
              </View>
            )}
          </View>

          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Feather name="bell-off" size={64} color={textMutedColor} style={styles.emptyIcon} />
              <ThemedText style={styles.emptyTitle}>No Notifications</ThemedText>
              <ThemedText style={styles.emptyDescription}>When you receive notifications, they&apos;ll appear here</ThemedText>
            </View>
          ) : (
            notifications.map((notification) => {
              const icon = getNotificationIcon(notification.type);
              return (
                <View key={notification.id} style={styles.notificationCard}>
                  <Pressable style={styles.notificationContent} onPress={() => !notification.read && handleMarkAsRead(notification.id)}>
                    <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
                      <Ionicons name={icon.name as keyof typeof Ionicons.glyphMap} size={24} color={icon.color} />
                    </View>
                    <View style={styles.notificationBody}>
                      <View style={styles.notificationHeader}>
                        <ThemedText style={styles.notificationTitle}>{notification.title}</ThemedText>
                        <ThemedText style={styles.timestamp}>{formatTimestamp(notification.timestamp)}</ThemedText>
                      </View>
                      <ThemedText style={styles.notificationMessage}>{notification.message}</ThemedText>
                    </View>
                    {!notification.read && <View style={styles.unreadIndicator} />}
                  </Pressable>

                  <View style={styles.notificationActions}>
                    {!notification.read && (
                      <Pressable style={styles.notificationAction} onPress={() => handleMarkAsRead(notification.id)}>
                        <ThemedText style={[styles.actionText, styles.markReadText]}>Mark as read</ThemedText>
                      </Pressable>
                    )}
                    <Pressable style={styles.notificationAction} onPress={() => handleDelete(notification.id)}>
                      <ThemedText style={[styles.actionText, styles.deleteText]}>Delete</ThemedText>
                    </Pressable>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </ScreenContainer>
    </>
  );
}
