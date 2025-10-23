import { useCallback, useState } from 'react';

/**
 * Return type for the useMap hook.
 */
export interface UseMapReturn<K, V> {
  /** Current Map instance */
  map: Map<K, V>;
  /** Set a key-value pair */
  set: (key: K, value: V) => void;
  /** Set multiple key-value pairs */
  setAll: (entries: [K, V][]) => void;
  /** Get value by key */
  get: (key: K) => V | undefined;
  /** Check if key exists */
  has: (key: K) => boolean;
  /** Remove entry by key */
  remove: (key: K) => void;
  /** Clear all entries */
  clear: () => void;
  /** Reset to initial state */
  reset: () => void;
  /** Get all keys as array */
  keys: () => K[];
  /** Get all values as array */
  values: () => V[];
  /** Get all entries as array */
  entries: () => [K, V][];
  /** Current size of the map */
  size: number;
}

/**
 * A hook for managing Map state with helpful methods.
 *
 * This hook provides a reactive way to work with JavaScript Map data structure,
 * useful for key-value storage, caching, and lookup tables.
 *
 * @param initialMap - Initial entries as array of [key, value] tuples
 * @returns Map state and manipulation functions
 *
 * @example
 * ```typescript
 * // Basic Map usage
 * function UserCache() {
 *   const { map, set, get, has, remove } = useMap<string, User>([]);
 *
 *   const fetchUser = async (userId: string) => {
 *     if (has(userId)) {
 *       return get(userId);
 *     }
 *     const user = await api.getUser(userId);
 *     set(userId, user);
 *     return user;
 *   };
 *
 *   return (
 *     <View>
 *       <Text>Cached Users: {map.size}</Text>
 *       <Button onPress={() => remove('user-123')}>Remove User</Button>
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Form field validation
 * function FormValidator() {
 *   const { map, set, has, entries } = useMap<string, string>([]);
 *
 *   const setError = (field: string, _error: string) => {
 *     set(field, _error);
 *   };
 *
 *   const hasErrors = entries().length > 0;
 *
 *   return (
 *     <View>
 *       {entries().map(([field, _error]) => (
 *         <Text key={field}>{field}: {error}</Text>
 *       ))}
 *     </View>
 *   );
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Selection state
 * function MultiSelect() {
 *   const { has, set, remove, clear, size } = useMap<string, boolean>([]);
 *
 *   const toggleSelection = (id: string) => {
 *     if (has(id)) {
 *       remove(id);
 *     } else {
 *       set(id, true);
 *     }
 *   };
 *
 *   return (
 *     <View>
 *       <Text>Selected: {size}</Text>
 *       <Button onPress={clear}>Clear Selection</Button>
 *     </View>
 *   );
 * }
 * ```
 */
export function useMap<K, V>(initialMap: [K, V][] = []): UseMapReturn<K, V> {
  const [map, setMap] = useState<Map<K, V>>(new Map(initialMap));

  const set = useCallback((key: K, value: V) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.set(key, value);
      return newMap;
    });
  }, []);

  const setAll = useCallback((entries: [K, V][]) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      entries.forEach(([key, value]) => {
        newMap.set(key, value);
      });
      return newMap;
    });
  }, []);

  const get = useCallback(
    (key: K): V | undefined => {
      return map.get(key);
    },
    [map]
  );

  const has = useCallback(
    (key: K): boolean => {
      return map.has(key);
    },
    [map]
  );

  const remove = useCallback((key: K) => {
    setMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(key);
      return newMap;
    });
  }, []);

  const clear = useCallback(() => {
    setMap(new Map());
  }, []);

  const reset = useCallback(() => {
    setMap(new Map(initialMap));
  }, [initialMap]);

  const keys = useCallback((): K[] => {
    return Array.from(map.keys());
  }, [map]);

  const values = useCallback((): V[] => {
    return Array.from(map.values());
  }, [map]);

  const entries = useCallback((): [K, V][] => {
    return Array.from(map.entries());
  }, [map]);

  return {
    map,
    set,
    setAll,
    get,
    has,
    remove,
    clear,
    reset,
    keys,
    values,
    entries,
    size: map.size,
  };
}
