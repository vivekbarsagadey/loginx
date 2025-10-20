# Ready to Implement - Hooks Migration Tasks

**Last Updated**: October 19, 2025  
**Estimated Total Effort**: 15-20 hours  
**Risk Level**: 🟢 Low - All changes are backward compatible

---

## Quick Wins (High Impact, Low Effort)

### 1. Complete useToggle Migration - 15 States
**Effort**: 2-3 hours | **Impact**: High | **Risk**: Low

All 15 boolean states have been identified and can be migrated systematically:

#### Group A: Onboarding (3 states) - 20 minutes
```typescript
// File: app/onboarding/index.tsx

// Change:
const [slideTransitioning, setSlideTransitioning] = useState(false);
const [accessibilityEnabled, setAccessibilityEnabled] = useState(false);
const [isRecoveredSession, setIsRecoveredSession] = useState(false);

// To:
const [slideTransitioning, toggleSlideTransitioning, setSlideTransitioning] = useToggle(false);
const [accessibilityEnabled, toggleAccessibilityEnabled, setAccessibilityEnabled] = useToggle(false);
const [isRecoveredSession, toggleIsRecoveredSession, setIsRecoveredSession] = useToggle(false);
```

#### Group B: Auth Screens (7 states) - 1 hour
```typescript
// 1. app/(auth)/login.tsx
const [loading, toggleLoading, setLoading] = useToggle(false);

// 2. app/(auth)/verify-magic-link.tsx
const [checking, toggleChecking, setChecking] = useToggle(true);

// 3. app/(auth)/verify-2fa.tsx
const [showBackupCodes, toggleShowBackupCodes, setShowBackupCodes] = useToggle(false);

// 4. app/(auth)/verify-email.tsx
const [showSuccessAnimation, toggleSuccessAnimation, setShowSuccessAnimation] = useToggle(false);

// 5. app/(auth)/otp-login.tsx
const [resending, toggleResending, setResending] = useToggle(false);

// 6. app/(auth)/register/index.tsx
const [isSubmitting, toggleIsSubmitting, setIsSubmitting] = useToggle(false);

// 7. app/security/2fa.tsx (2 states)
const [showReAuthForTwoFactor, toggleShowReAuthForTwoFactor] = useToggle(false);
const [showSuccessAnimation, toggleSuccessAnimation] = useToggle(false);
```

#### Group C: Dashboard Screens (3 states) - 30 minutes
```typescript
// 1. app/(tabs)/index.tsx
const [loading, toggleLoading, setLoading] = useToggle(true);
const [refreshing, toggleRefreshing, setRefreshing] = useToggle(false);

// 2. app/(tabs)/items.tsx
const [refreshing, toggleRefreshing, setRefreshing] = useToggle(false);
```

#### Group D: Profile Screens (2 states) - 20 minutes
```typescript
// 1. app/profile/edit.tsx
const [initialLoading, toggleInitialLoading, setInitialLoading] = useToggle(true);
```

**Total**: 15 states across 11 files

---

### 2. Finish setTimeout Migration - 3 Critical Calls
**Effort**: 1 hour | **Impact**: Medium | **Risk**: Very Low

#### File: app/(auth)/verify-2fa.tsx

**Change 1 (Line 43):**
```typescript
// Before:
await new Promise((resolve) => setTimeout(resolve, 1000));

// After:
// Option A: Create sleep utility
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
await sleep(1000);

// Option B: Use existing pattern with Promise
await new Promise((resolve) => setTimeout(resolve, 1000)); // Keep as-is for simple delays
```

**Change 2 (Line 97):**
```typescript
// Before:
setTimeout(() => handleVerifyWithCode(), 0);

// After:
useTimeout(() => handleVerifyWithCode(), 0);
```

**Change 3 (Line 103):**
```typescript
// Before:
setTimeout(() => handleVerifyWithBackupCode(), 0);

// After:
useTimeout(() => handleVerifyWithBackupCode(), 0);
```

**Note**: The 3 setTimeout calls in `app/examples/dialogs.tsx` are for demonstration purposes and can remain as-is.

---

## High Priority - Critical Gaps

### 3. Add Unit Tests for Core Hooks
**Effort**: 8-10 hours | **Impact**: Very High | **Risk**: None

Create test files for untested hooks using `@testing-library/react-hooks`:

#### Phase 1: Timing Hooks (2 hours)
```bash
# Create files:
tests/hooks/useTimeout.test.ts
tests/hooks/useInterval.test.ts
tests/hooks/useDebouncedCallback.test.ts
tests/hooks/useThrottledCallback.test.ts
```

**Example Test Structure:**
```typescript
// tests/hooks/useTimeout.test.ts
import { renderHook, act } from '@testing-library/react-hooks';
import { useTimeout } from '@/hooks/use-timeout';

describe('useTimeout', () => {
  jest.useFakeTimers();

  it('should execute callback after specified delay', () => {
    const callback = jest.fn();
    renderHook(() => useTimeout(callback, 1000));

    expect(callback).not.toHaveBeenCalled();
    
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should cancel timeout when component unmounts', () => {
    const callback = jest.fn();
    const { unmount } = renderHook(() => useTimeout(callback, 1000));

    unmount();

    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(callback).not.toHaveBeenCalled();
  });

  it('should reset timeout when delay changes', () => {
    const callback = jest.fn();
    const { rerender } = renderHook(
      ({ delay }) => useTimeout(callback, delay),
      { initialProps: { delay: 1000 } }
    );

    act(() => {
      jest.advanceTimersByTime(500);
    });

    rerender({ delay: 2000 });

    act(() => {
      jest.advanceTimersByTime(1500);
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });
});
```

#### Phase 2: Utility Hooks (2 hours)
```bash
# Create files:
tests/hooks/useToggle.test.ts
tests/hooks/useCounter.test.ts
tests/hooks/useList.test.ts
tests/hooks/useMap.test.ts
```

#### Phase 3: Lifecycle Hooks (2 hours)
```bash
# Create files:
tests/hooks/usePrevious.test.ts
tests/hooks/useUpdateEffect.test.ts
tests/hooks/useIsMounted.test.ts
```

#### Phase 4: Storage Hooks (2 hours)
```bash
# Create files:
tests/hooks/useAsyncStorage.test.ts
tests/hooks/useSecureStorage.test.ts
```

**Success Criteria:**
- All core utility hooks have 80%+ test coverage
- All tests pass in CI/CD pipeline
- Edge cases and error scenarios covered

---

### 4. Create Missing Documentation
**Effort**: 4-6 hours | **Impact**: Very High | **Risk**: None

#### Document 1: HOOKS_ARCHITECTURE.md (2 hours)
**Contents:**
- System overview and design philosophy
- Hook categories and their purposes
- Dependency graph between hooks
- Performance considerations
- Design decisions and trade-offs

#### Document 2: HOOKS_BEST_PRACTICES.md (1.5 hours)
**Contents:**
- Common patterns and usage examples
- Anti-patterns to avoid
- Performance optimization tips
- Testing strategies
- Common pitfalls and solutions

#### Document 3: HOOKS_MIGRATION_GUIDE.md (1.5 hours)
**Contents:**
- Step-by-step migration process
- Before/after code examples
- Migration checklists
- Troubleshooting common issues
- FAQ section

---

## Medium Priority - Future Enhancements

### 5. Lifecycle Hooks Adoption
**Effort**: 4-6 hours | **Impact**: Medium | **Risk**: Low

Identify use cases for lifecycle hooks that currently exist but are unused:

- `usePrevious`: Track previous prop/state values for comparisons
- `useUpdateEffect`: Skip effect on initial mount
- `useIsMounted`: Prevent state updates on unmounted components

**Action**: Conduct codebase audit to find patterns that could benefit from these hooks.

---

### 6. Context Provider Optimization
**Effort**: 6-8 hours | **Impact**: High | **Risk**: Medium

Review and optimize existing context providers:
- AuthProvider
- ThemeProvider
- LanguageProvider
- SettingsProvider
- NetworkProvider

**Tasks:**
- Add performance measurements
- Identify unnecessary re-renders
- Add React.memo where appropriate
- Document optimization decisions

---

## Implementation Timeline

### Week 1 (High Priority)
- **Day 1-2**: Migrate all 15 useToggle states
- **Day 3**: Complete setTimeout migrations in verify-2fa
- **Day 4-5**: Write tests for timing hooks

### Week 2 (High Priority)
- **Day 1-2**: Write tests for utility hooks
- **Day 3**: Write tests for lifecycle hooks
- **Day 4-5**: Write tests for storage hooks

### Week 3 (Documentation)
- **Day 1-2**: Create HOOKS_ARCHITECTURE.md
- **Day 3**: Create HOOKS_BEST_PRACTICES.md
- **Day 4**: Create HOOKS_MIGRATION_GUIDE.md
- **Day 5**: Review and polish all documentation

### Week 4 (Optimization)
- **Day 1-3**: Lifecycle hooks adoption analysis
- **Day 4-5**: Context provider optimization (if time permits)

---

## Success Metrics

### Before Implementation
- Hook Adoption Rate: ~55%
- Test Coverage: <5%
- Documentation: 1/4 (25%)

### After Implementation (Target)
- Hook Adoption Rate: 70%+
- Test Coverage: 60%+
- Documentation: 4/4 (100%)

### Long-Term Goals
- Hook Adoption Rate: 90%
- Test Coverage: 80%+
- Performance: 40% reduction in re-renders

---

## Getting Started

### Step 1: Choose Your Starting Point
```bash
# Quick wins (2-3 hours)
→ Start with useToggle migration

# Quality improvements (8-10 hours)
→ Start with unit testing

# Team enablement (4-6 hours)
→ Start with documentation
```

### Step 2: Follow the Checklist
- [ ] Read the relevant section above
- [ ] Create a new branch for your changes
- [ ] Make changes incrementally (one file at a time)
- [ ] Test your changes locally
- [ ] Verify no regressions
- [ ] Submit PR with clear description
- [ ] Update this document when complete

### Step 3: Track Progress
Update `plan/refactor-hooks-optimization-1.md` as tasks are completed.

---

## Questions or Issues?

Refer to:
- `docs/HOOKS_REFERENCE.md` - Complete hooks API reference
- `plan/refactor-hooks-optimization-1.md` - Master plan document
- `HOOKS-STATUS-UPDATE-20251019.md` - Comprehensive status update

---

**Status**: Ready for Implementation  
**Next Action**: Choose Priority 1, 2, 3, or 4 above and begin implementation  
**Support**: All necessary information and code examples provided above
