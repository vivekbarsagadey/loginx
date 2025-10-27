# LoginX - AI Prompts Quick Reference

**Version**: 2.0  
**Last Updated**: October 28, 2025  
**Purpose**: Focused collection of effective prompts for AI-assisted development in LoginX

---

## 📱 LoginX Project Context

**Stack**: React Native + Expo SDK 54 | TypeScript | Firebase | Expo Router  
**Features**: Biometric Auth, 2FA, Passwordless Login, Social Auth, i18n, Push Notifications

**Key Directories**:

- `app/(auth)/` - Authentication screens
- `components/auth/` - Auth UI components
- `actions/` - Firebase server actions
- `hooks/` - Custom React hooks
- `types/` - TypeScript definitions

---

## ⭐ Quick Start: Most Used Prompts

```bash
# Execute entire implementation plan automatically
@plan-implementor implement plan/in-progress/[plan-name].md

# Review and update existing plan with new infrastructure
@plan-review-and-update review plan/in-progress/[plan-name].md

# Analyze business requirements with market research
@ba analyze requirements for [feature-name]

# Implement specific feature following LoginX patterns
@developer implement [feature] using Firebase and Expo Router

# Debug production issue with comprehensive analysis
@problem-solver debug [issue-description]
```

---

## 📚 Table of Contents

1. [GitHub Prompts Reference](#github-prompts-reference) - Your 10 actual prompts
2. [Initiation Phase](#initiation-phase) - Requirements & Analysis
3. [Planning Phase](#planning-phase) - Design & Architecture
4. [Execution Phase](#execution-phase) - Implementation
5. [Monitoring Phase](#monitoring-phase) - Testing & Quality
6. [Common Tasks](#common-tasks) - Day-to-day prompts
7. [Tool Integration](#tool-integration) - When to use which tools

---

## 🎯 GitHub Prompts Reference

### Your 10 Actual GitHub Prompts

Located in `.github/prompts/`, these are your project-specific prompts:

#### 1. `create-implementation-plan.md`

**Use When**: Need detailed implementation plan from requirements

```bash
@implementation-plan create plan for [feature-name]

# Include:
- Business requirements (from BA analysis)
- Architecture design (from architect)
- Firestore schema (from data-architect)

# Gets: Detailed markdown plan in plan/in-progress/
```

---

#### 2. `update-implementation-plan.md`

**Use When**: Plan needs updating based on new infrastructure

```bash
@plan-review-and-update review plan/in-progress/[plan-name].md

# Automatically checks:
- New components available (semantic_search)
- Updated libraries (Context7)
- Better implementation approaches
- Completed vs marked tasks

# Gets: Updated plan with new recommendations
```

---

#### 3. `breakdown-feature-implementation.md`

**Use When**: Need to break down feature into implementation tasks

```bash
@feature-breakdown analyze [feature-name] and create implementation tasks

# Include:
- Feature description
- Acceptance criteria
- Technical constraints

# Gets: Granular task breakdown with dependencies
```

---

#### 4. `breakdown-feature-prd.md`

**Use When**: Convert PRD into technical specifications

```bash
@prd-breakdown convert [PRD-file] to technical implementation plan

# Gets: Technical specs from product requirements
```

---

#### 5. `breakdown-epic-arch.md`

**Use When**: Need architecture design for large epic

```bash
@architect design architecture for [epic-name]

Context:
- LoginX uses Firebase + Expo Router
- Follow themed components pattern
- Local-first data sync approach

# Gets: Architecture document (NO CODE)
```

---

#### 6. `breakdown-epic-pm.md`

**Use When**: Project manager view of epic breakdown

```bash
@pm-breakdown analyze [epic] for project planning

# Gets: Timeline, resources, dependencies, risks
```

---

#### 7. `create-github-issues.md`

**Use When**: Convert tasks to GitHub issues

```bash
@issue-creator create GitHub issues from plan/in-progress/[plan].md

# Gets: GitHub issues with labels, assignments, milestones
```

---

#### 8. `create-technical-spike.md`

**Use When**: Research needed before implementation

```bash
@spike research [technical-question]

Examples:
- "Best approach for offline-first React Native with Firebase"
- "Biometric authentication library comparison for Expo"
- "Push notification architecture with FCM and Expo"

# Gets: Research document with recommendations
```

---

#### 9. `multi-stage-dockerfile.md`

**Use When**: Need optimized Docker setup (if backend added)

```bash
@docker create multi-stage Dockerfile for [service]

# Gets: Optimized Dockerfile with build stages
```

---

#### 10. `ai-prompt-safety-review.md`

**Use When**: Review prompts for security and safety

```bash
@safety-review analyze prompt for security issues

# Gets: Security assessment and recommendations
```

---

## 🔍 Initiation Phase: Requirements & Analysis

### Business Requirements Research

```bash
@ba analyze requirements for [feature]

Context: LoginX mobile authentication app
Research:
- Industry best practices (use fetch_webpage)
- Competitor analysis (banking apps, password managers)
- Firebase Authentication patterns
- Mobile UX standards (iOS HIG, Material Design)

Expected Output:
- Market research findings with citations
- Competitor feature comparison
- Implementation requirements (Firebase APIs, Expo modules)
- Files to create/modify in LoginX structure
```

**LoginX-Specific Example**:

```bash
@ba research passwordless authentication with magic links

Focus:
- Email delivery reliability (SendGrid, Firebase Email)
- Deep linking setup (expo-linking configuration)
- Token expiration best practices
- Fallback to OTP if email fails
- Rate limiting for email sending
```

---

### Technical Debt Analysis

```bash
@todo-manager scan [module] for incomplete implementations

Target: app/(auth)/**/*.tsx, components/auth/**/*.tsx
Look for:
- TODO/FIXME comments
- Incomplete error handling
- Missing TypeScript types
- Hardcoded strings (need i18n)
- Security issues (token exposure, input sanitization)

Expected Output:
- Prioritized TODO list (Critical/High/Medium/Low)
- Effort estimates
- Dependencies map
- Fix recommendations
```

**LoginX-Specific Example**:

```bash
@todo-manager analyze technical debt before refactoring login flow

Check:
- app/(auth)/login.tsx
- components/auth/login-form.tsx
- hooks/use-auth-provider.tsx
- actions/user.action.ts

Identify:
- Missing rate limiting
- Incomplete biometric fallback
- Hardcoded error messages
- Unused imports
```

---

### Code Quality & Security Audit

```bash
@code-auditor audit [module] for security vulnerabilities

Scope: Authentication module
Focus:
- Authentication bypass vulnerabilities
- Token/credential exposure
- Input sanitization (XSS, injection)
- Rate limiting effectiveness
- Firebase Security Rules compliance
- TypeScript type safety

Expected Output:
- Severity-rated issue list
- Affected files with line numbers
- Fix recommendations with code snippets
```

**LoginX-Specific Example**:

```bash
@code-auditor security audit of biometric authentication

Check:
- hooks/use-biometric-auth.tsx
- Token storage with expo-secure-store
- Fallback to password if biometric fails
- Device enrollment verification
- Error message exposure
```

---

## 🏗️ Planning Phase: Design & Architecture

### Architecture Design

```bash
@architect design architecture for [feature]

Requirements:
- [Functional requirements]
- [Non-functional requirements]

Deliverables:
- Technical design document
- Component hierarchy
- Data flow diagrams
- Firebase integration points
- Security considerations
- Performance strategy

Tools: semantic_search (existing patterns), Context7 (Firebase docs)

⚠️ IMPORTANT: NO CODE - Design documents only
```

**LoginX-Specific Example**:

```bash
@architect design 2FA system with TOTP and SMS

Requirements:
- TOTP with QR code generation
- SMS backup via Firebase Phone Auth
- Recovery codes (10 single-use codes)
- Secure storage with expo-secure-store

Deliverables:
- Component diagram (setup, verify, manage screens)
- Data model (Firestore user.twoFactorAuth field)
- Security flow (secret generation, verification)
```

---

### Firebase Schema Design

```bash
@data-architect design Firestore schema for [entity]

Requirements:
- Data fields and types
- Relationships to other collections
- Access patterns (queries needed)

Deliverables:
- Collection structure in firestore.rules
- Security rules for data access
- Indexes for query performance
- Example documents

Follow: firebase-config.ts patterns, local-first approach
```

**LoginX-Specific Example**:

```bash
@data-architect design schema for user sessions

Requirements:
- Multi-device tracking
- Session expiration (30 days)
- Last active timestamp
- Device info (name, platform, push token)

Structure:
users/{userId}/sessions/{sessionId}
- deviceId: string
- deviceName: string
- platform: 'ios' | 'android'
- pushToken: string
- createdAt: timestamp
- lastActiveAt: timestamp
- expiresAt: timestamp
```

---

### Implementation Plan Creation

```bash
@implementation-plan create plan for [feature]

Input:
- BRSD from BA analysis
- Architecture from architect
- Schema from data-architect

Output Structure:
1. Executive Summary
2. Phases with Goals
3. Detailed Tasks with acceptance criteria
4. Dependencies and prerequisites
5. Risk assessment
6. Timeline estimates

Tools: semantic_search (reusable components), file_search (utilities)
```

**LoginX-Specific Example**:

```bash
@implementation-plan create plan for biometric authentication

Input:
- BA: Market research on Face ID/Touch ID adoption
- Architect: Component hierarchy (BiometricPrompt, FallbackScreen)
- Data: Session schema with biometric flag

Expected: plan/in-progress/biometric-auth-1.md with:
- Phase 1: expo-local-authentication setup
- Phase 2: BiometricPrompt component
- Phase 3: Secure token storage
- Phase 4: Fallback to password
- Phase 5: Settings UI
```

---

## 🚀 Execution Phase: Implementation

### Feature Development

```bash
@developer implement [feature] for LoginX

Requirements:
- [Feature description]
- [Acceptance criteria]

Follow LoginX patterns:
- Use themed components (ThemedView, ThemedText, ThemedButton)
- React Hook Form + Zod validation for forms
- Firebase actions in actions/[module].action.ts
- Expo Router for navigation
- i18n for all user-facing text
- Local-first with utils/local-first.ts

Expected:
- Working implementation in correct directories
- TypeScript types in types/
- JSDoc comments
- Zero TS errors (check with get_errors)
```

**LoginX-Specific Example**:

```bash
@developer implement OTP login screen

Requirements:
- 6-digit OTP input with auto-focus
- Phone number input with country code
- Resend OTP after 60 seconds
- Rate limiting (3 attempts per 15 min)

Structure:
- File: app/(auth)/otp-login.tsx
- Component: components/auth/otp-input.tsx
- Hook: hooks/use-otp-verification.tsx
- Action: actions/auth/verify-otp.action.ts
- Validation: Zod schema for phone + OTP

Follow: app/(auth)/login.tsx for screen structure
```

---

### Code Refactoring

```bash
@developer refactor [file/module] following best practices

Focus:
- Split large components (<200 lines)
- Extract custom hooks
- Add React.memo where appropriate
- Replace 'any' with proper types
- Add missing error handling
- Implement i18n for hardcoded strings

Maintain: Backward compatibility, existing tests
Verify: get_errors, runTests after changes
```

**LoginX-Specific Example**:

```bash
@developer refactor app/(auth)/login.tsx to use LoginForm component

Extract:
- Form logic → components/auth/login-form.tsx
- Social buttons → components/auth/social-sign-in-buttons.tsx
- Validation → constants/validation.ts

Keep: Screen layout, navigation, biometric section
Result: Cleaner screen component (<100 lines)
```

---

### Performance Optimization

```bash
@developer optimize [component] for mobile performance

Issues to address:
- Unnecessary re-renders
- Large bundle size
- Slow initial load
- Memory leaks

Solutions:
- React.memo, useMemo, useCallback
- Code splitting (React.lazy)
- Image optimization (expo-image)
- FlatList for long lists

Measure: Before/after with React DevTools Profiler
```

**LoginX-Specific Example**:

```bash
@developer optimize app/notifications/index.tsx for 1000+ notifications

Current issues:
- Using ScrollView (renders all 1000 items)
- No item memoization
- Expensive date formatting on every render

Apply:
- Replace with FlatList (virtualization)
- React.memo for NotificationItem
- useMemo for date formatting
- Pagination (20 items at a time)

Expected: 87% render time reduction
```

---

## 🔬 Monitoring Phase: Testing & Quality

### Test Execution

```bash
# Run all tests with coverage
Run tests for LoginX and report coverage for authentication module

# Run specific test file
Execute tests in __tests__/actions/user.action.test.ts

# Test with coverage for specific file
Run tests with coverage for hooks/use-biometric-auth.tsx
```

---

### Error Checking

```bash
# Check all TypeScript errors
Check TypeScript errors across the project

# Check specific module
Get errors in app/(auth)/ directory

# Pre-commit validation
Validate TypeScript and linting issues before commit
```

---

### Debugging

```bash
@problem-solver debug [issue-description]

Investigation:
1. get_errors: Check TypeScript/lint errors
2. grep_search: Find related code
3. semantic_search: Find similar patterns
4. read_file: Examine implementation
5. runTests: Check failing tests

Analysis:
- Root cause identification
- Impact assessment
- Fix recommendation with code
- Prevention strategy

Expected: Complete debugging report with fix
```

**LoginX-Specific Example**:

```bash
@problem-solver debug "Biometric prompt not showing on Android"

Investigation:
1. Check hooks/use-biometric-auth.tsx implementation
2. Verify expo-local-authentication setup
3. Check Android permissions in app.config.ts
4. Test LocalAuthentication.hasHardwareAsync()
5. Review error logs from device

Expected: Root cause, fix, and prevention
```

---

## 💼 Common Development Tasks

### Adding New Authentication Method

```bash
@developer add [auth-method] to LoginX

Pattern to follow:
1. Screen: app/(auth)/[method]-login.tsx
2. Component: components/auth/[method]-form.tsx
3. Hook: hooks/use-[method]-auth.tsx
4. Action: actions/auth/[method].action.ts
5. Types: types/auth.ts
6. i18n: i18n/locales/en/auth.json

Reference: app/(auth)/login.tsx structure
Include: Rate limiting, error handling, i18n
```

---

### Creating New Screen

```bash
@developer create [screen-name] screen in LoginX

Structure:
- File: app/[route-group]/[screen-name].tsx
- Use: ScreenContainer wrapper
- Components: Themed components (ThemedView, ThemedText)
- Navigation: useRouter from expo-router
- State: useState or custom hook
- Styling: StyleSheet with Spacing constants

Follow: app/(tabs)/index.tsx for example
Include: Loading states, error handling, accessibility
```

---

### Adding Firebase Action

```bash
@developer create Firebase action for [entity]

Pattern (follow actions/user.action.ts):
- File: actions/[module]/[entity].action.ts
- Functions: get[Entity], create[Entity], update[Entity], delete[Entity]
- Use: Local-first (getData, setData from utils/local-first)
- Types: Import from types/[entity].ts
- Sanitize: Use utils/sanitize.ts functions
- Errors: debugError + showError for UX

Include: JSDoc comments, try-catch blocks, type safety
```

---

### Implementing i18n

```bash
@i18n-specialist add translations for [module/screen]

Process:
1. Extract hardcoded strings
2. Create keys in i18n/locales/en/[module].json
3. Replace with i18n.t('[module].[key]')
4. Add Spanish (es) and Hindi (hi) translations
5. Test language switching

Pattern: i18n.t('screens.login.title')
Tools: grep_search for finding hardcoded strings
```

---

## 🔧 Tool Integration in Prompts

### When to Mention Tools

#### For Research & Analysis

```bash
@ba analyze requirements for [feature]

Tools to Use:
- fetch_webpage: Industry research and competitor analysis
- GitHub MCP search_code: Implementation examples
- semantic_search: Existing internal patterns
- Context7: Library documentation
```

#### For Plan Updates

```bash
@plan-review-and-update review plan/in-progress/[plan].md

Tools to Use:
- semantic_search: Find new components
- file_search: Infrastructure updates
- grep_search: Pattern changes
- Context7: Library updates
```

#### For Implementation

```bash
@developer implement [feature]

Tools to Use:
- semantic_search: Find reference implementations
- read_file: Examine existing patterns
- Context7: Library API docs (React Native, Expo)
- get_errors: TypeScript validation
```

#### For Debugging

```bash
@problem-solver debug [issue]

Tools to Use:
- get_errors: TypeScript/lint errors
- grep_search: Find related code
- semantic_search: Similar patterns
- runTests: Failing tests
```

---

## 🎓 Prompt Writing Best Practices

### ✅ Effective Prompts

```bash
# GOOD: Specific, clear, includes context
@developer implement email verification screen following app/(auth)/login.tsx pattern
- Use ThemedView and ThemedText
- React Hook Form with Zod validation
- Resend email button (rate limit: 1/min)
- Firebase sendEmailVerification
- Navigate to /(tabs) on success

# GOOD: Mentions relevant tools
@ba research passwordless authentication
Tools: fetch_webpage (industry research), GitHub MCP (examples), semantic_search (internal)

# GOOD: Clear expected output
@code-auditor audit authentication for security issues
Expected: Severity-rated list with file:line references and fix recommendations
```

### ❌ Ineffective Prompts

```bash
# BAD: Too vague
Implement login

# BAD: No context
Add authentication

# BAD: No expected output
Review the code

# BAD: No tool guidance for complex task
Research all authentication methods and implement the best one
```

---

## 📖 Quick Reference Card

### Copy-Paste Templates

#### Start New Feature

```bash
# 1. Research
@ba analyze requirements for [feature-name]

# 2. Design
@architect design architecture for [feature-name]
@data-architect design Firestore schema for [feature-name]

# 3. Plan
@implementation-plan create plan for [feature-name]

# 4. Implement
@plan-implementor implement plan/in-progress/[plan-name].md

# 5. Review
@code-auditor audit [module] for quality and security
```

#### Fix Bug

```bash
@problem-solver debug [issue-description]
Tools: get_errors, grep_search, semantic_search, runTests
```

#### Refactor Code

```bash
@developer refactor [file/module]
Focus: Extract components, add types, implement i18n, improve performance
Verify: get_errors, runTests
```

#### Update Plan

```bash
@plan-review-and-update review plan/in-progress/[plan-name].md
Tools: semantic_search (new components), Context7 (library updates)
```

---

## 🚨 Emergency Prompts

### Production Issue

```bash
@problem-solver URGENT: [production-issue-description]

Impact: [users affected, severity]
Investigation: get_errors, grep_search, runTests
Priority: Immediate fix + root cause + prevention
```

### Security Vulnerability

```bash
@code-auditor SECURITY AUDIT: [vulnerability-description]

Scope: [affected files/modules]
Focus: Authentication bypass, token exposure, injection, rate limiting
Urgency: Critical - provide immediate fix
```

### Performance Crisis

```bash
@developer OPTIMIZE: [performance-issue]

Current: [metrics - render time, bundle size, load time]
Target: [acceptable metrics]
Tools: React DevTools Profiler, get_errors
Priority: Immediate improvement
```

---

## 📝 Notes

### LoginX-Specific Patterns

- **Always use themed components**: ThemedView, ThemedText, ThemedButton
- **Forms**: React Hook Form + Zod validation
- **Navigation**: Expo Router with useRouter hook
- **Firebase**: Local-first pattern (getData/setData)
- **i18n**: i18n.t() for all user-facing text
- **Types**: Import from types/, never use 'any'
- **Errors**: debugError + showError pattern

### Instruction Files

Reference `.github/instructions/` for:

- `a11y.instructions.md` - Accessibility guidelines
- `reactjs.instructions.md` - React best practices
- `performance-optimization.instructions.md` - Performance tips
- `rule.instructions.md` - LoginX project guidelines

---

**Last Updated**: October 28, 2025  
**Document Type**: Quick Reference Guide  
**Lines**: ~800 (down from 6000+)
