/**
 * Search hook with debouncing and filtering
 * Provides comprehensive search functionality with performance optimization
 */

import { useDebouncedCallback } from '../timing/use-debounced-callback';
import { useCallback, useEffect, useState } from 'react';

export interface UseSearchOptions<T> {
  /** Data to search through */
  data: T[];
  /** Filter function that returns true if item matches query */
  filterFn: (item: T, query: string) => boolean;
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
  /** Initial search query */
  initialQuery?: string;
  /** Minimum query length to trigger search (default: 0) */
  minQueryLength?: number;
  /** Transform query before filtering (e.g., toLowerCase) */
  transformQuery?: (query: string) => string;
  /** Sort results after filtering */
  sortFn?: (a: T, b: T) => number;
  /** Maximum number of results to return */
  maxResults?: number;
}

export interface UseSearchReturn<T> {
  /** Current search query */
  query: string;
  /** Filtered and sorted search results */
  results: T[];
  /** Whether search is in progress (debouncing) */
  isSearching: boolean;
  /** Number of results found */
  resultCount: number;
  /** Whether query meets minimum length requirement */
  hasMinLength: boolean;
  /** Set search query (will trigger debounced search) */
  setQuery: (query: string) => void;
  /** Clear search query and results */
  clear: () => void;
  /** Manually trigger search with current query */
  search: () => void;
}

/**
 * Custom hook for search functionality with debouncing and filtering
 *
 * @param options - Search configuration options
 * @returns Search state and handlers
 *
 * @example
 * ```tsx
 * // Simple text search
 * const { query, results, setQuery, clear } = useSearch({
 *   data: users,
 *   filterFn: (user, query) =>
 *     user.name.toLowerCase().includes(query.toLowerCase()) ||
 *     user.email.toLowerCase().includes(query.toLowerCase()),
 *   debounceMs: 300
 * });
 *
 * // In your component
 * <TextInput
 *   value={query}
 *   onChangeText={setQuery}
 *   placeholder="Search users..."
 * />
 * <FlatList
 *   data={results}
 *   renderItem={({ item }) => <UserItem user={item} />}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Advanced search with transformation and sorting
 * const { query, results, resultCount } = useSearch({
 *   data: products,
 *   filterFn: (product, query) =>
 *     product.name.includes(query) ||
 *     product.category.includes(query),
 *   transformQuery: (q) => q.toLowerCase().trim(),
 *   sortFn: (a, b) => a.name.localeCompare(b.name),
 *   minQueryLength: 2,
 *   maxResults: 50
 * });
 * ```
 */
export function useSearch<T>(options: UseSearchOptions<T>): UseSearchReturn<T> {
  const {
    data,
    filterFn,
    debounceMs = 300,
    initialQuery = '',
    minQueryLength = 0,
    transformQuery,
    sortFn,
    maxResults,
  } = options;

  const [query, setQueryState] = useState(initialQuery);
  const [results, setResults] = useState<T[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * Perform the actual search
   */
  const performSearch = useCallback(
    (searchQuery: string) => {
      setIsSearching(true);

      try {
        // Transform query if transformer provided
        const transformedQuery = transformQuery
          ? transformQuery(searchQuery)
          : searchQuery;

        // Check minimum length requirement
        if (transformedQuery.length < minQueryLength) {
          setResults([]);
          return;
        }

        // Filter data
        let filtered = data.filter((item) => filterFn(item, transformedQuery));

        // Sort if sort function provided
        if (sortFn) {
          filtered = filtered.sort(sortFn);
        }

        // Limit results if maxResults specified
        if (maxResults && filtered.length > maxResults) {
          filtered = filtered.slice(0, maxResults);
        }

        setResults(filtered);
      } finally {
        setIsSearching(false);
      }
    },
    [data, filterFn, transformQuery, minQueryLength, sortFn, maxResults]
  );

  /**
   * Debounced search function
   */
  const debouncedSearch = useDebouncedCallback(performSearch, debounceMs);

  /**
   * Set query and trigger debounced search
   */
  const setQuery = useCallback(
    (newQuery: string) => {
      setQueryState(newQuery);
      setIsSearching(true);

      if (newQuery.trim() === '') {
        setResults([]);
        setIsSearching(false);
        return;
      }

      debouncedSearch(newQuery);
    },
    [debouncedSearch]
  );

  /**
   * Clear search query and results
   */
  const clear = useCallback(() => {
    setQueryState('');
    setResults([]);
    setIsSearching(false);
  }, []);

  /**
   * Manually trigger search with current query
   */
  const search = useCallback(() => {
    if (query) {
      performSearch(query);
    }
  }, [query, performSearch]);

  /**
   * Perform initial search if initial query provided
   */
  useEffect(() => {
    if (initialQuery) {
      performSearch(initialQuery);
    }
  }, []); // Only run on mount

  /**
   * Update results when data changes
   */
  useEffect(() => {
    if (query) {
      performSearch(query);
    }
  }, [data, performSearch]); // Re-search when data changes

  const hasMinLength = (transformQuery ? transformQuery(query) : query).length >= minQueryLength;

  return {
    query,
    results,
    isSearching,
    resultCount: results.length,
    hasMinLength,
    setQuery,
    clear,
    search,
  };
}
