# Themed Components Migration Guide

**Date:** October 11, 2025  
**Status:** Phase 4 - Migration in Progress  
**Target Completion:** October 18, 2025

## Overview

This guide helps you migrate existing code to use the new themed components. The
migration is **non-breaking** - you can adopt components gradually without
disrupting existing functionality.

## Table of Contents

1. [Migration Strategy](#migration-strategy)
2. [Component-by-Component Migration](#component-by-component-migration)
3. [Common Migration Patterns](#common-migration-patterns)
4. [Screen-by-Screen Migration](#screen-by-screen-migration)
5. [Testing Checklist](#testing-checklist)
6. [Rollback Strategy](#rollback-strategy)

---

## Migration Strategy

### Phase 4 Approach

#### Gradual Adoption (Recommended)

- ✅ No breaking changes to existing code
- ✅ Migrate screen by screen, starting with high-priority areas
- ✅ Test thoroughly after each migration
- ✅ Keep old patterns until migration is complete

#### Priority Order

1. **High Priority** (Week 1)
   - Settings screens (heavy use of list items)
   - Profile screens (badges, icons, list items)
   - Auth screens (info boxes, loading states)

2. **Medium Priority** (Week 2)
   - Onboarding screens (icons, dividers, surfaces)
   - Notification screens (badges, list items)
   - Security screens (list items, switches)

3. **Low Priority** (Week 3)
   - Example screens
   - About/Legal screens
   - Remaining screens

4. **Cleanup** (Week 4)
   - Remove unused styles
   - Update documentation
   - Performance review

---

## Component-by-Component Migration

### 1. ThemedPressable Migration

**Before:**

```tsx
const colors = useThemeColors();

<Pressable
  style={({ pressed }) => [
    styles.card,
    { backgroundColor: colors.surface },
    pressed && { opacity: 0.7 }
  ]}
  onPress={handlePress}
>
  <Text>Content</Text>
</Pressable>;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12
  }
});
```

**After:**

```tsx
import { ThemedPressable } from "@/components/themed-pressable";

<ThemedPressable variant="card" onPress={handlePress} pressedOpacity={0.7}>
  <ThemedText>Content</ThemedText>
</ThemedPressable>;

// No styles needed!
```

**Search Pattern:** `style={({ pressed })`  
**Estimated Occurrences:** 50+  
**Lines Saved per Use:** 10-15

---

### 2. ThemedStack (HStack/VStack) Migration

**Before:**

```tsx
<View style={styles.row}>
  <Icon name="user" />
  <Text>Profile</Text>
  <Badge />
</View>

<View style={styles.column}>
  <Card />
  <Card />
  <Card />
</View>

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  column: {
    flexDirection: 'column',
    gap: 16,
  }
});
```

**After:**

```tsx
import { HStack, VStack } from '@/components/themed-stack';

<HStack spacing="md" align="center">
  <Icon name="user" />
  <ThemedText>Profile</ThemedText>
  <Badge />
</HStack>

<VStack spacing="lg">
  <Card />
  <Card />
  <Card />
</VStack>

// No styles needed!
```

**Search Pattern:** `flexDirection: 'row'` or `flexDirection: 'column'`  
**Estimated Occurrences:** 60+  
**Lines Saved per Use:** 5-8

---

### 3. ThemedDivider Migration

**Before:**

```tsx
const borderColor = useThemeColor({}, "border");

<View style={styles.dividerContainer}>
  <View style={[styles.line, { backgroundColor: borderColor }]} />
  <Text style={styles.dividerText}>OR</Text>
  <View style={[styles.line, { backgroundColor: borderColor }]} />
</View>;

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16
  },
  line: {
    flex: 1,
    height: 1
  },
  dividerText: {
    marginHorizontal: 12
  }
});
```

**After:**

```tsx
import { ThemedDivider } from "@/components/themed-divider";

<ThemedDivider text="OR" />;

// No styles needed!
```

**Search Pattern:** `height: 1` with `backgroundColor`  
**Estimated Occurrences:** 15+  
**Lines Saved per Use:** 10-15

---

### 4. ThemedBadge Migration

**Before:**

```tsx
const statusColor = item.status === "active" ? colors.success : colors.error;

<View style={[styles.badge, { backgroundColor: statusColor }]}>
  <Text style={{ color: colors["on-primary"], fontSize: 12 }}>
    {item.status}
  </Text>
</View>;

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12
  }
});
```

**After:**

```tsx
import { ThemedBadge } from "@/components/themed-badge";

<ThemedBadge variant={item.status === "active" ? "success" : "error"}>
  {item.status}
</ThemedBadge>;

// No styles needed!
```

**Search Pattern:** Badge-like styles with `borderRadius: 12`  
**Estimated Occurrences:** 25+  
**Lines Saved per Use:** 8-12

---

### 5. ThemedIconContainer Migration

**Before:**

```tsx
const backgroundColor = useThemeColor({}, "surface");
const iconColor = useThemeColor({}, "primary");

<View style={[styles.iconContainer, { backgroundColor }]}>
  <Ionicons name="checkmark" size={24} color={iconColor} />
</View>;

const styles = StyleSheet.create({
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center"
  }
});
```

**After:**

```tsx
import { ThemedIconContainer } from "@/components/themed-icon-container";

<ThemedIconContainer icon="check" variant="primary" size="md" />;

// No styles needed!
```

**Search Pattern:** Circular/square views with centered icons  
**Estimated Occurrences:** 30+  
**Lines Saved per Use:** 12-18

---

### 6. ThemedListItem Migration

**Before:**

```tsx
const colors = useThemeColors();

<Pressable
  style={({ pressed }) => [
    styles.listItem,
    { backgroundColor: colors.surface },
    pressed && { opacity: 0.7 }
  ]}
  onPress={handlePress}
>
  <View
    style={[
      styles.iconContainer,
      { backgroundColor: colors["surface-variant"] }
    ]}
  >
    <Ionicons name="settings" size={24} color={colors.primary} />
  </View>
  <View style={styles.content}>
    <Text style={styles.title}>Settings</Text>
    <Text style={styles.description}>Manage your preferences</Text>
  </View>
  <Ionicons name="chevron-forward" size={20} color={colors["text-muted"]} />
</Pressable>;

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12
  },
  content: {
    flex: 1
  },
  title: {
    fontSize: 16,
    fontWeight: "500"
  },
  description: {
    fontSize: 14,
    marginTop: 4
  }
});
```

**After:**

```tsx
import { ThemedListItem } from "@/components/themed-list-item";

<ThemedListItem
  icon="settings"
  title="Settings"
  description="Manage your preferences"
  onPress={handlePress}
  showChevron
/>;

// No styles needed!
```

**Search Pattern:** List row patterns with icon, text, and chevron  
**Estimated Occurrences:** 40+  
**Lines Saved per Use:** 20-30

---

### 7. ThemedSurface Migration

**Before:**

```tsx
const backgroundColor = useThemeColor({}, "surface");
const borderColor = useThemeColor({}, "border");

<View style={[styles.card, { backgroundColor, borderColor }]}>{children}</View>;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  }
});
```

**After:**

```tsx
import { ThemedSurface } from "@/components/themed-surface";

<ThemedSurface elevation={1} padding="md" borderRadius="lg">
  {children}
</ThemedSurface>;

// No styles needed!
```

**Search Pattern:** Views with `shadowOffset`, `shadowOpacity`, `elevation`  
**Estimated Occurrences:** 35+  
**Lines Saved per Use:** 15-20

---

### 8. ThemedInfoBox Migration

**Before:**

```tsx
const backgroundColor =
  variant === "error"
    ? colors.error
    : variant === "warning"
      ? colors.warning
      : colors.info;

<View style={[styles.infoBox, { backgroundColor, borderColor }]}>
  <Ionicons name="information-circle" size={20} color={colors.text} />
  <Text style={styles.message}>{message}</Text>
  {dismissible && (
    <Pressable onPress={handleDismiss}>
      <Ionicons name="close" size={20} />
    </Pressable>
  )}
</View>;

const styles = StyleSheet.create({
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    gap: 12
  },
  message: {
    flex: 1
  }
});
```

**After:**

```tsx
import { ThemedInfoBox } from "@/components/themed-info-box";

<ThemedInfoBox
  variant="error"
  dismissible={dismissible}
  onDismiss={handleDismiss}
>
  {message}
</ThemedInfoBox>;

// No styles needed!
```

**Search Pattern:** Alert/info box patterns with icons and messages  
**Estimated Occurrences:** 20+  
**Lines Saved per Use:** 10-15

---

### 9. ThemedLoadingSpinner Migration

**Before:**

```tsx
const colors = useThemeColors();

{
  loading && (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 8
  },
  loadingText: {
    marginTop: 8
  }
});
```

**After:**

```tsx
import { ThemedLoadingSpinner } from "@/components/themed-loading-spinner";

{
  loading && (
    <ThemedLoadingSpinner
      size="large"
      text="Loading..."
      variant="primary"
      centered
    />
  );
}

// No styles needed!
```

**Search Pattern:** `<ActivityIndicator` with styling  
**Estimated Occurrences:** 15+  
**Lines Saved per Use:** 7-10

---

## Common Migration Patterns

### Pattern 1: Settings List

**Before (40+ lines):**

```tsx
function SettingsScreen() {
  const colors = useThemeColors();

  return (
    <ScrollView style={{ backgroundColor: colors.bg }}>
      <Pressable style={styles.item} onPress={handleProfile}>
        <View style={styles.iconBox}>
          <Icon name="user" color={colors.primary} />
        </View>
        <View style={styles.content}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Edit your info</Text>
        </View>
        <Icon name="chevron-forward" />
      </Pressable>

      {/* Repeat 10+ times */}
    </ScrollView>
  );
}
```

**After (15 lines):**

```tsx
import { ThemedScrollView } from "@/components/themed-scroll-view";
import { ThemedListItem } from "@/components/themed-list-item";

function SettingsScreen() {
  return (
    <ThemedScrollView>
      <ThemedListItem
        icon="user"
        title="Profile"
        description="Edit your info"
        onPress={handleProfile}
        showChevron
      />
      {/* Repeat with same simplicity */}
    </ThemedScrollView>
  );
}
```

**Reduction:** 40+ lines → 15 lines (62% reduction)

---

### Pattern 2: Status Dashboard

**Before (30+ lines):**

```tsx
function Dashboard() {
  const colors = useThemeColors();

  return (
    <View style={styles.container}>
      <View style={[styles.card, { backgroundColor: colors.surface }]}>
        <View style={styles.row}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: colors.success + "20" }
            ]}
          >
            <Icon name="check" color={colors.success} />
          </View>
          <View style={styles.content}>
            <Text style={styles.title}>Active</Text>
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Text style={styles.badgeText}>5</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
```

**After (12 lines):**

```tsx
import { ThemedView } from "@/components/themed-view";
import { ThemedSurface } from "@/components/themed-surface";
import { HStack, VStack } from "@/components/themed-stack";
import { ThemedIconContainer } from "@/components/themed-icon-container";
import { ThemedBadge } from "@/components/themed-badge";

function Dashboard() {
  return (
    <ThemedView>
      <ThemedSurface elevation={1} padding="md">
        <HStack spacing="md" align="center">
          <ThemedIconContainer icon="check" variant="success" />
          <VStack spacing="xs" style={{ flex: 1 }}>
            <ThemedText type="bodyBold">Active</ThemedText>
          </VStack>
          <ThemedBadge variant="success">5</ThemedBadge>
        </HStack>
      </ThemedSurface>
    </ThemedView>
  );
}
```

**Reduction:** 30+ lines → 12 lines (60% reduction)

---

### Pattern 3: Form with Validation

**Before (25+ lines):**

```tsx
function LoginForm() {
  const colors = useThemeColors();

  return (
    <View>
      {error && (
        <View
          style={[styles.errorBox, { backgroundColor: colors.error + "20" }]}
        >
          <Icon name="alert" color={colors.error} />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <TextInput style={styles.input} />

      {loading ? (
        <ActivityIndicator color={colors.primary} />
      ) : (
        <Pressable style={styles.button}>
          <Text>Login</Text>
        </Pressable>
      )}
    </View>
  );
}
```

**After (10 lines):**

```tsx
import { VStack } from "@/components/themed-stack";
import { ThemedInfoBox } from "@/components/themed-info-box";
import { ThemedInput } from "@/components/themed-input";
import { ThemedButton } from "@/components/themed-button";
import { ThemedLoadingSpinner } from "@/components/themed-loading-spinner";

function LoginForm() {
  return (
    <VStack spacing="lg">
      {error && <ThemedInfoBox variant="error">{error}</ThemedInfoBox>}
      <ThemedInput placeholder="Email" />
      {loading ? (
        <ThemedLoadingSpinner />
      ) : (
        <ThemedButton title="Login" onPress={handleLogin} />
      )}
    </VStack>
  );
}
```

**Reduction:** 25+ lines → 10 lines (60% reduction)

---

## Screen-by-Screen Migration

### Priority 1: Settings Screens

**Files to Migrate:**

- `app/(tabs)/settings.tsx`
- `app/settings/index.tsx`
- `app/profile/edit.tsx`
- `app/security/index.tsx`

**Components to Use:**

- `ThemedListItem` (primary)
- `ThemedDivider`
- `ThemedBadge`
- `ThemedIconContainer`

**Estimated Impact:** ~500-800 lines saved

---

### Priority 2: Profile Screens

**Files to Migrate:**

- `app/profile/index.tsx`
- `app/profile/edit.tsx`
- `app/(tabs)/profile.tsx`

**Components to Use:**

- `ThemedSurface`
- `ThemedIconContainer`
- `ThemedBadge`
- `HStack/VStack`

**Estimated Impact:** ~300-500 lines saved

---

### Priority 3: Auth Screens

**Files to Migrate:**

- `app/(auth)/login.tsx`
- `app/(auth)/register/*.tsx`
- `app/(auth)/verify-*.tsx`
- `app/(auth)/forgot-password.tsx`

**Components to Use:**

- `ThemedInfoBox`
- `ThemedLoadingSpinner`
- `ThemedDivider`
- `VStack`

**Estimated Impact:** ~400-600 lines saved

---

## Testing Checklist

After migrating each screen, verify:

### Visual Testing

- [ ] Light mode renders correctly
- [ ] Dark mode renders correctly
- [ ] All spacing matches previous layout
- [ ] Colors are theme-appropriate
- [ ] Icons display correctly
- [ ] Badges show correct variants

### Functional Testing

- [ ] All pressable elements respond to touch
- [ ] Haptic feedback works (if enabled)
- [ ] Navigation functions correctly
- [ ] Switches toggle properly
- [ ] Loading states display correctly
- [ ] Error states show appropriately

### Accessibility Testing

- [ ] VoiceOver reads all elements (iOS)
- [ ] TalkBack reads all elements (Android)
- [ ] All interactive elements are focusable
- [ ] Proper accessibility roles assigned
- [ ] Labels are descriptive and clear

### Performance Testing

- [ ] No lag when scrolling lists
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks
- [ ] Component re-renders are optimized

---

## Rollback Strategy

If you encounter issues during migration:

### Option 1: Revert Single Screen

```bash
# Revert changes to specific file
git checkout HEAD -- app/path/to/screen.tsx
```

### Option 2: Keep Both Implementations

```tsx
// Feature flag approach
import { useFeatureFlag } from "@/hooks/use-feature-flag";

function MyScreen() {
  const useNewComponents = useFeatureFlag("themed-components");

  if (useNewComponents) {
    return <NewImplementation />;
  }

  return <OldImplementation />;
}
```

### Option 3: Gradual Component Rollback

If a specific component has issues:

```tsx
// Temporarily use old pattern
// TODO: Migrate back to ThemedListItem after fix
<Pressable style={styles.oldStyle}>{/* Old implementation */}</Pressable>
```

---

## Migration Tracking

### High Priority (Week 1) - Target: 1,200-2,000 lines saved

- [ ] `app/(tabs)/settings.tsx`
- [ ] `app/settings/index.tsx`
- [ ] `app/profile/index.tsx`
- [ ] `app/profile/edit.tsx`
- [ ] `app/security/index.tsx`

### Medium Priority (Week 2) - Target: 800-1,200 lines saved

- [ ] `app/onboarding/*.tsx`
- [ ] `app/notifications/*.tsx`
- [ ] `app/security/two-factor.tsx`
- [ ] `app/(auth)/login.tsx`
- [ ] `app/(auth)/register/*.tsx`

### Low Priority (Week 3) - Target: 600-1,000 lines saved

- [ ] `app/examples/*.tsx`
- [ ] `app/about/*.tsx`
- [ ] `app/legal/*.tsx`
- [ ] `app/help.tsx`
- [ ] `app/support.tsx`

### Cleanup (Week 4)

- [ ] Remove unused style definitions
- [ ] Update component documentation
- [ ] Create example showcase screens
- [ ] Performance audit
- [ ] Final accessibility review

---

## Best Practices

### DO ✅

- Migrate one screen at a time
- Test thoroughly after each migration
- Use TypeScript for type safety
- Follow component prop conventions
- Add accessibility labels
- Use semantic variant names
- Leverage component composition

### DON'T ❌

- Mix old and new patterns in the same component
- Skip testing after migration
- Override component styles unnecessarily
- Use hardcoded colors or spacing
- Ignore accessibility requirements
- Rush through multiple screens at once

---

## Support & Resources

### Documentation

- [Themed Components Proposal](./THEMED_COMPONENTS_PROPOSAL.md)
- [Component Quick Reference](../components/THEMED_COMPONENTS_README.md)
- [Design System Guide](./DESIGN_SYSTEM.md)
- [Constants Reference](./CONSTANTS_REFERENCE.md)

### Examples

Each themed component includes usage examples in its JSDoc comments.

```tsx
// Press Cmd/Ctrl + Click on component name to see examples
import { ThemedListItem } from "@/components/themed-list-item";
```

### Getting Help

1. Check component JSDoc for API documentation
2. Review this migration guide for common patterns
3. Look at example implementations in `app/examples/`
4. Test in both light and dark modes

---

## Success Metrics

Track these metrics throughout migration:

### Code Metrics

- [ ] Total lines removed
- [ ] Number of screens migrated
- [ ] Style definitions eliminated
- [ ] Component usage count

### Quality Metrics

- [ ] Accessibility score maintained/improved
- [ ] Zero new TypeScript errors
- [ ] Zero new linting warnings
- [ ] Performance maintained/improved

### Developer Experience

- [ ] Time to implement new features reduced
- [ ] Fewer style-related bugs
- [ ] Faster code reviews
- [ ] Improved component consistency

---

## Conclusion

The migration to themed components is a gradual, non-breaking process that will
significantly improve code quality, consistency, and developer experience.

**Expected Outcomes:**

- ✅ 3,000-4,500 fewer lines of code
- ✅ 40-60% reduction in component boilerplate
- ✅ 100% design system compliance
- ✅ Improved accessibility coverage
- ✅ Faster feature development

**Timeline:** 4 weeks for complete migration  
**Status:** Ready to begin  
**Next Step:** Start with high-priority settings screens

---

**Last Updated:** October 11, 2025  
**Phase:** 4 - Migration  
**Contact:** See project documentation for support
