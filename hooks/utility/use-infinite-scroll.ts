/**
 * Infinite scroll hook for pagination
 * Provides infinite scrolling functionality for lists with automatic loading
 */

import { useCallback, useEffect, useState } from 'react';

export interface UseInfiniteScrollOptions<T> {
  /** Function to fetch items for a given page */
  fetchFn: (page: number, pageSize: number) => Promise<T[]>;
  /** Number of items per page */
  pageSize?: number;
  /** Initial page number (default: 1) */
  initialPage?: number;
  /** Whether to fetch initial page on mount (default: true) */
  fetchOnMount?: boolean;
  /** Threshold for triggering load more (0-1, where 1 is at the bottom) */
  threshold?: number;
  /** Callback when all items are loaded */
  onComplete?: () => void;
  /** Callback on error */
  onError?: (_error: unknown) => void;
}

export interface UseInfiniteScrollReturn<T> {
  /** All loaded items */
  items: T[];
  /** Whether initial load is in progress */
  isLoading: boolean;
  /** Whether loading more items */
  isLoadingMore: boolean;
  /** Whether there are more items to load */
  hasMore: boolean;
  /** Current page number */
  currentPage: number;
  /** Load more items */
  loadMore: () => Promise<void>;
  /** Refresh - reset to first page */
  refresh: () => Promise<void>;
  /** Error if any occurred */
  error: unknown | null;
  /** Retry after error */
  retry: () => Promise<void>;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Custom hook for infinite scrolling with pagination
 *
 * @param options - Infinite scroll configuration options
 * @returns Infinite scroll state and handlers
 *
 * @example
 * ```tsx
 * // Basic usage
 * const { items, isLoading, hasMore, loadMore } = useInfiniteScroll({
 *   fetchFn: async (page, pageSize) => {
 *     const response = await fetch(`/api/items?page=${page}&size=${pageSize}`);
 *     return response.json();
 *   },
 *   pageSize: 20
 * });
 *
 * // In your component
 * <FlatList
 *   data={items}
 *   renderItem={({ item }) => <ItemComponent item={item} />}
 *   onEndReached={loadMore}
 *   onEndReachedThreshold={0.5}
 *   ListFooterComponent={isLoadingMore ? <Loader /> : null}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With refresh support
 * const { items, isLoading, refresh, loadMore } = useInfiniteScroll({
 *   fetchFn: fetchNotifications,
 *   pageSize: 15,
 *   onError: (error) => showError(error)
 * });
 *
 * <FlatList
 *   data={items}
 *   onRefresh={refresh}
 *   refreshing={isLoading}
 *   onEndReached={loadMore}
 * />
 * ```
 */
export function useInfiniteScroll<T>(
  options: UseInfiniteScrollOptions<T>
): UseInfiniteScrollReturn<T> {
  const {
    fetchFn,
    pageSize = 20,
    initialPage = 1,
    fetchOnMount = true,
    onComplete,
    onError,
  } = options;

  const [items, setItems] = useState<T[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<unknown | null>(null);

  /**
   * Fetch items for a specific page
   */
  const fetchPage = useCallback(
    async (page: number, append = false) => {
      try {
        setError(null);

        if (append) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        const newItems = await fetchFn(page, pageSize);

        // If we got fewer items than pageSize, we've reached the end
        if (newItems.length < pageSize) {
          setHasMore(false);
          if (onComplete) {
            onComplete();
          }
        }

        if (append) {
          setItems((prev) => [...prev, ...newItems]);
        } else {
          setItems(newItems);
        }

        setCurrentPage(page);
      } catch (_error) {
        setError(_error);
        if (onError) {
          onError(_error);
        }
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [fetchFn, pageSize, onComplete, onError]
  );

  /**
   * Load more items (next page)
   */
  const loadMore = useCallback(async () => {
    // Don't load if already loading or no more items
    if (isLoading || isLoadingMore || !hasMore) {
      return;
    }

    await fetchPage(currentPage + 1, true);
  }, [isLoading, isLoadingMore, hasMore, currentPage, fetchPage]);

  /**
   * Refresh - reset to first page
   */
  const refresh = useCallback(async () => {
    setHasMore(true);
    setError(null);
    await fetchPage(initialPage, false);
  }, [fetchPage, initialPage]);

  /**
   * Retry after error
   */
  const retry = useCallback(async () => {
    await fetchPage(currentPage, false);
  }, [currentPage, fetchPage]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setItems([]);
    setCurrentPage(initialPage);
    setHasMore(true);
    setError(null);
    setIsLoading(false);
    setIsLoadingMore(false);
  }, [initialPage]);

  /**
   * Fetch initial page on mount if enabled
   */
  useEffect(() => {
    if (fetchOnMount) {
      fetchPage(initialPage, false);
    }
  }, []); // Only run on mount

  return {
    items,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    loadMore,
    refresh,
    error,
    retry,
    reset,
  };
}
