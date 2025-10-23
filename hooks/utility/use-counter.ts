import { useCallback, useState } from "react";

/**
 * Configuration options for the counter hook.
 */
export interface UseCounterOptions {
  /** Minimum allowed value (inclusive) */
  min?: number;
  /** Maximum allowed value (inclusive) */
  max?: number;
  /** Amount to increment/decrement by (default: 1) */
  step?: number;
}

/**
 * Return type for the useCounter hook.
 */
export interface UseCounterReturn {
  /** Current counter value */
  count: number;
  /** Increment the counter by step amount */
  increment: () => void;
  /** Decrement the counter by step amount */
  decrement: () => void;
  /** Set counter to a specific value (respects min/max bounds) */
  set: (value: number) => void;
  /** Reset counter to initial value */
  reset: () => void;
  /** Check if counter is at minimum bound */
  isMin: boolean;
  /** Check if counter is at maximum bound */
  isMax: boolean;
}

/**
 * A hook for managing counter state with optional min/max bounds.
 * 
 * This hook provides a simple way to manage numeric counters with
 * increment, decrement, and reset functionality. Optionally enforce
 * minimum and maximum bounds.
 * 
 * @param initialValue - The initial counter value
 * @param options - Configuration options (min, max, step)
 * @returns Counter state and control functions
 * 
 * @example
 * ```typescript
 * // Basic counter
 * function BasicCounter() {
 *   const { count, increment, decrement, reset } = useCounter(0);
 * 
 *   return (
 *     <>
 *       <Text>Count: {count}</Text>
 *       <Button onPress={increment}>+</Button>
 *       <Button onPress={decrement}>-</Button>
 *       <Button onPress={reset}>Reset</Button>
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Counter with bounds
 * function BoundedCounter() {
 *   const { count, increment, decrement, isMin, isMax } = useCounter(5, {
 *     min: 1,
 *     max: 10,
 *     step: 1
 *   });
 * 
 *   return (
 *     <>
 *       <Text>Quantity: {count}</Text>
 *       <Button onPress={decrement} disabled={isMin}>-</Button>
 *       <Button onPress={increment} disabled={isMax}>+</Button>
 *     </>
 *   );
 * }
 * ```
 * 
 * @example
 * ```typescript
 * // Cart quantity selector
 * function CartItem() {
 *   const { count, increment, decrement, set } = useCounter(1, {
 *     min: 1,
 *     max: 99
 *   });
 * 
 *   return (
 *     <View>
 *       <Button onPress={decrement}>-</Button>
 *       <TextInput value={String(count)} onChangeText={(v) => set(Number(v))} />
 *       <Button onPress={increment}>+</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useCounter(
  initialValue = 0,
  options: UseCounterOptions = {}
): UseCounterReturn {
  const { min, max, step = 1 } = options;

  // Ensure initial value respects bounds
  const clamp = useCallback(
    (value: number): number => {
      if (min !== undefined && value < min) {return min;}
      if (max !== undefined && value > max) {return max;}
      return value;
    },
    [min, max]
  );

  const [count, setCount] = useState<number>(clamp(initialValue));

  const increment = useCallback(() => {
    setCount((prev) => clamp(prev + step));
  }, [step, clamp]);

  const decrement = useCallback(() => {
    setCount((prev) => clamp(prev - step));
  }, [step, clamp]);

  const set = useCallback(
    (value: number) => {
      setCount(clamp(value));
    },
    [clamp]
  );

  const reset = useCallback(() => {
    setCount(clamp(initialValue));
  }, [initialValue, clamp]);

  const isMin = min !== undefined && count <= min;
  const isMax = max !== undefined && count >= max;

  return {
    count,
    increment,
    decrement,
    set,
    reset,
    isMin,
    isMax,
  };
}
