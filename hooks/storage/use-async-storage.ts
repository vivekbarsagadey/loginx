import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";

export interface UseAsyncStorageOptions {
  cache?: boolean;
  ttl?: number;
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
}

export interface UseAsyncStorageReturn<T> {
  value: T;
  setValue: (value: T | ((prev: T) => T)) => Promise<void>;
  remove: () => Promise<void>;
  refresh: () => Promise<void>;
  loading: boolean;
  error: Error | null;
  isCached: boolean;
}

const cache = new Map<
  string,
  { value: unknown; timestamp: number; ttl: number }
>();

/**
 * Enhanced AsyncStorage hook with caching and TTL support.
 */
export function useAsyncStorage<T>(
  key: string,
  initialValue: T,
  options: UseAsyncStorageOptions = {}
): UseAsyncStorageReturn<T> {
  const {
    cache: useCache = true,
    ttl = 300000,
    serialize = JSON.stringify,
    deserialize = JSON.parse,
  } = options;

  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCached, setIsCached] = useState<boolean>(false);

  const getCachedValue = useCallback((): T | null => {
    if (!useCache) {return null;}

    const cached = cache.get(key);
    if (!cached) {return null;}

    const isExpired = Date.now() - cached.timestamp > cached.ttl;
    if (isExpired) {
      cache.delete(key);
      return null;
    }

    return cached.value as T;
  }, [key, useCache]);

  const setCachedValue = useCallback(
    (value: T) => {
      if (!useCache) {return;}
      cache.set(key, { value, timestamp: Date.now(), ttl });
    },
    [key, useCache, ttl]
  );

  const loadValue = useCallback(
    async (bypassCache = false) => {
      try {
        setLoading(true);
        setError(null);

        if (!bypassCache) {
          const cachedValue = getCachedValue();
          if (cachedValue !== null) {
            setStoredValue(cachedValue);
            setIsCached(true);
            setLoading(false);
            return;
          }
        }

        const item = await AsyncStorage.getItem(key);
        if (item !== null) {
          const parsed = deserialize(item) as T;
          setStoredValue(parsed);
          setCachedValue(parsed);
          setIsCached(false);
        }
      } catch (_error) {
        setError(
          _error instanceof Error ? _error : new Error("Failed to load from storage")
        );
      } finally {
        setLoading(false);
      }
    },
    [key, getCachedValue, setCachedValue, deserialize]
  );

  useEffect(() => {
    loadValue();
  }, [loadValue]);

  const setValue = useCallback(
    async (value: T | ((prev: T) => T)) => {
      try {
        setError(null);
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        setCachedValue(valueToStore);
        await AsyncStorage.setItem(key, serialize(valueToStore));
        setIsCached(true);
      } catch (_error) {
        setError(
          _error instanceof Error ? _error : new Error("Failed to save to storage")
        );
      }
    },
    [key, storedValue, serialize, setCachedValue]
  );

  const remove = useCallback(async () => {
    try {
      setError(null);
      setStoredValue(initialValue);
      cache.delete(key);
      setIsCached(false);
      await AsyncStorage.removeItem(key);
    } catch (_error) {
      setError(
        _error instanceof Error ? _error : new Error("Failed to remove from storage")
      );
    }
  }, [key, initialValue]);

  const refresh = useCallback(async () => {
    await loadValue(true);
  }, [loadValue]);

  return {
    value: storedValue,
    setValue,
    remove,
    refresh,
    loading,
    error,
    isCached,
  };
}
