# Hooks Optimization Quick Start Guide

This is a quick reference guide to get started with the Hooks Optimization Plan.

## Current State Summary

Based on the audit report (Oct 19, 2025):

### ✅ Strengths

- **84 custom hooks** available across 13 categories
- **266 hook imports** across the codebase showing active usage
- Well-organized category structure (auth, async, ui, layout, device, theme, lifecycle, utility, storage, timing, network, permissions, settings)
- Most popular hooks: `useThemeColor` (380 uses), `useThemeColors` (125 uses), `useAlert` (52 uses)

### ⚠️ Opportunities for Improvement

- **20+ components** have NO custom hooks (using only React built-in hooks)
- **10 files** with 4+ `useState` calls (candidates for state management hooks)
- **10+ files** with manual `setTimeout`/`setInterval` (should use timing hooks)
- **189 `useState` calls** - many could be replaced with `useToggle`, `useCounter`, `useList`, `useMap`
- **82 `useEffect` calls** - some could use `useUpdateEffect`, `useInterval`, `useTimeout`
- **9 forms** without `useForm` hook
- **11 components** with search logic without `useSearch` hook

## Priority Actions

### Phase 1: Low-Hanging Fruit (Week 1-2)

**Replace boolean useState with useToggle:**

```typescript
// BEFORE
const [isOpen, setIsOpen] = useState(false);
const toggleOpen = () => setIsOpen(!isOpen);

// AFTER
import { useToggle } from "@/hooks/utility";
const [isOpen, toggleOpen] = useToggle(false);
```

**Files to update:**

- All modal/dialog components
- Components with visibility toggles
- Components with expanded/collapsed states

**Replace manual debounce with useDebouncedCallback:**

```typescript
// BEFORE
const [timer, setTimer] = useState<NodeJS.Timeout>();
const handleSearch = (text: string) => {
  if (timer) clearTimeout(timer);
  const newTimer = setTimeout(() => {
    performSearch(text);
  }, 300);
  setTimer(newTimer);
};

// AFTER
import { useDebouncedCallback } from "@/hooks/timing";
const handleSearch = useDebouncedCallback((text: string) => {
  performSearch(text);
}, 300);
```

**Files to update:**

- `dialogs.tsx`
- `verify-phone.tsx`
- `step-2.tsx`
- `otp-login.tsx`

### Phase 2: State Management Refactoring (Week 3-4)

**High-priority files with multiple useState:**

1. **profile/edit.tsx** (14 useState calls)
   - Use `useFormState` or create custom `useProfileForm` hook

2. **change-password.tsx** (9 useState calls)
   - Use `useFormState` with validation

3. **report-issue.tsx** (7 useState calls)
   - Extract to `useIssueForm` hook

4. **2fa.tsx** (5 useState calls)
   - Use `useToggle` for boolean states
   - Use `useLoadingState` for async operations

5. **rate-app.tsx** (5 useState calls)
   - Extract to `useRatingForm` hook

### Phase 3: Create Missing Hooks (Week 5-6)

**Priority hooks to create:**

1. **useForm** - Standardized form handling

```typescript
const { values, errors, handleChange, handleSubmit, isValid } = useForm({
  initialValues: { email: "", password: "" },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    /* submit logic */
  }
});
```

2. **useSearch** - Search with debouncing and filtering

```typescript
const { query, results, loading, setQuery } = useSearch({
  data: items,
  filterFn: (item, query) => item.name.includes(query),
  debounceMs: 300
});
```

3. **useInfiniteScroll** - Pagination support

```typescript
const { items, loadMore, hasMore, loading } = useInfiniteScroll({
  fetchFn: fetchItems,
  pageSize: 20
});
```

## Component Checklist

When refactoring a component, ask:

- [ ] Can multiple `useState` be replaced with `useToggle`, `useCounter`, `useList`, or `useMap`?
- [ ] Are there manual `setTimeout`/`setInterval` that should use `useTimeout`/`useInterval`?
- [ ] Is there debounce/throttle logic that should use timing hooks?
- [ ] Is form logic that should be extracted to `useForm`?
- [ ] Are there search/filter operations that should use `useSearch`?
- [ ] Are async operations using `useAsyncOperation` or `useLoadingState`?
- [ ] Is the component using `useHapticNavigation` for navigation?
- [ ] Are theme colors accessed via `useThemeColors` or `useThemeColor`?
- [ ] Is network state checked with `useNetwork` for offline-first?
- [ ] Are storage operations using storage hooks (`useAsyncStorage`, `useSecureStorage`)?

## Quick Hook Reference

### State Management

```typescript
import { useToggle, useCounter, useList, useMap } from "@/hooks/utility";

const [isOpen, toggle, setOpen] = useToggle(false);
const [count, { increment, decrement, reset }] = useCounter(0);
const [items, { push, remove, clear, filter }] = useList([]);
const [map, { set, remove, clear }] = useMap();
```

### Timing

```typescript
import { useDebouncedCallback, useThrottledCallback, useTimeout, useInterval } from "@/hooks/timing";

const debouncedSearch = useDebouncedCallback(handleSearch, 300);
const throttledScroll = useThrottledCallback(handleScroll, 100);
useTimeout(() => console.log("delayed"), 1000);
useInterval(() => console.log("repeating"), 5000);
```

### Lifecycle

```typescript
import { useUpdateEffect, usePrevious, useIsMounted } from "@/hooks/lifecycle";

useUpdateEffect(() => {
  // Runs on updates, not on mount
}, [dependency]);

const prevValue = usePrevious(value);
const isMounted = useIsMounted();
```

### Async Operations

```typescript
import { useAsyncOperation, useLoadingState } from "@/hooks/async";

const { execute, loading, error, data } = useAsyncOperation();
const { loading, startLoading, stopLoading } = useLoadingState();
```

### Storage

```typescript
import { useAsyncStorage, useSecureStorage } from "@/hooks/storage";

const [value, setValue] = useAsyncStorage<string>("key", "default");
const [token, setToken] = useSecureStorage<string>("auth_token");
```

## Implementation Order

1. **Week 1**: Audit and document (TASK-001 to TASK-008)
2. **Week 2**: Replace boolean states with `useToggle` across the app
3. **Week 3**: Replace manual timing logic with timing hooks
4. **Week 4**: Refactor high-priority forms with state management hooks
5. **Week 5**: Create and implement `useForm` hook
6. **Week 6**: Create and implement `useSearch` hook
7. **Week 7-8**: Optimize context providers and performance
8. **Week 9-10**: Testing and documentation
9. **Week 11-12**: Performance monitoring and final optimization

## Success Tracking

Track progress weekly:

- Number of components refactored
- Number of `useState` replaced
- Number of manual timing logic removed
- Performance improvements (re-render count reduction)
- Test coverage percentage
- Developer feedback

## Getting Help

- Review the full plan: `plan/refactor-hooks-optimization-1.md`
- Check hook documentation: Each hook has JSDoc with usage examples
- Run audit script: `./scripts/audit-hooks-usage.sh`
- Ask questions in team standups

---

**Last Updated**: October 19, 2025
