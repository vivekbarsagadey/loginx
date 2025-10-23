/**
 * Lifecycle & Performance Hooks
 *
 * This module exports hooks for component lifecycle and performance optimization:
 * - useDeepCallback - Callback with deep dependency comparison
 * - usePrevious - Track previous value
 * - useUpdateEffect - useEffect that skips initial mount
 * - useIsMounted - Track component mount status
 * - useBatchedState - Batch state updates
 * - useCallbackRef - Stable callback reference
 *
 * NOTE: useDebouncedCallback and useThrottledCallback have been moved to hooks/timing/
 */

export { useBatchedState, useCallbackRef, useDeepCallback, useIsMounted, usePrevious, useUpdateEffect } from './use-optimized-callback';
