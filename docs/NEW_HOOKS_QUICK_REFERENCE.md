# New Hooks Quick Reference

Quick reference guide for the 7 new hooks added in Phase 2 & 3.

---

## State Management Hooks

### `useToggle`
```typescript
import { useToggle } from '@/hooks';

const [isOpen, toggle, setIsOpen] = useToggle(false);

// Usage
<Button onPress={toggle}>Toggle</Button>
<Button onPress={() => setIsOpen(true)}>Open</Button>
```

### `useCounter`
```typescript
import { useCounter } from '@/hooks';

const { count, increment, decrement, isMin, isMax } = useCounter(1, {
  min: 1,
  max: 99,
  step: 1
});

// Usage
<Button onPress={decrement} disabled={isMin}>-</Button>
<Text>{count}</Text>
<Button onPress={increment} disabled={isMax}>+</Button>
```

### `useList`
```typescript
import { useList } from '@/hooks';

const { list, push, removeAt, clear, filter, sort } = useList<Item>([]);

// Usage
push(newItem);
removeAt(index);
filter(item => item.active);
sort((a, b) => a.name.localeCompare(b.name));
```

### `useMap`
```typescript
import { useMap } from '@/hooks';

const { map, set, get, has, remove, size } = useMap<string, User>([]);

// Usage
set('user-123', userData);
const user = get('user-123');
if (has('user-123')) { /* ... */ }
remove('user-123');
```

---

## Storage Hooks

### `useLocalStorage`
```typescript
import { useLocalStorage } from '@/hooks';

const [theme, setTheme, removeTheme, loading, error] = useLocalStorage(
  'user-theme',
  'light'
);

// Usage
if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;

<Button onPress={() => setTheme('dark')}>Dark Mode</Button>
<Button onPress={removeTheme}>Reset</Button>
```

### `useSecureStorage`
```typescript
import { useSecureStorage } from '@/hooks';

const [token, setToken, removeToken, loading, error] = useSecureStorage(
  'auth-token',
  ''
);

// Usage
await setToken(authToken);
await removeToken(); // Logout
```

### `useAsyncStorage`
```typescript
import { useAsyncStorage } from '@/hooks';

const { value, setValue, remove, refresh, loading, isCached } = useAsyncStorage(
  'user-profile',
  { name: '', email: '' },
  { cache: true, ttl: 300000 } // 5 minutes
);

// Usage
await setValue({ name: 'John', email: 'john@example.com' });
await refresh(); // Bypass cache
<Text>Cached: {isCached ? 'Yes' : 'No'}</Text>
```

---

## Import Styles

### Category-based (Recommended)
```typescript
import { useToggle, useCounter, useList, useMap } from '@/hooks/utility';
import { useLocalStorage, useSecureStorage, useAsyncStorage } from '@/hooks/storage';
```

### Main Export
```typescript
import { useToggle, useCounter, useLocalStorage } from '@/hooks';
```

### Individual
```typescript
import { useToggle } from '@/hooks/utility/use-toggle';
import { useLocalStorage } from '@/hooks/storage/use-local-storage';
```

---

## Common Patterns

### Modal/Dialog Toggle
```typescript
const [isModalOpen, toggleModal] = useToggle(false);

<Button onPress={toggleModal}>Open Modal</Button>
{isModalOpen && <Modal onClose={toggleModal} />}
```

### Shopping Cart
```typescript
const { list: cart, push, removeAt, clear } = useList<CartItem>([]);
const { count: quantity, increment, decrement } = useCounter(1, { min: 1, max: 99 });

// Add to cart
push({ id, name, price, quantity: count });
```

### Form Validation Errors
```typescript
const { map: errors, set: setError, has: hasError, clear: clearErrors } = 
  useMap<string, string>([]);

// Set error
setError('email', 'Invalid email address');

// Check for errors
if (hasError('email')) { /* ... */ }

// Clear all errors
clearErrors();
```

### User Selection State
```typescript
const { map: selected, has, set, remove, size } = useMap<string, boolean>([]);

const toggleSelection = (id: string) => {
  if (has(id)) {
    remove(id);
  } else {
    set(id, true);
  }
};

<Text>Selected: {size}</Text>
```

### Persistent User Preferences
```typescript
const [settings, setSettings, , loading] = useLocalStorage('app-settings', {
  notifications: true,
  darkMode: false,
  language: 'en'
});

if (loading) return <LoadingSpinner />;

const updateNotifications = (enabled: boolean) => {
  setSettings({ ...settings, notifications: enabled });
};
```

### Secure Token Management
```typescript
const [authToken, setAuthToken, clearAuthToken] = useSecureStorage('auth-token', '');

// After login
await setAuthToken(response.token);

// On logout
await clearAuthToken();
```

### Cached API Data
```typescript
const { value: userData, refresh, isCached, loading } = useAsyncStorage(
  'user-data',
  null,
  { cache: true, ttl: 600000 } // 10 minutes
);

// Force refresh
<Button onPress={refresh} disabled={loading}>
  {loading ? 'Refreshing...' : 'Refresh Data'}
</Button>

<Text>{isCached ? '⚡ From cache' : '🌐 From storage'}</Text>
```

---

## TypeScript Tips

### Generic Types
```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

const { list: users } = useList<User>([]);
const { map: userMap } = useMap<string, User>([]);
const [currentUser, setCurrentUser] = useLocalStorage<User | null>('current-user', null);
```

### Custom Interfaces
```typescript
interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const { list: cart, push, updateAt } = useList<CartItem>([]);
```

---

## Performance Tips

1. **useToggle**: Use for simple boolean states - more efficient than `useState`
2. **useCounter**: Bounds checking is built-in - no need for custom validation
3. **useList**: Methods are memoized - safe to pass to child components
4. **useMap**: Faster lookups than array.find() for key-value data
5. **useLocalStorage**: Auto-persists on every change - debounce frequent updates
6. **useSecureStorage**: Use only for sensitive data - slower than AsyncStorage
7. **useAsyncStorage**: Enable caching for frequently accessed data

---

## Troubleshooting

### Hook not found?
```typescript
// ❌ Wrong
import { useToggle } from '@/hooks/use-toggle';

// ✅ Correct
import { useToggle } from '@/hooks';
// or
import { useToggle } from '@/hooks/utility';
```

### Storage hook returns empty?
Wait for loading state to complete:
```typescript
const [value, setValue, remove, loading] = useLocalStorage('key', defaultValue);

if (loading) {
  return <LoadingSpinner />;
}

// Now safe to use value
```

### Cache not working in useAsyncStorage?
Check that cache is enabled:
```typescript
const { value } = useAsyncStorage('key', defaultValue, {
  cache: true, // Must be true
  ttl: 300000  // Optional: 5 minutes
});
```

---

**Last Updated**: October 19, 2025  
**See Also**: `docs/PHASE_2_3_COMPLETION_SUMMARY.md`
