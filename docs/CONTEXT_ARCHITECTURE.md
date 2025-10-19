# Context Architecture Documentation

## Overview

LoginX uses a comprehensive Context-based state management architecture for app-wide state. This architecture provides:

- Single source of truth for all app-wide state
- Immediate synchronization across all screens
- Local-first architecture with Firestore sync
- Optimistic updates with automatic rollback
- Type-safe state management

## Architecture

### Provider Tree

```tsx
<ErrorBoundary>
  <ThemeProvider>
    <LanguageProvider>
      <GlobalDialogProvider>
        <NetworkProvider>
          <PermissionsProvider>
            <SettingsProvider>
              <AuthProvider>
                <OnboardingProvider>
                  <App />
                </OnboardingProvider>
              </AuthProvider>
            </SettingsProvider>
          </PermissionsProvider>
        </NetworkProvider>
      </GlobalDialogProvider>
    </LanguageProvider>
  </ThemeProvider>
</ErrorBoundary>
```

### Context Providers

#### 1. SettingsProvider

Manages all application settings including notifications, security, app preferences, and privacy settings.

**Location:** `hooks/settings/use-settings-context.tsx`

**Features:**
- Local-first storage with AsyncStorage
- Firestore real-time sync for authenticated users
- Optimistic updates with rollback on error
- Proper memoization to prevent unnecessary re-renders

**Usage:**
```tsx
import { useSettings } from '@/hooks/settings/use-settings-context';

function MyComponent() {
  const { 
    notifications, 
    updateNotifications,
    isLoading 
  } = useSettings();

  const handleToggle = async () => {
    await updateNotifications({ pushEnabled: true });
  };

  return (
    <Switch 
      value={notifications.pushEnabled}
      onValueChange={handleToggle}
      disabled={isLoading}
    />
  );
}
```

**State Structure:**
```typescript
interface SettingsState {
  notifications: NotificationSettings;
  security: SecuritySettings;
  app: AppPreferences;
  privacy: PrivacySettings;
  isLoading: boolean;
  error: string | null;
  lastSyncedAt: number | null;
}
```

#### 2. NetworkProvider

Monitors network connectivity and manages sync queue status.

**Location:** `hooks/network/use-network-context.tsx`

**Features:**
- Real-time network status monitoring
- Connection type detection (wifi, cellular, etc.)
- Sync queue status tracking
- Automatic network change event handling

**Usage:**
```tsx
import { useNetwork } from '@/hooks/network/use-network-context';

function MyComponent() {
  const { 
    isConnected,
    isInternetReachable,
    connectionType,
    syncQueue 
  } = useNetwork();

  if (!isConnected) {
    return <Text>You're offline</Text>;
  }

  return (
    <View>
      <Text>Connected via {connectionType}</Text>
      <Text>Pending syncs: {syncQueue.pendingCount}</Text>
    </View>
  );
}
```

**State Structure:**
```typescript
interface NetworkContextState {
  isConnected: boolean;
  connectionType: ConnectionType;
  isInternetReachable: boolean | null;
  quality: number | null;
  isAirplaneMode: boolean;
  syncQueue: SyncQueueInfo;
  isMonitoring: boolean;
  error: string | null;
}
```

#### 3. PermissionsProvider

Manages all app permissions with real-time status tracking.

**Location:** `hooks/permissions/use-permissions-context.tsx`

**Features:**
- Real-time permission status tracking
- Permission request handlers
- Settings navigation helper
- Loading and error states

**Usage:**
```tsx
import { usePermissions } from '@/hooks/permissions/use-permissions-context';

function MyComponent() {
  const { 
    permissions,
    requestPermission,
    isPermissionGranted,
    openSettings
  } = usePermissions();

  const handleRequestCamera = async () => {
    const granted = await requestPermission('camera');
    if (!granted) {
      // Show message to open settings
      openSettings();
    }
  };

  return (
    <Button 
      onPress={handleRequestCamera}
      title={isPermissionGranted('camera') ? 'Camera Allowed' : 'Allow Camera'}
    />
  );
}
```

**State Structure:**
```typescript
interface PermissionsContextState {
  permissions: PermissionsStatusMap;
  isLoading: boolean;
  error: string | null;
  lastCheckedAt: number | null;
}
```

## Design Patterns

### 1. Context + Custom Hook Pattern

All contexts follow the same pattern:

```tsx
// 1. Create context with proper typing
const MyContext = createContext<MyContextType | undefined>(undefined);

// 2. Create provider component
export function MyProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState(...);
  
  // Memoize context value
  const value = useMemo(() => ({
    ...state,
    actions: ...
  }), [state, actions]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
}

// 3. Create custom hook with error boundary
export function useMyContext() {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  return context;
}
```

### 2. Optimistic Updates with Rollback

All update operations use optimistic updates for instant UI feedback:

```tsx
const updateSomething = async (updates) => {
  const previousValue = state.something;
  
  // Optimistic update
  setState(prev => ({ ...prev, something: { ...prev.something, ...updates } }));
  
  try {
    await saveToStorage(updates);
  } catch (error) {
    // Rollback on error
    setState(prev => ({ ...prev, something: previousValue }));
    throw error;
  }
};
```

### 3. Proper Memoization

All contexts use proper memoization to prevent unnecessary re-renders:

```tsx
// Memoize callbacks
const updateValue = useCallback(async (value) => {
  // implementation
}, [dependencies]);

// Memoize context value
const contextValue = useMemo(() => ({
  state,
  updateValue
}), [state, updateValue]);
```

### 4. Local-First Architecture

All contexts follow local-first principles:

1. **Save locally first** (AsyncStorage)
2. **Update UI immediately** (optimistic update)
3. **Sync to Firestore** in background for authenticated users
4. **Real-time sync** from Firestore to keep data fresh
5. **Automatic conflict resolution** via last-write-wins

## Migration Guide

### Migrating from useState to Context

**Before:**
```tsx
function SettingsScreen() {
  const [settings, setSettings] = useState(...);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const data = await getSettings();
        setSettings(data);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleUpdate = async (key, value) => {
    setLoading(true);
    try {
      await updateSetting(key, value);
      setSettings(prev => ({ ...prev, [key]: value }));
    } catch (error) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  return (
    <Switch 
      value={settings.pushEnabled}
      onValueChange={(v) => handleUpdate('pushEnabled', v)}
    />
  );
}
```

**After:**
```tsx
function SettingsScreen() {
  const { notifications, updateNotifications, isLoading } = useSettings();

  const handleUpdate = async (value) => {
    await updateNotifications({ pushEnabled: value });
  };

  return (
    <Switch 
      value={notifications.pushEnabled}
      onValueChange={handleUpdate}
      disabled={isLoading}
    />
  );
}
```

**Benefits:**
- 50% less code
- No manual loading states
- Automatic cross-screen sync
- Built-in error handling
- Optimistic updates

## Testing

All Context providers have comprehensive unit tests:

```tsx
import { SettingsProvider, useSettings } from '@/hooks/settings/use-settings-context';
import { renderHook, waitFor } from '@testing-library/react-native';

const wrapper = ({ children }) => (
  <SettingsProvider>{children}</SettingsProvider>
);

test('should update settings optimistically', async () => {
  const { result } = renderHook(() => useSettings(), { wrapper });

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  await result.current.updateNotifications({ pushEnabled: true });

  expect(result.current.notifications.pushEnabled).toBe(true);
});
```

## Performance Considerations

### 1. Memoization

All context values and callbacks are properly memoized to prevent unnecessary re-renders.

### 2. Context Splitting

State is split into multiple contexts (Settings, Network, Permissions) to:
- Reduce re-render scope
- Improve maintainability
- Enable selective consumption

### 3. Selective Updates

Components only re-render when the specific data they use changes, not on every context update.

### 4. Loading States

All contexts provide loading states to show appropriate UI feedback during async operations.

## Best Practices

### DO:
✅ Use the provided custom hooks (`useSettings`, `useNetwork`, `usePermissions`)
✅ Handle errors from update functions
✅ Show loading states during updates
✅ Use proper TypeScript types
✅ Follow the existing patterns

### DON'T:
❌ Use `useContext` directly - always use custom hooks
❌ Update context state from outside the provider
❌ Store large objects in context (use refs or external storage)
❌ Create circular dependencies between contexts
❌ Forget to handle errors from async operations

## Troubleshooting

### Context not updating across screens

**Issue:** Changes in one screen don't reflect in another
**Solution:** Verify both screens are using the same context provider and custom hook

### Performance issues

**Issue:** App feels slow or laggy
**Solution:** Check for:
- Missing memoization in context values/callbacks
- Too many context consumers re-rendering
- Large objects being stored in context

### Type errors

**Issue:** TypeScript errors when using context
**Solution:** 
- Ensure proper type imports
- Use the custom hook, not raw useContext
- Check that types match the context interface

## Future Improvements

1. **Context Selectors**: Implement selectors to reduce re-renders further
2. **Persistence Layer**: Add more sophisticated caching strategies
3. **Performance Monitoring**: Add metrics for context update performance
4. **DevTools Integration**: Add debugging tools for context state

## Related Documentation

- [React Context Best Practices](https://react.dev/learn/passing-data-deeply-with-context)
- [Local-First Implementation](./LOCAL_FIRST_IMPLEMENTATION.md)
- [Performance Optimization](../.github/instructions/performance-optimization.instructions.md)
- [TypeScript Guidelines](../.github/instructions/reactjs.instructions.md)

---

**Last Updated:** 2025-10-19
**Version:** 1.0
**Status:** Production Ready
