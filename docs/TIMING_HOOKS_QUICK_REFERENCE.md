# Timing Hooks - Quick Reference Guide

Fast reference for all timing & scheduling hooks in the LoginX custom hooks library.

---

## 🕐 useDebouncedCallback

**Purpose**: Delay execution until user stops performing action

```typescript
import { useDebouncedCallback } from '@/hooks/timing';

const debouncedCallback = useDebouncedCallback(
  (arg1, arg2) => {
    // Your logic here
  },
  delay // milliseconds
);
```

### Common Use Cases

#### Search Input
```typescript
const debouncedSearch = useDebouncedCallback((query: string) => {
  searchAPI(query);
}, 300);

<TextInput 
  placeholder="Search..."
  onChangeText={debouncedSearch}
/>
```

#### Form Validation
```typescript
const debouncedValidate = useDebouncedCallback((value: string) => {
  validateEmail(value);
}, 400);

<TextInput
  onChangeText={(text) => {
    setEmail(text);
    debouncedValidate(text);
  }}
/>
```

#### Auto-save
```typescript
const debouncedSave = useDebouncedCallback(() => {
  saveDraft(content);
}, 1000);

<TextInput
  value={content}
  onChangeText={(text) => {
    setContent(text);
    debouncedSave();
  }}
/>
```

---

## 🚦 useThrottledCallback

**Purpose**: Limit execution frequency (runs at most once per period)

```typescript
import { useThrottledCallback } from '@/hooks/timing';

const throttledCallback = useThrottledCallback(
  (arg1, arg2) => {
    // Your logic here
  },
  limit // milliseconds
);
```

### Common Use Cases

#### Scroll Handler
```typescript
const throttledScroll = useThrottledCallback((event) => {
  const offset = event.nativeEvent.contentOffset.y;
  updateScrollPosition(offset);
}, 100);

<ScrollView onScroll={throttledScroll}>
  {content}
</ScrollView>
```

#### Button Click Protection
```typescript
const throttledSubmit = useThrottledCallback(() => {
  submitForm();
}, 2000); // Prevent double-submit

<Button onPress={throttledSubmit} title="Submit" />
```

#### API Rate Limiting
```typescript
const throttledTrack = useThrottledCallback((event: string) => {
  trackAnalytics(event);
}, 5000); // Max once per 5 seconds
```

---

## ⏱️ useInterval

**Purpose**: Run callback periodically with full control

```typescript
import { useInterval } from '@/hooks/timing';

const { isRunning, start, stop, restart } = useInterval(
  () => {
    // Your periodic logic
  },
  delay, // milliseconds (or null to disable)
  {
    immediate: true,  // Start on mount (default: true)
    enabled: true     // Enable/disable interval (default: true)
  }
);
```

### Common Use Cases

#### Auto-refresh Data
```typescript
// Simple: Auto-refresh every 5 seconds
useInterval(() => {
  fetchLatestData();
}, 5000);
```

#### Countdown Timer
```typescript
const [seconds, setSeconds] = useState(60);
const { isRunning, start, stop, restart } = useInterval(
  () => setSeconds((s) => s - 1),
  1000,
  { immediate: false }
);

<View>
  <Text>{seconds}s remaining</Text>
  {!isRunning && <Button onPress={start} title="Start" />}
  {isRunning && <Button onPress={stop} title="Pause" />}
  <Button onPress={restart} title="Reset" />
</View>
```

#### Real-time Clock
```typescript
const [time, setTime] = useState(new Date());

useInterval(() => {
  setTime(new Date());
}, 1000);

<Text>{time.toLocaleTimeString()}</Text>
```

#### Conditional Polling
```typescript
const [isEnabled, setIsEnabled] = useState(false);

useInterval(
  () => checkForUpdates(),
  3000,
  { enabled: isEnabled } // Only poll when enabled
);

<Switch value={isEnabled} onValueChange={setIsEnabled} />
```

#### Progress Bar
```typescript
const [progress, setProgress] = useState(0);
const { stop } = useInterval(() => {
  setProgress((p) => {
    if (p >= 100) {
      stop();
      return 100;
    }
    return p + 1;
  });
}, 100);

<ProgressBar progress={progress} />
```

---

## ⏰ useTimeout

**Purpose**: Execute callback once after delay with full control

```typescript
import { useTimeout } from '@/hooks/timing';

const { isPending, isComplete, start, cancel, reset } = useTimeout(
  () => {
    // Your delayed logic
  },
  delay, // milliseconds (or null to disable)
  {
    immediate: true,  // Start on mount (default: true)
    enabled: true     // Enable/disable timeout (default: true)
  }
);
```

### Common Use Cases

#### Welcome Message
```typescript
// Simple: Show notification after 3 seconds
useTimeout(() => {
  showNotification('Welcome to the app!');
}, 3000);
```

#### Delayed Redirect
```typescript
const { isPending } = useTimeout(() => {
  router.push('/home');
}, 2000);

<View>
  <Text>Redirecting to home...</Text>
  {isPending && <ActivityIndicator />}
</View>
```

#### Auto-save with User Activity
```typescript
const { start, cancel } = useTimeout(
  () => saveDraft(),
  5000,
  { immediate: false }
);

const handleTextChange = (text: string) => {
  setContent(text);
  cancel(); // Cancel existing timeout
  start();  // Start new timeout
};

<TextInput
  value={content}
  onChangeText={handleTextChange}
/>
```

#### Show Hint After Delay
```typescript
const { isPending, isComplete, cancel } = useTimeout(
  () => setShowHint(true),
  10000
);

<View>
  {isPending && !isComplete && (
    <Text>Need help? Hint coming soon...</Text>
  )}
  {isComplete && showHint && (
    <Text>Hint: Try tapping the icon!</Text>
  )}
  <Button onPress={cancel} title="I got it!" />
</View>
```

#### Toast Auto-dismiss
```typescript
const [visible, setVisible] = useState(false);

const showToast = () => {
  setVisible(true);
  reset();
  start();
};

useTimeout(
  () => setVisible(false),
  3000,
  { immediate: false }
);

{visible && <Toast message="Action completed!" />}
```

---

## 🎯 Choosing the Right Hook

| Hook | When to Use | Key Benefit |
|------|-------------|-------------|
| **useDebouncedCallback** | User is typing/acting repeatedly | Wait until they're done |
| **useThrottledCallback** | High-frequency events (scroll, mousemove) | Limit execution rate |
| **useInterval** | Periodic tasks (refresh, countdown) | Full control over timing |
| **useTimeout** | One-time delayed action | State tracking + controls |

### Decision Tree

```
Need timing control?
├─ Repeated user input → useDebouncedCallback
├─ High-frequency events → useThrottledCallback
├─ Periodic execution → useInterval
└─ Single delayed action → useTimeout
```

---

## 💡 Tips & Best Practices

### Debounce vs Throttle

- **Debounce**: "Wait until they stop"
  - Perfect for: Search input, form validation, auto-save
  - Behavior: Resets timer on each call
  
- **Throttle**: "No more than X per second"
  - Perfect for: Scroll handlers, API rate limiting
  - Behavior: Executes immediately, then waits

### Cleanup

All timing hooks automatically clean up on unmount. No manual cleanup needed!

```typescript
// ✅ Automatic cleanup
useInterval(() => fetchData(), 5000);

// ❌ Manual cleanup not needed
useEffect(() => {
  const interval = setInterval(() => fetchData(), 5000);
  return () => clearInterval(interval); // Not necessary with useInterval
}, []);
```

### TypeScript Generics

All hooks support TypeScript generics for type-safe callbacks:

```typescript
const debounced = useDebouncedCallback<(id: string, data: User) => void>(
  (id, data) => {
    // id and data are properly typed
    updateUser(id, data);
  },
  500
);
```

### Performance

- Debounce/throttle are lightweight (no state, just refs)
- Interval/timeout track state (isRunning, isPending, etc.)
- All hooks use `useCallback` internally for stability

### Common Patterns

#### Conditional Timing
```typescript
const [shouldPoll, setShouldPoll] = useState(false);

useInterval(
  () => fetchData(),
  5000,
  { enabled: shouldPoll }
);
```

#### Delay Null Pattern
```typescript
const delay = isActive ? 1000 : null; // null disables

useInterval(() => update(), delay);
```

---

## 📚 Import Patterns

### Category Import (Recommended)
```typescript
import { 
  useDebouncedCallback, 
  useThrottledCallback,
  useInterval,
  useTimeout 
} from '@/hooks/timing';
```

### Main Index Import (Backward Compatible)
```typescript
import { 
  useDebouncedCallback, 
  useInterval 
} from '@/hooks';
```

### Individual Import
```typescript
import { useDebouncedCallback } from '@/hooks/timing/use-debounced-callback';
```

---

## 🐛 Troubleshooting

### Debounce not working?
- Check delay value (must be > 0)
- Verify callback reference isn't changing
- Ensure you're calling the debounced function, not the original

### Throttle executing too often?
- Increase limit value
- Check if callback itself has side effects
- Verify you're using throttle, not debounce

### Interval not starting?
- Check `immediate` option (default: true)
- Verify `enabled` option (default: true)
- Ensure delay is not null
- Call `start()` if immediate is false

### Timeout not firing?
- Check `immediate` option (default: true)
- Verify `enabled` option (default: true)
- Ensure delay is not null
- Call `start()` if immediate is false

---

## 📖 Full Documentation

For complete API documentation with all parameters and return types, see:
- `hooks/timing/use-debounced-callback.ts`
- `hooks/timing/use-throttled-callback.ts`
- `hooks/timing/use-interval.ts`
- `hooks/timing/use-timeout.ts`

---

**Last Updated**: October 19, 2025  
**Version**: 1.0  
**Category**: Timing & Scheduling Hooks
