import { ThemedText } from '@/components/themed-text';
import { BorderRadius, BorderWidth, FontWeight, Spacing, Typography } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import type { NotificationItem as NotificationItemType } from '@/types/notification';
import { formatTimestamp, getNotificationIconConfig } from '@/utils/notification-helpers';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface NotificationItemProps {
  item: NotificationItemType;
  onPress?: () => void;
  onMarkAsRead?: () => void;
  onDelete?: () => void;
}

/**
 * NotificationItem component displays a single notification with actions
 */
export function NotificationItem({ item, onPress, onMarkAsRead, onDelete }: NotificationItemProps) {
  const colors = useThemeColors();

  const iconConfig = useMemo(() => getNotificationIconConfig(item.type), [item.type]);
  const icon = {
    name: iconConfig.name,
    color: colors[iconConfig.colorKey],
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Pressable style={styles.content} onPress={() => (!item.read && onMarkAsRead ? onMarkAsRead() : onPress?.())}>
        <View style={[styles.iconContainer, { backgroundColor: icon.color + '20' }]}>
          <Ionicons name={icon.name as keyof typeof Ionicons.glyphMap} size={24} color={icon.color} />
        </View>
        <View style={styles.body}>
          <View style={styles.header}>
            <ThemedText style={[styles.title, { color: colors.text }]} numberOfLines={1}>
              {item.title}
            </ThemedText>
            <ThemedText style={[styles.timestamp, { color: colors['text-muted'] }]}>{formatTimestamp(item.timestamp)}</ThemedText>
          </View>
          <ThemedText style={[styles.message, { color: colors['text-muted'] }]} numberOfLines={2}>
            {item.message}
          </ThemedText>
        </View>
        {!item.read && <View style={[styles.unreadIndicator, { backgroundColor: colors.primary }]} />}
      </Pressable>

      <View style={[styles.actions, { borderTopColor: colors.border }]}>
        {!item.read && onMarkAsRead && (
          <Pressable style={styles.action} onPress={onMarkAsRead}>
            <ThemedText style={[styles.actionText, { color: colors.primary }]}>Mark as read</ThemedText>
          </Pressable>
        )}
        {onDelete && (
          <Pressable style={styles.action} onPress={onDelete}>
            <ThemedText style={[styles.actionText, { color: colors.error }]}>Delete</ThemedText>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: BorderWidth.thin,
    marginBottom: Spacing.md,
    overflow: 'hidden',
  },
  content: {
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
  body: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: Typography.body.fontSize,
    fontWeight: FontWeight.semibold,
    marginRight: Spacing.sm,
  },
  timestamp: {
    fontSize: Typography.caption.fontSize,
  },
  message: {
    fontSize: Typography.bodySmall.fontSize,
    lineHeight: Typography.bodySmall.lineHeight,
    marginBottom: Spacing.sm,
  },
  unreadIndicator: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    width: 8,
    height: 8,
    borderRadius: BorderRadius.xs,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: BorderWidth.thin,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  action: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    marginLeft: Spacing.sm,
  },
  actionText: {
    fontSize: Typography.caption.fontSize + 1,
    fontWeight: FontWeight.semibold,
  },
});
