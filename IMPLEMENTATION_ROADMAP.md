# Code Quality Fixes - Implementation Roadmap

**Created**: October 20, 2025  
**Total Issues**: 103 (79 errors + 24 warnings)  
**Estimated Duration**: 6-8 days

---

## 📊 Visual Workflow

```
┌─────────────────────────────────────────────────────────────────┐
│                    START: Code Quality Audit                     │
│                     103 Issues Identified                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 1: Critical Type Safety (Days 1-2)                       │
│  ✓ Fix 52 `any` type violations                                 │
│  ✓ Create proper TypeScript types                               │
│  ✓ Implement type guards where needed                           │
│  Tasks: 11 | Priority: CRITICAL                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm type-check]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 2: Unused Variables Cleanup (Day 3)                      │
│  ✓ Prefix 27 unused variables with `_`                          │
│  ✓ Remove truly unnecessary code                                │
│  Tasks: 11 | Priority: CRITICAL                                 │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm lint]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 3: Missing Dependencies (Day 3)                          │
│  ✓ Install expo-battery                                         │
│  ✓ Fix broken imports                                           │
│  Tasks: 4 | Priority: CRITICAL                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm install && pnpm test]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 4: React Hook Dependencies (Day 4)                       │
│  ✓ Fix 24 useEffect/useCallback dependencies                    │
│  ✓ Prevent stale closures                                       │
│  Tasks: 8 | Priority: HIGH                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm test]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 5: Import Modernization (Day 5)                          │
│  ✓ Convert 8 require() to ES6 imports                           │
│  ✓ Add import type for 8 type-only imports                      │
│  Tasks: 8 | Priority: HIGH                                      │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm lint:fix]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 6: Code Style (Day 5-6)                                  │
│  ✓ Add curly braces (8 locations)                               │
│  ✓ Remove trivial types (4 locations)                           │
│  ✓ Fix import sorting (3 files)                                 │
│  Tasks: 10 | Priority: MEDIUM                                   │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm format]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 7: Documentation (Day 6)                                 │
│  ✓ Fix markdown formatting                                      │
│  ✓ Update JSDoc comments                                        │
│  Tasks: 3 | Priority: LOW                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm lint:md:fix]
                             │
┌─────────────────────────────────────────────────────────────────┐
│  PHASE 8: Testing & Validation (Day 7-8)                        │
│  ✓ Run full test suite                                          │
│  ✓ Manual testing of critical flows                             │
│  ✓ Security & performance tests                                 │
│  ✓ Full validation                                              │
│  Tasks: 8 | Priority: CRITICAL                                  │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼ [Run: pnpm validate]
                             │
┌─────────────────────────────────────────────────────────────────┐
│                    ✅ COMPLETION                                 │
│  • Zero ESLint errors                                           │
│  • Zero TypeScript errors                                       │
│  • All tests passing                                            │
│  • Code quality improved                                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Daily Breakdown

### Day 1-2: Type Safety Foundation
**Focus**: Eliminate all `any` types  
**Files**: 11 files across hooks and tests  
**Validation**: `pnpm type-check`

**Morning (Day 1)**:
- TASK-001: Fix `hooks/use-flow-validation.ts` (10 any types)
- TASK-002: Fix `hooks/use-flow-state.ts` (4 any types)

**Afternoon (Day 1)**:
- TASK-003: Fix `hooks/use-flow-engine.ts` (4 any types)
- TASK-004: Fix `hooks/async/use-fetch.ts` (4 any types)

**Morning (Day 2)**:
- TASK-005: Fix `hooks/auth/use-registration-state.ts` (5 any types)
- TASK-006: Fix `hooks/use-flow-navigation.ts` (3 any types)

**Afternoon (Day 2)**:
- TASK-007-011: Fix remaining files (13 any types total)

**Commit**: `git commit -m "fix: eliminate all any type violations (Phase 1)"`

---

### Day 3: Cleanup & Dependencies
**Focus**: Remove unused code, install dependencies  
**Files**: 15 files + package.json  
**Validation**: `pnpm lint && pnpm install`

**Morning**:
- TASK-012-016: Fix unused variables in hooks (5 tasks)
- TASK-023: Install expo-battery package

**Afternoon**:
- TASK-017-022: Fix remaining unused variables (6 tasks)
- TASK-024-026: Fix broken imports and verify paths

**Commit**: `git commit -m "chore: cleanup unused variables and dependencies (Phase 2-3)"`

---

### Day 4: React Hooks Best Practices
**Focus**: Fix all hook dependency warnings  
**Files**: 8 files across app and hooks  
**Validation**: `pnpm test`

**Morning**:
- TASK-027-028: Fix countdown intervals in auth screens
- TASK-029: Fix success-animation dependencies
- TASK-030: Fix flow-engine config dependency

**Afternoon**:
- TASK-031-034: Fix remaining hook dependencies (4 tasks)
- Run full test suite to verify no regressions

**Commit**: `git commit -m "fix: correct React Hook dependencies (Phase 4)"`

---

### Day 5: Import Modernization
**Focus**: ES6 imports and type imports  
**Files**: 8 files  
**Validation**: `pnpm lint:fix`

**Morning**:
- TASK-035-038: Convert all require() to ES6 imports (4 tasks)

**Afternoon**:
- TASK-039-042: Add import type declarations (4 tasks)
- TASK-043-045: Add curly braces to conditionals (3 tasks)

**Commit**: `git commit -m "refactor: modernize imports and improve code style (Phase 5-6)"`

---

### Day 6: Polish & Documentation
**Focus**: Final style improvements and docs  
**Files**: 7 files + documentation  
**Validation**: `pnpm format && pnpm lint:md:fix`

**Morning**:
- TASK-046-048: Remove trivial type annotations (3 tasks)
- TASK-049-052: Fix import sorting and cleanup (4 tasks)

**Afternoon**:
- TASK-053-055: Fix markdown documentation (3 tasks)

**Commit**: `git commit -m "docs: fix markdown formatting and code polish (Phase 6-7)"`

---

### Day 7-8: Comprehensive Testing
**Focus**: Validation and manual testing  
**Validation**: Everything  

**Day 7 Morning**:
- TASK-056: TypeScript compilation check
- TASK-057: ESLint validation
- TASK-058: Unit tests

**Day 7 Afternoon**:
- TASK-059: Security tests
- TASK-060: Performance tests
- TASK-061: Full validation suite

**Day 8 Full Day**:
- TASK-062: Manual testing of all critical flows
  - Registration flow
  - Login flow
  - Onboarding
  - Biometric auth
  - 2FA flows
  - Settings & profile
- TASK-063: Review all changes in git diff

**Final Commit**: `git commit -m "test: comprehensive validation and manual testing (Phase 8)"`

---

## ✅ Validation Checklist

After each phase, run these commands:

```bash
# After Phase 1-2-3 (Type Safety + Cleanup)
pnpm type-check          # Must pass with 0 errors
pnpm lint                # Check remaining issues
git status               # Verify clean changes

# After Phase 4 (Hooks)
pnpm test                # All tests must pass
pnpm test:security       # Security tests
git diff                 # Review hook changes

# After Phase 5-6 (Imports + Style)
pnpm lint:fix            # Auto-fix remaining
pnpm format:check        # Verify formatting
git diff                 # Review changes

# After Phase 7 (Docs)
pnpm lint:md             # Check markdown
pnpm lint:md:fix         # Fix markdown
git diff                 # Review doc changes

# Final Validation (Phase 8)
pnpm validate            # Full validation
pnpm test                # All tests
pnpm test:security       # Security
pnpm test:performance    # Performance
```

---

## 🚀 Quick Start

To begin implementation:

```bash
# 1. Review the detailed plan
cat plan/refactor-code-quality-fixes-1.md

# 2. Create a feature branch
git checkout -b fix/code-quality-improvements

# 3. Start with Phase 1
# Fix any types in hooks/use-flow-validation.ts first

# 4. Commit after each task
git add .
git commit -m "fix(types): eliminate any in use-flow-validation (TASK-001)"

# 5. Continue systematically through all phases
```

---

## 📚 Key Resources

| Resource | Purpose |
|----------|---------|
| [Full Implementation Plan](plan/refactor-code-quality-fixes-1.md) | Complete task breakdown |
| [Audit Summary](CODE_QUALITY_AUDIT_SUMMARY.md) | Executive overview |
| [Development Guidelines](.github/instructions/rule.instructions.md) | Project standards |
| [TypeScript Handbook](https://www.typescriptlang.org/docs/) | Type system reference |
| [React Hooks Rules](https://react.dev/reference/rules/rules-of-hooks) | Hook best practices |

---

## 🎯 Success Metrics

Track progress with these metrics:

| Metric | Before | Target | Check Command |
|--------|--------|--------|---------------|
| ESLint Errors | 79 | 0 | `pnpm lint` |
| ESLint Warnings | 24 | 0 | `pnpm lint` |
| TypeScript Errors | 0 | 0 | `pnpm type-check` |
| `any` Types | 52 | 0 | `grep -r "any" hooks/` |
| Unused Variables | 27 | 0 | `pnpm lint` |
| Test Failures | 0 | 0 | `pnpm test` |

---

**Remember**: 
- ✅ Commit after each completed task
- ✅ Test after each phase
- ✅ Document any deviations from plan
- ✅ Ask for clarification if needed

**Last Updated**: October 20, 2025
