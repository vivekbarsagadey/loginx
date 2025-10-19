/**
 * Lifecycle & Performance Hooks
 * 
 * This module exports hooks for component lifecycle and performance optimization:
 * - useDeepCallback - Callback with deep dependency comparison
 * - useDebouncedCallback - Debounced callback execution
 * - useThrottledCallback - Throttled callback execution
 * - usePrevious - Track previous value
 * - useUpdateEffect - useEffect that skips initial mount
 * - useIsMounted - Track component mount status
 * - useBatchedState - Batch state updates
 * - useCallbackRef - Stable callback reference
 */

export * from './use-optimized-callback';
