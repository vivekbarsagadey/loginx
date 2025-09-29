
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const set = (key: string, data: any) => {
  const entry: CacheEntry = {
    data,
    timestamp: Date.now(),
  };
  cache.set(key, entry);
};

export const get = (key: string): any | null => {
  const entry = cache.get(key);
  if (!entry) {
    return null;
  }

  const isExpired = Date.now() - entry.timestamp > CACHE_DURATION;
  if (isExpired) {
    cache.delete(key);
    return null;
  }

  return entry.data;
};
