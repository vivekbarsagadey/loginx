# Quick Fix Guide - Code Quality Issues

**⚡ Fast Reference for Common Fixes**

---

## 🔴 Critical: Install Missing Dependency

```bash
pnpm add expo-battery
```

---

## 🔴 Critical: Fix `any` Types

### ❌ Before
```typescript
const data: any = {};
function process(item: any): any {
  return item;
}
```

### ✅ After
```typescript
const data: Record<string, unknown> = {};
function process(item: unknown): ProcessedItem {
  if (isValidItem(item)) {
    return processValidItem(item);
  }
  throw new Error('Invalid item');
}

// Type guard
function isValidItem(item: unknown): item is ValidItem {
  return typeof item === 'object' && item !== null && 'id' in item;
}
```

---

## 🔴 Critical: Fix Unused Variables

### ❌ Before
```typescript
} catch (error) {
  showError('Failed');
}

const handlePress = () => {};  // Never used
```

### ✅ After
```typescript
} catch (_error) {
  showError('Failed');
}

// Remove if truly unused, or prefix with _
const _handlePress = () => {};  // Intentionally unused
```

---

## 🟡 High Priority: Fix Hook Dependencies

### ❌ Before
```typescript
useEffect(() => {
  return () => clearInterval(countdownInterval);
}, []); // Missing dependency!
```

### ✅ After
```typescript
useEffect(() => {
  return () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  };
}, [countdownInterval]); // Dependency added
```

---

## 🟡 High Priority: Fix require() Imports

### ❌ Before
```typescript
const Font = require('@expo-google-fonts/roboto');
```

### ✅ After
```typescript
import * as Font from '@expo-google-fonts/roboto';
```

---

## 🟡 High Priority: Fix Type-Only Imports

### ❌ Before
```typescript
import { AppStateStatus } from 'react-native';
```

### ✅ After
```typescript
import type { AppStateStatus } from 'react-native';
```

---

## 🟢 Medium Priority: Add Curly Braces

### ❌ Before
```typescript
if (condition) doSomething();
```

### ✅ After
```typescript
if (condition) {
  doSomething();
}
```

---

## 🟢 Medium Priority: Remove Trivial Types

### ❌ Before
```typescript
const [enabled, setEnabled] = useState<boolean>(false);
```

### ✅ After
```typescript
const [enabled, setEnabled] = useState(false);
```

---

## 📋 Commands Cheat Sheet

```bash
# Check status
pnpm lint                # See all ESLint issues
pnpm type-check         # TypeScript errors
pnpm lint:md            # Markdown issues

# Auto-fix
pnpm lint:fix           # Fix auto-fixable ESLint
pnpm lint:md:fix        # Fix markdown
pnpm format             # Format all files

# Test
pnpm test               # Run all tests
pnpm test:security      # Security tests
pnpm test:performance   # Performance tests

# Full validation
pnpm validate           # Everything
```

---

## 📊 Progress Tracking

```bash
# Count remaining any types
grep -r "any" hooks/ | wc -l

# Count ESLint errors
pnpm lint 2>&1 | grep "error" | wc -l

# Count ESLint warnings
pnpm lint 2>&1 | grep "warning" | wc -l
```

---

## 🚀 Git Workflow

```bash
# Start
git checkout -b fix/code-quality-improvements

# After each task
git add .
git commit -m "fix(types): eliminate any in use-flow-validation (TASK-001)"

# Push regularly
git push origin fix/code-quality-improvements

# When complete
git checkout main
git merge fix/code-quality-improvements
```

---

## 🎯 File-Specific Quick Fixes

### hooks/use-flow-engine.ts
```typescript
// Remove unused import
- import { useCallback, useEffect, useMemo, useState } from 'react';
+ import { useCallback, useEffect, useMemo } from 'react';

// Fix any types
- initialData?: Record<string, any>
+ initialData?: FlowData

// Remove unused variable
- resetState,
+ // resetState removed - not needed
```

### hooks/auth/use-permissions.tsx
```typescript
// Prefix unused errors
- } catch (error) {
+ } catch (_error) {
```

### app/(auth)/otp-login.tsx
```typescript
// Fix hook dependency
useEffect(() => {
  return () => {
    if (countdownInterval) {
      clearInterval(countdownInterval);
    }
  };
-}, []);
+}, [countdownInterval]);
```

---

## ⚠️ Common Pitfalls to Avoid

1. **Don't use `as any`** - Always use proper types or `unknown` with guards
2. **Don't ignore hook warnings** - They indicate real bugs (stale closures)
3. **Don't remove error handling** - Prefix with `_` if not used
4. **Don't skip tests** - Verify each change doesn't break functionality
5. **Don't commit without validation** - Run `pnpm validate` first

---

## 📞 Need Help?

- Full plan: `plan/refactor-code-quality-fixes-1.md`
- Summary: `CODE_QUALITY_AUDIT_SUMMARY.md`
- Roadmap: `IMPLEMENTATION_ROADMAP.md`
- Guidelines: `.github/instructions/rule.instructions.md`

---

**Last Updated**: October 20, 2025
