# LoginX Hooks Best Practices

## Overview

This guide outlines best practices, common patterns, and anti-patterns for using custom hooks in the LoginX application. Following these guidelines ensures consistent, maintainable, and performant code.

## Table of Contents

- [Hook Usage Patterns](#hook-usage-patterns)
- [Performance Optimization](#performance-optimization)
- [Common Anti-Patterns](#common-anti-patterns)
- [Testing Hooks](#testing-hooks)
- [Debugging Hooks](#debugging-hooks)
- [Migration Strategies](#migration-strategies)

## Hook Usage Patterns

### 1. State Management

#### ✅ DO: Use appropriate utility hooks

```typescript
// Use useToggle for boolean states
const [isModalOpen, toggleModal, setModalOpen] = useToggle(false);

// Use useCounter for numeric counters
const [count, { increment, decrement, reset }] = useCounter(0, {
  min: 0,
  max: 100
});

// Use useList for array state
const [items, { push, remove, clear, update }] = useList<Item>([]);
```

#### ❌ DON'T: Use raw useState for common patterns

```typescript
// Avoid manual boolean toggle
const [isOpen, setIsOpen] = useState(false);
const toggle = () => setIsOpen(!isOpen);

// Avoid manual counter logic
const [count, setCount] = useState(0);
const increment = () => setCount(count + 1);

// Avoid manual array manipulation
const [items, setItems] = useState<Item[]>([]);
const addItem = (item: Item) => setItems([...items, item]);
```

### 2. Async Operations

#### ✅ DO: Use async hooks for standardized error handling

```typescript
// Use useAsyncOperation for complex async logic
const { data, loading, error, execute } = useAsyncOperation(
  async () => {
    const response = await api.fetchUser(userId);
    return response.data;
  },
  {
    onSuccess: (data) => {
      showToast("User loaded successfully");
    },
    onError: (error) => {
      logError("Failed to load user", _error);
    }
  }
);

// Use useFetch for API calls
const { data, isLoading, refetch } = useFetch("/api/user/profile", {
  retry: 3,
  retryDelay: 1000
});
```

#### ❌ DON'T: Manually manage loading/error states

```typescript
// Avoid manual async state management
const [data, setData] = useState(null);
const [loading, setLoading] = useState(false);
const [error, setError] = useState(null);

const fetchData = async () => {
  setLoading(true);
  try {
    const result = await api.fetch();
    setData(result);
  } catch (err) {
    setError(err);
  } finally {
    setLoading(false);
  }
};
```

### 3. Timing Operations

#### ✅ DO: Use timing hooks for delays and intervals

```typescript
// Use useTimeout for delayed actions
const { start, cancel } = useTimeout(
  () => {
    router.push("/home");
  },
  3000,
  { immediate: false }
);

// Use useInterval for periodic updates
useInterval(
  () => {
    refreshData();
  },
  30000, // Every 30 seconds
  { immediate: true }
);

// Use useDebouncedCallback for search
const debouncedSearch = useDebouncedCallback((query: string) => {
  searchAPI(query);
}, 500);
```

#### ❌ DON'T: Use raw setTimeout/setInterval

```typescript
// Avoid manual timeout management
useEffect(() => {
  const timer = setTimeout(() => {
    doSomething();
  }, 1000);

  return () => clearTimeout(timer);
}, []);

// Avoid manual interval management
useEffect(() => {
  const interval = setInterval(() => {
    updateData();
  }, 5000);

  return () => clearInterval(interval);
}, []);
```

### 4. Form Handling

#### ✅ DO: Use useForm for form validation

```typescript
// Use useForm for consistent form handling
const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
  initialValues: {
    email: "",
    password: ""
  },
  validate: (values) => {
    const errors: Record<string, string> = {};
    if (!values.email) {
      errors.email = "Email is required";
    }
    if (!values.password || values.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    return errors;
  },
  onSubmit: async (values) => {
    await login(values.email, values.password);
  }
});
```

#### ❌ DON'T: Manually manage form state and validation

```typescript
// Avoid manual form management
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [errors, setErrors] = useState({});

const handleSubmit = () => {
  const newErrors = {};
  if (!email) newErrors.email = "Required";
  if (!password) newErrors.password = "Required";
  setErrors(newErrors);
  // ...
};
```

### 5. UI Interactions

#### ✅ DO: Use interaction hooks for enhanced UX

```typescript
// Use haptic feedback hooks
const navigateWithFeedback = useHapticNavigation();
navigateWithFeedback('/profile');

const handleSubmit = useHapticAction(async () => {
  await submitForm();
});

// Use auto-focus for better accessibility
const { focusRef } = useAutoFocus<TextInput>({
  delay: 100,
});

<TextInput ref={focusRef} />
```

#### ❌ DON'T: Ignore haptic feedback and focus management

```typescript
// Avoid manual navigation without feedback
const handleNavigate = () => {
  router.push("/profile");
};

// Avoid manual focus management
const inputRef = useRef<TextInput>(null);
useEffect(() => {
  setTimeout(() => {
    inputRef.current?.focus();
  }, 100);
}, []);
```

## Performance Optimization

### 1. Memoization

#### ✅ DO: Memoize expensive computations

```typescript
// Memoize expensive calculations
const sortedItems = useMemo(() => {
  return items.sort((a, b) => a.date - b.date);
}, [items]);

// Memoize callbacks passed to child components
const handleItemPress = useCallback((itemId: string) => {
  navigateToDetail(itemId);
}, []);

// Use optimized callback for deep comparisons
const handleComplexAction = useOptimizedCallback(
  (data: ComplexObject) => {
    processData(data);
  },
  [dependency1, dependency2]
);
```

#### ❌ DON'T: Create new functions/objects in render

```typescript
// Avoid creating new functions in render
<Button
  onPress={() => {
    handleAction(item.id);
  }}
/>

// Avoid creating new objects in render
const config = { theme: 'dark', language: 'en' };
<Component config={config} />
```

### 2. Context Optimization

#### ✅ DO: Split contexts by concern

```typescript
// Split contexts to minimize re-renders
export function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Memoize context values
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);

  const value = useMemo(() => ({
    user,
    setUser,
  }), [user]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

#### ❌ DON'T: Create monolithic contexts

```typescript
// Avoid putting everything in one context
const value = {
  user,
  theme,
  language,
  settings,
  network,
  permissions,
  // ... too many values
};

// Avoid creating new objects every render
<AppContext.Provider value={{ user, theme, language }}>
  {children}
</AppContext.Provider>
```

### 3. Conditional Hook Execution

#### ✅ DO: Use conditional rendering, not conditional hooks

```typescript
// Correct: Move condition outside hook
if (!isEnabled) {
  return null;
}

const data = useCustomHook();
```

#### ❌ DON'T: Call hooks conditionally

```typescript
// Wrong: Hooks must be called unconditionally
if (isEnabled) {
  const data = useCustomHook(); // ❌ Violates rules of hooks
}

// Wrong: Conditional hook call in loop
items.forEach((item) => {
  const itemData = useCustomHook(item.id); // ❌ Hooks in loops
});
```

## Common Anti-Patterns

### 1. ❌ Overusing useEffect

```typescript
// Anti-pattern: Using useEffect for derived state
const [items, setItems] = useState([]);
const [count, setCount] = useState(0);

useEffect(() => {
  setCount(items.length);
}, [items]);

// Better: Use derived state
const count = items.length;
```

### 2. ❌ Infinite Loops in useEffect

```typescript
// Anti-pattern: Missing dependencies causing infinite loops
useEffect(() => {
  fetchData();
}, []); // Missing fetchData dependency

// Better: Include all dependencies
useEffect(() => {
  fetchData();
}, [fetchData]);

// Or use useCallback
const fetchData = useCallback(() => {
  // Implementation
}, []);
```

### 3. ❌ Not Cleaning Up Effects

```typescript
// Anti-pattern: No cleanup
useEffect(() => {
  const subscription = eventEmitter.on("event", handler);
}, []);

// Better: Always clean up
useEffect(() => {
  const subscription = eventEmitter.on("event", handler);
  return () => {
    subscription.remove();
  };
}, []);
```

### 4. ❌ Stale Closures

```typescript
// Anti-pattern: Stale closure in timeout
const [count, setCount] = useState(0);

const handleClick = () => {
  setTimeout(() => {
    console.log(count); // Stale value
  }, 1000);
};

// Better: Use ref for latest value
const countRef = useRef(count);
useEffect(() => {
  countRef.current = count;
}, [count]);

const handleClick = () => {
  setTimeout(() => {
    console.log(countRef.current); // Latest value
  }, 1000);
};
```

### 5. ❌ Prop Drilling

```typescript
// Anti-pattern: Passing props through multiple levels
<Parent theme={theme}>
  <Child theme={theme}>
    <GrandChild theme={theme} />
  </Child>
</Parent>

// Better: Use context
<ThemeProvider>
  <Parent>
    <Child>
      <GrandChild /> {/* Uses useTheme() */}
    </Child>
  </Parent>
</ThemeProvider>
```

## Testing Hooks

### Unit Testing

```typescript
import { renderHook, act, waitFor } from "@testing-library/react-native";
import { useToggle } from "@/hooks/utility/use-toggle";

describe("useToggle", () => {
  it("should initialize with default value", () => {
    const { result } = renderHook(() => useToggle(false));
    expect(result.current[0]).toBe(false);
  });

  it("should toggle value", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[1](); // toggle
    });

    expect(result.current[0]).toBe(true);
  });

  it("should set specific value", () => {
    const { result } = renderHook(() => useToggle(false));

    act(() => {
      result.current[2](true); // setValue
    });

    expect(result.current[0]).toBe(true);
  });
});
```

### Testing with Context

```typescript
import { renderHook } from '@testing-library/react-native';
import { AuthProvider, useAuth } from '@/hooks/auth/use-auth-provider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('useAuth', () => {
  it('should provide auth context', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('login');
    expect(result.current).toHaveProperty('logout');
  });
});
```

### Testing Async Hooks

```typescript
import { renderHook, waitFor } from "@testing-library/react-native";
import { useAsyncOperation } from "@/hooks/async/use-async-operation";

describe("useAsyncOperation", () => {
  it("should handle successful async operation", async () => {
    const mockFetch = jest.fn().mockResolvedValue("data");

    const { result } = renderHook(() => useAsyncOperation(mockFetch));

    expect(result.current.loading).toBe(false);

    result.current.execute();

    expect(result.current.loading).toBe(true);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.data).toBe("data");
    });
  });
});
```

## Debugging Hooks

### 1. Use React DevTools

- **Component Tree**: Inspect hook state in components
- **Profiler**: Identify performance bottlenecks
- **Hook Values**: View current hook values in real-time

### 2. Debug Logging

```typescript
// Add debug logging to hooks
export function useCustomHook() {
  const [state, setState] = useState(initialState);

  useEffect(() => {
    console.log('[useCustomHook] State changed:', state);
  }, [state]);

  // ...
}

// Use debug hook
import { useDebugValue } from 'react';

export function useCustomHook() {
  const value = /* ... */;

  useDebugValue(value, (v) => `Value: ${v}`);

  return value;
}
```

### 3. Common Issues

**Issue: Hook not updating**

- Check dependencies in useEffect/useMemo/useCallback
- Verify state updates are not mutating existing state
- Ensure context provider is wrapping the component

**Issue: Infinite re-renders**

- Check for missing dependencies in useEffect
- Verify callbacks are memoized
- Check for object/array creation in render

**Issue: Stale values**

- Use refs for latest values in callbacks
- Check closure scope in async operations
- Verify dependencies are correct

## Migration Strategies

### 1. Incremental Migration

Start with low-risk components and gradually migrate:

1. **Identify candidates**: Components with manual state management
2. **Start simple**: Begin with useToggle and useTimeout
3. **Test thoroughly**: Ensure behavior is unchanged
4. **Expand gradually**: Move to more complex hooks
5. **Monitor performance**: Check for regressions

### 2. Migration Checklist

- [ ] Identify all useState that can be replaced with utility hooks
- [ ] Replace setTimeout/setInterval with timing hooks
- [ ] Convert async operations to useAsyncOperation/useFetch
- [ ] Add haptic feedback to navigation and actions
- [ ] Implement form validation with useForm
- [ ] Add proper cleanup to all effects
- [ ] Memoize expensive computations and callbacks
- [ ] Test thoroughly after each change

### 3. Backward Compatibility

When migrating, maintain backward compatibility:

```typescript
// Old API (keep for now)
export function OldComponent() {
  const [isOpen, setIsOpen] = useState(false);

  // ...
}

// New API (gradually adopt)
export function NewComponent() {
  const [isOpen, toggle, setIsOpen] = useToggle(false);

  // ...
}
```

## Best Practices Summary

### DO ✅

1. ✅ Use appropriate utility hooks (useToggle, useCounter, useList)
2. ✅ Use async hooks for standardized error handling
3. ✅ Use timing hooks instead of raw setTimeout/setInterval
4. ✅ Memoize expensive computations with useMemo
5. ✅ Memoize callbacks passed to children with useCallback
6. ✅ Clean up effects (event listeners, timers, subscriptions)
7. ✅ Split contexts by concern to minimize re-renders
8. ✅ Use TypeScript for type safety
9. ✅ Test hooks with React Testing Library
10. ✅ Document complex hooks with JSDoc

### DON'T ❌

1. ❌ Call hooks conditionally or in loops
2. ❌ Create new functions/objects in render
3. ❌ Use useEffect for derived state
4. ❌ Forget to clean up effects
5. ❌ Ignore memoization in performance-critical code
6. ❌ Create monolithic contexts with too many values
7. ❌ Mutate state directly
8. ❌ Use raw useState for common patterns
9. ❌ Ignore TypeScript warnings
10. ❌ Skip testing hooks

## Further Reading

- [React Hooks Documentation](https://react.dev/reference/react)
- [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks)
- [LoginX Hooks Architecture](/docs/HOOKS_ARCHITECTURE.md)
- [LoginX Hooks Migration Guide](/docs/HOOKS_MIGRATION_GUIDE.md)
- [LoginX Hooks Reference](/docs/HOOKS_REFERENCE.md)

---

**Last Updated:** October 23, 2025\
**Version:** 1.0\
**Maintainer:** LoginX Development Team
