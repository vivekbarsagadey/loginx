import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/layout';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import type { ComponentProps, ReactNode } from 'react';
import { ActivityIndicator, FlatList, type FlatListProps, Platform, Pressable, RefreshControl, StyleSheet, View } from 'react-native';
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
  const backgroundColor = useThemeColor({}, backgroundVariant);
  const surfaceColor = useThemeColor({}, 'surface');
  const textColor = useThemeColor({}, 'text');
  const textMutedColor = useThemeColor({}, 'text-muted');
  const borderColor = useThemeColor({}, 'border');
  const primaryColor = useThemeColor({}, 'primary');

  // Loading State
  if (loading && !refreshing) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <ActivityIndicator size="large" color={primaryColor} />
          <ThemedText type="body" style={{ color: textMutedColor, marginTop: Spacing.md }}>
            Loading...
          </ThemedText>
        </View>
      </ThemedView>
    );
  }

  // Error State
  if (error && onRetry) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          <Feather name="alert-circle" size={48} color={textMutedColor} />
          <ThemedText type="title" style={styles.stateTitle}>
            Something went wrong
          </ThemedText>
          <ThemedText type="body" style={[styles.stateDescription, { color: textMutedColor }]}>
            {error.message || 'An unexpected error occurred'}
          </ThemedText>
          <Pressable onPress={onRetry} style={[styles.actionButton, { backgroundColor: primaryColor }]} accessibilityRole="button" accessibilityLabel="Try again">
            <ThemedText style={styles.actionButtonText}>Try Again</ThemedText>
          </Pressable>
        </View>
      </ThemedView>
    );
  }

  // Empty State
  if (isEmpty && emptyStateContent) {
    return (
      <ThemedView style={[styles.container, { backgroundColor }]}>
        <View style={styles.centerContent}>
          {emptyStateContent.icon && <Feather name={emptyStateContent.icon} size={48} color={textMutedColor} />}
          <ThemedText type="title" style={styles.stateTitle}>
            {emptyStateContent.title}
          </ThemedText>
          {emptyStateContent.description && (
            <ThemedText type="body" style={[styles.stateDescription, { color: textMutedColor }]}>
              {emptyStateContent.description}
            </ThemedText>
          )}
          {emptyStateContent.actionLabel && emptyStateContent.onAction && (
            <Pressable
              onPress={emptyStateContent.onAction}
              style={[styles.actionButton, { backgroundColor: primaryColor }]}
              accessibilityRole="button"
              accessibilityLabel={emptyStateContent.actionLabel}
            >
              <ThemedText style={styles.actionButtonText}>{emptyStateContent.actionLabel}</ThemedText>
            </Pressable>
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
              backgroundColor: surfaceColor,
              borderBottomColor: borderColor,
            },
          ]}
        >
          <ThemedText type="title">{title}</ThemedText>
          {headerAction && (
            <Pressable onPress={headerAction.onPress} style={styles.headerButton} accessibilityRole="button" accessibilityLabel={headerAction.accessibilityLabel}>
              <Feather name={headerAction.icon} size={24} color={textColor} />
            </Pressable>
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
        refreshControl={onRefresh ? <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={primaryColor} colors={[primaryColor]} /> : undefined}
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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
