import { ThemedLoadingSpinner } from '@/components/themed-loading-spinner';
import { ThemedPressable } from '@/components/themed-pressable';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColors } from '@/hooks/use-theme-colors';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { FlatList, type FlatListProps, Platform, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ListScreenProps<T> extends Partial<FlatListProps<T>> {
  /**
   * Screen title
   */
  title?: string;
  /**
   * Whether the list is loading (initial load)
   */
  loading?: boolean;
  /**
   * Whether the list is refreshing (pull-to-refresh)
   */
  refreshing?: boolean;
  /**
   * Refresh handler for pull-to-refresh
   */
  onRefresh?: () => void;
  /**
   * Whether the list has an error
   */
  error?: Error | null;
  /**
   * Error retry handler
   */
  onRetry?: () => void;
  /**
   * Whether the list is empty
   */
  isEmpty?: boolean;
  /**
   * Empty state content
   */
  emptyStateContent?: {
    icon?: ComponentProps<typeof Feather>['name'];
    title: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
  };
  /**
   * Optional header action button
   */
  headerAction?: {
    icon: ComponentProps<typeof Feather>['name'];
    onPress: () => void;
    accessibilityLabel: string;
  };
  /**
   * Background color variant
   * @default 'bg'
   */
  backgroundVariant?: 'bg' | 'bg-elevated' | 'surface';
  /**
   * Optional list header content (above items)
   */
  listHeaderContent?: ReactNode;
  /**
   * Whether to use safe area insets
   * @default true
   */
  useSafeArea?: boolean;
}

/**
 * ListScreen template provides consistent layout for list-based screens.
 * Handles loading states, empty states, errors, and pull-to-refresh.
 *
 * @example
 * <ListScreen
 *   title="Notifications"
 *   data={notifications}
 *   renderItem={({ item }) => <NotificationItem item={item} />}
 *   keyExtractor={(item) => item.id}
 *   loading={loading}
 *   refreshing={refreshing}
 *   onRefresh={handleRefresh}
 *   emptyStateContent={{
 *     icon: 'bell-off',
 *     title: 'No notifications',
 *     description: 'You\'re all caught up!',
 *   }}
 * />
 */
export function ListScreen<T>({
  title,
  loading = false,
  refreshing = false,
  onRefresh,
  error,
  onRetry,
  isEmpty = false,
  emptyStateContent,
  headerAction,
  backgroundVariant = 'bg',
  listHeaderContent,
  useSafeArea = true,
  ...flatListProps
}: ListScreenProps<T>) {
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const backgroundColor = colors[backgroundVariant];

  // Loading State
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <ThemedLoadingSpinner size="large" text="Loading..." />
        </View>
      </ThemedView>
    );
  }

  // Error State
  if (error && onRetry) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <Feather name="alert-circle" size={48} color={colors['text-muted']} />
          <ThemedText type="title" style={styles.stateTitle}>
            Something went wrong
          </ThemedText>
          <ThemedText type="body" style={[styles.stateDescription, { color: colors['text-muted'] }]}>
            {error.message || 'An unexpected error occurred'}
          </ThemedText>
          <ThemedPressable onPress={onRetry} style={[styles.actionButton, { backgroundColor: colors.primary }]} accessibilityRole="button" accessibilityLabel="Try again">
            <ThemedText style={[styles.actionButtonText, { color: colors['on-primary'] }]}>Try Again</ThemedText>
          </ThemedPressable>
        </View>
      </ThemedView>
    );
  }

  // Empty State
  if (isEmpty && emptyStateContent) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          {emptyStateContent.icon && <Feather name={emptyStateContent.icon} size={48} color={colors['text-muted']} />}
          <ThemedText type="title" style={styles.stateTitle}>
            {emptyStateContent.title}
          </ThemedText>
          {emptyStateContent.description && (
            <ThemedText type="body" style={[styles.stateDescription, { color: colors['text-muted'] }]}>
              {emptyStateContent.description}
            </ThemedText>
          )}
          {emptyStateContent.actionLabel && emptyStateContent.onAction && (
            <ThemedPressable
              onPress={emptyStateContent.onAction}
              style={[styles.actionButton, { backgroundColor: colors.primary }]}
              accessibilityRole="button"
              accessibilityLabel={emptyStateContent.actionLabel}
            >
              <ThemedText style={[styles.actionButtonText, { color: colors['on-primary'] }]}>{emptyStateContent.actionLabel}</ThemedText>
            </ThemedPressable>
          )}
        </View>
      </ThemedView>
    );
  }

  // Header Component
  const renderHeader = () => (
    <>
      {(title || headerAction) && (
        <View
          style={[
            styles.header,
            {
              paddingTop: useSafeArea ? insets.top + Spacing.sm : Spacing.md,
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <ThemedText type="title">{title}</ThemedText>
          {headerAction && (
            <ThemedPressable onPress={headerAction.onPress} style={styles.headerButton} accessibilityRole="button" accessibilityLabel={headerAction.accessibilityLabel}>
              <Feather name={headerAction.icon} size={24} color={colors.text} />
            </ThemedPressable>
          )}
        </View>
      )}
      {listHeaderContent}
    </>
  );

  // List Screen with Data
  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <FlatList
        data={flatListProps.data || []}
        renderItem={flatListProps.renderItem}
        keyExtractor={flatListProps.keyExtractor}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={{
          paddingBottom: useSafeArea ? insets.bottom : Spacing.md,
        }}
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} colors={[colors.primary]} /> : undefined}
        showsVerticalScrollIndicator={false}
        {...flatListProps}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: Platform.select({ ios: 0.5, android: 1 }),
  },
  headerButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  stateTitle: {
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  stateDescription: {
    textAlign: 'center',
    lineHeight: 22,
  },
  actionButton: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: 8,
    marginTop: Spacing.md,
    minWidth: 120,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
