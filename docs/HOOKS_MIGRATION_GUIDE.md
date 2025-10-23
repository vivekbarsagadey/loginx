# LoginX Hooks Migration Guide

## Overview

This guide provides step-by-step instructions for migrating existing code to use LoginX's custom hooks library. It covers common migration scenarios, code examples, and troubleshooting tips.

## Table of Contents

- [Before You Start](#before-you-start)
- [Migration Scenarios](#migration-scenarios)
- [Step-by-Step Migrations](#step-by-step-migrations)
- [Testing After Migration](#testing-after-migration)
- [Common Migration Challenges](#common-migration-challenges)
- [Rollback Procedures](#rollback-procedures)

## Before You Start

### Prerequisites

1. **Understand the current code**: Read through the component/file you're migrating
2. **Review hook documentation**: Familiarize yourself with the hooks you'll use
3. **Set up testing**: Ensure tests exist or create them before migrating
4. **Create a branch**: Always work in a feature branch for migrations

### Migration Strategy

Follow this order for safest migration:

1. **Phase 1**: Simple utility hooks (useToggle, useTimeout)
2. **Phase 2**: Timing hooks (useDebounce, useInterval)
3. **Phase 3**: State management hooks (useList, useMap, useCounter)
4. **Phase 4**: Complex hooks (useForm, useAsyncOperation)
5. **Phase 5**: Context hooks (useAuth, useTheme, useNetwork)

## Migration Scenarios

### Scenario 1: Boolean State → useToggle

**Before:**
```typescript
const [isModalOpen, setIsModalOpen] = useState(false);

const openModal = () => setIsModalOpen(true);
const closeModal = () => setIsModalOpen(false);
const toggleModal = () => setIsModalOpen(!isModalOpen);

return (
  <View>
    <Button onPress={openModal}>Open</Button>
    <Button onPress={closeModal}>Close</Button>
    <Button onPress={toggleModal}>Toggle</Button>
    <Modal visible={isModalOpen} onClose={closeModal}>
      {/* Modal content */}
    </Modal>
  </View>
);
```

**After:**
```typescript
const [isModalOpen, toggleModal, setIsModalOpen] = useToggle(false);

return (
  <View>
    <Button onPress={() => setIsModalOpen(true)}>Open</Button>
    <Button onPress={() => setIsModalOpen(false)}>Close</Button>
    <Button onPress={toggleModal}>Toggle</Button>
    <Modal visible={isModalOpen} onClose={toggleModal}>
      {/* Modal content */}
    </Modal>
  </View>
);
```

**Benefits:**
- ✅ Less boilerplate code
- ✅ Consistent toggle pattern
- ✅ Memoized toggle function

### Scenario 2: setTimeout → useTimeout

**Before:**
```typescript
const [showMessage, setShowMessage] = useState(false);

useEffect(() => {
  const timer = setTimeout(() => {
    setShowMessage(true);
  }, 3000);
  
  return () => clearTimeout(timer);
}, []);

const handleReset = () => {
  setShowMessage(false);
  const timer = setTimeout(() => {
    setShowMessage(true);
  }, 3000);
};
```

**After:**
```typescript
const [showMessage, setShowMessage] = useState(false);

const { start, cancel } = useTimeout(
  () => setShowMessage(true),
  3000
);

const handleReset = () => {
  setShowMessage(false);
  cancel();
  start();
};
```

**Benefits:**
- ✅ Automatic cleanup
- ✅ Declarative API
- ✅ Easy to control (start, cancel, reset)

### Scenario 3: setInterval → useInterval

**Before:**
```typescript
const [countdown, setCountdown] = useState(60);

useEffect(() => {
  const interval = setInterval(() => {
    setCountdown((prev) => {
      if (prev <= 1) {
        clearInterval(interval);
        return 0;
      }
      return prev - 1;
    });
  }, 1000);
  
  return () => clearInterval(interval);
}, []);
```

**After:**
```typescript
const [countdown, setCountdown] = useState(60);

useInterval(
  () => {
    setCountdown((prev) => Math.max(0, prev - 1));
  },
  countdown > 0 ? 1000 : null // Stop when countdown reaches 0
);
```

**Benefits:**
- ✅ Automatic cleanup
- ✅ Easy to pause/resume (pass null delay)
- ✅ Less boilerplate

### Scenario 4: Debounced Search → useDebouncedCallback

**Before:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);

useEffect(() => {
  const timer = setTimeout(() => {
    if (searchQuery) {
      searchAPI(searchQuery).then(setSearchResults);
    }
  }, 500);
  
  return () => clearTimeout(timer);
}, [searchQuery]);

const handleSearchChange = (text: string) => {
  setSearchQuery(text);
};
```

**After:**
```typescript
const [searchQuery, setSearchQuery] = useState('');
const [searchResults, setSearchResults] = useState([]);

const debouncedSearch = useDebouncedCallback(
  async (query: string) => {
    if (query) {
      const results = await searchAPI(query);
      setSearchResults(results);
    }
  },
  500
);

const handleSearchChange = (text: string) => {
  setSearchQuery(text);
  debouncedSearch(text);
};
```

**Benefits:**
- ✅ Cleaner separation of concerns
- ✅ Reusable debounced function
- ✅ Automatic cleanup

### Scenario 5: Array State → useList

**Before:**
```typescript
const [items, setItems] = useState<Item[]>([]);

const addItem = (item: Item) => {
  setItems([...items, item]);
};

const removeItem = (id: string) => {
  setItems(items.filter(item => item.id !== id));
};

const updateItem = (id: string, updates: Partial<Item>) => {
  setItems(items.map(item => 
    item.id === id ? { ...item, ...updates } : item
  ));
};

const clearItems = () => {
  setItems([]);
};
```

**After:**
```typescript
const [items, { push, remove, update, clear }] = useList<Item>([]);

// Usage:
push(newItem);
remove(itemId);
update(itemId, updates);
clear();
```

**Benefits:**
- ✅ Built-in array operations
- ✅ Immutability handled automatically
- ✅ Less boilerplate code

### Scenario 6: Counter State → useCounter

**Before:**
```typescript
const [count, setCount] = useState(0);

const increment = () => setCount(prev => Math.min(prev + 1, 100));
const decrement = () => setCount(prev => Math.max(prev - 1, 0));
const reset = () => setCount(0);
const set = (value: number) => {
  if (value >= 0 && value <= 100) {
    setCount(value);
  }
};
```

**After:**
```typescript
const [count, { increment, decrement, reset, set }] = useCounter(0, {
  min: 0,
  max: 100,
});
```

**Benefits:**
- ✅ Built-in min/max constraints
- ✅ All counter operations included
- ✅ Less error-prone

### Scenario 7: Async Operation → useAsyncOperation

**Before:**
```typescript
const [data, setData] = useState<User | null>(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

const fetchUser = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const response = await api.getUser(userId);
    setData(response.data);
  } catch (err) {
    setError(err as Error);
    showToast('Failed to load user');
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchUser();
}, [userId]);
```

**After:**
```typescript
const { data, loading, error, execute } = useAsyncOperation(
  async () => {
    const response = await api.getUser(userId);
    return response.data;
  },
  {
    onSuccess: (data) => {
      // Optional success handler
    },
    onError: (error) => {
      showToast('Failed to load user');
    },
  }
);

useEffect(() => {
  execute();
}, [userId, execute]);
```

**Benefits:**
- ✅ Standardized error handling
- ✅ Loading state managed automatically
- ✅ Success/error callbacks
- ✅ Retry logic (if configured)

### Scenario 8: Form Handling → useForm

**Before:**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [errors, setErrors] = useState<Record<string, string>>({});
const [touched, setTouched] = useState<Record<string, boolean>>({});
const [isSubmitting, setIsSubmitting] = useState(false);

const validate = () => {
  const newErrors: Record<string, string> = {};
  
  if (!email) {
    newErrors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    newErrors.email = 'Invalid email address';
  }
  
  if (!password) {
    newErrors.password = 'Password is required';
  } else if (password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;
  
  setIsSubmitting(true);
  try {
    await login(email, password);
  } catch (error) {
    setErrors({ submit: 'Login failed' });
  } finally {
    setIsSubmitting(false);
  }
};
```

**After:**
```typescript
const { values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validate: (values) => {
    const errors: Record<string, string> = {};
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!values.password) {
      errors.password = 'Password is required';
    } else if (values.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    return errors;
  },
  onSubmit: async (values) => {
    await login(values.email, values.password);
  },
});
```

**Benefits:**
- ✅ All form state in one place
- ✅ Validation integrated
- ✅ Touch tracking
- ✅ Submit handling

## Step-by-Step Migrations

### Step 1: Identify Migration Candidates

Run this command to find useState usage:

```bash
# Find all useState in a file
grep -n "useState" app/path/to/file.tsx

# Find all setTimeout/setInterval
grep -n "setTimeout\|setInterval" app/path/to/file.tsx
```

### Step 2: Choose the Right Hook

| Pattern | Hook to Use |
|---------|-------------|
| `useState(false)` with toggle | `useToggle` |
| `useState(0)` with increment/decrement | `useCounter` |
| `useState([])` with array operations | `useList` |
| `useState({})` with map operations | `useMap` |
| `setTimeout` | `useTimeout` |
| `setInterval` | `useInterval` |
| Debounced function | `useDebouncedCallback` |
| Throttled function | `useThrottledCallback` |
| Async operation | `useAsyncOperation` or `useFetch` |
| Form handling | `useForm` |

### Step 3: Update Imports

```typescript
// Add hook imports
import { useToggle } from '@/hooks/utility/use-toggle';
import { useTimeout } from '@/hooks/timing/use-timeout';
import { useAsyncOperation } from '@/hooks/async/use-async-operation';
```

### Step 4: Replace the Code

Follow the migration scenarios above for your specific case.

### Step 5: Test the Changes

```bash
# Run tests
npm test path/to/file.test.tsx

# Run the app and manually test
npm start
```

### Step 6: Commit the Changes

```bash
git add path/to/file.tsx
git commit -m "refactor: migrate to useToggle hook"
```

## Testing After Migration

### Manual Testing Checklist

- [ ] Component renders without errors
- [ ] All user interactions work as before
- [ ] State updates correctly
- [ ] Effects run at the right time
- [ ] Cleanup happens on unmount
- [ ] No memory leaks
- [ ] Performance is same or better

### Automated Testing

Update or add tests for the migrated code:

```typescript
import { renderHook, act } from '@testing-library/react-native';
import { render, fireEvent } from '@testing-library/react-native';

describe('MyComponent after migration', () => {
  it('should toggle modal', () => {
    const { getByText, queryByText } = render(<MyComponent />);
    
    // Modal should be closed initially
    expect(queryByText('Modal Content')).toBeNull();
    
    // Open modal
    fireEvent.press(getByText('Open Modal'));
    expect(queryByText('Modal Content')).toBeTruthy();
    
    // Close modal
    fireEvent.press(getByText('Close'));
    expect(queryByText('Modal Content')).toBeNull();
  });
});
```

## Common Migration Challenges

### Challenge 1: Complex State Logic

**Problem:** Component has complex interdependent state.

**Solution:** Use multiple hooks or create a custom hook:

```typescript
// Option 1: Multiple hooks
const [isLoading, toggleLoading] = useToggle(false);
const [data, { push, clear }] = useList([]);
const [error, setError] = useState<Error | null>(null);

// Option 2: Custom hook
function useDataManager() {
  const [isLoading, toggleLoading] = useToggle(false);
  const [data, { push, clear }] = useList([]);
  const [error, setError] = useState<Error | null>(null);
  
  const fetchData = useCallback(async () => {
    // Implementation
  }, []);
  
  return { isLoading, data, error, fetchData };
}
```

### Challenge 2: Stale Closures

**Problem:** Hook callbacks access stale values.

**Solution:** Use refs for latest values:

```typescript
// Problem
const [count, setCount] = useState(0);
const { start } = useTimeout(() => {
  console.log(count); // Stale value
}, 1000);

// Solution
const [count, setCount] = useState(0);
const countRef = useRef(count);

useEffect(() => {
  countRef.current = count;
}, [count]);

const { start } = useTimeout(() => {
  console.log(countRef.current); // Latest value
}, 1000);
```

### Challenge 3: Type Errors

**Problem:** TypeScript errors after migration.

**Solution:** Add proper types:

```typescript
// Problem
const [items, { push }] = useList([]);
push({ id: '1', name: 'Item' }); // Type error

// Solution
interface Item {
  id: string;
  name: string;
}

const [items, { push }] = useList<Item>([]);
push({ id: '1', name: 'Item' }); // ✅
```

### Challenge 4: Effect Dependencies

**Problem:** Hooks in useEffect dependencies cause re-renders.

**Solution:** Memoize hook functions:

```typescript
// Problem
const { execute } = useAsyncOperation(fetchData);

useEffect(() => {
  execute(); // execute changes every render
}, [execute]);

// Solution 1: Add execute to dependencies (if it's memoized)
useEffect(() => {
  execute();
}, [execute]);

// Solution 2: Call directly without dependency
useEffect(() => {
  const load = async () => {
    await fetchData();
  };
  load();
}, []); // Empty dependencies
```

## Rollback Procedures

### If Migration Fails

1. **Revert the changes:**
```bash
git checkout -- path/to/file.tsx
```

2. **Or create a rollback commit:**
```bash
git revert HEAD
```

3. **Document the issue:**
Create an issue in the repository explaining what went wrong.

### Incremental Rollback

If only part of the migration is problematic:

1. Keep the working parts
2. Revert the problematic section
3. Create a follow-up task

## Migration Tracking

Use this checklist to track progress:

### Phase 1: Utility Hooks
- [ ] useToggle migrations
- [ ] useTimeout migrations
- [ ] useInterval migrations

### Phase 2: State Management
- [ ] useList migrations
- [ ] useCounter migrations
- [ ] useMap migrations

### Phase 3: Async Operations
- [ ] useAsyncOperation migrations
- [ ] useFetch migrations

### Phase 4: Forms
- [ ] useForm migrations

### Phase 5: UI Interactions
- [ ] useHapticNavigation migrations
- [ ] useHapticAction migrations
- [ ] useAutoFocus migrations

## Best Practices for Migration

1. **Migrate one component at a time** - Don't bulk migrate
2. **Test thoroughly** - Manual and automated tests
3. **Review with team** - Get code review before merging
4. **Document changes** - Update comments and docs
5. **Monitor production** - Watch for issues after deployment
6. **Be patient** - Migration takes time, don't rush

## Success Metrics

Track these metrics to measure migration success:

- **Code reduction**: Lines of code saved
- **Performance**: Render count improvements
- **Bugs**: Issues found vs baseline
- **Developer velocity**: Time saved in new features
- **Test coverage**: Coverage improvements

## Further Reading

- [LoginX Hooks Architecture](/docs/HOOKS_ARCHITECTURE.md)
- [LoginX Hooks Best Practices](/docs/HOOKS_BEST_PRACTICES.md)
- [LoginX Hooks Reference](/docs/HOOKS_REFERENCE.md)
- [React Hooks Migration Guide](https://react.dev/learn/migrate-to-hooks)

---

**Last Updated:** October 23, 2025  
**Version:** 1.0  
**Maintainer:** LoginX Development Team
