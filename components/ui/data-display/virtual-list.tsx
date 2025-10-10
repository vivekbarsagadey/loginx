import { ThemedText } from '@/components/themed-text';
import { memo, useCallback, useMemo } from 'react';
import { FlatList, type FlatListProps, StyleSheet, View } from 'react-native';

/**
 * VirtualList Component
 * High-performance list component for rendering very long lists
 * Uses FlatList with all performance optimizations enabled
 *
 * Perfect for:
 * - Lists with 1000+ items
 * - Chat messages
 * - Feed items
 * - Search results
 */

interface VirtualListProps<T> extends Partial<FlatListProps<T>> {
  /** Array of data items */
  data: T[];
  /** Render function for each item */
  renderItem: (info: { item: T; index: number }) => React.ReactElement | null;
  /** Unique key extractor */
  keyExtractor: (item: T, index: number) => string;
  /** Estimated item height (for better performance) */
  estimatedItemHeight?: number;
  /** Enable loading indicator at bottom */
  loading?: boolean;
  /** Called when user scrolls near bottom */
  onEndReached?: () => void;
  /** Threshold for onEndReached (0-1) */
  onEndReachedThreshold?: number;
  /** Empty state component */
  ListEmptyComponent?: React.ComponentType | React.ReactElement | null;
  /** Header component */
  ListHeaderComponent?: React.ComponentType | React.ReactElement | null;
  /** Footer component */
  ListFooterComponent?: React.ComponentType | React.ReactElement | null;
}

function VirtualListComponent<T>({
  data,
  renderItem,
  keyExtractor,
  estimatedItemHeight = 60,
  loading = false,
  onEndReached,
  onEndReachedThreshold = 0.5,
  ListEmptyComponent,
  ListHeaderComponent,
  ListFooterComponent,
  ...otherProps
}: VirtualListProps<T>) {
  // Memoize getItemLayout for maximum performance
  const getItemLayout = useCallback(
    (_data: ArrayLike<T> | null | undefined, index: number) => ({
      length: estimatedItemHeight,
      offset: estimatedItemHeight * index,
      index,
    }),
    [estimatedItemHeight]
  );

  // Memoize renderItem wrapper
  const memoizedRenderItem = useCallback((info: { item: T; index: number }) => renderItem(info), [renderItem]);

  // Default empty component
  const defaultEmptyComponent = useMemo(
    () => (
      <View style={styles.emptyContainer}>
        <ThemedText type="caption" style={styles.emptyText}>
          No items to display
        </ThemedText>
      </View>
    ),
    []
  );

  // Loading footer
  const loadingFooter = useMemo(
    () =>
      loading ? (
        <View style={styles.loadingFooter}>
          <ThemedText type="caption">Loading more...</ThemedText>
        </View>
      ) : ListFooterComponent ? (
        <>{ListFooterComponent}</>
      ) : null,
    [loading, ListFooterComponent]
  );

  return (
    <FlatList
      // Data props
      data={data}
      renderItem={memoizedRenderItem}
      keyExtractor={keyExtractor}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      windowSize={5}
      initialNumToRender={10}
      getItemLayout={getItemLayout}
      updateCellsBatchingPeriod={50}
      // Infinite scroll
      onEndReached={onEndReached}
      onEndReachedThreshold={onEndReachedThreshold}
      // Components
      ListEmptyComponent={ListEmptyComponent || defaultEmptyComponent}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={loadingFooter}
      // Additional props
      {...otherProps}
    />
  );
}

// Export memoized component
export const VirtualList = memo(VirtualListComponent) as typeof VirtualListComponent;

const styles = StyleSheet.create({
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    opacity: 0.6,
  },
  loadingFooter: {
    padding: 16,
    alignItems: 'center',
  },
});
